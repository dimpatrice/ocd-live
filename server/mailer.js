import net from 'node:net';
import tls from 'node:tls';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runSql, queryOne } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables depuis .env si présent
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const k = trimmed.slice(0, eqIdx).trim();
        const v = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[k]) process.env[k] = v;
      }
    }
  }
}
loadEnv();

function getAdminEmail() {
  const row = queryOne(`SELECT value FROM settings WHERE key = 'admin_notification_email'`);
  return row ? row.value : 'reservations@boovangroup.com';
}

function getSenderConfig() {
  loadEnv();
  const host = process.env.SMTP_HOST || '';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || '';
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, ''); // enlever les espaces
  const from = process.env.SMTP_FROM || `"OCD LIVE — Boovan Group" <${user || 'reservations@boovangroup.com'}>`;
  return { host, port, secure, user, pass, from };
}

/**
 * Client SMTP 100% natif Node.js (sans dépendance externe).
 * Supporte TLS direct (port 465), STARTTLS (port 587) et AUTH LOGIN.
 */
export async function sendNativeSmtpEmail({ to, subject, text, html }) {
  const cfg = getSenderConfig();
  if (!cfg.host) {
    return {
      sent: false,
      reason: 'AUCUN_SERVEUR_SMTP_CONFIGURÉ',
      note: 'Pour activer la délivrance SMTP réelle dans la boîte de réception, définissez SMTP_HOST, SMTP_USER et SMTP_PASS dans le fichier .env.'
    };
  }

  return new Promise((resolve) => {
    let socket;
    let buffer = '';
    let step = 0;
    let isTlsUpgraded = false;

    function cleanup() {
      if (socket && !socket.destroyed) {
        socket.destroy();
      }
    }

    const timeout = setTimeout(() => {
      cleanup();
      resolve({ sent: false, reason: 'SMTP_TIMEOUT_15S' });
    }, 15000);

    function send(cmd) {
      if (socket && !socket.destroyed) {
        socket.write(cmd + '\r\n');
      }
    }

    function onData(chunk) {
      buffer += chunk.toString('utf-8');
      const lines = buffer.split('\r\n');
      buffer = lines.pop(); // garde le reste non terminé

      for (const line of lines) {
        const code = Number(line.slice(0, 3));
        const isLastLine = line.charAt(3) === ' ';
        if (!isLastLine) continue; // ignorer les lignes multi-lignes intermédiaires 250-...

        handleSmtpCode(code, line);
      }
    }

    function handleSmtpCode(code, line) {
      if (step === 0 && code === 220) {
        step = 1;
        send(`EHLO localhost`);
      } else if (step === 1 && code === 250) {
        if (!cfg.secure && !isTlsUpgraded && cfg.port === 587) {
          step = 2; // STARTTLS
          send('STARTTLS');
        } else if (cfg.user && cfg.pass) {
          step = 3; // AUTH LOGIN
          send('AUTH LOGIN');
        } else {
          step = 6; // MAIL FROM
          send(`MAIL FROM:<${extractEmail(cfg.from)}>`);
        }
      } else if (step === 2 && code === 220) {
        // Upgrade socket vers TLS
        isTlsUpgraded = true;
        socket.removeAllListeners('data');
        socket = tls.connect({
          socket,
          servername: cfg.host,
          rejectUnauthorized: false
        });
        socket.on('data', onData);
        socket.on('error', (err) => {
          clearTimeout(timeout);
          cleanup();
          resolve({ sent: false, reason: `TLS_UPGRADE_ERROR: ${err.message}` });
        });
        step = 1; // Renvoyer EHLO après STARTTLS
        send('EHLO localhost');
      } else if (step === 3 && code === 334) {
        step = 4;
        send(Buffer.from(cfg.user).toString('base64'));
      } else if (step === 4 && code === 334) {
        step = 5;
        send(Buffer.from(cfg.pass).toString('base64'));
      } else if (step === 5 && code === 235) {
        step = 6;
        send(`MAIL FROM:<${extractEmail(cfg.from)}>`);
      } else if (step === 6 && code === 250) {
        step = 7;
        send(`RCPT TO:<${extractEmail(to)}>`);
      } else if (step === 7 && code === 250) {
        step = 8;
        send('DATA');
      } else if (step === 8 && code === 354) {
        step = 9;
        const boundary = 'ocd_mime_boundary_' + Date.now();
        const headers = [
          `From: ${cfg.from}`,
          `To: ${to}`,
          `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
          `Date: ${new Date().toUTCString()}`,
          `MIME-Version: 1.0`,
          `Content-Type: multipart/alternative; boundary="${boundary}"`
        ];

        const bodyParts = [
          `--${boundary}`,
          `Content-Type: text/plain; charset=UTF-8`,
          `Content-Transfer-Encoding: base64`,
          ``,
          Buffer.from(text || '').toString('base64'),
          `--${boundary}`,
          `Content-Type: text/html; charset=UTF-8`,
          `Content-Transfer-Encoding: base64`,
          ``,
          Buffer.from(html || renderDefaultHtml(subject, text)).toString('base64'),
          `--${boundary}--`,
          `.`
        ];

        socket.write(headers.join('\r\n') + '\r\n\r\n' + bodyParts.join('\r\n') + '\r\n');
      } else if (step === 9 && code === 250) {
        step = 10;
        send('QUIT');
        clearTimeout(timeout);
        setTimeout(cleanup, 500);
        resolve({ sent: true, reason: 'DELIVERED_VIA_SMTP' });
      } else if (code >= 400) {
        clearTimeout(timeout);
        cleanup();
        resolve({ sent: false, reason: `SMTP_REJECTED_${code}: ${line}` });
      }
    }

    try {
      if (cfg.secure) {
        socket = tls.connect({
          host: cfg.host,
          port: cfg.port,
          servername: cfg.host,
          rejectUnauthorized: false
        });
      } else {
        socket = net.connect({ host: cfg.host, port: cfg.port });
      }

      socket.on('data', onData);
      socket.on('error', (err) => {
        clearTimeout(timeout);
        cleanup();
        resolve({ sent: false, reason: `SOCKET_ERROR: ${err.message}` });
      });
    } catch (e) {
      clearTimeout(timeout);
      cleanup();
      resolve({ sent: false, reason: `CONNECT_EXCEPTION: ${e.message}` });
    }
  });
}

function extractEmail(str) {
  const match = str.match(/<([^>]+)>/);
  return match ? match[1].trim() : str.trim();
}

export function renderDefaultHtml(title, bodyText) {
  const paragraphs = (bodyText || '')
    .split(/\n\n+/)
    .map((p) => `<p style="margin: 0 0 16px 0; line-height: 1.6; color: #1f2937;">${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
    <div style="background-color: #0f172a; padding: 28px 32px; border-bottom: 4px solid #F26513; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">OCD <span style="color: #F26513;">LIVE</span></h1>
      <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px;">Plateforme de Livestreaming Commercial • Boovan Group Togo</p>
    </div>
    <div style="padding: 32px; font-size: 14px;">
      <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 18px; font-weight: 700;">${escapeHtml(title)}</h2>
      ${paragraphs}
    </div>
    <div style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
      <p style="margin: 0 0 4px 0; font-weight: 600; color: #334155;">Boovan Group — Complexe Audiovisuel OCD LIVE</p>
      <p style="margin: 0;">Lomé, Togo • Tél & WhatsApp : +228 90 00 00 00 • TikTok @bovann • Facebook Bovann Officiel</p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function dispatchNotification({
  type,
  title,
  recipientEmail,
  subject,
  bodyText,
  relatedReference = null
}) {
  const targetEmail = recipientEmail || getAdminEmail();
  let deliveryStatus = 'LOGGED_AND_QUEUED';

  try {
    const smtpRes = await sendNativeSmtpEmail({
      to: targetEmail,
      subject,
      text: bodyText,
      html: renderDefaultHtml(title, bodyText)
    });
    if (smtpRes.sent) {
      deliveryStatus = 'SENT_SMTP_SUCCESS';
    } else {
      deliveryStatus = smtpRes.reason || 'LOGGED_AND_QUEUED';
    }
  } catch (err) {
    deliveryStatus = `SMTP_EXCEPTION: ${err.message}`;
  }

  runSql(
    `INSERT INTO notifications (
      type, title, recipient_email, subject, body_text, related_reference, is_read, email_delivery_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, datetime('now'))`,
    [type, title, targetEmail, subject, bodyText, relatedReference, deliveryStatus]
  );

  return { status: deliveryStatus, targetEmail };
}

export function formatAdminNewBookingMessage(booking) {
  const socialLinks = [
    booking.social_facebook ? `Facebook: ${booking.social_facebook}` : null,
    booking.social_instagram ? `Instagram: ${booking.social_instagram}` : null,
    booking.social_tiktok ? `TikTok: ${booking.social_tiktok}` : null,
    booking.website_url ? `Site Web: ${booking.website_url}` : null,
  ]
    .filter(Boolean)
    .join(' | ') || 'Non renseignés';

  const modeLabel = booking.participation_mode === 'PRESENTIEL'
    ? 'En présentiel (Studio Lomé, Togo)'
    : 'À distance (International / Afrique)';

  const assistanceLabel = booking.participation_mode === 'DISTANCE'
    ? (booking.remote_assistance === 'OUI' ? 'Oui (Accompagnement studio Togo demandé)' : 'Non (Intervention autonome)')
    : 'Présentiel au studio';

  const amountLabel = booking.is_custom_quote
    ? 'Sur devis personnalisé (À définir par l\'administration)'
    : `${Number(booking.total_price_fcfa).toLocaleString('fr-FR')} FCFA`;

  return `NOUVELLE RÉSERVATION OCD LIVE
Référence : ${booking.reference}

Client : ${booking.client_first_name} ${booking.client_last_name}.
Entreprise : ${booking.company_name}${booking.trade_name ? ` (${booking.trade_name})` : ''}.
Activité : ${booking.sector} — ${booking.products_to_present}.
Pays : ${booking.client_country}.
Ville : ${booking.client_city}.

Mode : ${modeLabel}.
Date : ${booking.booking_date}.
Heure : ${booking.start_time.replace(':', 'h')} – ${booking.end_time.replace(':', 'h')} (Fuseau : ${booking.timezone}).
Forfait : ${booking.package_name}.
Montant : ${amountLabel}.
Statut du paiement : ${booking.payment_status} (Aucune réservation n'est considérée payée sans validation).
Assistance : ${assistanceLabel}.

Téléphone : ${booking.client_phone} (Commercial : ${booking.business_phone}).
WhatsApp : ${booking.client_whatsapp} (Commercial : ${booking.business_whatsapp}).
E-mail : ${booking.client_email}.

Description : ${booking.activity_description}
Liens sociaux : ${socialLinks}`;
}

export function formatClientConfirmationMessage(booking) {
  const modeLabel = booking.participation_mode === 'PRESENTIEL'
    ? 'Présentiel au Studio OCD LIVE (Lomé, Togo)'
    : 'À distance depuis votre pays / entreprise';

  const amountLabel = booking.is_custom_quote
    ? 'Sur devis personnalisé'
    : `${Number(booking.total_price_fcfa).toLocaleString('fr-FR')} FCFA`;

  return `Bonjour ${booking.client_first_name} ${booking.client_last_name},

Nous accusons bonne réception de votre demande de réservation sur OCD LIVE (Boovan Group).

RÉCAPITULATIF DE VOTRE RÉSERVATION :
- Numéro de réservation : ${booking.reference}
- Entreprise : ${booking.company_name}
- Mode de participation : ${modeLabel}
- Date programmée : ${booking.booking_date}
- Créneau horaire : ${booking.start_time.replace(':', 'h')} – ${booking.end_time.replace(':', 'h')} (Heure du Togo - GMT/UTC+0)
- Forfait sélectionné : ${booking.package_name}
- Montant total : ${amountLabel}
- Statut actuel du paiement : En attente de vérification administrative

IMPORTANT : Votre créneau vous est pré-réservé. Conformément à nos règles de gestion, votre réservation sera marquée comme définitivement payée et confirmée dès validation effective de votre règlement par l'équipe Boovan Group.

Notre équipe reste à votre entière disposition sur WhatsApp et par e-mail pour préparer votre passage en direct.

Cordialement,
La Direction OCD LIVE — Boovan Group
Lomé, Togo`;
}

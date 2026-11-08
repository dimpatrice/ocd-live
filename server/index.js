import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import {
  initDatabase,
  queryAll,
  queryOne,
  runSql,
  verifyPassword
} from './db.js';
import {
  dispatchNotification,
  formatAdminNewBookingMessage,
  formatClientConfirmationMessage
} from './mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis .env si présent
const ENV_PATH = path.join(__dirname, '..', '.env');
if (fs.existsSync(ENV_PATH)) {
  const lines = fs.readFileSync(ENV_PATH, 'utf-8').split(/\r?\n/);
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

const PORT = Number(process.env.PORT || 3006);
const JWT_SECRET = process.env.JWT_SECRET || 'OCD_LIVE_BOOVAN_GROUP_ULTRA_SECRET_2026';

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const DIST_DIR = path.join(__dirname, '..', 'dist');

// Liste blanche stricte contre les téléchargements malveillants
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'video/mp4',
  'video/webm',
  'video/quicktime'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.pdf',
  '.mp4',
  '.webm',
  '.mov'
]);

const STATIC_MIMES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime'
};

// JWT natif signé via HMAC-SHA256
function signJwt(payload, expiresInSeconds = 86400) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  if (sig !== expectedSig) return null;
  const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null;
  return decoded;
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function readRawBody(req, maxBytes = 26 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error('Fichier ou requête trop volumineux (limite 25 Mo).'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJsonBody(req) {
  const buf = await readRawBody(req, 15 * 1024 * 1024);
  if (!buf.length) return {};
  return JSON.parse(buf.toString('utf-8'));
}

// Parseur multipart/form-data natif pour téléversement sécurisé
function parseMultipartFile(buffer, contentType) {
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!match) throw new Error('Boundary multipart manquant.');
  const boundary = `--${match[1] || match[2]}`;
  const boundaryBuf = Buffer.from(boundary);

  const startIdx = buffer.indexOf(boundaryBuf);
  if (startIdx === -1) throw new Error('Contenu multipart invalide.');

  const headerStart = startIdx + boundaryBuf.length + 2; // skip \r\n
  const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), headerStart);
  if (headerEnd === -1) throw new Error('En-têtes multipart invalides.');

  const headersText = buffer.slice(headerStart, headerEnd).toString('utf-8');
  const filenameMatch = headersText.match(/filename="([^"]+)"/i);
  const mimeMatch = headersText.match(/Content-Type:\s*([^\r\n]+)/i);

  if (!filenameMatch) throw new Error('Aucun fichier trouvé dans la requête.');
  const originalName = filenameMatch[1];
  const mimeType = mimeMatch ? mimeMatch[1].trim().toLowerCase() : 'application/octet-stream';

  const dataStart = headerEnd + 4;
  const nextBoundaryIdx = buffer.indexOf(boundaryBuf, dataStart);
  if (nextBoundaryIdx === -1) throw new Error('Fin de fichier multipart introuvable.');

  // Retirer le \r\n précédant le boundary de fin
  const dataEnd = nextBoundaryIdx - 2;
  const fileBuffer = buffer.slice(dataStart, dataEnd);

  return { originalName, mimeType, fileBuffer };
}

// Utilitaires de gestion des horaires et conflits de créneaux
function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(totalMinutes) {
  const capped = Math.min(totalMinutes, 23 * 60 + 59);
  const h = Math.floor(capped / 60);
  const m = capped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getTodayInLome() {
  // Africa/Lome est à UTC+0 toute l'année
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function computeDayAvailability(dateStr, requestedDurationMinutes = 90) {
  const todayStr = getTodayInLome();
  if (dateStr < todayStr) {
    return {
      date: dateStr,
      status: 'PAST',
      isOpen: false,
      reason: 'Date passée',
      slots: []
    };
  }

  const override = queryOne(`SELECT * FROM calendar_overrides WHERE date_str = ?`, [dateStr]);
  if (override && Number(override.is_closed) === 1) {
    return {
      date: dateStr,
      status: 'CLOSED',
      isOpen: false,
      reason: override.reason || 'Journée fermée par l\'administration',
      slots: []
    };
  }

  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dayOfWeek = dt.getUTCDay();

  const weekly = queryOne(`SELECT * FROM weekly_schedule WHERE day_of_week = ?`, [dayOfWeek]);
  let candidateStartTimes = [];

  if (override && override.custom_slots_json) {
    try {
      candidateStartTimes = JSON.parse(override.custom_slots_json);
    } catch {
      candidateStartTimes = [];
    }
  } else if (weekly && Number(weekly.is_open) === 1) {
    try {
      candidateStartTimes = JSON.parse(weekly.slots_json);
    } catch {
      candidateStartTimes = [];
    }
  } else {
    return {
      date: dateStr,
      status: 'CLOSED',
      isOpen: false,
      reason: 'Studio fermé ce jour',
      slots: []
    };
  }

  if (!candidateStartTimes.length) {
    return {
      date: dateStr,
      status: 'CLOSED',
      isOpen: false,
      reason: 'Aucun créneau configuré',
      slots: []
    };
  }

  const activeReservations = queryAll(
    `SELECT id, reference, start_time, end_time, duration_minutes, booking_status, company_name
     FROM reservations
     WHERE booking_date = ? AND booking_status != 'ANNULEE'`,
    [dateStr]
  );

  const closingMinutes = 22 * 60;

  const evaluatedSlots = candidateStartTimes.map((startTime) => {
    const startMin = timeToMinutes(startTime);
    const endMin = startMin + Number(requestedDurationMinutes);
    const endTime = minutesToTime(endMin);

    const exceedsClosing = endMin > closingMinutes && startMin > 10 * 60;

    const conflictingBooking = activeReservations.find((res) => {
      const rStart = timeToMinutes(res.start_time);
      const rEnd = timeToMinutes(res.end_time);
      return startMin < rEnd && endMin > rStart;
    });

    const isAvailable = !exceedsClosing && !conflictingBooking;

    return {
      startTime,
      endTime,
      label: `${startTime.replace(':', 'h')} – ${endTime.replace(':', 'h')}`,
      available: isAvailable,
      conflictReason: conflictingBooking
        ? 'Créneau déjà réservé'
        : exceedsClosing
          ? 'Durée incompatible avec la fin de journée'
          : null
    };
  });

  const availableCount = evaluatedSlots.filter((s) => s.available).length;
  const status = availableCount === 0 ? 'FULL' : 'AVAILABLE';

  return {
    date: dateStr,
    status,
    isOpen: true,
    totalSlots: evaluatedSlots.length,
    availableCount,
    slots: evaluatedSlots
  };
}

function getAuthenticatedAdmin(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return verifyJwt(authHeader.slice(7));
}

function serveStaticFile(res, filePath) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return false;
  const ext = path.extname(filePath).toLowerCase();
  const contentType = STATIC_MIMES[ext] || 'application/octet-stream';

  // Pour index.html et les assets, empêcher le cache stale pour éviter les écrans blancs
  const isHtml = ext === '.html';
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': isHtml
      ? 'no-cache, no-store, must-revalidate'
      : 'public, max-age=31536000, immutable'
  };

  res.writeHead(200, headers);
  fs.createReadStream(filePath).pipe(res);
  return true;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      res.end();
      return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const query = Object.fromEntries(parsedUrl.searchParams.entries());
    const method = req.method;

    // Servir les fichiers téléversés (/uploads/...)
    if (pathname.startsWith('/uploads/')) {
      const safeFilename = path.basename(pathname);
      const targetPath = path.join(UPLOADS_DIR, safeFilename);
      if (serveStaticFile(res, targetPath)) return;
      return sendJson(res, 404, { error: 'Fichier introuvable.' });
    }

    // =========================================================================
    // API PUBLIQUES
    // =========================================================================

    if (method === 'GET' && pathname === '/api/public/config') {
      const settingsRows = queryAll(`SELECT key, value FROM settings`);
      const settings = {};
      for (const r of settingsRows) settings[r.key] = r.value;

      const packages = queryAll(
        `SELECT * FROM packages WHERE is_active = 1 ORDER BY display_order ASC, id ASC`
      ).map((p) => ({
        ...p,
        is_recommended: Boolean(p.is_recommended),
        allows_remote_assistance: Boolean(p.allows_remote_assistance),
        remote_assistance_included: Boolean(p.remote_assistance_included),
        features: JSON.parse(p.features_json || '[]')
      }));

      const addons = queryAll(
        `SELECT * FROM package_addons WHERE is_active = 1 ORDER BY display_order ASC, id ASC`
      ).map((a) => ({
        ...a,
        requires_team_validation: Boolean(a.requires_team_validation)
      }));

      const studios = queryAll(`SELECT * FROM studios WHERE is_active = 1`);

      return sendJson(res, 200, {
        settings,
        packages,
        addons,
        studios,
        serverTodayLome: getTodayInLome()
      });
    }

    if (method === 'GET' && pathname === '/api/public/calendar') {
      const now = new Date();
      const year = Number(query.year || now.getUTCFullYear());
      const month = Number(query.month || now.getUTCMonth() + 1);
      const durationMinutes = Number(query.duration || 90);

      if (!year || !month || month < 1 || month > 12) {
        return sendJson(res, 400, { error: 'Mois ou année invalide.' });
      }

      const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
      const days = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        days.push(computeDayAvailability(dateStr, durationMinutes));
      }

      return sendJson(res, 200, {
        year,
        month,
        timezone: 'Africa/Lome',
        durationMinutes,
        todayLome: getTodayInLome(),
        days
      });
    }

    if (method === 'GET' && pathname === '/api/public/calendar/day') {
      const { date, duration } = query;
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return sendJson(res, 400, { error: 'Format de date invalide (attendu YYYY-MM-DD).' });
      }
      return sendJson(res, 200, computeDayAvailability(date, Number(duration || 90)));
    }

    if (method === 'POST' && pathname === '/api/public/upload') {
      const contentType = req.headers['content-type'] || '';
      if (!contentType.includes('multipart/form-data')) {
        return sendJson(res, 400, { error: 'Requête multipart/form-data attendue.' });
      }
      const rawBuf = await readRawBody(req, 26 * 1024 * 1024);
      const { originalName, mimeType, fileBuffer } = parseMultipartFile(rawBuf, contentType);
      const ext = path.extname(originalName).toLowerCase();

      if (!ALLOWED_MIME_TYPES.has(mimeType) || !ALLOWED_EXTENSIONS.has(ext)) {
        return sendJson(res, 400, {
          error: 'Format de fichier non autorisé. Formats acceptés : JPG, PNG, WEBP, PDF, MP4, WEBM.'
        });
      }

      const safeBase = path
        .basename(originalName, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 40);
      const filename = `${safeBase}-${Date.now()}-${Math.round(Math.random() * 1e5)}${ext}`;
      fs.writeFileSync(path.join(UPLOADS_DIR, filename), fileBuffer);

      return sendJson(res, 200, {
        url: `/uploads/${filename}`,
        originalName,
        mimeType,
        size: fileBuffer.length
      });
    }

    if (method === 'POST' && pathname === '/api/public/reservations') {
      const body = await readJsonBody(req);

      const requiredFields = [
        'participation_mode',
        'booking_date',
        'start_time',
        'package_id',
        'client_last_name',
        'client_first_name',
        'client_phone',
        'client_whatsapp',
        'client_email',
        'client_country',
        'client_city',
        'client_address',
        'company_name',
        'sector',
        'activity_description',
        'products_to_present',
        'approx_products_count',
        'business_phone',
        'business_whatsapp',
        'business_address',
        'business_country',
        'business_city',
        'payment_method'
      ];

      for (const field of requiredFields) {
        if (body[field] === undefined || body[field] === null || String(body[field]).trim() === '') {
          return sendJson(res, 400, {
            error: `Le champ obligatoire "${field}" est manquant ou vide.`
          });
        }
      }

      if (!body.terms_accepted) {
        return sendJson(res, 400, {
          error: 'Vous devez accepter les conditions générales de réservation.'
        });
      }

      const pkg = queryOne(`SELECT * FROM packages WHERE id = ? AND is_active = 1`, [Number(body.package_id)]);
      if (!pkg) {
        return sendJson(res, 404, { error: 'Le forfait sélectionné est introuvable ou inactif.' });
      }

      const durationMinutes = Number(pkg.duration_minutes) || 90;
      const dayAvailability = computeDayAvailability(body.booking_date, durationMinutes);
      if (!dayAvailability.isOpen) {
        return sendJson(res, 409, {
          error: `Cette date (${body.booking_date}) n'est pas disponible : ${dayAvailability.reason || 'Fermé'}.`
        });
      }

      const matchingSlot = dayAvailability.slots.find((s) => s.startTime === body.start_time);
      if (!matchingSlot || !matchingSlot.available) {
        return sendJson(res, 409, {
          error: 'Ce créneau horaire vient d\'être réservé ou est incompatible avec la durée du forfait choisi. Veuillez sélectionner un autre horaire.'
        });
      }

      const isCustomQuote = pkg.price_fcfa === null || pkg.price_fcfa === undefined ? 1 : 0;
      const basePrice = isCustomQuote ? 0 : Number(pkg.price_fcfa);

      let remoteAssistance = 'NON_APPLICABLE';
      let remoteAssistanceFee = 0;
      if (body.participation_mode === 'DISTANCE') {
        remoteAssistance = body.remote_assistance === 'OUI' ? 'OUI' : 'NON';
        if (remoteAssistance === 'OUI' && Number(pkg.remote_assistance_included) === 0) {
          remoteAssistanceFee = Number(pkg.remote_assistance_fee_fcfa || 0);
        }
      }

      const selectedAddonCodes = Array.isArray(body.addon_codes) ? body.addon_codes : [];
      const activeAddons = queryAll(`SELECT * FROM package_addons WHERE is_active = 1`);
      const resolvedAddons = [];
      let addonsTotal = 0;

      for (const code of selectedAddonCodes) {
        const found = activeAddons.find((a) => a.code === code);
        if (found) {
          resolvedAddons.push({
            code: found.code,
            name: found.name,
            price_fcfa: Number(found.price_fcfa),
            requires_team_validation: Boolean(found.requires_team_validation)
          });
          addonsTotal += Number(found.price_fcfa);
        }
      }

      const totalPrice = basePrice + remoteAssistanceFee + addonsTotal;
      const paymentStatus = body.payment_proof_url ? 'PREUVE_TRANSMISE' : 'EN_ATTENTE_PAIEMENT';

      const year = new Date().getUTCFullYear();
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      const reference = `OCD-${year}-${randomCode}`;

      const insertResult = runSql(
        `INSERT INTO reservations (
          reference, studio_id, participation_mode, booking_date, start_time, end_time, duration_minutes, timezone,
          package_id, package_name, package_price_fcfa, remote_assistance, remote_assistance_fee_fcfa,
          addons_json, addons_total_fcfa, total_price_fcfa, is_custom_quote,
          client_last_name, client_first_name, client_phone, client_whatsapp, client_email, client_country, client_city, client_address,
          company_name, trade_name, sector, activity_description, products_to_present, approx_products_count, products_price_range,
          business_phone, business_whatsapp, business_address, business_country, business_city,
          website_url, social_facebook, social_instagram, social_tiktok, social_other,
          live_objectives_json, live_objectives_details, company_logo_url, product_photos_json, presentation_video_url,
          payment_method, payment_status, payment_proof_url, payment_reference, booking_status, terms_accepted, created_at, updated_at
        ) VALUES (
          ?, 1, ?, ?, ?, ?, ?, 'Africa/Lome',
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, 'EN_ATTENTE', 1, datetime('now'), datetime('now')
        )`,
        [
          reference,
          body.participation_mode,
          body.booking_date,
          matchingSlot.startTime,
          matchingSlot.endTime,
          durationMinutes,
          pkg.id,
          pkg.name,
          basePrice,
          remoteAssistance,
          remoteAssistanceFee,
          JSON.stringify(resolvedAddons),
          addonsTotal,
          totalPrice,
          isCustomQuote,
          String(body.client_last_name).trim(),
          String(body.client_first_name).trim(),
          String(body.client_phone).trim(),
          String(body.client_whatsapp).trim(),
          String(body.client_email).trim(),
          String(body.client_country).trim(),
          String(body.client_city).trim(),
          String(body.client_address).trim(),
          String(body.company_name).trim(),
          body.trade_name ? String(body.trade_name).trim() : '',
          String(body.sector).trim(),
          String(body.activity_description).trim(),
          String(body.products_to_present).trim(),
          String(body.approx_products_count).trim(),
          body.products_price_range ? String(body.products_price_range).trim() : '',
          String(body.business_phone).trim(),
          String(body.business_whatsapp).trim(),
          String(body.business_address).trim(),
          String(body.business_country).trim(),
          String(body.business_city).trim(),
          body.website_url ? String(body.website_url).trim() : '',
          body.social_facebook ? String(body.social_facebook).trim() : '',
          body.social_instagram ? String(body.social_instagram).trim() : '',
          body.social_tiktok ? String(body.social_tiktok).trim() : '',
          body.social_other ? String(body.social_other).trim() : '',
          JSON.stringify(Array.isArray(body.live_objectives) ? body.live_objectives : []),
          body.live_objectives_details ? String(body.live_objectives_details).trim() : '',
          body.company_logo_url || '',
          JSON.stringify(Array.isArray(body.product_photos) ? body.product_photos : []),
          body.presentation_video_url || '',
          String(body.payment_method).trim(),
          paymentStatus,
          body.payment_proof_url || '',
          body.payment_reference ? String(body.payment_reference).trim() : ''
        ]
      );

      const createdBooking = queryOne(`SELECT * FROM reservations WHERE id = ?`, [insertResult.lastInsertRowid]);

      const adminBody = formatAdminNewBookingMessage(createdBooking);
      await dispatchNotification({
        type: 'NEW_BOOKING',
        title: `Nouvelle réservation ${createdBooking.reference} — ${createdBooking.company_name}`,
        recipientEmail: null,
        subject: `NOUVELLE RÉSERVATION OCD LIVE — ${createdBooking.company_name} (${createdBooking.reference})`,
        bodyText: adminBody,
        relatedReference: createdBooking.reference
      });

      if (createdBooking.payment_proof_url || createdBooking.payment_reference) {
        await dispatchNotification({
          type: 'PAYMENT_PROOF',
          title: `Justificatif de paiement transmis pour ${createdBooking.reference}`,
          recipientEmail: null,
          subject: `JUSTIFICATIF DE PAIEMENT À VÉRIFIER — ${createdBooking.reference}`,
          bodyText: `Le client ${createdBooking.client_first_name} ${createdBooking.client_last_name} (${createdBooking.company_name}) a transmis une référence ou preuve de paiement pour la réservation ${createdBooking.reference}.\nRéférence transaction : ${createdBooking.payment_reference || 'Voir fichier joint'}\nFichier : ${createdBooking.payment_proof_url || 'Non joint'}`,
          relatedReference: createdBooking.reference
        });
      }

      const clientBody = formatClientConfirmationMessage(createdBooking);
      await dispatchNotification({
        type: 'CLIENT_CONFIRMATION',
        title: `Accusé de réservation envoyé à ${createdBooking.client_email}`,
        recipientEmail: createdBooking.client_email,
        subject: `Votre réservation OCD LIVE (${createdBooking.reference}) — Récapitulatif & Instructions`,
        bodyText: clientBody,
        relatedReference: createdBooking.reference
      });

      return sendJson(res, 201, {
        message: 'Réservation enregistrée avec succès.',
        reservation: {
          ...createdBooking,
          addons: JSON.parse(createdBooking.addons_json || '[]'),
          live_objectives: JSON.parse(createdBooking.live_objectives_json || '[]'),
          product_photos: JSON.parse(createdBooking.product_photos_json || '[]')
        }
      });
    }

    const pubResMatch = pathname.match(/^\/api\/public\/reservations\/([^/]+)$/);
    if (method === 'GET' && pubResMatch) {
      const ref = decodeURIComponent(pubResMatch[1]).toUpperCase();
      const booking = queryOne(`SELECT * FROM reservations WHERE reference = ?`, [ref]);
      if (!booking) return sendJson(res, 404, { error: 'Aucune réservation trouvée avec cette référence.' });
      return sendJson(res, 200, {
        ...booking,
        addons: JSON.parse(booking.addons_json || '[]'),
        live_objectives: JSON.parse(booking.live_objectives_json || '[]'),
        product_photos: JSON.parse(booking.product_photos_json || '[]')
      });
    }

    const pubProofMatch = pathname.match(/^\/api\/public\/reservations\/([^/]+)\/payment-proof$/);
    if (method === 'POST' && pubProofMatch) {
      const ref = decodeURIComponent(pubProofMatch[1]).toUpperCase();
      const { payment_proof_url, payment_reference } = await readJsonBody(req);
      const booking = queryOne(`SELECT * FROM reservations WHERE reference = ?`, [ref]);
      if (!booking) return sendJson(res, 404, { error: 'Réservation introuvable.' });

      runSql(
        `UPDATE reservations
         SET payment_proof_url = COALESCE(NULLIF(?, ''), payment_proof_url),
             payment_reference = COALESCE(NULLIF(?, ''), payment_reference),
             payment_status = CASE WHEN payment_status = 'PAYE_CONFIRME' THEN 'PAYE_CONFIRME' ELSE 'PREUVE_TRANSMISE' END,
             updated_at = datetime('now')
         WHERE id = ?`,
        [payment_proof_url || '', payment_reference || '', booking.id]
      );

      await dispatchNotification({
        type: 'PAYMENT_PROOF',
        title: `Preuve de paiement reçue (${booking.reference})`,
        recipientEmail: null,
        subject: `PREUVE DE PAIEMENT TRANSMISE — ${booking.reference} (${booking.company_name})`,
        bodyText: `Une preuve de paiement a été ajoutée pour la réservation ${booking.reference}.\nEntreprise : ${booking.company_name}\nRéférence paiement : ${payment_reference || 'N/A'}\nFichier : ${payment_proof_url || 'N/A'}\nVeuillez vérifier la réception effective des fonds avant de valider le statut Payé.`,
        relatedReference: booking.reference
      });

      const updated = queryOne(`SELECT * FROM reservations WHERE id = ?`, [booking.id]);
      return sendJson(res, 200, { message: 'Preuve de paiement transmise à l\'administration.', reservation: updated });
    }

    if (method === 'POST' && pathname === '/api/public/applications') {
      const {
        full_name,
        age,
        phone,
        whatsapp,
        city,
        country,
        email,
        bio_presentation,
        experience_summary,
        availability,
        cv_url,
        video_url
      } = await readJsonBody(req);

      if (!full_name || !phone || !whatsapp || !city || !email || !bio_presentation || !experience_summary || !availability) {
        return sendJson(res, 400, {
          error: 'Veuillez renseigner tous les champs obligatoires du formulaire de candidature.'
        });
      }

      const reference = `CAND-${new Date().getUTCFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const result = runSql(
        `INSERT INTO applications (
          reference, full_name, age, phone, whatsapp, city, country, email,
          bio_presentation, experience_summary, availability, cv_url, video_url, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NOUVELLE', datetime('now'))`,
        [
          reference,
          String(full_name).trim(),
          age ? Number(age) : null,
          String(phone).trim(),
          String(whatsapp).trim(),
          String(city).trim(),
          country ? String(country).trim() : 'Togo',
          String(email).trim(),
          String(bio_presentation).trim(),
          String(experience_summary).trim(),
          String(availability).trim(),
          cv_url || '',
          video_url || ''
        ]
      );

      const created = queryOne(`SELECT * FROM applications WHERE id = ?`, [result.lastInsertRowid]);
      await dispatchNotification({
        type: 'NEW_APPLICATION',
        title: `Nouvelle candidature animatrice : ${created.full_name} (${created.city})`,
        recipientEmail: null,
        subject: `RECRUTEMENT OCD LIVE — Candidature de ${created.full_name} (${created.reference})`,
        bodyText: `NOUVELLE CANDIDATURE RECRUTEMENT OCD LIVE\nRéférence : ${created.reference}\nNom complet : ${created.full_name}\nÂge : ${created.age || 'Non précisé'}\nVille : ${created.city} (${created.country})\nTéléphone : ${created.phone}\nWhatsApp : ${created.whatsapp}\nE-mail : ${created.email}\nDisponibilité : ${created.availability}\n\nPrésentation :\n${created.bio_presentation}\n\nExpérience communication / vente :\n${created.experience_summary}`,
        relatedReference: created.reference
      });

      return sendJson(res, 201, {
        message: 'Votre candidature a été transmise avec succès à la direction de Boovan Group.',
        application: created
      });
    }

    if (method === 'POST' && pathname === '/api/public/contact') {
      const { full_name, company, email, phone, country, subject, message } = await readJsonBody(req);
      if (!full_name || !email || !phone || !subject || !message) {
        return sendJson(res, 400, { error: 'Veuillez remplir tous les champs obligatoires.' });
      }

      runSql(
        `INSERT INTO contact_messages (full_name, company, email, phone, country, subject, message, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, datetime('now'))`,
        [
          String(full_name).trim(),
          company ? String(company).trim() : '',
          String(email).trim(),
          String(phone).trim(),
          country ? String(country).trim() : 'Togo',
          String(subject).trim(),
          String(message).trim()
        ]
      );

      await dispatchNotification({
        type: 'CONTACT_MESSAGE',
        title: `Message de contact : ${full_name} (${subject})`,
        recipientEmail: null,
        subject: `CONTACT OCD LIVE — ${subject} (${full_name})`,
        bodyText: `De : ${full_name} (${company || 'Particulier / Entrepreneur'})\nPays : ${country || 'Togo'}\nTéléphone : ${phone}\nE-mail : ${email}\nObjet : ${subject}\n\nMessage :\n${message}`,
        relatedReference: null
      });

      return sendJson(res, 201, { message: 'Votre message a bien été envoyé à l\'équipe Boovan Group.' });
    }

    // =========================================================================
    // API D'AUTHENTIFICATION & BACK-OFFICE ADMINISTRATEUR
    // =========================================================================

    if (method === 'POST' && pathname === '/api/admin/login') {
      const { email, password } = await readJsonBody(req);
      if (!email || !password) {
        return sendJson(res, 400, { error: 'Veuillez saisir votre e-mail et votre mot de passe.' });
      }

      const user = queryOne(`SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND is_active = 1`, [
        String(email).trim()
      ]);

      if (!user || !verifyPassword(password, user.password_hash)) {
        return sendJson(res, 401, { error: 'Identifiants administrateur incorrects.' });
      }

      runSql(`UPDATE users SET last_login_at = datetime('now') WHERE id = ?`, [user.id]);

      const token = signJwt({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        studio_id: user.studio_id
      });

      return sendJson(res, 200, {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      });
    }

    if (pathname.startsWith('/api/admin/')) {
      const adminUser = getAuthenticatedAdmin(req);
      if (!adminUser) {
        return sendJson(res, 401, { error: 'Authentification administrateur requise.' });
      }

      if (method === 'GET' && pathname === '/api/admin/me') {
        return sendJson(res, 200, { user: adminUser });
      }

      if (method === 'GET' && pathname === '/api/admin/dashboard') {
        const todayStr = getTodayInLome();
        const allReservations = queryAll(`SELECT * FROM reservations ORDER BY created_at DESC`);
        const totalReservations = allReservations.length;
        const todayReservations = allReservations.filter((r) => r.booking_date === todayStr && r.booking_status !== 'ANNULEE').length;
        const upcomingReservations = allReservations.filter((r) => r.booking_date >= todayStr && r.booking_status !== 'ANNULEE').length;
        const confirmedReservations = allReservations.filter((r) => r.booking_status === 'CONFIRMEE' || r.booking_status === 'TERMINEE').length;
        const pendingReservations = allReservations.filter((r) => r.booking_status === 'EN_ATTENTE').length;
        const cancelledReservations = allReservations.filter((r) => r.booking_status === 'ANNULEE').length;

        const confirmedRevenueFcfa = allReservations
          .filter((r) => r.payment_status === 'PAYE_CONFIRME' && r.booking_status !== 'ANNULEE')
          .reduce((acc, r) => acc + Number(r.total_price_fcfa || 0), 0);

        const pendingPaymentBookings = allReservations.filter(
          (r) => (r.payment_status === 'EN_ATTENTE_PAIEMENT' || r.payment_status === 'PREUVE_TRANSMISE') && r.booking_status !== 'ANNULEE'
        );
        const pendingRevenueFcfa = pendingPaymentBookings.reduce((acc, r) => acc + Number(r.total_price_fcfa || 0), 0);

        const uniqueCompanies = new Set(
          allReservations.map((r) => String(r.company_name || '').trim().toLowerCase()).filter(Boolean)
        ).size;

        const packageBreakdownMap = {};
        for (const r of allReservations) {
          if (r.booking_status === 'ANNULEE') continue;
          packageBreakdownMap[r.package_name] = (packageBreakdownMap[r.package_name] || 0) + 1;
        }
        const packageBreakdown = Object.entries(packageBreakdownMap).map(([name, count]) => ({ name, count }));

        const presentielCount = allReservations.filter((r) => r.participation_mode === 'PRESENTIEL' && r.booking_status !== 'ANNULEE').length;
        const distanceCount = allReservations.filter((r) => r.participation_mode === 'DISTANCE' && r.booking_status !== 'ANNULEE').length;

        const countryMap = {};
        for (const r of allReservations) {
          if (r.booking_status === 'ANNULEE') continue;
          const c = r.client_country || 'Togo';
          countryMap[c] = (countryMap[c] || 0) + 1;
        }
        const countryBreakdown = Object.entries(countryMap).map(([country, count]) => ({ country, count }));

        const unreadNotifications = Number(queryOne(`SELECT COUNT(*) as count FROM notifications WHERE is_read = 0`)?.count || 0);
        const newApplications = Number(queryOne(`SELECT COUNT(*) as count FROM applications WHERE status = 'NOUVELLE'`)?.count || 0);

        return sendJson(res, 200, {
          kpis: {
            totalReservations,
            todayReservations,
            upcomingReservations,
            confirmedReservations,
            pendingReservations,
            cancelledReservations,
            confirmedRevenueFcfa,
            pendingPaymentsCount: pendingPaymentBookings.length,
            pendingRevenueFcfa,
            registeredCompaniesCount: uniqueCompanies,
            unreadNotifications,
            newApplications
          },
          charts: {
            packageBreakdown,
            modeBreakdown: [
              { mode: 'Présentiel (Studio Togo)', count: presentielCount },
              { mode: 'À distance (International)', count: distanceCount }
            ],
            countryBreakdown
          },
          recentReservations: allReservations.slice(0, 8).map((r) => ({
            ...r,
            addons: JSON.parse(r.addons_json || '[]'),
            live_objectives: JSON.parse(r.live_objectives_json || '[]'),
            product_photos: JSON.parse(r.product_photos_json || '[]')
          }))
        });
      }

      if (method === 'GET' && pathname === '/api/admin/reservations') {
        const { search, date, country, package_id, mode, booking_status, payment_status } = query;
        let rows = queryAll(`SELECT * FROM reservations ORDER BY booking_date DESC, start_time ASC, id DESC`);

        if (search) {
          const q = String(search).toLowerCase();
          rows = rows.filter(
            (r) =>
              r.reference.toLowerCase().includes(q) ||
              r.company_name.toLowerCase().includes(q) ||
              `${r.client_first_name} ${r.client_last_name}`.toLowerCase().includes(q) ||
              r.client_phone.toLowerCase().includes(q) ||
              r.client_email.toLowerCase().includes(q) ||
              r.sector.toLowerCase().includes(q)
          );
        }
        if (date) rows = rows.filter((r) => r.booking_date === date);
        if (country) rows = rows.filter((r) => r.client_country.toLowerCase() === String(country).toLowerCase());
        if (package_id) rows = rows.filter((r) => Number(r.package_id) === Number(package_id));
        if (mode) rows = rows.filter((r) => r.participation_mode === mode);
        if (booking_status) rows = rows.filter((r) => r.booking_status === booking_status);
        if (payment_status) rows = rows.filter((r) => r.payment_status === payment_status);

        const formatted = rows.map((r) => ({
          ...r,
          addons: JSON.parse(r.addons_json || '[]'),
          live_objectives: JSON.parse(r.live_objectives_json || '[]'),
          product_photos: JSON.parse(r.product_photos_json || '[]')
        }));

        return sendJson(res, 200, { reservations: formatted });
      }

      const adminResMatch = pathname.match(/^\/api\/admin\/reservations\/(\d+)$/);
      if (method === 'PUT' && adminResMatch) {
        const id = Number(adminResMatch[1]);
        const existing = queryOne(`SELECT * FROM reservations WHERE id = ?`, [id]);
        if (!existing) return sendJson(res, 404, { error: 'Réservation introuvable.' });

        const {
          booking_status,
          payment_status,
          booking_date,
          start_time,
          end_time,
          total_price_fcfa,
          remote_assistance,
          internal_notes,
          send_reminder
        } = await readJsonBody(req);

        const newBookingStatus = booking_status || existing.booking_status;
        const newPaymentStatus = payment_status || existing.payment_status;
        const newDate = booking_date || existing.booking_date;
        const newStart = start_time || existing.start_time;
        const newEnd = end_time || existing.end_time;
        const newTotal = total_price_fcfa !== undefined ? Number(total_price_fcfa) : existing.total_price_fcfa;
        const newAssistance = remote_assistance || existing.remote_assistance;
        const newNotes = internal_notes !== undefined ? internal_notes : existing.internal_notes;

        if ((newDate !== existing.booking_date || newStart !== existing.start_time) && newBookingStatus !== 'ANNULEE') {
          const others = queryAll(
            `SELECT * FROM reservations WHERE booking_date = ? AND id != ? AND booking_status != 'ANNULEE'`,
            [newDate, id]
          );
          const sMin = timeToMinutes(newStart);
          const eMin = timeToMinutes(newEnd);
          const conflict = others.find((o) => {
            const oS = timeToMinutes(o.start_time);
            const oE = timeToMinutes(o.end_time);
            return sMin < oE && eMin > oS;
          });
          if (conflict) {
            return sendJson(res, 409, {
              error: `Conflit d'horaire avec la réservation ${conflict.reference} (${conflict.company_name} de ${conflict.start_time} à ${conflict.end_time}).`
            });
          }
        }

        runSql(
          `UPDATE reservations
           SET booking_status = ?,
               payment_status = ?,
               booking_date = ?,
               start_time = ?,
               end_time = ?,
               total_price_fcfa = ?,
               remote_assistance = ?,
               internal_notes = ?,
               updated_at = datetime('now')
           WHERE id = ?`,
          [
            newBookingStatus,
            newPaymentStatus,
            newDate,
            newStart,
            newEnd,
            newTotal,
            newAssistance,
            newNotes,
            id
          ]
        );

        const updated = queryOne(`SELECT * FROM reservations WHERE id = ?`, [id]);

        if (newPaymentStatus === 'PAYE_CONFIRME' && existing.payment_status !== 'PAYE_CONFIRME') {
          await dispatchNotification({
            type: 'PAYMENT_CONFIRMED',
            title: `Paiement confirmé pour ${updated.reference} (${updated.company_name})`,
            recipientEmail: updated.client_email,
            subject: `PAIEMENT CONFIRMÉ — Réservation OCD LIVE ${updated.reference}`,
            bodyText: `Bonjour ${updated.client_first_name} ${updated.client_last_name},\n\nLa direction de Boovan Group confirme la bonne réception de votre paiement de ${Number(updated.total_price_fcfa).toLocaleString('fr-FR')} FCFA pour la réservation ${updated.reference} (${updated.company_name}).\n\nDate du live : ${updated.booking_date} de ${updated.start_time.replace(':', 'h')} à ${updated.end_time.replace(':', 'h')}.\n\nMerci pour votre confiance.`,
            relatedReference: updated.reference
          });
        }

        if (newBookingStatus === 'CONFIRMEE' && existing.booking_status !== 'CONFIRMEE') {
          await dispatchNotification({
            type: 'BOOKING_CONFIRMED',
            title: `Réservation ${updated.reference} validée et confirmée`,
            recipientEmail: updated.client_email,
            subject: `CONFIRMATION OFFICIELLE DE VOTRE PASSAGE SUR OCD LIVE — ${updated.reference}`,
            bodyText: `Bonjour ${updated.client_first_name} ${updated.client_last_name},\n\nVotre session de livestream OCD LIVE (${updated.reference}) pour l'entreprise ${updated.company_name} est officiellement CONFIRMÉE.\n\nDate : ${updated.booking_date}\nHoraire : ${updated.start_time.replace(':', 'h')} – ${updated.end_time.replace(':', 'h')} (Heure de Lomé)\nForfait : ${updated.package_name}\n\nNotre régie prendra contact avec vous pour les derniers réglages avant l'antenne.`,
            relatedReference: updated.reference
          });
        }

        if (newBookingStatus === 'ANNULEE' && existing.booking_status !== 'ANNULEE') {
          await dispatchNotification({
            type: 'BOOKING_CANCELLED',
            title: `Réservation ${updated.reference} annulée`,
            recipientEmail: updated.client_email,
            subject: `ANNULATION DE RÉSERVATION OCD LIVE — ${updated.reference}`,
            bodyText: `Bonjour ${updated.client_first_name} ${updated.client_last_name},\n\nVotre réservation ${updated.reference} (${updated.company_name}) prévue le ${updated.booking_date} a été annulée.\nPour toute reprogrammation, contactez-nous directement.`,
            relatedReference: updated.reference
          });
        }

        if (newDate !== existing.booking_date || newStart !== existing.start_time) {
          await dispatchNotification({
            type: 'BOOKING_UPDATED',
            title: `Modification de créneau pour ${updated.reference}`,
            recipientEmail: updated.client_email,
            subject: `MISE À JOUR DE VOTRE CRÉNEAU OCD LIVE — ${updated.reference}`,
            bodyText: `Bonjour ${updated.client_first_name} ${updated.client_last_name},\n\nLes horaires de votre réservation ${updated.reference} (${updated.company_name}) ont été mis à jour :\nNouvelle date : ${updated.booking_date}\nNouvel horaire : ${updated.start_time.replace(':', 'h')} – ${updated.end_time.replace(':', 'h')} (Africa/Lome).`,
            relatedReference: updated.reference
          });
        }

        if (send_reminder) {
          await dispatchNotification({
            type: 'LIVE_REMINDER',
            title: `Rappel avant le live envoyé à ${updated.company_name} (${updated.reference})`,
            recipientEmail: updated.client_email,
            subject: `RAPPEL IMPORTANT — Votre émission OCD LIVE approche (${updated.reference})`,
            bodyText: `Bonjour ${updated.client_first_name} ${updated.client_last_name},\n\nNous vous rappelons votre passage en direct sur OCD LIVE pour l'entreprise ${updated.company_name} :\n- Date : ${updated.booking_date}\n- Heure : ${updated.start_time.replace(':', 'h')} – ${updated.end_time.replace(':', 'h')} (Heure du Togo)\n- Mode : ${updated.participation_mode === 'PRESENTIEL' ? 'Présentiel au Studio de Lomé (arrivée 30 min avant)' : 'À distance (vérifiez votre connexion et éclairage 30 min avant)'}\n\nÀ très bientôt sur le plateau OCD LIVE !`,
            relatedReference: updated.reference
          });
        }

        return sendJson(res, 200, {
          message: 'Réservation mise à jour avec succès.',
          reservation: {
            ...updated,
            addons: JSON.parse(updated.addons_json || '[]'),
            live_objectives: JSON.parse(updated.live_objectives_json || '[]'),
            product_photos: JSON.parse(updated.product_photos_json || '[]')
          }
        });
      }

      if (method === 'GET' && pathname === '/api/admin/schedule') {
        const weekly = queryAll(`SELECT * FROM weekly_schedule ORDER BY day_of_week ASC`).map((w) => ({
          ...w,
          is_open: Boolean(w.is_open),
          slots: JSON.parse(w.slots_json || '[]')
        }));

        const overrides = queryAll(`SELECT * FROM calendar_overrides ORDER BY date_str ASC`).map((o) => ({
          ...o,
          is_closed: Boolean(o.is_closed),
          custom_slots: o.custom_slots_json ? JSON.parse(o.custom_slots_json) : null
        }));

        return sendJson(res, 200, { weekly, overrides });
      }

      if (method === 'PUT' && pathname === '/api/admin/schedule/weekly') {
        const { weekly } = await readJsonBody(req);
        if (!Array.isArray(weekly)) return sendJson(res, 400, { error: 'Format hebdomadaire invalide.' });

        for (const day of weekly) {
          const cleanSlots = Array.isArray(day.slots)
            ? day.slots.filter((s) => /^\d{2}:\d{2}$/.test(s)).sort()
            : [];
          runSql(
            `UPDATE weekly_schedule SET is_open = ?, slots_json = ? WHERE day_of_week = ?`,
            [day.is_open ? 1 : 0, JSON.stringify(cleanSlots), Number(day.day_of_week)]
          );
        }
        return sendJson(res, 200, { message: 'Planning hebdomadaire enregistré avec succès.' });
      }

      if (method === 'POST' && pathname === '/api/admin/schedule/override') {
        const { date_str, is_closed, reason, custom_slots } = await readJsonBody(req);
        if (!date_str || !/^\d{4}-\d{2}-\d{2}$/.test(date_str)) {
          return sendJson(res, 400, { error: 'Date invalide.' });
        }
        const customSlotsJson = Array.isArray(custom_slots) && custom_slots.length > 0
          ? JSON.stringify(custom_slots.filter((s) => /^\d{2}:\d{2}$/.test(s)).sort())
          : null;

        runSql(
          `INSERT INTO calendar_overrides (date_str, is_closed, reason, custom_slots_json, created_at)
           VALUES (?, ?, ?, ?, datetime('now'))
           ON CONFLICT(date_str) DO UPDATE SET
             is_closed = excluded.is_closed,
             reason = excluded.reason,
             custom_slots_json = excluded.custom_slots_json`,
          [date_str, is_closed ? 1 : 0, reason || '', customSlotsJson]
        );
        return sendJson(res, 200, { message: 'Configuration de la date enregistrée.' });
      }

      const delOverrideMatch = pathname.match(/^\/api\/admin\/schedule\/override\/(\d+)$/);
      if (method === 'DELETE' && delOverrideMatch) {
        runSql(`DELETE FROM calendar_overrides WHERE id = ?`, [Number(delOverrideMatch[1])]);
        return sendJson(res, 200, { message: 'Exception de date supprimée.' });
      }

      if (method === 'GET' && pathname === '/api/admin/packages') {
        const packages = queryAll(`SELECT * FROM packages ORDER BY display_order ASC, id ASC`).map((p) => ({
          ...p,
          is_recommended: Boolean(p.is_recommended),
          allows_remote_assistance: Boolean(p.allows_remote_assistance),
          remote_assistance_included: Boolean(p.remote_assistance_included),
          is_active: Boolean(p.is_active),
          features: JSON.parse(p.features_json || '[]')
        }));

        const addons = queryAll(`SELECT * FROM package_addons ORDER BY display_order ASC, id ASC`).map((a) => ({
          ...a,
          requires_team_validation: Boolean(a.requires_team_validation),
          is_active: Boolean(a.is_active)
        }));

        return sendJson(res, 200, { packages, addons });
      }

      if (method === 'POST' && pathname === '/api/admin/packages') {
        const b = await readJsonBody(req);
        if (!b.name || !b.duration_label || !b.duration_minutes) {
          return sendJson(res, 400, { error: 'Nom, durée affichée et durée en minutes sont obligatoires.' });
        }
        const slug = (b.slug || b.name)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') + '-' + Math.floor(100 + Math.random() * 900);

        const priceVal = b.price_fcfa === '' || b.price_fcfa === null || b.price_fcfa === undefined ? null : Number(b.price_fcfa);
        const priceLabel = b.price_label || (priceVal !== null ? `${priceVal.toLocaleString('fr-FR')} FCFA` : 'Sur mesure');

        const result = runSql(
          `INSERT INTO packages (
            slug, name, subtitle, duration_label, duration_minutes, price_fcfa, price_label,
            badge, is_recommended, description, features_json, image_url,
            allows_remote_assistance, remote_assistance_included, remote_assistance_fee_fcfa,
            is_active, display_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            slug,
            b.name,
            b.subtitle || '',
            b.duration_label,
            Number(b.duration_minutes),
            priceVal,
            priceLabel,
            b.badge || '',
            b.is_recommended ? 1 : 0,
            b.description || '',
            JSON.stringify(Array.isArray(b.features) ? b.features : []),
            b.image_url || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
            b.allows_remote_assistance !== false ? 1 : 0,
            b.remote_assistance_included ? 1 : 0,
            Number(b.remote_assistance_fee_fcfa || 0),
            b.is_active !== false ? 1 : 0,
            Number(b.display_order || 1)
          ]
        );

        const created = queryOne(`SELECT * FROM packages WHERE id = ?`, [result.lastInsertRowid]);
        return sendJson(res, 201, { message: 'Forfait créé avec succès.', package: created });
      }

      const pkgIdMatch = pathname.match(/^\/api\/admin\/packages\/(\d+)$/);
      if (method === 'PUT' && pkgIdMatch) {
        const id = Number(pkgIdMatch[1]);
        const b = await readJsonBody(req);
        const existing = queryOne(`SELECT * FROM packages WHERE id = ?`, [id]);
        if (!existing) return sendJson(res, 404, { error: 'Forfait introuvable.' });

        const priceVal = b.price_fcfa === '' || b.price_fcfa === null || b.price_fcfa === undefined ? null : Number(b.price_fcfa);
        const priceLabel = b.price_label || (priceVal !== null ? `${priceVal.toLocaleString('fr-FR')} FCFA` : 'Sur mesure');

        runSql(
          `UPDATE packages SET
            name = ?,
            subtitle = ?,
            duration_label = ?,
            duration_minutes = ?,
            price_fcfa = ?,
            price_label = ?,
            badge = ?,
            is_recommended = ?,
            description = ?,
            features_json = ?,
            image_url = ?,
            allows_remote_assistance = ?,
            remote_assistance_included = ?,
            remote_assistance_fee_fcfa = ?,
            is_active = ?,
            display_order = ?
           WHERE id = ?`,
          [
            b.name,
            b.subtitle || '',
            b.duration_label,
            Number(b.duration_minutes),
            priceVal,
            priceLabel,
            b.badge || '',
            b.is_recommended ? 1 : 0,
            b.description || '',
            JSON.stringify(Array.isArray(b.features) ? b.features : []),
            b.image_url,
            b.allows_remote_assistance ? 1 : 0,
            b.remote_assistance_included ? 1 : 0,
            Number(b.remote_assistance_fee_fcfa || 0),
            b.is_active ? 1 : 0,
            Number(b.display_order || 1),
            id
          ]
        );
        return sendJson(res, 200, { message: 'Forfait mis à jour avec succès.' });
      }

      if (method === 'DELETE' && pkgIdMatch) {
        runSql(`DELETE FROM packages WHERE id = ?`, [Number(pkgIdMatch[1])]);
        return sendJson(res, 200, { message: 'Forfait supprimé.' });
      }

      if (method === 'POST' && pathname === '/api/admin/addons') {
        const { name, description, price_fcfa, requires_team_validation, is_active } = await readJsonBody(req);
        if (!name || price_fcfa === undefined) {
          return sendJson(res, 400, { error: 'Nom et tarif du supplément requis.' });
        }
        const code = name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').slice(0, 20) + '_' + Math.floor(10 + Math.random() * 90);
        runSql(
          `INSERT INTO package_addons (code, name, description, price_fcfa, requires_team_validation, is_active, display_order)
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
          [code, name, description || '', Number(price_fcfa), requires_team_validation ? 1 : 0, is_active !== false ? 1 : 0]
        );
        return sendJson(res, 201, { message: 'Supplément optionnel ajouté.' });
      }

      const addonIdMatch = pathname.match(/^\/api\/admin\/addons\/(\d+)$/);
      if (method === 'PUT' && addonIdMatch) {
        const id = Number(addonIdMatch[1]);
        const { name, description, price_fcfa, requires_team_validation, is_active } = await readJsonBody(req);
        runSql(
          `UPDATE package_addons SET name = ?, description = ?, price_fcfa = ?, requires_team_validation = ?, is_active = ? WHERE id = ?`,
          [name, description || '', Number(price_fcfa), requires_team_validation ? 1 : 0, is_active ? 1 : 0, id]
        );
        return sendJson(res, 200, { message: 'Supplément mis à jour.' });
      }

      if (method === 'DELETE' && addonIdMatch) {
        runSql(`DELETE FROM package_addons WHERE id = ?`, [Number(addonIdMatch[1])]);
        return sendJson(res, 200, { message: 'Supplément supprimé.' });
      }

      if (method === 'GET' && pathname === '/api/admin/applications') {
        const applications = queryAll(`SELECT * FROM applications ORDER BY created_at DESC`);
        return sendJson(res, 200, { applications });
      }

      const appIdMatch = pathname.match(/^\/api\/admin\/applications\/(\d+)$/);
      if (method === 'PUT' && appIdMatch) {
        const id = Number(appIdMatch[1]);
        const { status, internal_notes } = await readJsonBody(req);
        runSql(
          `UPDATE applications SET status = COALESCE(?, status), internal_notes = COALESCE(?, internal_notes) WHERE id = ?`,
          [status || null, internal_notes !== undefined ? internal_notes : null, id]
        );
        const updated = queryOne(`SELECT * FROM applications WHERE id = ?`, [id]);
        return sendJson(res, 200, { message: 'Candidature mise à jour.', application: updated });
      }

      if (method === 'GET' && pathname === '/api/admin/notifications') {
        const notifications = queryAll(`SELECT * FROM notifications ORDER BY id DESC LIMIT 100`);
        const contacts = queryAll(`SELECT * FROM contact_messages ORDER BY id DESC LIMIT 100`);
        return sendJson(res, 200, { notifications, contacts });
      }

      if (method === 'PUT' && pathname === '/api/admin/notifications/read-all') {
        runSql(`UPDATE notifications SET is_read = 1 WHERE is_read = 0`);
        runSql(`UPDATE contact_messages SET is_read = 1 WHERE is_read = 0`);
        return sendJson(res, 200, { message: 'Toutes les notifications ont été marquées comme lues.' });
      }

      if (method === 'PUT' && pathname === '/api/admin/settings') {
        const settingsObj = await readJsonBody(req);
        if (!settingsObj || typeof settingsObj !== 'object') {
          return sendJson(res, 400, { error: 'Paramètres invalides.' });
        }
        for (const [k, v] of Object.entries(settingsObj)) {
          runSql(
            `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
             ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
            [k, String(v ?? '')]
          );
        }
        return sendJson(res, 200, { message: 'Paramètres généraux enregistrés avec succès.' });
      }

      if (method === 'POST' && pathname === '/api/admin/send-test-email') {
        const { target_email } = await readJsonBody(req);
        const recipient = target_email || adminUser.email;
        const resNotice = await dispatchNotification({
          type: 'TEST_EMAIL',
          title: 'Test d\'envoi d\'e-mail OCD LIVE',
          recipientEmail: recipient,
          subject: 'Test de transmission d\'e-mail — OCD LIVE (Boovan Group)',
          bodyText: `Ceci est un e-mail de test envoyé depuis le portail d'administration OCD LIVE.\n\nDate : ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Lome' })} (Heure de Lomé)\nDestinataire : ${recipient}\n\nSi vous lisez ce message, la distribution d'e-mails d'OCD LIVE est opérationnelle !`
        });
        return sendJson(res, 200, {
          message: `E-mail de test généré (Statut : ${resNotice.status}).`,
          status: resNotice.status,
          recipient
        });
      }
    }

    // Servir le frontend compilé (dist) en production
    if (fs.existsSync(DIST_DIR)) {
      const candidate = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);
      if (serveStaticFile(res, candidate)) return;
      if (!pathname.startsWith('/api/')) {
        if (serveStaticFile(res, path.join(DIST_DIR, 'index.html'))) return;
      }
    }

    sendJson(res, 404, { error: 'Route introuvable.' });
  } catch (err) {
    console.error('[OCD LIVE Server Error]', err);
    sendJson(res, 500, { error: err.message || 'Erreur interne du serveur.' });
  }
});

initDatabase()
  .then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`================================================================`);
      console.log(`  OCD LIVE — Boovan Group API & Back-Office Server`);
      console.log(`  Port : http://localhost:${PORT} | Fuseau : Africa/Lome`);
      console.log(`================================================================`);
    });
  })
  .catch((err) => {
    console.error('Échec critique d\'initialisation de la base de données OCD LIVE :', err);
    process.exit(1);
  });

import React from 'react';
import { Link } from '../router';

export default function Footer({ settings }) {
  const address = settings?.studio_address || 'Studio OCD LIVE — Boovan Group, Lomé, Togo';
  const phone = settings?.contact_phone || '+228 90 00 00 00';
  const whatsapp = settings?.contact_whatsapp || '+228 90 00 00 00';
  const email = settings?.contact_email || 'contact@boovangroup.com';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-slate-800">
          
          {/* Colonne 1 : Marque & Présentation */}
          <div className="lg:col-span-4 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded inline-flex items-center">
                <img
                  src="/brand/ocd-logo.jpg"
                  alt="OCD LIVE"
                  className="h-7 w-auto object-contain"
                />
              </div>
              <span className="font-semibold text-lg text-white">
                OCD <span className="text-[#F26513]">LIVE</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Infrastructure audiovisuelle et plateforme de diffusion commerciale pour entreprises et créateurs. Opéré par Boovan Group depuis Lomé, Togo.
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Heure de référence : Africa/Lome (GMT)
            </p>
          </div>

          {/* Colonne 2 : Plateaux & Studio */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Studio & Production
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/forfaits" className="hover:text-white transition-colors">Forfaits de diffusion</Link></li>
              <li><Link to="/comment-ca-marche" className="hover:text-white transition-colors">Comment ça marche</Link></li>
              <li><Link to="/a-propos" className="hover:text-white transition-colors">À propos de Boovan Group</Link></li>
              <li><Link to="/reserver" className="hover:text-white transition-colors">Réserver un passage en direct</Link></li>
              <li><Link to="/recrutement" className="hover:text-white transition-colors">Recrutement d'animatrices</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Directs & E-Commerce */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Vente en direct
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/lives-afrique" className="hover:text-white transition-colors">Directs Panafricains</Link></li>
              <li><Link to="/boutique" className="hover:text-white transition-colors">Boutique OCD Shop</Link></li>
              <li><Link to="/suivi-reservation" className="hover:text-white transition-colors">Suivi de dossier</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Espace direction</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Coordonnées Lomé */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Siège & Studio (Lomé)
            </h4>
            <div className="space-y-1.5 text-sm text-slate-400">
              <p>{address}</p>
              <p>Tél : <a href={`tel:${phone}`} className="text-slate-200 hover:text-white">{phone}</a></p>
              <p>WhatsApp : <span className="text-slate-200">{whatsapp}</span></p>
              <p>E-mail : <a href={`mailto:${email}`} className="text-slate-200 hover:text-white">{email}</a></p>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a
                href={settings?.social_facebook || 'https://www.facebook.com/Bovannofficiel'}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                Facebook
              </a>
              <a
                href={settings?.social_tiktok || 'https://www.tiktok.com/@bovann'}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} OCD LIVE — Boovan Group. Tous droits réservés.</p>
          <p>Diffusion panafricaine et internationale.</p>
        </div>
      </div>
    </footer>
  );
}

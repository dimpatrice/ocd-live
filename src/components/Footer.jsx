import React from 'react';
import { Link } from '../router';

export default function Footer({ settings }) {
  const address = settings?.studio_address || 'Studio OCD LIVE — Boovan Group, Lomé, Togo';
  const phone = settings?.contact_phone || '+228 90 00 00 00';
  const whatsapp = settings?.contact_whatsapp || '+228 90 00 00 00';
  const email = settings?.contact_email || 'dimpatrice3@gmail.com';

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-zinc-800">
          {/* Colonne 1 : Marque */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white px-2.5 py-1.5 rounded-lg inline-flex items-center">
                <img
                  src="/brand/ocd-logo.jpg"
                  alt="OCD LIVE"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <span className="font-display font-extrabold text-xl text-white">
                OCD <span className="text-[#F26513]">LIVE</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Plateforme de réservation, de présentation commerciale et de livestreaming pour les entrepreneurs en Afrique et à l'international. Organisé par Boovan Group depuis le Togo.
            </p>
            <p className="text-xs text-zinc-500">
              Fuseau horaire du studio : Africa/Lome (GMT)
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link to="/" className="hover:text-[#F26513] transition-colors">Accueil</Link></li>
              <li><Link to="/reserver" className="hover:text-[#F26513] transition-colors">Réserver un live</Link></li>
              <li><Link to="/forfaits" className="hover:text-[#F26513] transition-colors">Nos forfaits</Link></li>
              <li><Link to="/comment-ca-marche" className="hover:text-[#F26513] transition-colors">Comment ça marche ?</Link></li>
              <li><Link to="/a-propos" className="hover:text-[#F26513] transition-colors">À propos</Link></li>
              <li><Link to="/recrutement" className="hover:text-[#F26513] transition-colors">Recrutement</Link></li>
              <li><Link to="/contact" className="hover:text-[#F26513] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Accès rapides */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Espace Client
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link to="/reserver?mode=PRESENTIEL" className="hover:text-[#F26513] transition-colors">Live en présentiel</Link></li>
              <li><Link to="/reserver?mode=DISTANCE" className="hover:text-[#F26513] transition-colors">Live à distance</Link></li>
              <li><Link to="/suivi-reservation" className="hover:text-[#F26513] transition-colors">Suivre ma réservation</Link></li>
              <li><Link to="/admin" className="hover:text-[#F26513] transition-colors">Administration</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Coordonnées & Réseaux Officiels */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Boovan Group • Coordonnées
            </h4>
            <div className="space-y-2 text-sm text-zinc-400">
              <p>{address}</p>
              <p>Tél : <a href={`tel:${phone}`} className="text-white hover:text-[#F26513]">{phone}</a></p>
              <p>WhatsApp : <span className="text-white">{whatsapp}</span></p>
              <p>E-mail : <a href={`mailto:${email}`} className="text-white hover:text-[#F26513]">{email}</a></p>
            </div>
            <div className="pt-3 flex flex-wrap gap-2">
              <a
                href={settings?.social_facebook || 'https://www.facebook.com/Bovannofficiel'}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white text-xs font-semibold transition-colors"
              >
                Facebook : Bovann Officiel
              </a>
              <a
                href={settings?.social_tiktok || 'https://www.tiktok.com/@bovann'}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
              >
                TikTok : @bovann
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} OCD LIVE — Boovan Group (Togo). Tous droits réservés.</p>
          <p>Du Togo à toute l'Afrique, et partout dans le monde.</p>
        </div>
      </div>
    </footer>
  );
}

import React, { useState } from 'react';
import { MessageCircle, X, ArrowUpRight } from 'lucide-react';

export default function FloatingWhatsApp({ settings = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const rawNumber = settings.contact_whatsapp || '+228 90 00 00 00';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const studioName = settings.organization_name || 'OCD LIVE • Boovan Group';

  const defaultMessage = encodeURIComponent(
    'Bonjour l\'équipe OCD LIVE, je souhaite avoir des renseignements sur la réservation du studio ou le lancement d\'un direct.'
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden">
      {/* Popover rapide */}
      {isOpen && (
        <div className="mb-3 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-xs text-slate-900">{studioName}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Une question sur votre direct, un forfait ou une réservation ? Écrivez-nous directement sur WhatsApp, notre équipe au studio vous répond sans attendre.
          </p>

          <a
            href={`https://wa.me/${cleanNumber}?text=${defaultMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ouvrir WhatsApp</span>
            <ArrowUpRight className="w-4 h-4 opacity-75" />
          </a>
        </div>
      )}

      {/* Bouton déclencheur flottant */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-150 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-200"
        aria-label="Contacter le studio sur WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white shrink-0 group-hover:scale-110 transition-transform" />
        <span className="font-bold text-xs hidden sm:inline tracking-wide">
          WhatsApp Direct
        </span>
      </button>
    </div>
  );
}

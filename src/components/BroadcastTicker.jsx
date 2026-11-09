import React from 'react';
import { Radio } from 'lucide-react';

/**
 * BroadcastTicker - Bandeau d'information régie en direct.
 * Style chyron de télévision professionnelle (dense, lisible, sans fioritures IA).
 */
export default function BroadcastTicker() {
  const items = [
    'RÉGIE BOOVAN GROUP LOMÉ • DIRECT PANAFRICAIN CONNECTÉ',
    'CRÉNEAUX D\'ANTENNE OUVERTS : 08H00 - 11H00 & 18H00 - 21H00 GMT',
    'COMMERÇANTS CERTIFIÉS : TOGO • BÉNIN • CAMEROUN • CÔTE D\'IVOIRE • GABON • SÉNÉGAL',
    'ABONNEMENT MARCHAND : 5 000 FCFA / MOIS (DIFFUSION QUOTIDIENNE)',
    'COMMANDES EN DIRECT VIA WHATSAPP SANS FRAIS D\'INTERMÉDIAIRE'
  ];

  return (
    <div
      role="region"
      aria-label="Fil d'information du direct"
      className="relative z-20 border-b border-slate-800 bg-slate-950 text-slate-300 overflow-hidden py-1.5 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        
        {/* Témoin d'antenne officiel (style cartouche de régie TV) */}
        <div className="flex items-center gap-2 pr-3.5 border-r border-slate-800 shrink-0 z-10 bg-slate-950">
          <span className="w-2 h-2 rounded-xs bg-red-600 shrink-0" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#F26513] shrink-0" />
            <span>EN DIRECT</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            GMT
          </span>
        </div>

        {/* Ruban défilant d'actualité régie */}
        <div className="overflow-hidden relative flex-1 mask-linear-gradient ml-3">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-mono text-xs font-medium text-slate-300">
            {items.concat(items).map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-3">
                <span>{item}</span>
                <span className="w-1 h-1 rounded-full bg-[#F26513]" />
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

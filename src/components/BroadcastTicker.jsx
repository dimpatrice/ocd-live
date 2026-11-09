import React from 'react';
import { Radio, Zap } from 'lucide-react';

/**
 * BroadcastTicker - Bandeau défilant d'information en direct.
 * Donne une sensation immédiate d'activité permanente et de studio vivant.
 */
export default function BroadcastTicker() {
  const items = [
    'SESSION EN DIRECT • STUDIO BOOVAN GROUP LOMÉ (GMT)',
    'PLATEAUX CONNECTÉS EN DUPLEX PANAFRICAIN',
    'CRÉNEAUX DE VALIDATION : 08H00 - 11H00 & 18H00 - 21H00',
    'COMMERÇANTS VÉRIFIÉS : TOGO • BÉNIN • CAMEROUN • CÔTE D\'IVOIRE • GABON • SÉNÉGAL',
    'DIFFUSEZ VOTRE PROPRE DIRECT POUR 5 000 FCFA / MOIS',
    'COMMANDEZ SUR WHATSAPP EN 1 CLIC AUPRÈS DES VENDEURS'
  ];

  return (
    <div
      role="region"
      aria-label="Bandeau d'information en direct"
      className="relative z-20 border-b border-orange-200/80 bg-gradient-to-r from-orange-100/90 via-amber-50/95 to-orange-100/90 backdrop-blur-md overflow-hidden py-2"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        
        {/* Badge fixe : Signal Live & Égaliseur audio de direct */}
        <div className="flex items-center gap-2.5 pr-4 border-r border-orange-300/80 shrink-0 z-10 bg-gradient-to-r from-orange-100/90 to-transparent">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#F26513] shrink-0" />
            <span>En direct</span>
          </span>
          
          {/* Égaliseur audio animé (effet régie TV) */}
          <div className="flex items-end gap-0.5 h-3.5 px-1 py-0.5" aria-hidden="true">
            <span className="w-1 bg-[#F26513] rounded-full animate-eq-1" />
            <span className="w-1 bg-amber-500 rounded-full animate-eq-2" />
            <span className="w-1 bg-[#F26513] rounded-full animate-eq-3" />
            <span className="w-1 bg-amber-600 rounded-full animate-eq-4" />
          </div>
        </div>

        {/* Ruban défilant continu */}
        <div className="overflow-hidden relative flex-1 mask-linear-gradient">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-bold text-slate-800">
            {items.concat(items).map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-3">
                <span>{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F26513]/60" />
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}


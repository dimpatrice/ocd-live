import React from 'react';

/**
 * Arrière-plan animé subtil avec symboles thématiques :
 * - Live (ondes de direct, signal caméra, micro)
 * - Afrique (contour stylisé du continent africain)
 * - Business (croissance, transactions, diamant commercial)
 * Conçu avec une opacité très légère (4% à 10%) pour créer de la vie et du prestige sans jamais saturer ni gêner la lecture.
 */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* 1. Contour Afrique — Haut Droite */}
      <div className="absolute -top-12 right-6 lg:right-24 w-80 h-96 opacity-[0.06] animate-float-1 text-[#F26513]">
        <svg viewBox="0 0 200 240" fill="currentColor" className="w-full h-full">
          {/* Forme stylisée du continent africain */}
          <path d="M70,15 C95,12 120,20 135,35 C155,55 170,80 160,110 C155,125 140,135 130,150 C120,165 110,185 105,205 C100,220 95,230 90,235 C85,230 80,215 75,195 C70,175 60,155 50,140 C40,125 25,115 20,95 C15,75 25,50 40,35 C50,25 60,18 70,15 Z" />
        </svg>
      </div>

      {/* 2. Symbole Live / Signal Broadcast — Haut Gauche */}
      <div className="absolute top-28 left-4 lg:left-16 w-44 h-44 opacity-[0.05] animate-float-2 text-zinc-900">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
          {/* Ondes concentriques live */}
          <circle cx="50" cy="50" r="10" fill="#F26513" fillOpacity="0.4" />
          <path d="M32,32 A25,25 0 0,0 32,68" strokeLinecap="round" />
          <path d="M68,32 A25,25 0 0,1 68,68" strokeLinecap="round" />
          <path d="M22,22 A40,40 0 0,0 22,78" strokeLinecap="round" />
          <path d="M78,22 A40,40 0 0,1 78,78" strokeLinecap="round" />
        </svg>
      </div>

      {/* 3. Symbole Business / Croissance & Flèche de vente — Milieu Droite */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:right-16 w-52 h-52 opacity-[0.06] animate-float-3 text-[#F26513]">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
          <polyline points="15,85 40,55 60,65 90,25" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="72,25 90,25 90,43" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="90" cy="25" r="4" fill="currentColor" />
          <line x1="15" y1="88" x2="90" y2="88" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        </svg>
      </div>

      {/* 4. Contour Afrique stylisé — Bas Gauche */}
      <div className="absolute bottom-16 left-6 lg:left-24 w-72 h-80 opacity-[0.05] animate-float-4 text-zinc-900">
        <svg viewBox="0 0 200 240" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="w-full h-full">
          <path d="M70,15 C95,12 120,20 135,35 C155,55 170,80 160,110 C155,125 140,135 130,150 C120,165 110,185 105,205 C100,220 95,230 90,235 C85,230 80,215 75,195 C70,175 60,155 50,140 C40,125 25,115 20,95 C15,75 25,50 40,35 C50,25 60,18 70,15 Z" />
        </svg>
      </div>

      {/* 5. Symbole Caméra Studio / Clap Live — Bas Droite */}
      <div className="absolute bottom-24 right-1/4 w-36 h-36 opacity-[0.04] animate-float-2 text-[#F26513]">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
          <rect x="15" y="30" width="50" height="40" rx="8" />
          <polygon points="68,42 88,32 88,68 68,58" fill="currentColor" fillOpacity="0.3" />
          <circle cx="40" cy="50" r="10" />
        </svg>
      </div>

      {/* 6. Légère lueur diffuse chaude non saturante */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#F26513]/[0.025] rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#F26513]/[0.02] rounded-full blur-3xl" />
    </div>
  );
}


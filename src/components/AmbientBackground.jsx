import React from 'react';

/**
 * AmbientBackground - Environnement vivant à thème clair dominant.
 * Apporte de la profondeur, de la chaleur et du dynamisme (ondes de diffusion TV,
 * orbes lumineux chauds, trame de plateau audiovisuel) sans jamais alourdir la lisibilité.
 */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gradient-to-b from-orange-50/40 via-amber-50/20 to-slate-50/60"
    >
      {/* 1. Trame texturée subtile de régie audiovisuelle (évite le blanc plat et mort) */}
      <div className="absolute inset-0 bg-studio-dots opacity-70" />
      <div className="absolute inset-0 bg-studio-grid opacity-35" />

      {/* 2. Grandes auras lumineuses chaudes et organiques (thème clair lumineux) */}
      {/* Aura Orange OCD LIVE principale (Haut Droite) */}
      <div
        className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#F26513]/25 via-amber-400/20 to-transparent blur-[110px] animate-float-1"
      />

      {/* Aura Dorée Afrique (Milieu Gauche) */}
      <div
        className="absolute top-[35%] -left-32 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-amber-400/20 via-orange-300/15 to-transparent blur-[100px] animate-float-2"
      />

      {/* Aura Chaleureuse Énergie (Bas Droite) */}
      <div
        className="absolute bottom-10 right-10 w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-[#F26513]/20 via-amber-200/15 to-transparent blur-[120px] animate-float-3"
      />

      {/* Aura Centrale Subtile (Milieu) */}
      <div
        className="absolute top-[60%] left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-orange-200/15 via-rose-200/10 to-transparent blur-[90px] animate-float-4"
      />

      {/* 3. Ondes radio/satellite animées stylisées (symbole de diffusion en direct) */}
      <div className="absolute top-16 left-8 w-64 h-64 opacity-20 hidden md:block">
        <div className="absolute inset-0 rounded-full border-2 border-[#F26513] animate-broadcast-ring" />
        <div
          className="absolute inset-4 rounded-full border border-amber-500 animate-broadcast-ring"
          style={{ animationDelay: '0.9s' }}
        />
        <div
          className="absolute inset-8 rounded-full border border-orange-400 animate-broadcast-ring"
          style={{ animationDelay: '1.8s' }}
        />
      </div>

      {/* 4. Faisceau lumineux vertical doux */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-gradient-to-b from-orange-200/15 via-transparent to-transparent blur-2xl" />
    </div>
  );
}

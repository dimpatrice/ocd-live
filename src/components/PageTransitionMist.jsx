import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '../router';
import { Radio } from 'lucide-react';

/**
 * PageTransitionMist - Animation de transition atmosphérique (brouillard / fumée de dégradé)
 * déclenchée à chaque changement d'onglet ou de page.
 * Apporte une fluidité cinématographique et vivante sans jamais bloquer l'interaction utilisateur.
 */
export default function PageTransitionMist() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Ne pas déclencher au premier chargement initial
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Déclencher l'effet de brume / fumée
    setActive(true);
    setTransitionKey((prev) => prev + 1);

    const timer = setTimeout(() => {
      setActive(false);
    }, 750);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      key={transitionKey}
      aria-hidden="true"
      className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Nappe de brume chaude principale (fleurit puis s'évapore) */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/25 via-amber-200/30 to-white/60 backdrop-blur-md animate-mist-layer" />

      {/* 2. Nuage de fumée chaud central rotatif et expansif */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-[#F26513]/30 via-amber-300/25 to-orange-100/40 blur-[90px] animate-mist-cloud" />

      {/* 3. Faisceau lumineux diagonal évoquant la lumière de projecteur de studio */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-white/70 via-orange-200/40 to-transparent blur-[70px] animate-mist-cloud" />

      {/* 4. Micro-signal discret au centre pendant l'évaporation du brouillard */}
      <div className="absolute inset-0 flex items-center justify-center animate-mist-layer">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border-2 border-orange-300/80 shadow-xl backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F26513] animate-ping" />
          <Radio className="w-4 h-4 text-[#F26513]" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-900">
            OCD LIVE
          </span>
        </div>
      </div>
    </div>
  );
}

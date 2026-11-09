import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '../router';
import { Radio } from 'lucide-react';

/**
 * PageTransitionMist - Voile de dégradé atmosphérique fluide et ultra-rapide (450ms)
 * qui s'estompe sans aucun ralentissement.
 */
export default function PageTransitionMist() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setActive(true);
    setTransitionKey((prev) => prev + 1);

    const timer = setTimeout(() => {
      setActive(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      key={transitionKey}
      aria-hidden="true"
      className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none"
    >
      {/* Nappe de brume chaude principale fluide */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-amber-200/20 to-white/70 backdrop-blur-xs animate-mist-layer" />

      {/* Volute centrale douce */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-r from-[#F26513]/20 via-amber-300/15 to-transparent blur-3xl animate-mist-cloud" />

      {/* Indicateur de transition discret */}
      <div className="absolute inset-0 flex items-center justify-center animate-mist-layer">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border-2 border-orange-300 shadow-lg backdrop-blur-sm">
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

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '../router';

/**
 * PageTransitionMist - Voile de dégradé atmosphérique fluide et ultra-rapide (400ms)
 * qui s'estompe sans aucun ralentissement ni artéfact visuel artificiel.
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
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      key={transitionKey}
      aria-hidden="true"
      className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none"
    >
      {/* Nappe de brume chaude principale fluide (orbe ambrée et nacrée) */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-300/15 via-amber-100/15 to-white/60 backdrop-blur-xs animate-mist-layer" />

      {/* Volute douce en expansion rapide */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#F26513]/15 via-amber-200/15 to-transparent blur-2xl animate-mist-cloud" />
    </div>
  );
}

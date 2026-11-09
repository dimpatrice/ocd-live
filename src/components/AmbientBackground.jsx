import React from 'react';
import {
  Video,
  Radio,
  Tv,
  Mic,
  Camera,
  ShoppingBag,
  Tag,
  Package,
  TrendingUp,
  Globe2,
  Sparkles,
  ShieldCheck,
  Megaphone,
  CreditCard,
  Zap,
  ShoppingBag as CartIcon
} from 'lucide-react';

/**
 * AmbientBackground - Fond texturé léger et ultra-performant.
 * Contient des objets Live & Business FIXES, positionnés de façon ALÉATOIRE
 * et de TAILLES VARIÉES, sans aucun texte pour une clarté et fluidité 100% absolue.
 */
export default function AmbientBackground() {
  // Objets fixes positionnés de manière organique et dispersée (aucun alignement)
  const scatteredObjects = [
    { icon: Video, style: { top: '6%', left: '4%', transform: 'rotate(-14deg)' }, size: 'w-12 h-12', color: 'text-[#F26513]', opacity: 'opacity-20' },
    { icon: ShoppingBag, style: { top: '11%', right: '6%', transform: 'rotate(18deg)' }, size: 'w-16 h-16', color: 'text-amber-500', opacity: 'opacity-25' },
    { icon: Mic, style: { top: '22%', left: '10%', transform: 'rotate(22deg)' }, size: 'w-7 h-7', color: 'text-orange-400', opacity: 'opacity-20' },
    { icon: Tag, style: { top: '28%', right: '12%', transform: 'rotate(-16deg)' }, size: 'w-9 h-9', color: 'text-amber-600', opacity: 'opacity-20' },
    { icon: Megaphone, style: { top: '18%', right: '28%', transform: 'rotate(28deg)' }, size: 'w-8 h-8', color: 'text-orange-500', opacity: 'opacity-15' },
    { icon: Tv, style: { top: '38%', left: '3%', transform: 'rotate(10deg)' }, size: 'w-16 h-16', color: 'text-[#F26513]', opacity: 'opacity-15' },
    { icon: ShieldCheck, style: { top: '42%', left: '20%', transform: 'rotate(-12deg)' }, size: 'w-8 h-8', color: 'text-emerald-600', opacity: 'opacity-15' },
    { icon: Radio, style: { top: '49%', right: '4%', transform: 'rotate(-8deg)' }, size: 'w-12 h-12', color: 'text-[#F26513]', opacity: 'opacity-25' },
    { icon: TrendingUp, style: { top: '54%', left: '28%', transform: 'rotate(-10deg)' }, size: 'w-10 h-10', color: 'text-emerald-600', opacity: 'opacity-15' },
    { icon: Package, style: { top: '62%', left: '12%', transform: 'rotate(16deg)' }, size: 'w-10 h-10', color: 'text-amber-600', opacity: 'opacity-20' },
    { icon: Globe2, style: { top: '67%', right: '14%', transform: 'rotate(-6deg)' }, size: 'w-14 h-14', color: 'text-emerald-600', opacity: 'opacity-20' },
    { icon: Video, style: { top: '74%', right: '26%', transform: 'rotate(20deg)' }, size: 'w-8 h-8', color: 'text-orange-500', opacity: 'opacity-15' },
    { icon: Sparkles, style: { top: '80%', left: '6%', transform: 'rotate(24deg)' }, size: 'w-9 h-9', color: 'text-amber-400', opacity: 'opacity-25' },
    { icon: Camera, style: { top: '86%', right: '8%', transform: 'rotate(-18deg)' }, size: 'w-14 h-14', color: 'text-orange-500', opacity: 'opacity-20' },
    { icon: Zap, style: { top: '91%', left: '18%', transform: 'rotate(14deg)' }, size: 'w-8 h-8', color: 'text-amber-500', opacity: 'opacity-20' },
    { icon: CartIcon, style: { top: '33%', left: '32%', transform: 'rotate(-15deg)' }, size: 'w-7 h-7', color: 'text-orange-400', opacity: 'opacity-15' },
    { icon: CreditCard, style: { top: '82%', right: '22%', transform: 'rotate(10deg)' }, size: 'w-9 h-9', color: 'text-slate-500', opacity: 'opacity-15' }
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gradient-to-b from-orange-50/50 via-amber-50/25 to-slate-50/70"
    >
      {/* 1. Trame texturée subtile de régie audiovisuelle */}
      <div className="absolute inset-0 bg-studio-dots opacity-60" />

      {/* 2. Grandes auras lumineuses statiques ultra-légères (zéro ralentissement CPU/GPU) */}
      <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#F26513]/15 via-amber-400/10 to-transparent blur-[80px]" />
      <div className="absolute top-[40%] -left-28 w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-amber-400/15 via-orange-300/10 to-transparent blur-[80px]" />
      <div className="absolute bottom-10 right-10 w-[480px] h-[480px] rounded-full bg-gradient-to-tl from-[#F26513]/12 via-amber-200/10 to-transparent blur-[90px]" />

      {/* 3. Objets fixes aléatoires et non alignés (aucun texte, formes pures) */}
      {scatteredObjects.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            style={item.style}
            className={`absolute ${item.opacity} ${item.color} transition-transform duration-300 hover:scale-110`}
          >
            <IconComponent className={`${item.size} drop-shadow-xs`} />
          </div>
        );
      })}
    </div>
  );
}

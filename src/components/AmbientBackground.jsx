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
  Users,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Megaphone,
  CreditCard,
  Share2,
  CheckCircle2,
  Zap,
  ShoppingBag as CartIcon
} from 'lucide-react';

/**
 * AmbientBackground - Environnement vivant d'ambiance avec flux infinis
 * d'objets liés au Live broadcasting, à la régie TV et au commerce panafricain.
 * Thème clair dominant avec auras douces et rubans d'objets en défilement infini.
 */
export default function AmbientBackground() {
  // Ruban 1 : Éléments Live, Diffusion & Régie
  const liveItems = [
    { label: 'DIRECT 4K', icon: Video, color: 'text-[#F26513]' },
    { label: 'REC', isRec: true, color: 'text-red-500' },
    { label: 'MICRO PLATEAU', icon: Mic, color: 'text-amber-600' },
    { label: 'RÉGIE LOMÉ', icon: Tv, color: 'text-slate-700' },
    { label: 'SIGNAL LIVE', icon: Radio, color: 'text-[#F26513]' },
    { label: 'OBJECTIF CAMÉRA', icon: Camera, color: 'text-slate-600' },
    { label: 'DUPLEX AFRICA', icon: Globe2, color: 'text-emerald-600' },
    { label: 'DIFFUSION HD', icon: Zap, color: 'text-amber-500' },
    { label: 'VOIX & ANIMATION', icon: Megaphone, color: 'text-[#F26513]' }
  ];

  // Ruban 2 : Éléments Commerce, Vente & Business
  const businessItems = [
    { label: 'BOUTIQUE LIVE', icon: ShoppingBag, color: 'text-[#F26513]' },
    { label: '5 000 FCFA / MOIS', isBadge: true, color: 'text-amber-700' },
    { label: 'EXPÉDITION COLIS', icon: Package, color: 'text-slate-700' },
    { label: 'PRIX EN DIRECT', icon: Tag, color: 'text-orange-600' },
    { label: 'VENTES EN HAUSSE', icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'COMMANDE 1-CLIC', icon: MessageCircle, color: 'text-emerald-700' },
    { label: 'VENDEUR CERTIFIÉ', icon: ShieldCheck, color: 'text-emerald-600' },
    { label: 'PANIER RAPIDE', icon: CartIcon, color: 'text-orange-500' },
    { label: 'PAIEMENT MOBILE', icon: CreditCard, color: 'text-slate-700' }
  ];

  // Ruban 3 : Connexion & Interactions
  const interactionItems = [
    { label: 'AUDIENCE ACTIVE', icon: Users, color: 'text-[#F26513]' },
    { label: 'PRODUIT VEDETTE', icon: Sparkles, color: 'text-amber-500' },
    { label: 'SESSION OUVERTE', icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'INTERACTION LIVE', icon: Share2, color: 'text-orange-600' },
    { label: 'BOOVAN GROUP', isBadge: true, color: 'text-slate-900' },
    { label: 'RÉPONSE WHATSAPP', icon: MessageCircle, color: 'text-emerald-600' },
    { label: 'MARCHÉ PANAFRICAIN', icon: Globe2, color: 'text-[#F26513]' },
    { label: 'PLATEAU TV CONNECTÉ', icon: Tv, color: 'text-amber-600' }
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gradient-to-b from-orange-50/40 via-amber-50/20 to-slate-50/60"
    >
      {/* 1. Trame texturée subtile de régie audiovisuelle */}
      <div className="absolute inset-0 bg-studio-dots opacity-70" />
      <div className="absolute inset-0 bg-studio-grid opacity-35" />

      {/* 2. Grandes auras lumineuses chaudes et organiques (thème clair) */}
      <div className="absolute -top-24 -right-24 w-[540px] h-[540px] rounded-full bg-gradient-to-br from-[#F26513]/20 via-amber-400/15 to-transparent blur-[120px] animate-float-1" />
      <div className="absolute top-[35%] -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-400/18 via-orange-300/12 to-transparent blur-[110px] animate-float-2" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-[#F26513]/18 via-amber-200/12 to-transparent blur-[130px] animate-float-3" />
      <div className="absolute top-[60%] left-1/3 w-[420px] h-[420px] rounded-full bg-gradient-to-r from-orange-200/15 via-rose-200/10 to-transparent blur-[100px] animate-float-4" />

      {/* 3. Ondes radio / signal satellite animées */}
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

      {/* 4. FLUX INFINIS D'OBJETS FLOTTANTS (LIVE & BUSINESS) */}
      <div className="absolute inset-0 flex flex-col justify-around py-12 opacity-[0.22] lg:opacity-[0.28]">
        
        {/* Ruban 1 : Défilement vers la gauche (Thème Régie & Live) */}
        <div className="overflow-hidden w-full rotate-[-1.5deg] scale-105">
          <div className="animate-stream-left-slow flex items-center gap-6">
            {liveItems.concat(liveItems).concat(liveItems).map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/70 border border-orange-200/60 shadow-xs backdrop-blur-[2px] shrink-0"
                >
                  {item.isRec ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      <span className="text-[10px] font-black tracking-wider text-red-600">REC LIVE</span>
                    </span>
                  ) : (
                    <>
                      {IconComponent && <IconComponent className={`w-3.5 h-3.5 ${item.color} shrink-0`} />}
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                        {item.label}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ruban 2 : Défilement inverse vers la droite (Thème E-Commerce & Vente) */}
        <div className="overflow-hidden w-full rotate-[1.2deg] scale-105 my-8">
          <div className="animate-stream-right-slow flex items-center gap-7">
            {businessItems.concat(businessItems).concat(businessItems).map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/70 border border-amber-200/60 shadow-xs backdrop-blur-[2px] shrink-0"
                >
                  {item.isBadge ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                      {item.label}
                    </span>
                  ) : (
                    <>
                      {IconComponent && <IconComponent className={`w-3.5 h-3.5 ${item.color} shrink-0`} />}
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                        {item.label}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ruban 3 : Défilement vers la gauche (Thème Audiences, Panafricain & Interactions) */}
        <div className="overflow-hidden w-full rotate-[-0.8deg] scale-105">
          <div className="animate-stream-left-fast flex items-center gap-6">
            {interactionItems.concat(interactionItems).concat(interactionItems).map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/70 border border-orange-200/60 shadow-xs backdrop-blur-[2px] shrink-0"
                >
                  {IconComponent && <IconComponent className={`w-3.5 h-3.5 ${item.color} shrink-0`} />}
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

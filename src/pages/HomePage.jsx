import React from 'react';
import { Link } from '../router';
import { 
  ArrowRight, 
  Radio, 
  ShoppingBag, 
  Tv, 
  MessageCircle, 
  ExternalLink,
  CheckCircle2,
  Calendar as CalendarIcon,
  Video,
  Sparkles,
  Zap,
  Globe2,
  Users
} from 'lucide-react';
import { OcdButton } from '../components/OcdLoader';

export default function HomePage({ packages = [], settings = {} }) {
  const whatsappNumber = (settings.contact_whatsapp || '+228 90 00 00 00').replace(/[^0-9]/g, '');

  // Directs panafricains représentatifs et actifs
  const activeLives = [
    {
      id: 1,
      country: 'Cameroun',
      business: 'Douala Mode & Pagnes',
      category: 'Mode & Habits',
      platform: 'TikTok Live',
      whatsapp: '237690000000',
      viewers: 142,
      image: '/brand/bovann-jeunesse.jpg',
      url: 'https://tiktok.com'
    },
    {
      id: 2,
      country: 'Bénin',
      business: 'Épices & Saveurs de Cotonou',
      category: 'Nourriture & Cuisine',
      platform: 'TikTok Live',
      whatsapp: '22997000000',
      viewers: 89,
      image: '/brand/ocd-plateau-afrique.jpg',
      url: 'https://tiktok.com'
    },
    {
      id: 3,
      country: 'Togo',
      business: 'Atelier Cuir & Chaussures Lomé',
      category: 'Artisanat & Déco',
      platform: 'Facebook Live',
      whatsapp: '22890000000',
      viewers: 210,
      image: '/brand/ocd-studio-bovann.jpg',
      url: 'https://facebook.com'
    }
  ];

  return (
    <div className="text-slate-900 overflow-x-hidden">
      
      {/* =====================================================================
          1. SECTION HERO LUMINEUSE, VIVANTE & CHALEUREUSE (THÈME CLAIR DOMINANT)
      ===================================================================== */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:py-20 lg:py-24 border-b border-orange-200/70 bg-gradient-to-b from-orange-100/50 via-amber-50/40 to-white/80">
        
        {/* Auras d'arrière-plan animées pour donner de la vie au fond */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-bl from-orange-300/30 via-[#F26513]/20 to-transparent rounded-full blur-3xl animate-float-1 pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-amber-300/25 via-orange-200/20 to-transparent rounded-full blur-3xl animate-float-2 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Colonne gauche : Accroche & Boîtier d'action */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge vivant : Indicateur de direct et égaliseur */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/95 border-2 border-orange-200/90 shadow-sm backdrop-blur-md">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F26513] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F26513]" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Studio Lomé • Régie en direct
                </span>
                <div className="hidden sm:flex items-end gap-1 h-3.5 pl-2 border-l border-orange-200" aria-hidden="true">
                  <span className="w-1 bg-[#F26513] rounded-full animate-eq-1" />
                  <span className="w-1 bg-amber-500 rounded-full animate-eq-2" />
                  <span className="w-1 bg-[#F26513] rounded-full animate-eq-3" />
                  <span className="w-1 bg-amber-600 rounded-full animate-eq-4" />
                </div>
              </div>

              {/* Titre percutant avec typographie forte */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-950">
                Vendez vos produits en direct <span className="text-[#F26513] underline decoration-orange-300 decoration-wavy decoration-2">à toute l'Afrique.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-xl">
                Accédez à nos plateaux de télévision connectés à Lomé ou diffusez vos ventes depuis votre boutique au Togo, Bénin, Cameroun, Côte d'Ivoire ou Gabon.
              </p>

              {/* BOÎTIER D'ACTION HAUTEMENT CONTRASTÉ & ERGONOMIQUE */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/95 border-2 border-orange-200 shadow-[0_8px_30px_rgb(242,101,19,0.08)] backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#F26513]" />
                    <span>Que souhaitez-vous faire aujourd'hui ?</span>
                  </span>
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    Accès immédiat
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Action 1 : Au Studio à Lomé */}
                  <Link
                    to="/reserver?mode=PRESENTIEL"
                    className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#F26513] to-[#d65109] text-white transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-100 bg-white/20 px-2 py-0.5 rounded">
                        Option 1 • Togo
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="mt-3.5">
                      <strong className="block text-lg font-black leading-tight">Venir au Studio à Lomé</strong>
                      <span className="text-xs text-orange-100 font-medium mt-1 block">
                        Plateau TV, animatrice, caméras 4K
                      </span>
                    </div>
                  </Link>

                  {/* Action 2 : Vendre depuis chez soi en Afrique */}
                  <Link
                    to="/lives-afrique"
                    className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-300 hover:border-[#F26513] text-slate-950 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        Option 2 • Panafricain
                      </span>
                      <Radio className="w-5 h-5 text-[#F26513] animate-pulse" />
                    </div>
                    <div className="mt-3.5">
                      <strong className="block text-lg font-black leading-tight">Diffuser mon propre direct</strong>
                      <span className="text-xs text-slate-600 font-medium mt-1 block">
                        Bénin, Cameroun, CI, Togo (5 000 F)
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Lien direct WhatsApp */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-600 font-medium">Vous hésitez sur la bonne formule ?</span>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Bonjour OCD LIVE, je souhaite des conseils pour lancer mon passage en direct.")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Discuter avec notre équipe sur WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Indicateurs de confiance du complexe */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center sm:text-left">
                <div className="p-3 rounded-xl bg-white/70 border border-orange-100">
                  <span className="block text-xl font-black text-slate-950">100%</span>
                  <span className="text-[11px] font-bold text-slate-600 uppercase">En direct & sans filtre</span>
                </div>
                <div className="p-3 rounded-xl bg-white/70 border border-orange-100">
                  <span className="block text-xl font-black text-[#F26513]">7j / 7</span>
                  <span className="text-[11px] font-bold text-slate-600 uppercase">Régie connectée</span>
                </div>
                <div className="p-3 rounded-xl bg-white/70 border border-orange-100">
                  <span className="block text-xl font-black text-slate-950">5 000 F</span>
                  <span className="text-[11px] font-bold text-slate-600 uppercase">Abonnement mensuel</span>
                </div>
              </div>

            </div>

            {/* Colonne droite : Visuel Studio vivant avec animations de cadre */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-900 group">
                <img
                  src="/brand/ocd-studio-bovann.jpg"
                  alt="Studio de diffusion OCD LIVE à Lomé avec Bovann"
                  className="w-full h-[440px] object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                {/* Halo d'ambiance sur l'image */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />

                {/* Badge en surimpression "En direct régie" */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/90 backdrop-blur-md border border-white/30 text-white shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Direct Régie Lomé
                  </span>
                </div>

                {/* Badge créneau de validation actif */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-orange-200 text-xs font-bold">
                  Créneaux : 08h-11h & 18h-21h
                </div>

                {/* Cartouche d'action en bas de photo */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white text-slate-950 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black text-[#F26513] block">
                      Plateau TV Boovan Group
                    </span>
                    <strong className="text-sm font-black text-slate-900 block">
                      Diffusion multi-caméras 4K
                    </strong>
                  </div>
                  <Link
                    to="/reserver"
                    className="px-4 py-2.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          2. SECTION DIRECTS EN COURS : COMMERCE VIVANT PANAFRICAIN
      ===================================================================== */}
      <section className="py-14 sm:py-20 relative bg-gradient-to-b from-transparent via-orange-50/30 to-transparent border-b border-orange-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black uppercase mb-2 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span>Flux vérifiés en direct</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Regarder les commerçants en direct
              </h2>
              <p className="text-sm sm:text-base text-slate-700 font-medium mt-1">
                Achetez directement auprès de vendeurs certifiés au Togo, Cameroun, Bénin, Côte d'Ivoire et Gabon.
              </p>
            </div>

            <Link
              to="/lives-afrique"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-[#F26513] text-white font-bold text-xs uppercase tracking-wider self-start sm:self-auto transition-all shadow-md hover:scale-105"
            >
              <Globe2 className="w-4 h-4" />
              <span>Voir tous les pays</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grille des directs actifs avec cartes vivantes à bordures lumineuses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeLives.map((live) => (
              <div
                key={live.id}
                className="group rounded-3xl bg-white/95 border-2 border-orange-100 hover:border-[#F26513] transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(242,101,19,0.08)] hover:shadow-[0_16px_36px_-6px_rgba(242,101,19,0.2)] hover:-translate-y-1.5"
              >
                <div>
                  <div className="relative h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={live.image}
                      alt={live.business}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Badge EN LIVE pulsant */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase flex items-center gap-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span>EN LIVE</span>
                    </div>

                    {/* Pays badge */}
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-black border border-white/20">
                      {live.country}
                    </span>

                    {/* Nombre de spectateurs en direct */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-orange-400" />
                      <span>{live.viewers} spectateurs</span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-2.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-black text-[#F26513] uppercase tracking-wide">
                      {live.category}
                    </span>
                    <h3 className="font-black text-xl text-slate-950 line-clamp-1">
                      {live.business}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Diffusé via : <strong className="text-slate-800">{live.platform}</strong> • Validé par l'équipe Boovan
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0 space-y-2.5">
                  <a
                    href={live.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full min-h-[48px] rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <span>Rejoindre le direct</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://wa.me/${live.whatsapp}?text=${encodeURIComponent(`Bonjour, je vous regarde sur OCD LIVE dans la catégorie ${live.category} et je souhaite commander.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full min-h-[46px] rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border-2 border-[#25D366]/40 text-emerald-900 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Commander sur WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bandeau d'action pour commerçants voulant vendre depuis chez eux */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-100/90 via-amber-50 to-orange-100/90 border-2 border-orange-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
            <div className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#F26513] block">
                Offre Commerçants Panafricains
              </span>
              <strong className="text-xl sm:text-2xl font-black text-slate-950 block">
                Vous faites des directs de vente chez vous ?
              </strong>
              <p className="text-sm text-slate-700 font-medium max-w-2xl">
                Abonnez votre commerce pour seulement <strong>5 000 FCFA / mois</strong> (166 FCFA par jour) et apparaissez devant des milliers d'acheteurs de votre pays sur nos créneaux de 08h-11h et 18h-21h.
              </p>
            </div>

            <Link
              to="/lives-afrique"
              className="px-7 py-4 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-black text-xs uppercase tracking-wider shrink-0 text-center transition-all shadow-md hover:scale-105"
            >
              Envoyer le lien de mon live
            </Link>
          </div>

        </div>
      </section>

      {/* =====================================================================
          3. SECTION CHOIX DU PASSAGE : DEUX MODALITÉS SIMPLES
      ===================================================================== */}
      <section className="py-14 sm:py-20 relative bg-gradient-to-b from-transparent via-amber-50/20 to-transparent border-b border-orange-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#F26513]">
              Deux façons de passer sur OCD LIVE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Choisissez votre formule de vente
            </h2>
            <p className="text-base text-slate-700 font-medium">
              Que vous soyez physiquement à Lomé ou n'importe où en Afrique, tout est prêt pour votre passage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Carte A : Studio Lomé */}
            <div className="rounded-3xl bg-white/95 border-2 border-orange-200 p-7 sm:p-9 space-y-6 flex flex-col justify-between shadow-[0_8px_30px_rgb(242,101,19,0.06)] hover:shadow-xl transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1.5 rounded-full bg-orange-100 text-[#F26513] text-xs font-black uppercase border border-orange-200">
                    Au Studio • Lomé, Togo
                  </span>
                  <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                    Dès 15 000 FCFA
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                  Je viens au studio à Lomé avec mes produits
                </h3>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Venez présenter vos articles sur un véritable plateau de télévision. Vous êtes accueilli par notre animatrice avec caméras 4K, éclairage de cinéma et affichage en temps réel de votre numéro WhatsApp pour recevoir les commandes.
                </p>

                <ul className="space-y-3 text-sm text-slate-800 pt-2 font-medium">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#F26513] shrink-0" />
                    <span>Animatrice dédiée sur le plateau pour interviewer et vendre vos articles</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#F26513] shrink-0" />
                    <span>Régie multi-caméras 4K et éclairage professionnel de studio</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#F26513] shrink-0" />
                    <span>Bandeau avec votre numéro WhatsApp de commande affiché à l'écran</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  to="/reserver?mode=PRESENTIEL"
                  className="w-full min-h-[52px] rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01]"
                >
                  <span>Réserver mon passage en studio</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Carte B : À distance */}
            <div className="rounded-3xl bg-white/95 border-2 border-emerald-200 p-7 sm:p-9 space-y-6 flex flex-col justify-between shadow-[0_8px_30px_rgb(16,185,129,0.06)] hover:shadow-xl transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase border border-emerald-300">
                    À distance • Panafricain
                  </span>
                  <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                    Cameroun, Bénin, CI, Gabon...
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                  J'anime mon direct depuis mon pays ou chez moi
                </h3>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Vous restez dans votre boutique ou à votre domicile. Notre régie centrale au Togo récupère votre flux vidéo, l'habille professionnellement et le diffuse devant notre audience de milliers d'acheteurs.
                </p>

                <ul className="space-y-3 text-sm text-slate-800 pt-2 font-medium">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Diffusion directe depuis votre téléphone portable ou tablette</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Possibilité d'assistance par une animatrice en duplex depuis Lomé</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Enregistrement vidéo HD fourni après votre session pour vos réseaux</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  to="/reserver?mode=DISTANCE"
                  className="w-full min-h-[52px] rounded-xl bg-slate-950 hover:bg-[#F26513] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01]"
                >
                  <span>Réserver mon créneau à distance</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          4. FORFAITS LES PLUS POPULAIRES (ACCÈS DIRECT AU PANIER)
      ===================================================================== */}
      <section className="py-14 sm:py-20 relative bg-gradient-to-b from-transparent via-orange-50/25 to-transparent border-b border-orange-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#F26513]">
                Tarifs clairs et fixes
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Nos forfaits de diffusion
              </h2>
            </div>

            <Link
              to="/forfaits"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#F26513] hover:underline"
            >
              <span>Comparer les 6 forfaits complets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(packages.slice(0, 3)).map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-3xl bg-white/95 border-2 border-orange-100 hover:border-[#F26513] p-7 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Durée : {pkg.duration_label}
                    </span>
                    {pkg.badge && (
                      <span className="px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-[#F26513] text-[10px] font-black uppercase">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-2xl text-slate-950">{pkg.name}</h3>
                  <div className="text-3xl font-black text-[#F26513]">{pkg.price_label}</div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{pkg.subtitle}</p>

                  <ul className="space-y-2 pt-2">
                    {(pkg.features || []).slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/reserver?packageId=${pkg.id}`}
                  className="w-full min-h-[48px] rounded-xl bg-slate-950 hover:bg-[#F26513] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Choisir ce forfait</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================================
          5. PARCOURS SIMPLE EN 3 ÉTAPES (ZÉRO TEXTE SUPERFLU)
      ===================================================================== */}
      <section className="py-14 sm:py-20 relative bg-gradient-to-b from-transparent via-amber-50/20 to-transparent border-b border-orange-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#F26513]">
              Simple & Rapide
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Comment ça se passe concrètement ?
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium">
              Trois étapes directes sans aucune difficulté technique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-7 rounded-3xl bg-white/95 border-2 border-orange-100 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
              <span className="font-black text-3xl text-[#F26513] block">01</span>
              <strong className="block text-lg font-black text-slate-950">
                Vous choisissez votre date et votre formule
              </strong>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                En présentiel au studio à Lomé ou à distance depuis votre boutique. Vous sélectionnez l'horaire qui convient à vos clients.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white/95 border-2 border-orange-100 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
              <span className="font-black text-3xl text-[#F26513] block">02</span>
              <strong className="block text-lg font-black text-slate-950">
                Nous préparons le direct avec vous
              </strong>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Vous transmettez vos photos et votre numéro WhatsApp commercial. L'animatrice prépare la mise en valeur de vos articles.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white/95 border-2 border-orange-100 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
              <span className="font-black text-3xl text-[#F26513] block">03</span>
              <strong className="block text-lg font-black text-slate-950">
                Vous passez en direct et vendez
              </strong>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Les spectateurs regardent votre démonstration et vous contactent directement sur WhatsApp pour payer et recevoir leurs colis.
              </p>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link
              to="/reserver"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              <span>Réserver mon direct maintenant</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* =====================================================================
          6. BOUTIQUE OFFICIELLE OCD SHOP
      ===================================================================== */}
      <section className="py-14 sm:py-20 relative bg-gradient-to-b from-transparent via-orange-50/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#F26513]">
                Boutique officielle
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Articles présentés sur OCD LIVE
              </h2>
              <p className="text-sm sm:text-base text-slate-700 font-medium mt-1">
                Commandez des produits de qualité certifiés directement auprès de leurs créateurs.
              </p>
            </div>

            <Link
              to="/boutique"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-slate-300 hover:border-[#F26513] text-slate-900 font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-[#F26513]" />
              <span>Ouvrir la boutique</span>
            </Link>
          </div>

          {/* Bannière marchande chaleureuse & lumineuse */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-600 via-[#F26513] to-orange-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative space-y-2 z-10">
              <span className="text-xs font-black uppercase tracking-wider text-amber-200">
                Marketplace Panafricaine Certifiée
              </span>
              <h3 className="text-3xl sm:text-4xl font-black leading-tight">
                Tous les produits vendus en live en un seul endroit.
              </h3>
              <p className="text-sm sm:text-base text-orange-100 font-medium max-w-xl">
                Alimentation, mode, épices, beauté et artisanat : chaque article dispose du contact direct WhatsApp du vendeur pour une livraison rapide.
              </p>
            </div>

            <Link
              to="/boutique"
              className="relative z-10 px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 text-center transition-all shadow-lg hover:scale-105"
            >
              Parcourir le catalogue
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

import React, { useState } from 'react';
import { Link } from '../router';
import { 
  ArrowRight, 
  Radio, 
  ShoppingBag, 
  Tv, 
  MessageCircle, 
  PhoneCall, 
  ExternalLink,
  CheckCircle2,
  Calendar as CalendarIcon,
  Video,
  ChevronRight
} from 'lucide-react';
import { OcdButton } from '../components/OcdLoader';

export default function HomePage({ packages = [], settings = {} }) {
  const whatsappNumber = (settings.contact_whatsapp || '+228 90 00 00 00').replace(/[^0-9]/g, '');

  // Exemple représentatif des directs panafricains actifs
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
    <div className="bg-slate-50 text-slate-900">
      
      {/* =====================================================================
          1. SECTION HERO VIVANTE, CHALEUREUSE & TOURNÉE VERS L'ACTION
      ===================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-14 sm:py-20 lg:py-24">
        {/* Lueur chaude de marque */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F26513]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Colonne gauche : Accroche directe & Sélecteur d'action immédiate */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F26513] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-orange-200">
                  Studio Lomé • En direct aujourd'hui
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Vendez vos produits en direct à toute l'Afrique.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Accédez à nos plateaux de télévision connectés à Lomé ou diffusez votre live depuis votre boutique au Bénin, Cameroun, Côte d'Ivoire ou Togo.
              </p>

              {/* BOÎTIER D'ACTION PRINCIPAL — Ergonomie maximale pour tous les âges */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-3.5 shadow-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-300 block">
                  Que souhaitez-vous faire ?
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Action 1 : Réserver au Studio */}
                  <Link
                    to="/reserver?mode=PRESENTIEL"
                    className="group flex flex-col justify-between p-4 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white transition-all duration-150 active:scale-[0.98] shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-100">
                        Option 1 • Togo
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="mt-3">
                      <strong className="block text-base font-extrabold">Venir au Studio à Lomé</strong>
                      <span className="text-xs text-orange-100 font-medium">Plateau TV, animatrice, caméras 4K</span>
                    </div>
                  </Link>

                  {/* Action 2 : Lancer son direct depuis son pays */}
                  <Link
                    to="/lives-afrique"
                    className="group flex flex-col justify-between p-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 transition-all duration-150 active:scale-[0.98] shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        Option 2 • Panafricain
                      </span>
                      <Radio className="w-4 h-4 text-[#F26513] animate-pulse" />
                    </div>
                    <div className="mt-3">
                      <strong className="block text-base font-extrabold">Diffuser mon propre direct</strong>
                      <span className="text-xs text-slate-600 font-medium">Bénin, Cameroun, CI, Togo (5 000 F)</span>
                    </div>
                  </Link>
                </div>

                {/* Lien WhatsApp direct */}
                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                  <span className="text-slate-300">Besoin d'aide pour choisir ?</span>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Bonjour%20OCD%20LIVE,%20je%20souhaite%20des%20renseignements%20sur%20les%20directs.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Écrire sur WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Colonne droite : Visuel authentique & indicateurs vivants */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900">
                <img
                  src="/brand/ocd-studio-bovann.jpg"
                  alt="Studio de diffusion OCD LIVE à Lomé avec Bovann"
                  className="w-full h-[420px] object-cover object-top"
                />

                {/* Badge "En direct" en surimpression vivante */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Direct Régie
                  </span>
                </div>

                {/* Badge animateur & promoteur */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-400 block">
                      Production Boovan Group
                    </span>
                    <strong className="text-sm font-bold text-white">
                      Plateau professionnel connecté
                    </strong>
                  </div>
                  <Link
                    to="/reserver"
                    className="px-3.5 py-2 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider"
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
      <section className="py-14 sm:py-18 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>En direct en ce moment</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Regarder les commerçants en direct
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Achetez directement auprès de vendeurs vérifiés au Togo, Cameroun, Bénin et Côte d'Ivoire.
              </p>
            </div>

            <Link
              to="/lives-afrique"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider self-start sm:self-auto transition-colors"
            >
              <span>Voir tous les pays</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grille des directs actifs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeLives.map((live) => (
              <div
                key={live.id}
                className="rounded-2xl bg-white border-2 border-slate-200 hover:border-[#F26513] transition-all overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={live.image}
                      alt={live.business}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black uppercase flex items-center gap-1.5 shadow">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span>EN LIVE</span>
                    </div>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/75 text-white text-xs font-bold">
                      {live.country}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-xs font-bold text-[#F26513] uppercase">
                      {live.category}
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-950 line-clamp-1">
                      {live.business}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Plateforme : {live.platform} • {live.viewers} spectateurs
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <a
                    href={live.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full min-h-[46px] rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Rejoindre le direct</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://wa.me/${live.whatsapp}?text=Bonjour,%20je%20vous%20regarde%20sur%20OCD%20LIVE%20et%20je%20veux%20commander.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full min-h-[44px] rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Commander sur WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bandeau d'action pour commerçants voulant vendre depuis chez eux */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <strong className="text-lg sm:text-xl font-extrabold text-slate-950 block">
                Vous faites des directs de vente chez vous ?
              </strong>
              <p className="text-xs sm:text-sm text-slate-700 max-w-2xl">
                Abonnez votre commerce pour seulement <strong>5 000 FCFA / mois</strong> (166 FCFA par jour) et apparaissez devant des milliers d'acheteurs de votre pays.
              </p>
            </div>

            <Link
              to="/lives-afrique"
              className="px-6 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider shrink-0 text-center transition-colors shadow-sm"
            >
              Envoyer le lien de mon live
            </Link>
          </div>

        </div>
      </section>

      {/* =====================================================================
          3. SECTION CHOIX DU PASSAGE : DEUX MODALITÉS SIMPLES
      ===================================================================== */}
      <section className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
              Deux façons de passer sur OCD LIVE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Choisissez votre formule de vente
            </h2>
            <p className="text-sm text-slate-600">
              Que vous soyez physiquement à Lomé ou n'importe où en Afrique, tout est prêt pour votre passage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Carte A : Studio Lomé */}
            <div className="rounded-2xl bg-white border-2 border-slate-200 p-7 sm:p-9 space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-[#F26513] text-xs font-black uppercase">
                    Au Studio • Lomé
                  </span>
                  <span className="text-xs font-bold text-slate-500">Dès 15 000 FCFA</span>
                </div>

                <h3 className="text-2xl font-black text-slate-950">
                  Je viens au studio à Lomé avec mes produits
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Venez présenter vos articles sur un vrai plateau de télévision. Vous êtes accueilli par notre animatrice avec caméras 4K, lumière de cinéma et affichage en temps réel de votre numéro WhatsApp pour recevoir les commandes.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0" />
                    <span>Animatrice dédiée sur le plateau pour présenter vos articles</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0" />
                    <span>Régie multi-caméras et éclairage professionnel</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0" />
                    <span>Bandeau avec votre numéro WhatsApp de commande affiché à l'écran</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  to="/reserver?mode=PRESENTIEL"
                  className="w-full min-h-[50px] rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Réserver mon passage en studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Carte B : À distance */}
            <div className="rounded-2xl bg-white border-2 border-slate-200 p-7 sm:p-9 space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase">
                    À distance • Panafricain
                  </span>
                  <span className="text-xs font-bold text-slate-500">Cameroun, Bénin, CI, Gabon...</span>
                </div>

                <h3 className="text-2xl font-black text-slate-950">
                  J'anime mon direct depuis mon pays ou chez moi
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Vous restez dans votre boutique ou chez vous. Notre régie au Togo récupère votre signal vidéo, l'habille professionnellement et le diffuse devant notre audience panafricaine.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Diffusion depuis votre téléphone ou ordinateur portable</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Option d'assistance animatrice depuis le studio au Togo</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Enregistrement vidéo HD fourni après votre session</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  to="/reserver?mode=DISTANCE"
                  className="w-full min-h-[50px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Réserver mon créneau à distance</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          4. FORFAITS LES PLUS POPULAIRES (ACCÈS DIRECT AU PANIER)
      ===================================================================== */}
      <section className="py-14 sm:py-18 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                Tarifs clairs en FCFA
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Nos forfaits de diffusion
              </h2>
            </div>

            <Link
              to="/forfaits"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F26513] hover:underline"
            >
              <span>Comparer les 6 forfaits complets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(packages.slice(0, 3)).map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl bg-white border-2 border-slate-200 p-6 flex flex-col justify-between space-y-5 shadow-xs hover:border-[#F26513] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      Durée : {pkg.duration_label}
                    </span>
                    {pkg.badge && (
                      <span className="px-2.5 py-0.5 rounded bg-orange-100 text-[#F26513] text-[10px] font-black uppercase">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-xl text-slate-950">{pkg.name}</h3>
                  <div className="text-2xl font-black text-[#F26513]">{pkg.price_label}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{pkg.subtitle}</p>

                  <ul className="space-y-1.5 pt-2">
                    {(pkg.features || []).slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F26513] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/reserver?packageId=${pkg.id}`}
                  className="w-full min-h-[46px] rounded-xl bg-slate-900 hover:bg-[#F26513] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
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
      <section className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Comment ça se passe concrètement ?
            </h2>
            <p className="text-sm text-slate-600">
              Trois étapes directes sans complexité technique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <span className="font-black text-2xl text-[#F26513]">01</span>
              <strong className="block text-base font-bold text-slate-950">
                Vous choisissez votre date et votre formule
              </strong>
              <p className="text-xs text-slate-600 leading-relaxed">
                En présentiel au studio à Lomé ou à distance depuis votre boutique. Vous sélectionnez l'horaire qui convient à vos clients.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <span className="font-black text-2xl text-[#F26513]">02</span>
              <strong className="block text-base font-bold text-slate-950">
                Nous préparons le direct avec vous
              </strong>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vous transmettez vos photos et votre numéro WhatsApp commercial. L'animatrice prépare la mise en valeur de vos articles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <span className="font-black text-2xl text-[#F26513]">03</span>
              <strong className="block text-base font-bold text-slate-950">
                Vous passez en direct et vendez
              </strong>
              <p className="text-xs text-slate-600 leading-relaxed">
                Les spectateurs regardent votre démonstration et vous contactent directement sur WhatsApp pour payer et recevoir leurs colis.
              </p>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link
              to="/reserver"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-extrabold text-sm uppercase tracking-wider transition-colors shadow-md"
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
      <section className="py-14 sm:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                Boutique officielle
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Articles présentés sur OCD LIVE
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Commandez les produits de qualité certifiés directement auprès de leurs créateurs.
              </p>
            </div>

            <Link
              to="/boutique"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-slate-600" />
              <span>Ouvrir la boutique</span>
            </Link>
          </div>

          <div className="p-7 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Marketplace Panafricaine
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Tous les produits vendus en live en un seul endroit.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Alimentation, mode, épices, beauté et artisanat : chaque article dispose du contact direct WhatsApp du vendeur pour une livraison rapide.
              </p>
            </div>

            <Link
              to="/boutique"
              className="px-7 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider shrink-0 text-center transition-colors shadow-sm"
            >
              Parcourir le catalogue
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

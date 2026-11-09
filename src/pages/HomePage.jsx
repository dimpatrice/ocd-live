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
          1. SECTION HERO — DESIGN ÉDITORIAL & BROADCASTER (SANS CLICHÉ IA)
      ===================================================================== */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:py-20 lg:py-24 border-b border-slate-200/80 bg-white/60">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Colonne gauche : Accroche & Boîtier d'action */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Tag éditorial architectural (remplace la pilule bonbon IA) */}
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
                <span className="h-px w-6 bg-[#F26513] inline-block" />
                <span>COMPLEXE AUDIOVISUEL BOOVAN GROUP • LOMÉ, TOGO</span>
              </div>

              {/* Titre percutant, net, sans vaguelette artificielle */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-950">
                Vendez vos produits en direct <span className="text-[#F26513]">à toute l'Afrique.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-xl">
                Accédez à nos plateaux de télévision connectés à Lomé ou diffusez vos ventes depuis votre boutique au Togo, Bénin, Cameroun, Côte d'Ivoire ou Gabon.
              </p>

              {/* Console d'action principale : Formats carrés nets et lisibles */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                    Sélectionnez votre modalité
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Lomé GMT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Option 1 : Studio Lomé */}
                  <Link
                    to="/reserver?mode=PRESENTIEL"
                    className="group flex flex-col justify-between p-5 rounded-xl bg-slate-950 hover:bg-[#F26513] text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white/80">
                        TOGO • PRÉSENTIEL
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="mt-4">
                      <strong className="block text-lg font-black leading-tight">Au Studio à Lomé</strong>
                      <span className="text-xs text-slate-300 group-hover:text-white/90 font-medium mt-1 block">
                        Plateau TV, animatrice, caméras 4K
                      </span>
                    </div>
                  </Link>

                  {/* Option 2 : À distance Panafricain */}
                  <Link
                    to="/lives-afrique"
                    className="group flex flex-col justify-between p-5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#F26513] text-slate-950 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        AFRIQUE • À DISTANCE
                      </span>
                      <Radio className="w-4 h-4 text-[#F26513]" />
                    </div>
                    <div className="mt-4">
                      <strong className="block text-lg font-black leading-tight">Diffuser mon direct</strong>
                      <span className="text-xs text-slate-600 font-medium mt-1 block">
                        Bénin, Cameroun, CI, Togo (5 000 F)
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Assistance WhatsApp discrète et efficace */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-slate-600">Besoin d'un conseil technique avant de réserver ?</span>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Bonjour OCD LIVE, je souhaite des conseils pour mon passage en direct.")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>WhatsApp Régie</span>
                  </a>
                </div>
              </div>

              {/* Chiffres clés régie */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="block text-xl font-black text-slate-950">100%</span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">DIRECT RÉEL</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="block text-xl font-black text-[#F26513]">7j / 7</span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">RÉGIE CONNECTÉE</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="block text-xl font-black text-slate-950">5 000 F</span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">ABONNEMENT / MOIS</span>
                </div>
              </div>

            </div>

            {/* Colonne droite : Cadre Studio broadcast */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-950">
                <img
                  src="/brand/ocd-studio-bovann.jpg"
                  alt="Studio de diffusion OCD LIVE à Lomé avec Bovann"
                  className="w-full h-[440px] object-cover object-top"
                />

                {/* Cartouche supérieur : Témoin Broadcast On-Air */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded bg-slate-950/90 text-white font-mono text-xs font-bold border border-white/20">
                  <span className="w-2 h-2 rounded-xs bg-red-600" />
                  <span>ON AIR • LOMÉ STUDIO 01</span>
                </div>

                {/* Cartouche inférieur régie */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-orange-400 block">
                      BOOVAN GROUP
                    </span>
                    <strong className="text-sm font-bold block">
                      Plateau TV 4K multi-caméras
                    </strong>
                  </div>
                  <Link
                    to="/reserver"
                    className="px-4 py-2 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider"
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
          2. SECTION DIRECTS EN COURS : GRILLE SANS CLICHÉS
      ===================================================================== */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
                <span className="h-px w-5 bg-[#F26513] inline-block" />
                <span>FLUX VÉRIFIÉS EN TEMPS RÉEL</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Commerçants en direct
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Achetez directement auprès de vendeurs certifiés au Togo, Cameroun, Bénin, Côte d'Ivoire et Gabon.
              </p>
            </div>

            <Link
              to="/lives-afrique"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              <span>Accéder au répertoire</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cartes épurées, typographie broadcast */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeLives.map((live) => (
              <div
                key={live.id}
                className="rounded-2xl border border-slate-200 hover:border-[#F26513] bg-white transition-colors overflow-hidden flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="relative h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={live.image}
                      alt={live.business}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Témoin DIRECT sobre */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>DIRECT</span>
                    </div>

                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 text-white font-mono text-xs font-bold border border-white/20">
                      {live.country}
                    </span>

                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-slate-950/80 text-white font-mono text-[11px] font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-orange-400" />
                      <span>{live.viewers} spectateurs</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-xs text-slate-800 font-semibold">
                      {live.category}
                    </span>
                    <h3 className="font-extrabold text-xl text-slate-950 line-clamp-1">
                      {live.business}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Canal : <strong className="text-slate-800 uppercase">{live.platform}</strong> • Validé par Boovan
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-2">
                  <a
                    href={live.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full min-h-[46px] rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Rejoindre le direct</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>

                  <a
                    href={`https://wa.me/${live.whatsapp}?text=${encodeURIComponent(`Bonjour, je vous regarde sur OCD LIVE dans la catégorie ${live.category} et je souhaite commander.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Commander sur WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bandeau commerçant sobre */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F26513] block">
                OFFRE PANAFRICAINE • 5 000 FCFA / MOIS
              </span>
              <strong className="text-xl sm:text-2xl font-black text-slate-950 block">
                Vous faites des directs de vente chez vous ?
              </strong>
              <p className="text-sm text-slate-600 font-medium max-w-2xl">
                Abonnez votre boutique pour 166 FCFA par jour et apparaissez devant les acheteurs de votre pays sur nos créneaux de 08h-11h et 18h-21h.
              </p>
            </div>

            <Link
              to="/lives-afrique"
              className="px-6 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider shrink-0 text-center transition-colors"
            >
              Envoyer mon lien
            </Link>
          </div>

        </div>
      </section>

      {/* =====================================================================
          3. SECTION DEUX FORMULES : DESIGN SOBER
      ===================================================================== */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
              <span className="h-px w-5 bg-[#F26513] inline-block" />
              <span>MODALITÉS DE DIFFUSION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Deux formats d'antenne adaptés à votre commerce
            </h2>
            <p className="text-base text-slate-700 font-medium">
              Que vous veniez au studio à Lomé ou que vous animiez depuis votre pays, nos moyens techniques sont mobilisés pour vous.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Carte A : Studio Lomé */}
            <div className="rounded-2xl bg-white border border-slate-200 p-8 space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="px-2.5 py-1 rounded bg-slate-900 text-white font-mono text-xs font-bold uppercase tracking-wider">
                    AU STUDIO • LOMÉ
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    DÈS 15 000 FCFA
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-950">
                  Passage sur plateau TV à Lomé
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Venez présenter vos articles sur un plateau de télévision équipé. Vous êtes accompagné par une animatrice professionnelle avec caméras 4K, lumière cinéma et affichage de votre contact WhatsApp à l'écran.
                </p>

                <ul className="space-y-3 text-sm text-slate-800 pt-2 font-medium">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0" />
                    <span>Animatrice sur plateau pour valoriser vos articles</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0" />
                    <span>Régie multi-caméras 4K et éclairage professionnel</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0" />
                    <span>Bandeau de commande WhatsApp incrusté en temps réel</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  to="/reserver?mode=PRESENTIEL"
                  className="w-full min-h-[50px] rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Réserver en studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Carte B : À distance */}
            <div className="rounded-2xl bg-white border border-slate-200 p-8 space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-900 font-mono text-xs font-bold uppercase tracking-wider">
                    À DISTANCE • PANAFRICAIN
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    BENIN, CAMEROUN, CI, GABON...
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-950">
                  Duplex depuis votre boutique ou domicile
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Vous animez depuis votre téléphone dans votre ville. La régie centrale OCD LIVE à Lomé récupère votre flux, l'habille aux normes télévisuelles et le relaie auprès de notre audience panafricaine.
                </p>

                <ul className="space-y-3 text-sm text-slate-800 pt-2 font-medium">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>Diffusion directe depuis votre téléphone portable</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>Possibilité d'assistance animatrice en duplex de Lomé</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>Enregistrement vidéo haute définition fourni après diffusion</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  to="/reserver?mode=DISTANCE"
                  className="w-full min-h-[50px] rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Réserver à distance</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          4. BOUTIQUE OFFICIELLE — VITRINE ÉPURÉE
      ===================================================================== */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
                <span className="h-px w-5 bg-[#F26513] inline-block" />
                <span>CATALOGUE COMMERCIAL</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Articles présentés sur OCD LIVE
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Commandez directement auprès de vendeurs certifiés avec livraison locale ou expédition.
              </p>
            </div>

            <Link
              to="/boutique"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-slate-700" />
              <span>Ouvrir la boutique</span>
            </Link>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-orange-400">
                MARKETPLACE PANAFRICAINE CERTIFIÉE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Tous les produits vendus en direct en un seul endroit.
              </h3>
              <p className="text-sm text-slate-300 max-w-xl font-medium">
                Alimentation, mode, épices, beauté et artisanat : chaque article dispose du contact direct WhatsApp du vendeur pour un échange rapide.
              </p>
            </div>

            <Link
              to="/boutique"
              className="px-7 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider shrink-0 text-center transition-colors shadow-xs"
            >
              Parcourir le catalogue
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

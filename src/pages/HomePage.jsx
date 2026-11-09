import React from 'react';
import { Link } from '../router';
import { ArrowRight, Check, Radio, ShoppingBag, Sparkles, Clock, Globe2 } from 'lucide-react';
import { SECTORS_SHOWCASE } from '../data/media';

export default function HomePage({ packages = [] }) {
  return (
    <div className="bg-white text-zinc-900">
      {/* =====================================================================
          1. SECTION HERO — CLAIRE, SOBRE, CENTRÉE SUR LE PLATEAU OFFICIEL
      ===================================================================== */}
      <section className="py-16 lg:py-24 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Texte et actions principales */}
            <div className="lg:col-span-6 space-y-6">

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-zinc-950 leading-[1.08]">
                VOTRE BUSINESS{' '}
                <span className="text-[#F26513] block mt-1">
                  MÉRITE D'ÊTRE VU.
                </span>
              </h1>

              <p className="text-lg text-zinc-600 leading-relaxed max-w-xl">
                Présentez vos produits. Faites connaître votre entreprise. Touchez de nouveaux clients. Avec OCD LIVE, votre activité entre en scène.
              </p>

              {/* Deux boutons principaux */}
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <Link
                  to="/reserver?mode=PRESENTIEL"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Réserver un live en présentiel</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/reserver?mode=DISTANCE"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-display font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Réserver un live à distance</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-sm font-medium text-zinc-500 pt-2">
                Du Togo à toute l'Afrique, et partout dans le monde.
              </p>
            </div>

            {/* Photographie réelle du plateau OCD LIVE avec Bovann */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-xl bg-zinc-100">
                <img
                  src="/brand/ocd-studio-bovann.jpg"
                  alt="Plateau officiel OCD LIVE au Togo avec Bovann"
                  className="w-full h-[460px] sm:h-[520px] object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          NOUVEAU : DIRECTS PANAFRICAINS DEPUIS CHEZ SOI & OCD SHOP
      ===================================================================== */}
      <section className="py-12 bg-zinc-950 text-white border-b border-zinc-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Carte A : DIRECTS AFRIQUE (5 000 FCFA/MOIS) */}
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-6 hover:border-[#F26513]/50 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Nouveau • Lives depuis chez soi</span>
                  </span>
                  <span className="text-xs font-mono text-[#F26513] font-bold">
                    5 000 FCFA / mois
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  Vendez en direct depuis votre maison ou boutique.
                </h3>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  Au <strong>Bénin</strong>, <strong>Cameroun</strong>, <strong>Côte d'Ivoire</strong> ou au <strong>Togo</strong> : lancez votre live TikTok ou Facebook. Transmettez votre lien sur OCD LIVE. Nos équipes vérifient votre flux de vente et le diffusent à toute l'Afrique.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                    <Clock className="w-4 h-4 text-[#F26513]" />
                    <span>08h-11h & 18h-21h GMT</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                    <Globe2 className="w-4 h-4 text-emerald-400" />
                    <span>Filtres par pays & rayons</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/lives-afrique"
                  className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 text-center"
                >
                  <Radio className="w-4 h-4" />
                  <span>Voir les direct en cours</span>
                </Link>
                <Link
                  to="/lives-afrique"
                  className="py-3.5 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 text-center"
                >
                  <span>Diffuser mon live</span>
                </Link>
              </div>
            </div>

            {/* Carte B : OCD SHOP (COMMANDES WHATSAPP 1-CLIC) */}
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-6 hover:border-[#F26513]/50 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F26513]/20 text-[#F26513] text-xs font-bold uppercase tracking-wider">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>OCD Shop • Marketplace</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Direct Producteurs
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  Les pépites des entrepreneurs africains à portée de clic.
                </h3>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  Piments et épices du Bénin, mode & chemises wax du Cameroun, cosmétiques bio de Côte d'Ivoire... Commandez en direct aux vendeurs sans intermédiaire par WhatsApp.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span>Articles certifiés OCD</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>1 Clic WhatsApp direct</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/boutique"
                  className="w-full py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 text-center"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Accéder à la boutique OCD Shop</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. DEUX EXPÉRIENCES, UNE SEULE AMBITION
      ===================================================================== */}
      <section className="py-20 lg:py-24 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
              Modes de participation
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-950">
              Deux expériences, une seule ambition
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* A. LIVE EN PRÉSENTIEL */}
            <div className="rounded-2xl bg-white border border-zinc-200 overflow-hidden flex flex-col justify-between shadow-sm">
              <div>
                <div className="h-72 overflow-hidden bg-zinc-100">
                  <img
                    src="/brand/ocd-plateau-afrique.jpg"
                    alt="Plateau OCD LIVE au Togo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                      Option A • Studio au Togo
                    </span>
                    <h3 className="font-display text-2xl font-extrabold text-zinc-950 mt-1">
                      LIVE EN PRÉSENTIEL
                    </h3>
                    <p className="mt-3 text-zinc-600 text-sm leading-relaxed">
                      Venez dans notre studio au Togo et présentez directement vos produits devant notre dispositif de production audiovisuelle.
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-sm text-zinc-700">
                    {[
                      'Studio situé au Togo',
                      'Installation professionnelle',
                      'Régie et accompagnement',
                      'Présentation en direct',
                      'Durée selon le forfait choisi'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#F26513] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-8 pb-8">
                <Link
                  to="/reserver?mode=PRESENTIEL"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Réserver en présentiel</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* B. LIVE À DISTANCE */}
            <div className="rounded-2xl bg-white border border-zinc-200 overflow-hidden flex flex-col justify-between shadow-sm">
              <div>
                <div className="h-72 overflow-hidden bg-zinc-100">
                  <img
                    src="/brand/bovann-jeunesse.jpg"
                    alt="Participation à distance en Afrique et à l'international"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-8 space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                      Option B • Afrique & International
                    </span>
                    <h3 className="font-display text-2xl font-extrabold text-zinc-950 mt-1">
                      LIVE À DISTANCE
                    </h3>
                    <p className="mt-3 text-zinc-600 text-sm leading-relaxed">
                      Vous êtes au Cameroun, au Gabon, en Côte d'Ivoire, au Sénégal ou ailleurs ? Participez à votre live depuis votre pays ou votre entreprise.
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-sm text-zinc-700">
                    {[
                      'Participation depuis n\'importe quel pays',
                      'Accompagnement à distance',
                      'Possibilité d\'assistance depuis le studio au Togo',
                      'Présentation de vos produits en direct',
                      'Mise en avant de vos coordonnées commerciales'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#F26513] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-8 pb-8">
                <Link
                  to="/reserver?mode=DISTANCE"
                  className="w-full py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
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
          3. POURQUOI OCD LIVE ?
      ===================================================================== */}
      <section className="py-20 lg:py-24 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-zinc-200">
                <img
                  src="/brand/bovann-conference.jpg"
                  alt="Bovann en présentation devant des entrepreneurs"
                  className="w-full h-[460px] object-cover object-top"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                  Nos engagements
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-950">
                  Pourquoi choisir OCD LIVE ?
                </h2>
                <p className="text-zinc-600 text-base">
                  Une organisation structurée par Boovan Group pour donner une visibilité concrète aux entrepreneurs et commerçants.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'VISIBILITÉ',
                    desc: 'Exposez votre activité, votre savoir-faire et votre marque à une nouvelle audience en Afrique et dans la diaspora.'
                  },
                  {
                    title: 'MARKETING',
                    desc: 'Présentez vos produits et vos services en direct, démontrez leur qualité et communiquez vos tarifs.'
                  },
                  {
                    title: 'OPPORTUNITÉS',
                    desc: 'Facilitez les contacts directs entre vendeurs et clients grâce à l\'affichage de vos coordonnées commerciales.'
                  },
                  {
                    title: 'ACCOMPAGNEMENT',
                    desc: 'Bénéficiez d\'un encadrement professionnel en studio au Togo ou d\'une assistante dédiée pour vos lives à distance.'
                  }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <span className="inline-block text-xs font-bold text-[#F26513]">0{i + 1}</span>
                    <h3 className="font-display font-bold text-lg text-zinc-950">{item.title}</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. TOUS LES SECTEURS SONT LES BIENVENUS
      ===================================================================== */}
      <section className="py-20 lg:py-24 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                Secteurs d'activité
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Tous les secteurs sont les bienvenus
              </h2>
              <p className="text-zinc-400 text-base">
                Quel que soit votre secteur d'activité, votre business a sa place sur OCD LIVE.
              </p>
            </div>
            <Link
              to="/reserver"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider self-start"
            >
              <span>Réserver un créneau</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {SECTORS_SHOWCASE.map((sector) => (
              <Link
                to={`/reserver?sector=${encodeURIComponent(sector.title)}`}
                key={sector.id}
                className="group relative h-64 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-[#F26513] transition-colors flex flex-col justify-end p-5"
              >
                <img
                  src={sector.image}
                  alt={sector.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F26513]">
                    {sector.tag}
                  </span>
                  <h3 className="font-display font-bold text-base text-white leading-snug">
                    {sector.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. NOS FORFAITS (APERÇU CLAIR)
      ===================================================================== */}
      {packages.length > 0 && (
        <section className="py-20 lg:py-24 bg-zinc-50 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                  Tarifs & Formules
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-950">
                  Nos 6 forfaits de diffusion
                </h2>
              </div>
              <Link
                to="/forfaits"
                className="text-sm font-bold text-[#F26513] hover:underline flex items-center gap-1"
              >
                <span>Voir le détail complet des forfaits</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {packages.slice(0, 6).map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-2xl bg-white overflow-hidden flex flex-col justify-between transition-shadow ${
                    pkg.is_recommended
                      ? 'border-2 border-[#F26513] shadow-lg'
                      : 'border border-zinc-200 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="relative h-48 bg-zinc-100 overflow-hidden">
                      <img
                        src={pkg.image_url}
                        alt={pkg.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />
                      {pkg.badge && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-md bg-[#F26513] text-white text-[11px] font-bold uppercase tracking-wider">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-zinc-500">
                          Durée : {pkg.duration_label}
                        </span>
                        <h3 className="font-display text-xl font-extrabold text-zinc-950 mt-0.5">
                          {pkg.name}
                        </h3>
                        <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{pkg.subtitle}</p>
                      </div>

                      <div className="py-3 border-y border-zinc-100">
                        <span className="font-display text-2xl font-extrabold text-[#F26513]">
                          {pkg.price_label}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {(pkg.features || []).slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-zinc-700">
                            <Check className="w-4 h-4 text-[#F26513] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      to={`/reserver?packageId=${pkg.id}`}
                      className={`w-full py-3 px-5 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                        pkg.is_recommended
                          ? 'bg-[#F26513] hover:bg-[#DC5309] text-white'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                      }`}
                    >
                      <span>Choisir ce forfait</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          6. COMMENT ÇA MARCHE ? (4 ÉTAPES SIMPLES)
      ===================================================================== */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
              Parcours de réservation
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-950">
              Comment ça marche ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                step: '1',
                title: 'Choisissez votre mode de participation',
                desc: 'En présentiel dans notre studio au Togo ou à distance depuis votre pays.'
              },
              {
                step: '2',
                title: 'Sélectionnez votre date et votre forfait',
                desc: 'Choisissez votre créneau horaire disponible et la formule adaptée à vos besoins.'
              },
              {
                step: '3',
                title: 'Renseignez les informations de votre entreprise',
                desc: 'Indiquez vos produits, vos coordonnées commerciales et téléversez vos visuels.'
              },
              {
                step: '4',
                title: 'Confirmez votre réservation et préparez votre live',
                desc: 'Validez votre demande et préparez votre passage avec l\'équipe Boovan Group.'
              }
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F26513] text-white font-display font-extrabold text-sm flex items-center justify-center">
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-base text-zinc-950">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div>
            <Link
              to="/reserver"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Réserver maintenant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

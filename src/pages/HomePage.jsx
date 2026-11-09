import React from 'react';
import { Link } from '../router';
import { 
  ArrowRight, 
  Check, 
  Radio, 
  ShoppingBag, 
  Tv, 
  Clock, 
  Globe2, 
  ShieldCheck, 
  Users,
  Video,
  ChevronRight
} from 'lucide-react';
import { SECTORS_SHOWCASE } from '../data/media';

export default function HomePage({ packages = [] }) {
  return (
    <div className="bg-slate-50 text-slate-900">
      
      {/* =====================================================================
          1. SECTION HERO — CLAIRE, SOBRE & INSTITUTIONNELLE
      ===================================================================== */}
      <section className="bg-white border-b border-slate-200 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Texte et actions principales */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-[#F26513]" />
                <span>Plateaux audiovisuels professionnels • Lomé, Togo</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-950 leading-[1.12]">
                Donnez une visibilité d'exception à votre activité.
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Présentez vos produits et développez votre clientèle grâce à nos plateaux de télévision connectés au Togo et à notre réseau de diffusion en direct partout en Afrique.
              </p>

              {/* Boutons d'action clairs et hiérarchisés */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/reserver"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-medium text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F26513] focus:ring-offset-2"
                >
                  <span>Réserver un passage en direct</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/lives-afrique"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <Radio className="w-4 h-4 text-slate-500" />
                  <span>Consulter les directs en cours</span>
                </Link>
              </div>

              {/* Indicateurs de confiance */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Production audiovisuelle HD & 4K</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Diffusion Togo, Afrique & Diaspora</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Accompagnement par Boovan Group</span>
                </div>
              </div>
            </div>

            {/* Photo officielle du studio et du promoteur Bovann */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                <img
                  src="/brand/ocd-studio-bovann.jpg"
                  alt="Plateau officiel OCD LIVE au Togo avec Bovann"
                  className="w-full h-[460px] object-cover object-top"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Complexe audiovisuel OCD LIVE — Lomé, République Togolaise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. TROIS PILIERS DE LA PLATEFORME (STUDIO, LIVES PANAFRICAINS, SHOP)
      ===================================================================== */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F26513]">
              Solutions complètes
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
              Trois dispositifs pensés pour le commerce africain
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pilier 1 : Plateaux en Studio */}
            <div className="bg-white rounded-xl border border-slate-200 p-7 flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F26513]">
                  <Tv className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900">
                  Plateaux de télévision au Togo
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Présentez votre entreprise devant un dispositif multi-caméras avec régie, animateur dédié et habillage graphique professionnel.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">De 1h30 à 1 journée</span>
                <Link to="/forfaits" className="text-xs font-semibold text-[#F26513] hover:underline flex items-center gap-1">
                  <span>Voir les forfaits</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pilier 2 : Directs Panafricains depuis chez soi */}
            <div className="bg-white rounded-xl border border-slate-200 p-7 flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900">
                  Directs depuis chez soi
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Vous vendez au Bénin, Cameroun, Côte d'Ivoire ou Togo ? Transmettez le lien de votre live TikTok ou Facebook. Nos équipes valident et relaient votre flux.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">5 000 FCFA / mois</span>
                <Link to="/lives-afrique" className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1">
                  <span>Accéder aux directs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pilier 3 : OCD Shop */}
            <div className="bg-white rounded-xl border border-slate-200 p-7 flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900">
                  Catalogue OCD Shop
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Retrouvez les articles phares présentés en direct par les producteurs africains. Commande directe par WhatsApp auprès du commerçant.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Sans intermédiaire</span>
                <Link to="/boutique" className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1">
                  <span>Parcourir la boutique</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          3. DEUX MODES DE PARTICIPATION EN STUDIO
      ===================================================================== */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F26513]">
              Modes d'intervention
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
              Deux manières de participer aux émissions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Mode Présentiel */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-64 overflow-hidden bg-slate-100">
                  <img
                    src="/brand/ocd-plateau-afrique.jpg"
                    alt="Plateau officiel OCD LIVE à Lomé"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-7 space-y-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#F26513]">
                      Option A • En studio à Lomé
                    </span>
                    <h3 className="text-xl font-semibold text-slate-900 mt-1">
                      Participation en présentiel
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      Venez directement dans notre complexe audiovisuel au Togo. Vous êtes accueilli par notre équipe technique et bénéficiez de tout le matériel de pointe.
                    </p>
                  </div>

                  <ul className="space-y-2 text-sm text-slate-700">
                    {[
                      'Studio insonorisé et climatisé à Lomé',
                      'Régie multi-caméras et éclairage de plateau',
                      'Présentation physique de vos échantillons et produits',
                      'Possibilité d\'animation conjointe par nos présentateurs',
                      'Diffusion en direct sur nos canaux officiels'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-7 pt-0">
                <Link
                  to="/reserver?mode=PRESENTIEL"
                  className="w-full py-3 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Réserver en présentiel à Lomé</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Mode À Distance */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-64 overflow-hidden bg-slate-100">
                  <img
                    src="/brand/bovann-jeunesse.jpg"
                    alt="Participation à distance en direct d'Afrique"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-7 space-y-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Option B • Panafricain & International
                    </span>
                    <h3 className="text-xl font-semibold text-slate-900 mt-1">
                      Participation à distance
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      Vous résidez au Cameroun, en Côte d'Ivoire, au Sénégal, en France ou ailleurs ? Participez en duplex direct depuis vos propres locaux.
                    </p>
                  </div>

                  <ul className="space-y-2 text-sm text-slate-700">
                    {[
                      'Connexion sécurisée en direct avec la régie centrale',
                      'Assistance technique préalable pour le son et l\'image',
                      'Possibilité d\'assistance par une animatrice présente au studio',
                      'Incrustation de vos coordonnées et de vos tarifs à l\'écran',
                      'Idéal pour tester de nouveaux marchés sans vous déplacer'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-7 pt-0">
                <Link
                  to="/reserver?mode=DISTANCE"
                  className="w-full py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Réserver une session à distance</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          4. FORFAITS OFFICIELS
      ===================================================================== */}
      {packages.length > 0 && (
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F26513]">
                  Tarifs transparents
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
                  Formules de diffusion adaptées à chaque étape
                </h2>
              </div>
              <Link
                to="/forfaits"
                className="text-sm font-semibold text-[#F26513] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Consulter tous les forfaits</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.slice(0, 3).map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-xl bg-white p-7 flex flex-col justify-between transition-shadow shadow-sm ${
                    pkg.is_recommended ? 'border-2 border-[#F26513]' : 'border border-slate-200'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500 font-mono">
                        Durée : {pkg.duration_label}
                      </span>
                      {pkg.is_recommended && (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-orange-50 text-[#F26513] border border-orange-200">
                          Recommandé
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {pkg.subtitle}
                      </p>
                    </div>

                    <div className="py-3 border-y border-slate-100">
                      <div className="text-3xl font-bold text-slate-900 tracking-tight">
                        {pkg.price_label}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">Tarif officiel Boovan Group</div>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700">
                      {(pkg.features || []).slice(0, 4).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <Link
                      to={`/reserver?packageId=${pkg.id}`}
                      className={`w-full py-2.5 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-colors ${
                        pkg.is_recommended
                          ? 'bg-[#F26513] hover:bg-[#DC5309] text-white shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>Sélectionner ce forfait</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          5. PROCESSUS EN 4 ÉTAPES CLAIRES
      ===================================================================== */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F26513]">
              Déroulement simple
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
              Comment réserver votre créneau
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Choix du mode et du forfait',
                desc: 'Présentiel à Lomé ou à distance depuis votre entreprise.'
              },
              {
                step: '02',
                title: 'Sélection du créneau',
                desc: 'Consultez le calendrier en temps réel et choisissez l\'horaire qui vous convient.'
              },
              {
                step: '03',
                title: 'Fiche d\'entreprise',
                desc: 'Indiquez vos coordonnées et les produits à mettre en avant durant le direct.'
              },
              {
                step: '04',
                title: 'Confirmation & Direct',
                desc: 'Notre régie prend contact avec vous pour organiser le passage et le cadrage.'
              }
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="text-xs font-mono font-bold text-[#F26513]">
                  {item.step}
                </span>
                <h3 className="font-semibold text-base text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <Link
              to="/reserver"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-medium text-sm transition-colors shadow-sm"
            >
              <span>Démarrer ma réservation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. SECTEURS D'ACTIVITÉ
      ===================================================================== */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F26513]">
              Secteurs représentés
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Une vitrine ouverte à tous les domaines d'activité
            </h2>
            <p className="text-sm text-slate-400">
              Du commerce traditionnel aux entreprises technologiques, chaque secteur bénéficie d'une mise en valeur adaptée.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {SECTORS_SHOWCASE.map((sector) => (
              <Link
                key={sector.id}
                to={`/reserver?sector=${encodeURIComponent(sector.title)}`}
                className="group relative h-48 rounded-lg overflow-hidden bg-slate-800 border border-slate-800 hover:border-[#F26513] transition-colors flex flex-col justify-end p-4"
              >
                <img
                  src={sector.image}
                  alt={sector.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="relative z-10 space-y-0.5">
                  <span className="text-[10px] font-semibold text-[#F26513] uppercase">
                    {sector.tag}
                  </span>
                  <h3 className="font-medium text-sm text-white line-clamp-1">
                    {sector.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

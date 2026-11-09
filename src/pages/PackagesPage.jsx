import React from 'react';
import { Link } from '../router';
import { Check, ArrowRight } from 'lucide-react';

export default function PackagesPage({ packages = [], addons = [] }) {
  return (
    <div className="min-h-screen bg-slate-50 py-14 lg:py-20 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* En-tête sobre */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <span>Catalogue Officiel • Boovan Group</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
            Forfaits de diffusion audiovisuelle
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Choisissez la durée et la formule adaptées à la présentation de vos produits. Chaque forfait comprend l'accueil régie, l'habillage graphique de vos coordonnées et la diffusion en direct.
          </p>
        </div>

        {/* Grille des forfaits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-xl bg-white overflow-hidden flex flex-col justify-between shadow-xs transition-shadow ${
                pkg.is_recommended ? 'border-2 border-[#F26513]' : 'border border-slate-200'
              }`}
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={pkg.image_url}
                    alt={pkg.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {pkg.badge && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded bg-slate-900 text-white text-[11px] font-semibold">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-xs font-medium text-slate-500 font-mono">
                      Durée : {pkg.duration_label}
                    </span>
                    <h2 className="text-xl font-semibold text-slate-950 mt-0.5">
                      {pkg.name}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {pkg.subtitle}
                    </p>
                  </div>

                  <div className="py-3 border-y border-slate-100">
                    <span className="text-[11px] text-slate-400 block font-medium">Tarif officiel</span>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-950 font-mono">
                      {pkg.price_label}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {pkg.description}
                  </p>

                  <ul className="space-y-2">
                    {(pkg.features || []).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/reserver?packageId=${pkg.id}`}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-colors ${
                    pkg.is_recommended
                      ? 'bg-[#F26513] hover:bg-[#DC5309] text-white shadow-xs'
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

        {/* Options complémentaires */}
        {addons.length > 0 && (
          <div className="rounded-xl bg-white border border-slate-200 p-7 space-y-6 shadow-xs">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F26513]">
                Options sur mesure
              </span>
              <h3 className="text-xl font-semibold text-slate-950 mt-1">
                Prestations complémentaires disponibles
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                >
                  <span className="text-sm font-semibold text-[#F26513] font-mono">
                    +{Number(addon.price_fcfa).toLocaleString('fr-FR')} FCFA
                  </span>
                  <h4 className="font-semibold text-sm text-slate-950">
                    {addon.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {addon.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

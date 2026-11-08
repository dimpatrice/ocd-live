import React from 'react';
import { Link } from '../router';
import { Check, ArrowRight } from 'lucide-react';

export default function PackagesPage({ packages = [], addons = [] }) {
  return (
    <div className="min-h-screen bg-zinc-50 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* En-tête sobre */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
            Offres commerciales OCD LIVE
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-zinc-950">
            Nos 6 forfaits de diffusion
          </h1>
          <p className="text-zinc-600 text-base leading-relaxed">
            Choisissez la durée et la formule adaptées à la présentation de vos produits, en présentiel au studio du Togo ou à distance depuis votre pays.
          </p>
        </div>

        {/* Grille des 6 forfaits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl bg-white overflow-hidden flex flex-col justify-between ${
                pkg.is_recommended
                  ? 'border-2 border-[#F26513] shadow-lg'
                  : 'border border-zinc-200 shadow-sm'
              }`}
            >
              <div>
                <div className="relative h-52 bg-zinc-100 overflow-hidden">
                  <img
                    src={pkg.image_url}
                    alt={pkg.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {pkg.badge && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-md bg-[#F26513] text-white text-[11px] font-bold uppercase tracking-wider">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <div className="p-7 space-y-5">
                  <div>
                    <span className="text-xs font-semibold text-zinc-500">
                      Durée : {pkg.duration_label}
                    </span>
                    <h2 className="font-display text-2xl font-extrabold text-zinc-950 mt-0.5">
                      {pkg.name}
                    </h2>
                    <p className="text-sm text-zinc-600 mt-1">{pkg.subtitle}</p>
                  </div>

                  <div className="py-3 border-y border-zinc-100">
                    <span className="text-xs text-zinc-400 block">Prix indicatif</span>
                    <div className="font-display text-2xl sm:text-3xl font-extrabold text-[#F26513]">
                      {pkg.price_label}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  <ul className="space-y-2">
                    {(pkg.features || []).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-700">
                        <Check className="w-4 h-4 text-[#F26513] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-7 pt-0">
                <Link
                  to={`/reserver?packageId=${pkg.id}`}
                  className={`w-full py-3.5 px-6 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
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

        {/* Options complémentaires */}
        {addons.length > 0 && (
          <div className="rounded-2xl bg-white border border-zinc-200 p-8 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                Options supplémentaires
              </span>
              <h3 className="font-display text-2xl font-extrabold text-zinc-950 mt-1">
                Prestations complémentaires sur demande
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2"
                >
                  <span className="text-sm font-bold text-[#F26513]">
                    +{Number(addon.price_fcfa).toLocaleString('fr-FR')} FCFA
                  </span>
                  <h4 className="font-display font-bold text-base text-zinc-950">
                    {addon.name}
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
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

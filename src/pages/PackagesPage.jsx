import React from 'react';
import { Link } from '../router';
import { CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';

export default function PackagesPage({ packages = [], addons = [] }) {
  return (
    <div className="min-h-screen bg-transparent py-12 lg:py-16 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* En-tête direct et vivant */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
              <span className="h-px w-5 bg-[#F26513] inline-block" />
              <span>TARIFS & FORFAITS OFFICIELS EN FCFA</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Forfaits de diffusion OCD LIVE
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Choisissez la formule qui convient à votre commerce. Chaque passage inclut l'accompagnement régie et l'affichage de vos coordonnées WhatsApp en direct.
            </p>
          </div>

          <a
            href="https://wa.me/22890000000?text=Bonjour%20OCD%20LIVE,%20j'hésite%20entre%20plusieurs%20forfaits%20et%20je%20veux%20des%20conseils."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-xs uppercase tracking-wider transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Conseil forfait sur WhatsApp</span>
          </a>
        </div>

        {/* Grille des 6 forfaits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl bg-white overflow-hidden flex flex-col justify-between shadow-xs transition-all ${
                pkg.is_recommended ? 'border-3 border-[#F26513] shadow-md ring-2 ring-orange-200' : 'border-2 border-slate-200 hover:border-slate-300'
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
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#F26513] text-white text-xs font-black uppercase shadow">
                      {pkg.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-xs font-bold">
                    Durée : {pkg.duration_label}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      {pkg.name}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {pkg.subtitle}
                    </p>
                  </div>

                  <div className="py-3 border-y border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Tarif</span>
                    <div className="text-3xl font-black text-[#F26513]">
                      {pkg.price_label}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {pkg.description}
                  </p>

                  <ul className="space-y-2 pt-1">
                    {(pkg.features || []).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/reserver?packageId=${pkg.id}`}
                  className={`w-full min-h-[48px] px-6 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
                    pkg.is_recommended
                      ? 'bg-[#F26513] hover:bg-[#DC5309] text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Réserver ce forfait</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Options complémentaires */}
        {addons.length > 0 && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                Suppléments au choix
              </span>
              <h3 className="text-xl font-black text-slate-950 mt-0.5">
                Prestations complémentaires
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <span className="text-base font-black text-[#F26513]">
                    +{Number(addon.price_fcfa).toLocaleString('fr-FR')} FCFA
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-950">
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

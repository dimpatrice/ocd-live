import React from 'react';
import { Link } from '../router';
import { ArrowRight, ShieldCheck, Globe2, Tv } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-14 lg:py-20 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Présentation principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <span>Boovan Group • Siège à Lomé, Togo</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950 leading-tight">
              Une infrastructure média au service de la croissance commerciale africaine.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Fondée et animée par <strong>Boovan Group</strong> sous l'impulsion de <strong>Bovann</strong>, la plateforme <strong>OCD LIVE</strong> comble le fossé entre les commerçants de proximité et les acheteurs de toute l'Afrique.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              En combinant un complexe audiovisuel de premier plan au Togo, des duplex à distance fiables et un canal de vente direct via WhatsApp, nous permettons aux créateurs et commerçants de toucher une clientèle engagée sans friction technologique.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/reserver"
                className="px-6 py-3.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-medium text-sm inline-flex items-center gap-2 shadow-sm transition-colors"
              >
                <span>Réserver un passage en direct</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://www.facebook.com/Bovannofficiel"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium text-sm transition-colors"
              >
                Facebook : Bovann Officiel
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <img
                src="/brand/bovann-jeunesse.jpg"
                alt="Bovann — Direction générale et promoteur OCD LIVE"
                className="w-full h-[460px] object-cover object-top"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Bovann — Promoteur & Direction Générale, Boovan Group
            </p>
          </div>
        </div>

        {/* Galerie & Piliers d'intervention */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs">
            <img
              src="/brand/ocd-studio-bovann.jpg"
              alt="Plateau officiel OCD LIVE à Lomé"
              className="w-full h-64 object-cover object-top"
            />
            <div className="p-6 space-y-2">
              <h3 className="font-semibold text-base text-slate-950">
                Le Studio Central à Lomé
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Régie multi-caméras 4K, éclairage cinématographique et insonorisation professionnelle pour recevoir les commerçants en présentiel au Togo.
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs">
            <img
              src="/brand/bovann-conference.jpg"
              alt="Accompagnement et stratégie pour entrepreneurs"
              className="w-full h-64 object-cover object-top"
            />
            <div className="p-6 space-y-2">
              <h3 className="font-semibold text-base text-slate-950">
                Accompagnement & Stratégie
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Un cadrage précis et des conseils d'argumentaire de vente dispensés avant chaque émission pour maximiser le taux de conversion.
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs">
            <img
              src="/brand/bovann-portrait-2.jpg"
              alt="Direction et rayonnement panafricain"
              className="w-full h-64 object-cover object-top"
            />
            <div className="p-6 space-y-2">
              <h3 className="font-semibold text-base text-slate-950">
                Rayonnement Panafricain
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Une audience fidèle au Bénin, Cameroun, Côte d'Ivoire, Gabon, Togo et dans la diaspora pour donner une résonance concrète à vos produits.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

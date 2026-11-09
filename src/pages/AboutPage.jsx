import React from 'react';
import { Link } from '../router';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-16 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Présentation principale avec photo du promoteur Bovann */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#F26513]">
              Vision & Équipe
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
              Une infrastructure média au service des commerçants africains.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Créée par <strong>Boovan Group</strong> sous l'impulsion de <strong>Bovann</strong>, la plateforme <strong>OCD LIVE</strong> permet aux commerçants de proximité de vendre en direct à des milliers de clients en Afrique sans barrière technique.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Grâce à notre studio de diffusion à Lomé et à nos duplex à distance, les vendeurs passent en live avec un habillage professionnel et reçoivent leurs commandes directement sur WhatsApp.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/reserver"
                className="min-h-[50px] px-8 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>Réserver un passage en direct</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://www.facebook.com/Bovannofficiel"
                target="_blank"
                rel="noreferrer"
                className="min-h-[50px] px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 font-extrabold text-xs uppercase tracking-wider inline-flex items-center transition-colors"
              >
                Facebook : Bovann Officiel
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg bg-slate-100">
              <img
                src="/brand/bovann-jeunesse.jpg"
                alt="Bovann — Direction générale et promoteur OCD LIVE"
                className="w-full h-[440px] object-cover object-top"
              />
            </div>
            <p className="text-xs font-bold text-slate-500 mt-2 text-center">
              Bovann — Promoteur & Direction Générale, Boovan Group
            </p>
          </div>
        </div>

        {/* Galerie des infrastructures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-xs">
            <img
              src="/brand/ocd-studio-bovann.jpg"
              alt="Plateau officiel OCD LIVE à Lomé"
              className="w-full h-60 object-cover object-top"
            />
            <div className="p-6 space-y-2">
              <h3 className="font-black text-lg text-slate-950">
                Le Studio Central à Lomé
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Régie multi-caméras 4K, éclairage cinéma et insonorisation professionnelle pour recevoir les commerçants en présentiel au Togo.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-xs">
            <img
              src="/brand/bovann-conference.jpg"
              alt="Accompagnement et stratégie pour entrepreneurs"
              className="w-full h-60 object-cover object-top"
            />
            <div className="p-6 space-y-2">
              <h3 className="font-black text-lg text-slate-950">
                Accompagnement Commercial
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cadrage précis et conseils d'argumentaire de vente avant chaque émission pour maximiser le taux de conversion sur WhatsApp.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-xs">
            <img
              src="/brand/bovann-portrait-2.jpg"
              alt="Rayonnement panafricain"
              className="w-full h-60 object-cover object-top"
            />
            <div className="p-6 space-y-2">
              <h3 className="font-black text-lg text-slate-950">
                Diffusion Panafricaine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Audience active répartie sur le Togo, Bénin, Cameroun, Côte d'Ivoire, Gabon et la diaspora connectée.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

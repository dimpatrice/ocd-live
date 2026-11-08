import React from 'react';
import { Link } from '../router';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Présentation principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
              Boovan Group • Lomé, Togo
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-zinc-950 leading-tight">
              Propulser les entrepreneurs africains grâce au livestreaming commercial.
            </h1>
            <p className="text-zinc-600 text-base leading-relaxed">
              Initiée par <strong>Boovan Group</strong> et portée par <strong>Bovann</strong>, la plateforme <strong>OCD LIVE</strong> permet aux commerçants, entrepreneurs et entreprises de présenter leurs produits en direct, de faire connaître leurs coordonnées et de vendre leurs marchandises à une audience engagée.
            </p>
            <p className="text-zinc-600 text-base leading-relaxed">
              Que vous soyez présent au Togo dans notre studio ou connecté à distance depuis votre pays, notre équipe assure la réalisation et l'accompagnement de votre émission.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/reserver"
                className="px-6 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2"
              >
                <span>Réserver un créneau</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://www.facebook.com/Bovannofficiel"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-display font-bold text-xs uppercase tracking-wider"
              >
                Facebook : Bovann Officiel
              </a>
              <a
                href="https://www.tiktok.com/@bovann"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-display font-bold text-xs uppercase tracking-wider"
              >
                TikTok : @bovann
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-lg">
              <img
                src="/brand/bovann-jeunesse.jpg"
                alt="Bovann — Porte-parole et promoteur OCD LIVE"
                className="w-full h-[460px] object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Galerie du studio et des activités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          <div className="rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200">
            <img
              src="/brand/ocd-studio-bovann.jpg"
              alt="Plateau OCD LIVE au Togo"
              className="w-full h-72 object-cover object-top"
            />
            <div className="p-6 space-y-1.5">
              <h3 className="font-display font-bold text-lg text-zinc-950">
                Le Plateau OCD LIVE au Togo
              </h3>
              <p className="text-sm text-zinc-600">
                Un studio équipé et sécurisé à Lomé pour recevoir les entrepreneurs en présentiel.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200">
            <img
              src="/brand/bovann-conference.jpg"
              alt="Formation et accompagnement des entrepreneurs"
              className="w-full h-72 object-cover object-top"
            />
            <div className="p-6 space-y-1.5">
              <h3 className="font-display font-bold text-lg text-zinc-950">
                Accompagnement & Stratégie
              </h3>
              <p className="text-sm text-zinc-600">
                Un encadrement concret pour structurer votre discours commercial et valoriser vos produits.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200">
            <img
              src="/brand/bovann-portrait-2.jpg"
              alt="Bovann — Direction Boovan Group"
              className="w-full h-72 object-cover object-top"
            />
            <div className="p-6 space-y-1.5">
              <h3 className="font-display font-bold text-lg text-zinc-950">
                Réseau Africain & International
              </h3>
              <p className="text-sm text-zinc-600">
                Des lives suivis au Togo, en Afrique de l'Ouest, en Afrique Centrale et dans la diaspora.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

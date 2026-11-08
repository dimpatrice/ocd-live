import React from 'react';
import { Link } from '../router';
import { Check, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '1',
      title: 'Choisissez votre mode de participation',
      subtitle: 'En présentiel au Togo ou à distance depuis votre pays',
      desc: 'Sélectionnez une intervention directe sur notre plateau à Lomé ou participez à distance depuis votre entreprise (Cameroun, Côte d\'Ivoire, Gabon, Sénégal, Bénin et international).',
      points: [
        'Plateau professionnel au Togo',
        'Connexion en direct à distance',
        'Assistance possible par une animatrice au studio'
      ],
      image: '/brand/ocd-studio-bovann.jpg'
    },
    {
      num: '2',
      title: 'Sélectionnez votre date et votre forfait',
      subtitle: 'Calendrier en temps réel (Fuseau horaire Africa/Lome)',
      desc: 'Choisissez la date de votre passage, un créneau horaire disponible et l\'un de nos 6 forfaits adaptés à la durée de présentation souhaitée.',
      points: [
        'Disponibilités affichées en temps réel',
        '6 forfaits de 1h30 à 1 journée ou abonnement mensuel',
        'Options supplémentaires configurables'
      ],
      image: '/brand/ocd-plateau-afrique.jpg'
    },
    {
      num: '3',
      title: 'Renseignez les informations de votre entreprise',
      subtitle: 'Préparation de votre présentation commerciale',
      desc: 'Indiquez le nom de votre activité, la liste des produits à présenter, vos coordonnées commerciales (téléphone, WhatsApp, réseaux sociaux) et téléversez vos photos produits.',
      points: [
        'Affichage de vos coordonnées pendant le direct',
        'Mise en avant de votre logo et de vos produits',
        'Précision de vos objectifs commerciaux'
      ],
      image: '/brand/bovann-conference.jpg'
    },
    {
      num: '4',
      title: 'Confirmez votre réservation et préparez votre live',
      subtitle: 'Validation par Boovan Group et mise en place',
      desc: 'Vous recevez votre référence unique de réservation. Après vérification de votre règlement par l\'administration, votre créneau est confirmé et notre équipe prépare votre émission.',
      points: [
        'Numéro de suivi unique',
        'Validation administrative du paiement',
        'Accompagnement par l\'équipe Boovan Group'
      ],
      image: '/brand/bovann-jeunesse.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
            Organisation & Étapes
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-zinc-950">
            Comment ça marche ?
          </h1>
          <p className="text-zinc-600 text-base">
            Réservez votre créneau en 4 étapes simples et présentez vos produits en direct sur OCD LIVE.
          </p>
        </div>

        <div className="space-y-10">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="lg:col-span-5 h-72 lg:h-auto bg-zinc-100">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover object-top" />
              </div>
              <div className="lg:col-span-7 p-8 sm:p-10 space-y-4 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F26513]">
                  <span>Étape {s.num}</span>
                  <span>•</span>
                  <span>{s.subtitle}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-950">
                  {s.title}
                </h2>
                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                  {s.desc}
                </p>
                <ul className="space-y-2 pt-1">
                  {s.points.map((pt, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-800">
                      <Check className="w-4 h-4 text-[#F26513] shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
    </div>
  );
}

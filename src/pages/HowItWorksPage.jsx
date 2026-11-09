import React from 'react';
import { Link } from '../router';
import { Check, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Sélectionnez votre mode de participation',
      subtitle: 'En présentiel à Lomé ou à distance depuis votre entreprise',
      desc: 'Choisissez entre un passage direct sur notre plateau professionnel au Togo ou une intervention à distance en duplex depuis votre pays (Bénin, Cameroun, Côte d\'Ivoire, Gabon, Sénégal, diaspora).',
      points: [
        'Plateau insonorisé et multi-caméras au Togo',
        'Liaison direct sécurisée pour les participants à distance',
        'Assistance conjointe d\'une animatrice sur le plateau'
      ],
      image: '/brand/ocd-studio-bovann.jpg'
    },
    {
      num: '02',
      title: 'Choisissez votre date et votre forfait',
      subtitle: 'Calendrier synchronisé en temps réel (Africa/Lome)',
      desc: 'Consultez les créneaux disponibles selon votre planning et sélectionnez la formule adaptée à la durée de votre démonstration commerciale.',
      points: [
        'Disponibilités actualisées en direct',
        'Formules modulables de 1h30 à la journée complète',
        'Options techniques et marketing activables'
      ],
      image: '/brand/ocd-plateau-afrique.jpg'
    },
    {
      num: '03',
      title: 'Renseignez les éléments de votre entreprise',
      subtitle: 'Préparation du cadrage et de l\'habillage visuel',
      desc: 'Transmettez les coordonnées commerciales à afficher à l\'antenne (WhatsApp, téléphone, réseaux sociaux) et les échantillons ou visuels de vos articles.',
      points: [
        'Affichage permanent de vos coordonnées de vente',
        'Incrustation de votre logo et catalogue tarifaire',
        'Cadrage spécifique selon la nature des produits'
      ],
      image: '/brand/bovann-conference.jpg'
    },
    {
      num: '04',
      title: 'Confirmez votre créneau et préparez l\'antenne',
      subtitle: 'Validation administrative et prise en charge technique',
      desc: 'Un numéro de dossier unique vous est attribué. Notre régie valide votre règlement et organise un briefing préparatoire avant le début du direct.',
      points: [
        'Référence unique pour le suivi de votre réservation',
        'Vérification humaine par l\'administration de Boovan Group',
        'Accompagnement personnalisé le jour de l\'émission'
      ],
      image: '/brand/bovann-jeunesse.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-14 lg:py-20 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <span>Guide d'accompagnement • Boovan Group</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
            Comment se déroule un direct sur OCD LIVE
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            De la réservation de votre créneau jusqu'à la diffusion en direct, découvrez les 4 étapes simples pour présenter vos produits.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-xl bg-white border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xs"
            >
              <div className="lg:col-span-5 h-64 lg:h-auto bg-slate-100">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover object-top" />
              </div>
              <div className="lg:col-span-7 p-7 sm:p-9 space-y-4 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F26513] font-mono">
                  <span>Étape {s.num}</span>
                  <span>•</span>
                  <span>{s.subtitle}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-950">
                  {s.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
                <ul className="space-y-2 pt-1">
                  {s.points.map((pt, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Link
            to="/reserver"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-medium text-sm transition-colors shadow-sm"
          >
            <span>Démarrer ma réservation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

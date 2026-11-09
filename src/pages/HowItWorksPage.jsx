import React from 'react';
import { Link } from '../router';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Sélectionnez votre mode de participation',
      desc: 'Choisissez entre un passage direct sur notre plateau professionnel à Lomé (Togo) ou une intervention en duplex depuis votre pays (Bénin, Cameroun, Côte d\'Ivoire, Gabon, Sénégal, diaspora).',
      points: [
        'Plateau insonorisé et multi-caméras 4K à Lomé',
        'Liaison direct sécurisée pour les participants à distance',
        'Relais animatrice sur le plateau pour dynamiser la vente'
      ],
      image: '/brand/ocd-studio-bovann.jpg'
    },
    {
      num: '02',
      title: 'Choisissez votre date et votre formule',
      desc: 'Consultez les créneaux disponibles selon votre calendrier et sélectionnez la formule adaptée à la durée de votre présentation de produits.',
      points: [
        'Disponibilités actualisées en direct (fuseau GMT)',
        'Formules modulables de 1h30 à la journée complète',
        'Options techniques activables en un clic'
      ],
      image: '/brand/ocd-plateau-afrique.jpg'
    },
    {
      num: '03',
      title: 'Transmettez les coordonnées de votre commerce',
      desc: 'Renseignez votre numéro WhatsApp commercial et les photos de vos articles. La régie prépare l\'habillage vidéo et le bandeau d\'achat qui apparaîtra en direct.',
      points: [
        'Affichage permanent de votre numéro WhatsApp à l\'écran',
        'Incrustation de votre logo et prix des articles',
        'Mise en valeur ciblée de vos produits'
      ],
      image: '/brand/bovann-conference.jpg'
    },
    {
      num: '04',
      title: 'Passez en direct et recevez les commandes',
      desc: 'Un numéro de dossier unique vous est attribué. Notre régie valide votre règlement et prépare l\'antenne avec vous avant le début du direct.',
      points: [
        'Référence unique pour suivre l\'état de votre dossier',
        'Vérification humaine par l\'administration de Boovan Group',
        'Accompagnement personnalisé le jour de l\'émission'
      ],
      image: '/brand/bovann-jeunesse.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-16 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#F26513]">
            Guide pratique
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            Comment se déroule un direct sur OCD LIVE
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            De la réservation de votre créneau jusqu'à la diffusion en direct, voici les 4 étapes pour présenter vos produits.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl bg-white border-2 border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xs hover:border-[#F26513] transition-colors"
            >
              <div className="lg:col-span-5 h-64 lg:h-auto bg-slate-100">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover object-top" />
              </div>
              <div className="lg:col-span-7 p-7 sm:p-9 space-y-3 flex flex-col justify-center">
                <span className="text-sm font-black text-[#F26513]">
                  Étape {s.num}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                  {s.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
                <ul className="space-y-2 pt-1">
                  {s.points.map((pt, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-2xl bg-white border-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="text-xl font-black text-slate-950">Prêt à réserver votre créneau ?</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Consultez les dates et forfaits disponibles en direct.</p>
          </div>
          <Link
            to="/reserver"
            className="min-h-[50px] px-8 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
          >
            <span>Réserver mon direct</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from '../router';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Check,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  Building2,
  User,
  ShieldCheck,
  Radio,
  Tv,
  MessageCircle
} from 'lucide-react';
import { AFRICAN_COUNTRIES, SECTORS_SHOWCASE, LIVE_OBJECTIVES_OPTIONS } from '../data/media';
import { fetchJson } from '../utils/api';
import { OcdButton } from '../components/OcdLoader';

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const WEEKDAYS_SHORT_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function BookingPage({ packages = [], addons = [], settings = {} }) {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);

  const [participationMode, setParticipationMode] = useState(
    searchParams.get('mode') === 'DISTANCE' ? 'DISTANCE' : 'PRESENTIEL'
  );

  const initialPkgId = useMemo(() => {
    const paramId = Number(searchParams.get('packageId'));
    if (paramId && packages.some((p) => p.id === paramId)) return paramId;
    const recommended = packages.find((p) => p.is_recommended);
    return recommended ? recommended.id : packages[0]?.id || 1;
  }, [packages, searchParams]);

  const [selectedPackageId, setSelectedPackageId] = useState(initialPkgId);
  const [selectedAddonCodes, setSelectedAddonCodes] = useState([]);
  const [remoteAssistance, setRemoteAssistance] = useState('OUI');

  useEffect(() => {
    if (packages.length > 0 && !packages.some((p) => p.id === selectedPackageId)) {
      const rec = packages.find((p) => p.is_recommended) || packages[0];
      setSelectedPackageId(rec.id);
    }
  }, [packages, selectedPackageId]);

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === Number(selectedPackageId)) || packages[0] || null,
    [packages, selectedPackageId]
  );

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getUTCFullYear());
  const [calMonth, setCalMonth] = useState(now.getUTCMonth() + 1);
  const [calendarDays, setCalendarDays] = useState([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [personalInfo, setPersonalInfo] = useState({
    client_last_name: '',
    client_first_name: '',
    client_phone: '',
    client_whatsapp: '',
    client_email: '',
    client_country: 'Togo',
    client_city: '',
    client_address: ''
  });

  const [companyInfo, setCompanyInfo] = useState({
    company_name: '',
    trade_name: '',
    sector: searchParams.get('sector') || SECTORS_SHOWCASE[0].title,
    activity_description: '',
    products_to_present: '',
    approx_products_count: '5 à 15 produits',
    products_price_range: '',
    business_phone: '',
    business_whatsapp: '',
    business_address: '',
    business_country: 'Togo',
    business_city: '',
    website_url: '',
    social_facebook: '',
    social_instagram: '',
    social_tiktok: '',
    social_other: '',
    live_objectives: ['Vente directe de marchandises pendant le live'],
    live_objectives_details: '',
    company_logo_url: '',
    product_photos: [],
    presentation_video_url: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('TMONEY_FLOOZ');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [uploadingField, setUploadingField] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  useEffect(() => {
    const duration = selectedPackage?.duration_minutes || 90;
    setLoadingCalendar(true);
    fetchJson(`/api/public/calendar?year=${calYear}&month=${calMonth}&duration=${duration}`)
      .then((data) => {
        if (Array.isArray(data.days)) {
          setCalendarDays(data.days);
          if (!selectedDate) {
            const firstAvailable = data.days.find((d) => d.status === 'AVAILABLE');
            if (firstAvailable) {
              setSelectedDate(firstAvailable.date);
            }
          } else {
            const currentDayObj = data.days.find((d) => d.date === selectedDate);
            if (currentDayObj && selectedSlot) {
              const updatedSlot = currentDayObj.slots.find(
                (s) => s.startTime === selectedSlot.startTime && s.available
              );
              setSelectedSlot(updatedSlot || null);
            }
          }
        }
      })
      .catch((err) => {
        console.error('Erreur de chargement du calendrier OCD LIVE:', err);
      })
      .finally(() => setLoadingCalendar(false));
  }, [calYear, calMonth, selectedPackage?.duration_minutes]);

  const selectedDayObject = useMemo(
    () => calendarDays.find((d) => d.date === selectedDate) || null,
    [calendarDays, selectedDate]
  );

  const calendarGridCells = useMemo(() => {
    const firstDayUtc = new Date(Date.UTC(calYear, calMonth - 1, 1)).getUTCDay();
    const leadingEmpty = (firstDayUtc + 6) % 7;
    const cells = [];
    for (let i = 0; i < leadingEmpty; i++) cells.push(null);
    for (const dayObj of calendarDays) cells.push(dayObj);
    return cells;
  }, [calYear, calMonth, calendarDays]);

  const handlePrevMonth = () => {
    if (calMonth === 1) {
      setCalYear((y) => y - 1);
      setCalMonth(12);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 12) {
      setCalYear((y) => y + 1);
      setCalMonth(1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  async function handleFileUpload(file, targetType) {
    if (!file) return;
    setUploadingField(targetType);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const data = await fetchJson('/api/public/upload', {
        method: 'POST',
        body: formData
      });

      if (targetType === 'logo') {
        setCompanyInfo((prev) => ({ ...prev, company_logo_url: data.url }));
      } else if (targetType === 'product_photo') {
        setCompanyInfo((prev) => ({
          ...prev,
          product_photos: [...prev.product_photos, data.url]
        }));
      } else if (targetType === 'video') {
        setCompanyInfo((prev) => ({ ...prev, presentation_video_url: data.url }));
      } else if (targetType === 'payment_proof') {
        setPaymentProofUrl(data.url);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors du téléversement du fichier.');
    } finally {
      setUploadingField(null);
    }
  }

  const pricingSummary = useMemo(() => {
    if (!selectedPackage) {
      return { base: 0, assistanceFee: 0, addonsTotal: 0, total: 0, isCustom: false, selectedAddonsList: [] };
    }
    const isCustom = selectedPackage.price_fcfa === null || selectedPackage.price_fcfa === undefined;
    const base = isCustom ? 0 : Number(selectedPackage.price_fcfa);

    let assistanceFee = 0;
    if (
      participationMode === 'DISTANCE' &&
      remoteAssistance === 'OUI' &&
      !selectedPackage.remote_assistance_included
    ) {
      assistanceFee = Number(selectedPackage.remote_assistance_fee_fcfa || 0);
    }

    const selectedAddonsList = addons.filter((a) => selectedAddonCodes.includes(a.code));
    const addonsTotal = selectedAddonsList.reduce((acc, a) => acc + Number(a.price_fcfa || 0), 0);

    return {
      base,
      assistanceFee,
      addonsTotal,
      total: base + assistanceFee + addonsTotal,
      isCustom,
      selectedAddonsList
    };
  }, [selectedPackage, participationMode, remoteAssistance, addons, selectedAddonCodes]);

  function validateAndGoNext(targetStep) {
    setErrorMsg('');

    if (currentStep === 2 && targetStep > 2) {
      if (!selectedDate || !selectedSlot) {
        setErrorMsg('Veuillez sélectionner une date disponible ainsi qu\'un créneau horaire.');
        return;
      }
    }

    if (currentStep === 3 && targetStep > 3) {
      if (!selectedPackage) {
        setErrorMsg('Veuillez choisir un forfait.');
        return;
      }
    }

    if (currentStep === 4 && targetStep > 4) {
      const {
        client_last_name,
        client_first_name,
        client_phone,
        client_whatsapp,
        client_email,
        client_country,
        client_city,
        client_address
      } = personalInfo;

      if (
        !client_last_name.trim() ||
        !client_first_name.trim() ||
        !client_phone.trim() ||
        !client_whatsapp.trim() ||
        !client_email.trim() ||
        !client_country.trim() ||
        !client_city.trim() ||
        !client_address.trim()
      ) {
        setErrorMsg('Veuillez renseigner tous les champs obligatoires de vos informations personnelles.');
        return;
      }
    }

    if (currentStep === 5 && targetStep > 5) {
      const {
        company_name,
        sector,
        activity_description,
        products_to_present,
        approx_products_count,
        business_phone,
        business_whatsapp,
        business_address,
        business_country,
        business_city
      } = companyInfo;

      if (
        !company_name.trim() ||
        !sector.trim() ||
        !activity_description.trim() ||
        !products_to_present.trim() ||
        !approx_products_count.trim() ||
        !business_phone.trim() ||
        !business_whatsapp.trim() ||
        !business_address.trim() ||
        !business_country.trim() ||
        !business_city.trim()
      ) {
        setErrorMsg('Veuillez renseigner toutes les informations obligatoires sur votre entreprise.');
        return;
      }
    }

    setCurrentStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleConfirmBooking(e) {
    e.preventDefault();
    setErrorMsg('');

    if (!termsAccepted) {
      setErrorMsg('Veuillez accepter les conditions générales avant de confirmer votre réservation.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        participation_mode: participationMode,
        booking_date: selectedDate,
        start_time: selectedSlot?.startTime,
        package_id: selectedPackage?.id,
        remote_assistance: participationMode === 'DISTANCE' ? remoteAssistance : 'NON_APPLICABLE',
        addon_codes: selectedAddonCodes,
        ...personalInfo,
        ...companyInfo,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        payment_proof_url: paymentProofUrl,
        terms_accepted: termsAccepted
      };

      const data = await fetchJson('/api/public/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setConfirmedReservation(data.reservation);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.message || 'Impossible d\'enregistrer votre réservation.');
    } finally {
      setSubmitting(false);
    }
  }

  const stepsMeta = [
    { num: 1, title: 'Modalité' },
    { num: 2, title: 'Date' },
    { num: 3, title: 'Forfait' },
    { num: 4, title: 'Coordonnées' },
    { num: 5, title: 'Entreprise' },
    { num: 6, title: 'Confirmation' }
  ];

  if (confirmedReservation) {
    return (
      <div className="min-h-screen bg-transparent py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl bg-white/95 border-2 border-emerald-500 p-6 sm:p-10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Réservation enregistrée</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                  Demande confirmée avec succès
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Notre équipe au studio de Lomé a bien reçu votre demande.
                </p>
              </div>
              <div className="bg-orange-50 px-5 py-3.5 rounded-xl border border-orange-200 text-center sm:text-right">
                <span className="text-[11px] font-bold uppercase text-slate-500 block">
                  Numéro de dossier
                </span>
                <span className="text-xl font-mono font-black text-[#F26513]">
                  {confirmedReservation.reference}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed">
              <strong>Statut actuel : {confirmedReservation.payment_status}</strong> — Votre créneau sera définitivement bloqué dès vérification de votre règlement par la régie Boovan Group.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-xs uppercase text-slate-500">
                  Créneau réservé
                </h3>
                <p><span className="text-slate-500">Modalité :</span> <strong className="text-slate-900">{confirmedReservation.participation_mode === 'PRESENTIEL' ? 'Au studio à Lomé' : 'À distance'}</strong></p>
                <p><span className="text-slate-500">Date :</span> <strong className="text-slate-900">{confirmedReservation.booking_date}</strong></p>
                <p><span className="text-slate-500">Horaire :</span> <strong className="text-slate-900">{confirmedReservation.start_time.replace(':', 'h')} – {confirmedReservation.end_time.replace(':', 'h')} GMT</strong></p>
                <p><span className="text-slate-500">Forfait :</span> <strong className="text-slate-900">{confirmedReservation.package_name}</strong></p>
                <p><span className="text-slate-500">Montant :</span> <strong className="text-[#F26513] font-black text-base">{confirmedReservation.is_custom_quote ? 'Sur devis' : `${Number(confirmedReservation.total_price_fcfa).toLocaleString('fr-FR')} FCFA`}</strong></p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-xs uppercase text-slate-500">
                  Entreprise cliente
                </h3>
                <p><span className="text-slate-500">Responsable :</span> <strong className="text-slate-900">{confirmedReservation.client_first_name} {confirmedReservation.client_last_name}</strong></p>
                <p><span className="text-slate-500">Entreprise :</span> <strong className="text-slate-900">{confirmedReservation.company_name}</strong></p>
                <p><span className="text-slate-500">Secteur :</span> <strong className="text-slate-900">{confirmedReservation.sector}</strong></p>
                <p><span className="text-slate-500">Ville et pays :</span> <strong className="text-slate-900">{confirmedReservation.client_city}, {confirmedReservation.client_country}</strong></p>
                <p><span className="text-slate-500">WhatsApp :</span> <strong className="text-slate-900">{confirmedReservation.client_whatsapp}</strong></p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Link
                to={`/suivi-reservation?ref=${confirmedReservation.reference}`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider text-center transition-colors shadow-md"
              >
                Suivre mon dossier / Joindre un reçu
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider text-center transition-colors"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* En-tête direct et vivant */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500 mb-1.5">
                <span className="h-px w-5 bg-[#F26513] inline-block" />
                <span>RÉSERVATION EN LIGNE • LOMÉ GMT</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Réserver un direct
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Choisissez votre formule et laissez-vous guider étape par étape.
              </p>
            </div>

            {/* Sélecteur de mode immédiat */}
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setParticipationMode('PRESENTIEL')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  participationMode === 'PRESENTIEL'
                    ? 'bg-[#F26513] text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Au Studio (Lomé)
              </button>
              <button
                type="button"
                onClick={() => setParticipationMode('DISTANCE')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  participationMode === 'DISTANCE'
                    ? 'bg-[#F26513] text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                À distance (Afrique)
              </button>
            </div>
          </div>
        </div>

        {/* Barre de progression des 6 étapes — Grande lisibilité */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stepsMeta.map((step) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => {
                  if (step.num < currentStep) {
                    setCurrentStep(step.num);
                    setErrorMsg('');
                  } else if (step.num === currentStep + 1) {
                    validateAndGoNext(step.num);
                  }
                }}
                className={`min-h-[56px] p-3 rounded-xl border-2 text-left transition-all ${
                  isActive
                    ? 'bg-[#F26513] border-[#F26513] text-white shadow-md'
                    : isCompleted
                      ? 'bg-white border-emerald-500 text-slate-900 cursor-pointer hover:border-emerald-600'
                      : 'bg-white border-slate-200 text-slate-400 cursor-default'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
                  <span>Étape {step.num}</span>
                  {isCompleted && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs font-bold mt-0.5 truncate">{step.title}</p>
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {/* ÉTAPE 1 : MODE DE PARTICIPATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div
                onClick={() => setParticipationMode('PRESENTIEL')}
                className={`cursor-pointer rounded-2xl bg-white overflow-hidden border-3 transition-all ${
                  participationMode === 'PRESENTIEL'
                    ? 'border-[#F26513] shadow-lg ring-2 ring-orange-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="h-56 bg-slate-100 overflow-hidden relative">
                  <img
                    src="/brand/ocd-plateau-afrique.jpg"
                    alt="Au studio OCD LIVE au Togo"
                    className="w-full h-full object-cover"
                  />
                  {participationMode === 'PRESENTIEL' && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#F26513] text-white text-xs font-black uppercase shadow">
                      Sélectionné
                    </span>
                  )}
                </div>
                <div className="p-6 space-y-2">
                  <span className="text-xs font-black uppercase text-[#F26513]">Formule Studio • Lomé</span>
                  <h2 className="text-xl font-black text-slate-950">
                    Venir au Studio à Lomé
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Vous venez physiquement avec vos articles. Vous profitez du plateau complet, de l'animatrice, des caméras professionnelles 4K et de l'habillage en direct.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setParticipationMode('DISTANCE')}
                className={`cursor-pointer rounded-2xl bg-white overflow-hidden border-3 transition-all ${
                  participationMode === 'DISTANCE'
                    ? 'border-[#F26513] shadow-lg ring-2 ring-orange-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="h-56 bg-slate-100 overflow-hidden relative">
                  <img
                    src="/brand/bovann-jeunesse.jpg"
                    alt="À distance depuis mon pays"
                    className="w-full h-full object-cover object-top"
                  />
                  {participationMode === 'DISTANCE' && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#F26513] text-white text-xs font-black uppercase shadow">
                      Sélectionné
                    </span>
                  )}
                </div>
                <div className="p-6 space-y-2">
                  <span className="text-xs font-black uppercase text-emerald-700">Formule Panafricaine</span>
                  <h2 className="text-xl font-black text-slate-950">
                    Animer depuis chez moi ou ma boutique
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Vous êtes au Cameroun, Bénin, Côte d'Ivoire, Gabon ou ailleurs. Notre régie au Togo habille votre flux vidéo et l'affiche devant des milliers d'acheteurs.
                  </p>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => validateAndGoNext(2)}
                className="min-h-[52px] px-8 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Continuer : Choisir la date</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : CALENDRIER ET CRÉNEAUX */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Calendrier */}
              <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h2 className="text-lg font-black text-slate-950">
                    {MONTH_NAMES_FR[calMonth - 1]} {calYear}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      aria-label="Mois précédent"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      aria-label="Mois suivant"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center">
                  {WEEKDAYS_SHORT_FR.map((wd) => (
                    <div key={wd} className="text-xs font-bold text-slate-400 py-1">
                      {wd}
                    </div>
                  ))}
                </div>

                {loadingCalendar ? (
                  <div className="py-14 text-center text-xs font-semibold text-slate-500 animate-pulse">
                    Vérification des disponibilités du studio...
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-2">
                    {calendarGridCells.map((cell, idx) => {
                      if (!cell) return <div key={`empty-${idx}`} className="h-11" />;
                      const dayNum = Number(cell.date.split('-')[2]);
                      const isSelected = selectedDate === cell.date;
                      const isSelectable = cell.status === 'AVAILABLE';

                      let btnStyle = 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed';
                      if (cell.status === 'AVAILABLE') {
                        btnStyle = isSelected
                          ? 'bg-[#F26513] text-white border-[#F26513] font-black shadow-md scale-105'
                          : 'bg-white hover:border-[#F26513] border-slate-200 text-slate-900 cursor-pointer font-bold';
                      } else if (cell.status === 'FULL') {
                        btnStyle = 'bg-amber-50 border-amber-200 text-amber-700 cursor-not-allowed';
                      }

                      return (
                        <button
                          key={cell.date}
                          type="button"
                          disabled={!isSelectable}
                          onClick={() => {
                            setSelectedDate(cell.date);
                            setSelectedSlot(null);
                          }}
                          className={`h-11 rounded-xl border flex items-center justify-center text-xs transition-all ${btnStyle}`}
                        >
                          <span>{dayNum}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Créneaux */}
              <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase text-[#F26513]">
                    Créneaux disponibles (GMT)
                  </span>
                  <h3 className="text-lg font-black text-slate-950 mt-0.5">
                    {selectedDate ? `Date : ${selectedDate}` : 'Cliquez sur une date disponible'}
                  </h3>
                </div>

                {selectedDayObject && selectedDayObject.slots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedDayObject.slots.map((slot) => {
                      const isChosen = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`min-h-[54px] p-3.5 rounded-xl border-2 text-left transition-all ${
                            !slot.available
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : isChosen
                                ? 'bg-[#F26513] text-white border-[#F26513] font-black shadow-md'
                                : 'bg-slate-50 hover:border-[#F26513] border-slate-200 text-slate-900 font-bold'
                          }`}
                        >
                          <div className="text-xs">{slot.label}</div>
                          <div className={`text-[10px] mt-0.5 ${isChosen ? 'text-white/90' : 'text-slate-500'}`}>
                            {slot.available ? 'Disponible' : 'Réservé'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-12 text-center font-medium">
                    Sélectionnez une date en vert ou blanc sur le calendrier.
                  </p>
                )}
              </div>

            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(3)}
                className="min-h-[52px] px-8 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Continuer : Choisir le forfait</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : FORFAITS & OPTIONS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const isSelected = Number(selectedPackageId) === Number(pkg.id);
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`cursor-pointer rounded-2xl bg-white overflow-hidden flex flex-col justify-between border-3 transition-all ${
                      isSelected
                        ? 'border-[#F26513] shadow-lg ring-2 ring-orange-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover object-top" />
                        {pkg.badge && (
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-[#F26513] text-white text-[10px] font-black uppercase">
                            {pkg.badge}
                          </span>
                        )}
                      </div>

                      <div className="p-6 space-y-2.5">
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          Durée : {pkg.duration_label}
                        </span>
                        <h3 className="text-lg font-black text-slate-950">{pkg.name}</h3>
                        <div className="text-2xl font-black text-[#F26513]">
                          {pkg.price_label}
                        </div>
                        <ul className="space-y-1.5 pt-2">
                          {(pkg.features || []).map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        type="button"
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`w-full min-h-[46px] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
                          isSelected
                            ? 'bg-[#F26513] text-white'
                            : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'Forfait choisi' : 'Sélectionner ce forfait'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Assistance pour le mode distance */}
            {participationMode === 'DISTANCE' && (
              <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
                <h3 className="text-base font-bold text-slate-950">
                  Assistance de notre animatrice au studio à Lomé
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setRemoteAssistance('OUI')}
                    className={`min-h-[54px] p-4 rounded-xl border-2 text-left transition-all ${
                      remoteAssistance === 'OUI'
                        ? 'bg-orange-50 border-[#F26513] text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">Oui, je souhaite un relais animatrice</div>
                    <div className="text-xs text-[#F26513] font-bold mt-1">
                      {selectedPackage?.remote_assistance_included
                        ? 'Inclus dans ce forfait'
                        : `+${Number(selectedPackage?.remote_assistance_fee_fcfa || 0).toLocaleString('fr-FR')} FCFA`}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemoteAssistance('NON')}
                    className={`min-h-[54px] p-4 rounded-xl border-2 text-left transition-all ${
                      remoteAssistance === 'NON'
                        ? 'bg-orange-50 border-[#F26513] text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">Non, j'anime seul</div>
                    <div className="text-xs text-slate-500 mt-1">Sans supplément</div>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(4)}
                className="min-h-[52px] px-8 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Continuer : Mes coordonnées</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : COORDONNÉES PERSONNELLES */}
        {currentStep === 4 && (
          <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-slate-200 p-6 sm:p-9 space-y-6 shadow-xs">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-2xl font-black text-slate-950">
                Vos coordonnées
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Renseignez le numéro sur lequel vous souhaitez recevoir la confirmation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Nom de famille *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_last_name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_last_name: e.target.value })}
                  placeholder="Ex. Dossou"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_first_name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_first_name: e.target.value })}
                  placeholder="Ex. Jean-Eudes"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Téléphone d'appel direct *</label>
                <input
                  type="tel"
                  required
                  value={personalInfo.client_phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_phone: e.target.value })}
                  placeholder="Ex. +228 90 00 00 00"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Numéro WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={personalInfo.client_whatsapp}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_whatsapp: e.target.value })}
                  placeholder="Ex. +228 90 00 00 00"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">Adresse e-mail *</label>
                <input
                  type="email"
                  required
                  value={personalInfo.client_email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_email: e.target.value })}
                  placeholder="contact@votre-boutique.com"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Pays de résidence *</label>
                <select
                  value={personalInfo.client_country}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_country: e.target.value })}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Ville *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_city}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_city: e.target.value })}
                  placeholder="Lomé, Cotonou, Douala..."
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">Quartier ou adresse *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_address}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_address: e.target.value })}
                  placeholder="Ex. Tokoin Wuiti"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(5)}
                className="min-h-[52px] px-8 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Continuer : Mon entreprise</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : ENTREPRISE & PRODUITS */}
        {currentStep === 5 && (
          <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200 p-6 sm:p-9 space-y-6 shadow-xs">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-2xl font-black text-slate-950">
                Votre entreprise et vos produits
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ces informations s'affichent sur le bandeau d'achat pendant votre live.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Nom de l'entreprise ou marque *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.company_name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, company_name: e.target.value })}
                  placeholder="Ex. Épicerie Délices d'Afrique"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Secteur d'activité *</label>
                <select
                  value={companyInfo.sector}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, sector: e.target.value })}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                >
                  {SECTORS_SHOWCASE.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                  <option value="Autre secteur">Autre secteur</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Nombre d'articles présentés *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.approx_products_count}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, approx_products_count: e.target.value })}
                  placeholder="Ex. 5 à 15 articles"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">WhatsApp commandes (affiché sur le live) *</label>
                <input
                  type="tel"
                  required
                  value={companyInfo.business_whatsapp}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_whatsapp: e.target.value })}
                  placeholder="+228 90 00 00 00"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">Description courte de ce que vous vendez *</label>
                <textarea
                  rows={2}
                  required
                  value={companyInfo.activity_description}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, activity_description: e.target.value })}
                  placeholder="Présentez vos produits en quelques mots..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">Articles clés présentés lors de la session *</label>
                <textarea
                  rows={2}
                  required
                  value={companyInfo.products_to_present}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, products_to_present: e.target.value })}
                  placeholder="Listez les références principales..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Téléphone boutique *</label>
                <input
                  type="tel"
                  required
                  value={companyInfo.business_phone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_phone: e.target.value })}
                  placeholder="+228 90 00 00 00"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Ville du commerce *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.business_city}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_city: e.target.value })}
                  placeholder="Lomé, Cotonou, Yaoundé..."
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">Adresse de la boutique *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.business_address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_address: e.target.value })}
                  placeholder="Boulevard du 13 Janvier, Lomé"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 font-medium text-base"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(6)}
                className="min-h-[52px] px-8 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Continuer : Récapitulatif</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 6 : RÉCAPITULATIF ET VALIDATION FINALE */}
        {currentStep === 6 && (
          <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-2xl font-black text-slate-950">
                  Récapitulatif de votre réservation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vérifiez vos informations avant de confirmer votre créneau.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Responsable</span>
                  <p className="font-bold text-slate-950">{personalInfo.client_first_name} {personalInfo.client_last_name}</p>
                  <p className="text-xs text-slate-600">{personalInfo.client_email}</p>
                  <p className="text-xs text-slate-600">{personalInfo.client_phone}</p>
                  <p className="text-xs text-slate-600">{personalInfo.client_city}, {personalInfo.client_country}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Entreprise</span>
                  <p className="font-bold text-slate-950">{companyInfo.company_name}</p>
                  <p className="text-xs text-[#F26513] font-bold">{companyInfo.sector}</p>
                  <p className="text-xs text-slate-600">WhatsApp : {companyInfo.business_whatsapp}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Modalité :</span>
                  <span className="font-bold text-slate-950">
                    {participationMode === 'PRESENTIEL' ? 'Au studio à Lomé' : 'À distance'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date & créneau :</span>
                  <span className="font-bold text-[#F26513]">{selectedDate} • {selectedSlot?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Forfait ({selectedPackage?.name}) :</span>
                  <span className="font-bold text-slate-950">{selectedPackage?.price_label}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-950">Montant total :</span>
                  <span className="text-2xl font-black text-[#F26513]">
                    {pricingSummary.isCustom
                      ? 'Sur devis'
                      : `${pricingSummary.total.toLocaleString('fr-FR')} FCFA`}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Règlement et confirmation
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sélectionnez votre méthode de règlement.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'TMONEY_FLOOZ', label: 'Mobile Money (T-Money / Flooz)' },
                    { id: 'BANK_TRANSFER', label: 'Virement bancaire' },
                    { id: 'STUDIO_CASH', label: 'Paiement en espèces au studio à Lomé' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full min-h-[48px] p-3 rounded-xl border-2 text-left text-xs font-bold transition-all ${
                        paymentMethod === m.id
                          ? 'bg-orange-50 border-[#F26513] text-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 accent-[#F26513] w-4 h-4"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed font-medium">
                    J'accepte les conditions de réservation OCD LIVE et prends note que mon créneau est validé définitivement après vérification de mon règlement par Boovan Group. *
                  </span>
                </label>
              </div>

              <div className="space-y-2.5 pt-4">
                <OcdButton
                  type="submit"
                  variant="primary"
                  size="large"
                  loading={submitting}
                  loadingText="Validation en cours..."
                  className="w-full"
                >
                  Confirmer et valider ma réservation
                </OcdButton>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Modifier les informations
                </button>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}

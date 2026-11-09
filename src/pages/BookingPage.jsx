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
  ShieldCheck
} from 'lucide-react';
import { AFRICAN_COUNTRIES, SECTORS_SHOWCASE, LIVE_OBJECTIVES_OPTIONS } from '../data/media';
import { fetchJson } from '../utils/api';

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
    { num: 2, title: 'Date et créneau' },
    { num: 3, title: 'Forfait' },
    { num: 4, title: 'Coordonnées' },
    { num: 5, title: 'Entreprise' },
    { num: 6, title: 'Validation' }
  ];

  if (confirmedReservation) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                  Dossier enregistré
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                  Confirmation de votre réservation
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Votre demande a bien été transmise à l'administration de Boovan Group.
                </p>
              </div>
              <div className="bg-orange-50 px-4 py-3 rounded-xl border border-orange-200">
                <span className="text-[11px] font-medium uppercase text-slate-500 block">
                  Référence de dossier
                </span>
                <span className="text-lg font-mono font-bold text-[#F26513]">
                  {confirmedReservation.reference}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed">
              <strong>Statut actuel : {confirmedReservation.payment_status}</strong> — Votre réservation sera validée définitivement dès vérification de votre règlement par notre équipe à Lomé.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-semibold text-xs uppercase text-slate-500">
                  Créneau et forfait
                </h3>
                <p><span className="text-slate-500">Modalité :</span> <strong className="text-slate-900">{confirmedReservation.participation_mode === 'PRESENTIEL' ? 'Présentiel au studio (Lomé)' : 'À distance'}</strong></p>
                <p><span className="text-slate-500">Date :</span> <strong className="text-slate-900">{confirmedReservation.booking_date}</strong></p>
                <p><span className="text-slate-500">Horaire (Togo GMT) :</span> <strong className="text-slate-900">{confirmedReservation.start_time.replace(':', 'h')} – {confirmedReservation.end_time.replace(':', 'h')}</strong></p>
                <p><span className="text-slate-500">Forfait :</span> <strong className="text-slate-900">{confirmedReservation.package_name}</strong></p>
                <p><span className="text-slate-500">Montant total :</span> <strong className="text-[#F26513] font-bold">{confirmedReservation.is_custom_quote ? 'Sur devis' : `${Number(confirmedReservation.total_price_fcfa).toLocaleString('fr-FR')} FCFA`}</strong></p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-semibold text-xs uppercase text-slate-500">
                  Client et entreprise
                </h3>
                <p><span className="text-slate-500">Nom complet :</span> <strong className="text-slate-900">{confirmedReservation.client_first_name} {confirmedReservation.client_last_name}</strong></p>
                <p><span className="text-slate-500">Entreprise :</span> <strong className="text-slate-900">{confirmedReservation.company_name}</strong></p>
                <p><span className="text-slate-500">Secteur :</span> <strong className="text-slate-900">{confirmedReservation.sector}</strong></p>
                <p><span className="text-slate-500">Ville et pays :</span> <strong className="text-slate-900">{confirmedReservation.client_city}, {confirmedReservation.client_country}</strong></p>
                <p><span className="text-slate-500">WhatsApp :</span> <strong className="text-slate-900">{confirmedReservation.client_whatsapp}</strong></p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Link
                to={`/suivi-reservation?ref=${confirmedReservation.reference}`}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider text-center transition-colors"
              >
                Suivre mon dossier / Joindre un reçu
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider text-center transition-colors"
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
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête sobre */}
        <div className="mb-8 space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
            Réservation officielle OCD LIVE • Fuseau horaire : Africa/Lome (GMT)
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Réserver une session de diffusion
          </h1>
          <p className="text-sm text-slate-600">
            Suivez les 6 étapes pour planifier votre passage en direct dans notre studio à Lomé ou à distance.
          </p>
        </div>

        {/* Barre de progression des 6 étapes */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
                className={`p-3 rounded-xl border text-left transition-colors ${
                  isActive
                    ? 'bg-[#F26513] border-[#F26513] text-white shadow-xs'
                    : isCompleted
                      ? 'bg-white border-slate-300 text-slate-900 cursor-pointer hover:border-slate-400'
                      : 'bg-white border-slate-200 text-slate-400 cursor-default'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold uppercase">
                  <span>Étape {step.num}</span>
                  {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-xs font-medium mt-0.5 truncate">{step.title}</p>
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
            {errorMsg}
          </div>
        )}

        {/* ÉTAPE 1 : MODE DE PARTICIPATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => setParticipationMode('PRESENTIEL')}
                className={`cursor-pointer rounded-2xl bg-white overflow-hidden border-2 transition-all ${
                  participationMode === 'PRESENTIEL'
                    ? 'border-[#F26513] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="h-56 bg-slate-100 overflow-hidden">
                  <img
                    src="/brand/ocd-plateau-afrique.jpg"
                    alt="Présentiel au studio OCD LIVE au Togo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#F26513]">Studio à Lomé</span>
                    {participationMode === 'PRESENTIEL' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F26513] text-white text-[11px] font-semibold">
                        Sélectionné
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Présentiel au studio OCD LIVE au Togo
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Venez directement dans notre studio professionnel à Lomé avec vos produits. Vous bénéficiez du plateau complet, des caméras professionnelles, de l'éclairage et de l'animatrice sur place.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setParticipationMode('DISTANCE')}
                className={`cursor-pointer rounded-2xl bg-white overflow-hidden border-2 transition-all ${
                  participationMode === 'DISTANCE'
                    ? 'border-[#F26513] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="h-56 bg-slate-100 overflow-hidden">
                  <img
                    src="/brand/bovann-jeunesse.jpg"
                    alt="À distance depuis votre pays"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#F26513]">International</span>
                    {participationMode === 'DISTANCE' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F26513] text-white text-[11px] font-semibold">
                        Sélectionné
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-950">
                    À distance depuis votre pays
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Participez depuis votre pays (Cameroun, Bénin, Côte d'Ivoire, Gabon, Sénégal ou diaspora). Notre régie gère l'habillage, l'affichage de vos coordonnées et la diffusion en simultané.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => validateAndGoNext(2)}
                className="px-6 py-3 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <span>Étape suivante : Date et créneau</span>
                <ArrowRight className="w-4 h-4" />
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
                  <h2 className="text-lg font-bold text-slate-950">
                    {MONTH_NAMES_FR[calMonth - 1]} {calYear}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {WEEKDAYS_SHORT_FR.map((wd) => (
                    <div key={wd} className="text-xs font-semibold text-slate-400 py-1">
                      {wd}
                    </div>
                  ))}
                </div>

                {loadingCalendar ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    Mise à jour des disponibilités...
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1.5">
                    {calendarGridCells.map((cell, idx) => {
                      if (!cell) return <div key={`empty-${idx}`} className="h-10" />;
                      const dayNum = Number(cell.date.split('-')[2]);
                      const isSelected = selectedDate === cell.date;
                      const isSelectable = cell.status === 'AVAILABLE';

                      let btnStyle = 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed';
                      if (cell.status === 'AVAILABLE') {
                        btnStyle = isSelected
                          ? 'bg-[#F26513] text-white border-[#F26513] font-bold shadow-xs'
                          : 'bg-white hover:border-[#F26513] border-slate-200 text-slate-800 cursor-pointer';
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
                          className={`h-10 rounded-lg border flex items-center justify-center text-xs font-medium transition-colors ${btnStyle}`}
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
                  <h3 className="text-lg font-bold text-slate-950 mt-0.5">
                    {selectedDate ? `Date : ${selectedDate}` : 'Sélectionnez une date'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Durée prévue : {selectedPackage?.duration_label || '1h30'}
                  </p>
                </div>

                {selectedDayObject && selectedDayObject.slots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedDayObject.slots.map((slot) => {
                      const isChosen = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            !slot.available
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : isChosen
                                ? 'bg-[#F26513] text-white border-[#F26513] font-bold shadow-xs'
                                : 'bg-slate-50 hover:border-[#F26513] border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="text-xs font-bold">{slot.label}</div>
                          <div className={`text-[10px] mt-0.5 ${isChosen ? 'text-white/90' : 'text-slate-500'}`}>
                            {slot.available ? 'Disponible' : 'Réservé'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-10 text-center">
                    Sélectionnez une date disponible sur le calendrier.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(3)}
                className="px-6 py-3 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <span>Étape suivante : Choix du forfait</span>
                <ArrowRight className="w-4 h-4" />
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
                    className={`cursor-pointer rounded-2xl bg-white overflow-hidden flex flex-col justify-between border-2 transition-all ${
                      isSelected
                        ? 'border-[#F26513] shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover object-top" />
                        {pkg.badge && (
                          <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#F26513] text-white text-[10px] font-bold uppercase">
                            {pkg.badge}
                          </span>
                        )}
                      </div>

                      <div className="p-6 space-y-2.5">
                        <span className="text-xs font-semibold text-slate-500">
                          Durée : {pkg.duration_label}
                        </span>
                        <h3 className="text-lg font-bold text-slate-950">{pkg.name}</h3>
                        <p className="text-2xl font-bold text-[#F26513]">
                          {pkg.price_label}
                        </p>
                        <ul className="space-y-1.5 pt-2">
                          {(pkg.features || []).map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                              <Check className="w-4 h-4 text-[#F26513] shrink-0 mt-0.5" />
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
                        className={`w-full py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider transition-colors ${
                          isSelected
                            ? 'bg-[#F26513] text-white'
                            : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'Forfait sélectionné' : 'Choisir ce forfait'}
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
                <p className="text-xs sm:text-sm text-slate-600">
                  Une animatrice présente au studio de Lomé peut vous relayer, répondre aux commentaires et valoriser vos produits pendant la session.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setRemoteAssistance('OUI')}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      remoteAssistance === 'OUI'
                        ? 'bg-orange-50 border-[#F26513] text-slate-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">Oui, je souhaite un relais animatrice</div>
                    <div className="text-xs text-[#F26513] font-semibold mt-1">
                      {selectedPackage?.remote_assistance_included
                        ? 'Inclus dans ce forfait'
                        : `+${Number(selectedPackage?.remote_assistance_fee_fcfa || 0).toLocaleString('fr-FR')} FCFA`}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemoteAssistance('NON')}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      remoteAssistance === 'NON'
                        ? 'bg-orange-50 border-[#F26513] text-slate-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">Non, j'anime seul de manière autonome</div>
                    <div className="text-xs text-slate-400 mt-1">Sans supplément</div>
                  </button>
                </div>
              </div>
            )}

            {/* Options supplémentaires */}
            {addons.length > 0 && (
              <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
                <h3 className="text-base font-bold text-slate-950">
                  Options complémentaires (facultatif)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {addons.map((addon) => {
                    const checked = selectedAddonCodes.includes(addon.code);
                    return (
                      <div
                        key={addon.code}
                        onClick={() =>
                          setSelectedAddonCodes((prev) =>
                            prev.includes(addon.code)
                              ? prev.filter((c) => c !== addon.code)
                              : [...prev, addon.code]
                          )
                        }
                        className={`cursor-pointer p-4 rounded-xl border transition-colors ${
                          checked
                            ? 'bg-orange-50 border-[#F26513]'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-xs text-slate-900">{addon.name}</span>
                          <input type="checkbox" checked={checked} onChange={() => {}} className="accent-[#F26513]" />
                        </div>
                        <p className="text-xs font-bold text-[#F26513] mt-2">
                          +{Number(addon.price_fcfa).toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(4)}
                className="px-6 py-3 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <span>Étape suivante : Coordonnées</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : COORDONNÉES PERSONNELLES */}
        {currentStep === 4 && (
          <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                Informations du responsable
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ces informations permettront à notre équipe de vous contacter pour la coordination technique.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_last_name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_last_name: e.target.value })}
                  placeholder="Ex. Dossou"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_first_name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_first_name: e.target.value })}
                  placeholder="Ex. Jean-Eudes"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Téléphone d'appel *</label>
                <input
                  type="tel"
                  required
                  value={personalInfo.client_phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_phone: e.target.value })}
                  placeholder="Ex. +228 90 00 00 00"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Numéro WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={personalInfo.client_whatsapp}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_whatsapp: e.target.value })}
                  placeholder="Ex. +228 90 00 00 00"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Adresse e-mail *</label>
                <input
                  type="email"
                  required
                  value={personalInfo.client_email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_email: e.target.value })}
                  placeholder="Ex. contact@votre-entreprise.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Pays de résidence *</label>
                <select
                  value={personalInfo.client_country}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ville *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_city}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_city: e.target.value })}
                  placeholder="Ex. Lomé, Cotonou, Douala..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Adresse ou quartier *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_address}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_address: e.target.value })}
                  placeholder="Ex. Tokoin Wuiti, Immeuble Boovan"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(5)}
                className="px-6 py-3 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <span>Étape suivante : Entreprise</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : ENTREPRISE & PRODUITS */}
        {currentStep === 5 && (
          <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                Informations sur l'entreprise et les produits
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ces détails seront utilisés pour préparer l'affichage régie et le bandeau d'achat pendant votre live.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nom légal ou raison sociale *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.company_name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, company_name: e.target.value })}
                  placeholder="Ex. Épicerie Délices d'Afrique SARL"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nom commercial ou marque</label>
                <input
                  type="text"
                  value={companyInfo.trade_name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, trade_name: e.target.value })}
                  placeholder="Ex. Délices d'Afrique"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Secteur d'activité *</label>
                <select
                  value={companyInfo.sector}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, sector: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                >
                  {SECTORS_SHOWCASE.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                  <option value="Autre secteur">Autre secteur</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nombre approximatif d'articles *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.approx_products_count}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, approx_products_count: e.target.value })}
                  placeholder="Ex. 5 à 15 articles"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Description sommaire de l'activité *</label>
                <textarea
                  rows={2}
                  required
                  value={companyInfo.activity_description}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, activity_description: e.target.value })}
                  placeholder="Présentez brièvement vos produits et votre positionnement..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Produits ou services présentés pendant la session *</label>
                <textarea
                  rows={2}
                  required
                  value={companyInfo.products_to_present}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, products_to_present: e.target.value })}
                  placeholder="Listez les références principales présentées..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Téléphone commercial (affiché sur le live) *</label>
                <input
                  type="tel"
                  required
                  value={companyInfo.business_phone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_phone: e.target.value })}
                  placeholder="Ex. +228 90 00 00 00"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">WhatsApp commandes *</label>
                <input
                  type="tel"
                  required
                  value={companyInfo.business_whatsapp}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_whatsapp: e.target.value })}
                  placeholder="Ex. +228 90 00 00 00"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Pays du siège commercial *</label>
                <select
                  value={companyInfo.business_country}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ville du commerce *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.business_city}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_city: e.target.value })}
                  placeholder="Ex. Lomé, Cotonou, Yaoundé..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Adresse physique de l'établissement *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.business_address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_address: e.target.value })}
                  placeholder="Ex. Boulevard du 13 Janvier, Lomé"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Compte TikTok (si disponible)</label>
                <input
                  type="text"
                  value={companyInfo.social_tiktok}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, social_tiktok: e.target.value })}
                  placeholder="@votrecompte"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Page Facebook (si disponible)</label>
                <input
                  type="text"
                  value={companyInfo.social_facebook}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, social_facebook: e.target.value })}
                  placeholder="facebook.com/votrepage"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#F26513] outline-none text-slate-900 text-sm"
                />
              </div>
            </div>

            {/* Objectifs du live */}
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <label className="block text-xs font-medium text-slate-700">Objectif prioritaire de votre session</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LIVE_OBJECTIVES_OPTIONS.map((obj) => {
                  const active = companyInfo.live_objectives.includes(obj);
                  return (
                    <button
                      key={obj}
                      type="button"
                      onClick={() =>
                        setCompanyInfo((prev) => ({
                          ...prev,
                          live_objectives: prev.live_objectives.includes(obj)
                            ? prev.live_objectives.filter((o) => o !== obj)
                            : [...prev.live_objectives, obj]
                        }))
                      }
                      className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                        active
                          ? 'bg-orange-50 border-[#F26513] text-slate-950 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {obj}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fichiers logo / photos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-200">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-medium text-slate-700 block">Logo de marque</span>
                <label className="cursor-pointer flex items-center justify-center gap-2 p-2.5 border border-dashed border-slate-300 hover:border-[#F26513] rounded-lg text-xs text-slate-600 bg-white">
                  <Upload className="w-4 h-4 text-[#F26513]" />
                  <span className="truncate">{uploadingField === 'logo' ? 'Téléversement...' : companyInfo.company_logo_url ? 'Logo joint' : 'Sélectionner'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0], 'logo')} />
                </label>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-medium text-slate-700 block">
                  Photos produits ({companyInfo.product_photos.length})
                </span>
                <label className="cursor-pointer flex items-center justify-center gap-2 p-2.5 border border-dashed border-slate-300 hover:border-[#F26513] rounded-lg text-xs text-slate-600 bg-white">
                  <Upload className="w-4 h-4 text-[#F26513]" />
                  <span className="truncate">{uploadingField === 'product_photo' ? 'Téléversement...' : 'Ajouter une photo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0], 'product_photo')} />
                </label>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-medium text-slate-700 block">Vidéo courte (facultatif)</span>
                <label className="cursor-pointer flex items-center justify-center gap-2 p-2.5 border border-dashed border-slate-300 hover:border-[#F26513] rounded-lg text-xs text-slate-600 bg-white">
                  <Upload className="w-4 h-4 text-[#F26513]" />
                  <span className="truncate">{uploadingField === 'video' ? 'Téléversement...' : companyInfo.presentation_video_url ? 'Vidéo jointe' : 'Sélectionner'}</span>
                  <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0], 'video')} />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(6)}
                className="px-6 py-3 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <span>Étape suivante : Récapitulatif</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 6 : RÉCAPITULATIF ET CONFIRMATION */}
        {currentStep === 6 && (
          <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                  Récapitulatif de votre demande
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Vérifiez l'ensemble des informations avant de soumettre votre réservation.
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
                  <p className="text-xs text-[#F26513] font-semibold">{companyInfo.sector}</p>
                  <p className="text-xs text-slate-600">Articles : {companyInfo.approx_products_count}</p>
                  <p className="text-xs text-slate-600">WhatsApp : {companyInfo.business_whatsapp}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Modalité :</span>
                  <span className="font-semibold text-slate-950">
                    {participationMode === 'PRESENTIEL' ? 'Présentiel au studio (Lomé)' : 'À distance'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date et horaire (GMT) :</span>
                  <span className="font-semibold text-[#F26513]">{selectedDate} • {selectedSlot?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Forfait ({selectedPackage?.name}) :</span>
                  <span className="font-semibold text-slate-950">{selectedPackage?.price_label}</span>
                </div>
                {participationMode === 'DISTANCE' && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Relais animatrice Lomé :</span>
                    <span className="font-semibold text-slate-950">{remoteAssistance}</span>
                  </div>
                )}
                {pricingSummary.selectedAddonsList.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Options retenues :</span>
                    {pricingSummary.selectedAddonsList.map((a) => (
                      <div key={a.code} className="flex justify-between text-xs text-slate-600">
                        <span>{a.name}</span>
                        <span>+{Number(a.price_fcfa).toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-950">Montant total estimé :</span>
                  <span className="text-2xl font-bold text-[#F26513]">
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
                  <h3 className="text-lg font-bold text-slate-950">
                    Règlement et confirmation
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choisissez votre méthode de paiement pour finaliser la réservation.
                  </p>
                </div>

                {settings.payment_manual_instructions && (
                  <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {settings.payment_manual_instructions}
                  </p>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Méthode de règlement *</label>
                  {[
                    { id: 'TMONEY_FLOOZ', label: 'Mobile Money (T-Money / Flooz)' },
                    { id: 'BANK_TRANSFER', label: 'Virement bancaire' },
                    { id: 'STUDIO_CASH', label: 'Paiement en espèces au studio à Lomé' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-colors ${
                        paymentMethod === m.id
                          ? 'bg-orange-50 border-[#F26513] text-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Référence de transaction (si déjà effectuée)
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Ex. Référence Mobile Money ou Virement"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-[#F26513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Reçu de paiement (facultatif à cette étape)
                  </label>
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-2.5 border border-dashed border-slate-300 hover:border-[#F26513] rounded-lg text-xs text-slate-600 bg-slate-50">
                    <Upload className="w-4 h-4 text-[#F26513]" />
                    <span className="truncate">
                      {uploadingField === 'payment_proof'
                        ? 'Téléversement...'
                        : paymentProofUrl
                          ? 'Reçu joint'
                          : 'Joindre une capture (JPG, PNG, PDF)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'payment_proof')}
                    />
                  </label>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 accent-[#F26513]"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    J'accepte les conditions de réservation OCD LIVE et prends note que mon créneau est validé définitivement après vérification de mon règlement par Boovan Group. *
                  </span>
                </label>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Enregistrement en cours...' : 'Confirmer ma réservation'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  Modifier les informations de l'entreprise
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

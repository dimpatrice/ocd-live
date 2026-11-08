import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from '../router';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Check,
  ArrowRight
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
      setErrorMsg(err.message);
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
        setErrorMsg('Veuillez remplir tous les champs obligatoires de vos informations personnelles.');
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
      setErrorMsg('Veuillez accepter les conditions générales de réservation avant de confirmer.');
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
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const stepsMeta = [
    { num: 1, title: 'Mode de participation' },
    { num: 2, title: 'Date et horaire' },
    { num: 3, title: 'Choix du forfait' },
    { num: 4, title: 'Informations personnelles' },
    { num: 5, title: 'Informations sur l\'entreprise' },
    { num: 6, title: 'Récapitulatif et confirmation' }
  ];

  if (confirmedReservation) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-white border-2 border-[#F26513] p-8 sm:p-10 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                  Réservation enregistrée
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">
                  Confirmation de votre demande OCD LIVE
                </h1>
              </div>
              <div className="bg-orange-50 px-4 py-3 rounded-xl border border-orange-200">
                <span className="text-[11px] font-semibold uppercase text-zinc-500 block">
                  N° de réservation
                </span>
                <span className="font-display text-lg font-extrabold text-[#F26513]">
                  {confirmedReservation.reference}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
              <strong>Statut du paiement : {confirmedReservation.payment_status}</strong> — Votre réservation sera marquée comme définitivement payée et confirmée après vérification effective de votre règlement par l'administration de Boovan Group.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <h3 className="font-display font-bold text-xs uppercase text-zinc-500">
                  Créneau & Forfait
                </h3>
                <p><strong>Mode :</strong> {confirmedReservation.participation_mode === 'PRESENTIEL' ? 'Présentiel (Studio Togo)' : 'À distance'}</p>
                <p><strong>Date :</strong> {confirmedReservation.booking_date}</p>
                <p><strong>Heure (Togo) :</strong> {confirmedReservation.start_time.replace(':', 'h')} – {confirmedReservation.end_time.replace(':', 'h')}</p>
                <p><strong>Forfait :</strong> {confirmedReservation.package_name}</p>
                <p><strong>Montant :</strong> <span className="font-bold text-[#F26513]">{confirmedReservation.is_custom_quote ? 'Sur devis' : `${Number(confirmedReservation.total_price_fcfa).toLocaleString('fr-FR')} FCFA`}</span></p>
              </div>

              <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <h3 className="font-display font-bold text-xs uppercase text-zinc-500">
                  Client & Entreprise
                </h3>
                <p><strong>Client :</strong> {confirmedReservation.client_first_name} {confirmedReservation.client_last_name}</p>
                <p><strong>Entreprise :</strong> {confirmedReservation.company_name}</p>
                <p><strong>Secteur :</strong> {confirmedReservation.sector}</p>
                <p><strong>Ville / Pays :</strong> {confirmedReservation.client_city}, {confirmedReservation.client_country}</p>
                <p><strong>WhatsApp :</strong> {confirmedReservation.client_whatsapp}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Link
                to={`/suivi-reservation?ref=${confirmedReservation.reference}`}
                className="px-6 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider"
              >
                Suivre ma réservation / Joindre un reçu
              </Link>
              <Link
                to="/"
                className="px-6 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-display font-bold text-xs uppercase tracking-wider"
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
    <div className="min-h-screen bg-zinc-50 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête sobre */}
        <div className="mb-8 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
            Réservation OCD LIVE • Fuseau horaire : Africa/Lome (GMT)
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-950">
            Réserver un créneau de livestream
          </h1>
        </div>

        {/* Barre de progression des 6 étapes */}
        <div className="mb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
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
                    ? 'bg-[#F26513] border-[#F26513] text-white'
                    : isCompleted
                      ? 'bg-white border-emerald-500 text-zinc-900 cursor-pointer'
                      : 'bg-white border-zinc-200 text-zinc-400 cursor-default'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold uppercase">
                  <span>Étape {step.num}</span>
                  {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-xs font-semibold mt-1 truncate">{step.title}</p>
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        {/* ÉTAPE 1 : MODE DE PARTICIPATION */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                onClick={() => setParticipationMode('PRESENTIEL')}
                className={`cursor-pointer rounded-2xl bg-white overflow-hidden border-2 transition-all ${
                  participationMode === 'PRESENTIEL'
                    ? 'border-[#F26513] shadow-md'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="h-60 bg-zinc-100 overflow-hidden">
                  <img
                    src="/brand/ocd-plateau-afrique.jpg"
                    alt="Présentiel au studio OCD LIVE au Togo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#F26513]">Option A • Togo</span>
                    {participationMode === 'PRESENTIEL' && (
                      <span className="px-2.5 py-0.5 rounded bg-[#F26513] text-white text-xs font-bold">
                        Sélectionné
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-xl font-extrabold text-zinc-950">
                    Présentiel au studio OCD LIVE au Togo
                  </h2>
                  <p className="text-sm text-zinc-600">
                    Venez directement dans notre studio à Lomé et présentez vos produits devant notre dispositif de production.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setParticipationMode('DISTANCE')}
                className={`cursor-pointer rounded-2xl bg-white overflow-hidden border-2 transition-all ${
                  participationMode === 'DISTANCE'
                    ? 'border-[#F26513] shadow-md'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="h-60 bg-zinc-100 overflow-hidden">
                  <img
                    src="/brand/bovann-jeunesse.jpg"
                    alt="À distance depuis votre pays ou votre entreprise"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-[#F26513]">Option B • International</span>
                    {participationMode === 'DISTANCE' && (
                      <span className="px-2.5 py-0.5 rounded bg-[#F26513] text-white text-xs font-bold">
                        Sélectionné
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-xl font-extrabold text-zinc-950">
                    À distance depuis votre pays ou votre entreprise
                  </h2>
                  <p className="text-sm text-zinc-600">
                    Participez à votre live depuis le Cameroun, le Gabon, la Côte d'Ivoire, le Sénégal ou ailleurs dans le monde.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => validateAndGoNext(2)}
                className="px-7 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Suivant : Date et horaire</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : CALENDRIER ET DISPONIBILITÉS */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 rounded-2xl bg-white border border-zinc-200 p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                  <h2 className="font-display text-xl font-extrabold text-zinc-950">
                    {MONTH_NAMES_FR[calMonth - 1]} {calYear}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center">
                  {WEEKDAYS_SHORT_FR.map((wd) => (
                    <div key={wd} className="text-xs font-bold text-zinc-400 py-1">
                      {wd}
                    </div>
                  ))}
                </div>

                {loadingCalendar ? (
                  <div className="py-12 text-center text-sm text-zinc-500">
                    Chargement du calendrier...
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-2">
                    {calendarGridCells.map((cell, idx) => {
                      if (!cell) return <div key={`empty-${idx}`} className="h-12" />;
                      const dayNum = Number(cell.date.split('-')[2]);
                      const isSelected = selectedDate === cell.date;
                      const isSelectable = cell.status === 'AVAILABLE';

                      let btnStyle = 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed';
                      if (cell.status === 'AVAILABLE') {
                        btnStyle = isSelected
                          ? 'bg-[#F26513] text-white border-[#F26513] font-bold shadow-sm'
                          : 'bg-white hover:border-[#F26513] border-zinc-200 text-zinc-900 cursor-pointer';
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
                          className={`h-12 rounded-xl border flex flex-col items-center justify-center text-sm transition-colors ${btnStyle}`}
                        >
                          <span>{dayNum}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 rounded-2xl bg-white border border-zinc-200 p-6 sm:p-8 space-y-5">
                <div className="pb-4 border-b border-zinc-200">
                  <span className="text-xs font-bold uppercase text-[#F26513]">
                    Créneaux horaires (Africa/Lome)
                  </span>
                  <h3 className="font-display text-lg font-extrabold text-zinc-950 mt-0.5">
                    {selectedDate ? `Date : ${selectedDate}` : 'Sélectionnez une date'}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Forfait actuel : {selectedPackage?.name} ({selectedPackage?.duration_label})
                  </p>
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
                          className={`p-3.5 rounded-xl border text-left transition-colors ${
                            !slot.available
                              ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed'
                              : isChosen
                                ? 'bg-[#F26513] text-white border-[#F26513] font-bold'
                                : 'bg-zinc-50 hover:border-[#F26513] border-zinc-200 text-zinc-900'
                          }`}
                        >
                          <div className="text-sm font-bold">{slot.label}</div>
                          <div className={`text-[11px] mt-0.5 ${isChosen ? 'text-white/90' : 'text-zinc-500'}`}>
                            {slot.available ? 'Disponible' : 'Déjà réservé'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 py-8 text-center">
                    Aucun créneau disponible à cette date.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-3 rounded-xl bg-white border border-zinc-300 text-zinc-700 font-display font-bold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(3)}
                className="px-7 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Suivant : Choix du forfait</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : LES 6 FORFAITS & ACCOMPAGNEMENT À DISTANCE */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const isSelected = Number(selectedPackageId) === Number(pkg.id);
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`cursor-pointer rounded-2xl bg-white overflow-hidden flex flex-col justify-between border-2 transition-all ${
                      isSelected
                        ? 'border-[#F26513] shadow-md'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="relative h-44 bg-zinc-100 overflow-hidden">
                        <img src={pkg.image_url} alt={pkg.name} className="w-full h-full object-cover object-top" />
                        {pkg.badge && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#F26513] text-white text-[10px] font-bold uppercase">
                            {pkg.badge}
                          </span>
                        )}
                      </div>

                      <div className="p-6 space-y-3">
                        <span className="text-xs font-semibold text-zinc-500">
                          Durée : {pkg.duration_label}
                        </span>
                        <h3 className="font-display text-lg font-extrabold text-zinc-950">{pkg.name}</h3>
                        <p className="font-display text-2xl font-extrabold text-[#F26513]">
                          {pkg.price_label}
                        </p>
                        <ul className="space-y-1.5 pt-2">
                          {(pkg.features || []).map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-zinc-700">
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
                        className={`w-full py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider ${
                          isSelected
                            ? 'bg-[#F26513] text-white'
                            : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                        }`}
                      >
                        {isSelected ? 'Forfait sélectionné' : 'Choisir ce forfait'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {participationMode === 'DISTANCE' && (
              <div className="rounded-2xl bg-white border border-zinc-200 p-6 sm:p-8 space-y-4">
                <h3 className="font-display text-lg font-extrabold text-zinc-950">
                  Souhaitez-vous bénéficier de l'assistance de notre équipe au Togo ?
                </h3>
                <p className="text-sm text-zinc-600">
                  Une assistante présente au studio de Lomé peut vous accompagner et intervenir pendant la réalisation de votre live.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRemoteAssistance('OUI')}
                    className={`p-4 rounded-xl border text-left ${
                      remoteAssistance === 'OUI'
                        ? 'bg-orange-50 border-[#F26513] text-zinc-950 font-bold'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <div className="text-sm">Oui, je souhaite être accompagné</div>
                    <div className="text-xs text-[#F26513] mt-1">
                      {selectedPackage?.remote_assistance_included
                        ? 'Inclus dans ce forfait'
                        : `+${Number(selectedPackage?.remote_assistance_fee_fcfa || 0).toLocaleString('fr-FR')} FCFA`}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemoteAssistance('NON')}
                    className={`p-4 rounded-xl border text-left ${
                      remoteAssistance === 'NON'
                        ? 'bg-orange-50 border-[#F26513] text-zinc-950 font-bold'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <div className="text-sm">Non, je souhaite intervenir de manière autonome</div>
                  </button>
                </div>
              </div>
            )}

            {addons.length > 0 && (
              <div className="rounded-2xl bg-white border border-zinc-200 p-6 sm:p-8 space-y-4">
                <h3 className="font-display text-lg font-extrabold text-zinc-950">
                  Options supplémentaires (Facultatif)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        className={`cursor-pointer p-4 rounded-xl border ${
                          checked
                            ? 'bg-orange-50 border-[#F26513]'
                            : 'bg-zinc-50 border-zinc-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-zinc-900">{addon.name}</span>
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

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3 rounded-xl bg-white border border-zinc-300 text-zinc-700 font-display font-bold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(4)}
                className="px-7 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Suivant : Informations personnelles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : INFORMATIONS PERSONNELLES */}
        {currentStep === 4 && (
          <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-zinc-200 p-7 sm:p-9 space-y-6">
            <h2 className="font-display text-2xl font-extrabold text-zinc-950 pb-3 border-b border-zinc-200">
              Informations personnelles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_last_name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_last_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_first_name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_first_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={personalInfo.client_phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={personalInfo.client_whatsapp}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_whatsapp: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Adresse e-mail *</label>
                <input
                  type="email"
                  required
                  value={personalInfo.client_email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Pays *</label>
                <select
                  value={personalInfo.client_country}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_country: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Ville *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_city}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Adresse ou localisation *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.client_address}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, client_address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-3 rounded-xl bg-white border border-zinc-300 text-zinc-700 font-display font-bold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(5)}
                className="px-7 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Suivant : Votre entreprise</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : INFORMATIONS SUR L'ENTREPRISE */}
        {currentStep === 5 && (
          <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-zinc-200 p-7 sm:p-9 space-y-6">
            <h2 className="font-display text-2xl font-extrabold text-zinc-950 pb-3 border-b border-zinc-200">
              Informations sur l'entreprise
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Nom de l'entreprise ou du commerce *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.company_name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, company_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Nom commercial</label>
                <input
                  type="text"
                  value={companyInfo.trade_name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, trade_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Secteur d'activité *</label>
                <select
                  value={companyInfo.sector}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, sector: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                >
                  {SECTORS_SHOWCASE.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                  <option value="Autre secteur">Autre secteur</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Nombre approximatif de produits *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.approx_products_count}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, approx_products_count: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Description détaillée de l'activité *</label>
                <textarea
                  rows={3}
                  required
                  value={companyInfo.activity_description}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, activity_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Produits ou services à présenter *</label>
                <textarea
                  rows={3}
                  required
                  value={companyInfo.products_to_present}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, products_to_present: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Prix des produits (si applicable)</label>
                <input
                  type="text"
                  value={companyInfo.products_price_range}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, products_price_range: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Site Internet (si disponible)</label>
                <input
                  type="url"
                  value={companyInfo.website_url}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, website_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Téléphone commercial *</label>
                <input
                  type="tel"
                  required
                  value={companyInfo.business_phone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">WhatsApp commercial *</label>
                <input
                  type="tel"
                  required
                  value={companyInfo.business_whatsapp}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_whatsapp: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Pays de l'entreprise *</label>
                <select
                  value={companyInfo.business_country}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_country: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Ville de l'entreprise *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.business_city}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Adresse physique *</label>
                <input
                  type="text"
                  required
                  value={companyInfo.business_address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, business_address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Facebook</label>
                <input
                  type="text"
                  value={companyInfo.social_facebook}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, social_facebook: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Instagram</label>
                <input
                  type="text"
                  value={companyInfo.social_instagram}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, social_instagram: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">TikTok</label>
                <input
                  type="text"
                  value={companyInfo.social_tiktok}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, social_tiktok: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Autres réseaux</label>
                <input
                  type="text"
                  value={companyInfo.social_other}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, social_other: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                />
              </div>
            </div>

            {/* Objectifs du live */}
            <div className="space-y-2 pt-3 border-t border-zinc-200">
              <label className="block text-xs font-semibold text-zinc-700">Objectifs du live</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                      className={`p-3 rounded-xl border text-left text-xs font-medium ${
                        active
                          ? 'bg-orange-50 border-[#F26513] text-zinc-950 font-semibold'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                      }`}
                    >
                      {obj}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fichiers : Logo, Photos, Vidéo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-zinc-200">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <span className="text-xs font-semibold text-zinc-700 block">Logo de l'entreprise</span>
                <label className="cursor-pointer flex items-center justify-center gap-2 p-3 border border-dashed border-zinc-300 hover:border-[#F26513] rounded-lg text-xs text-zinc-600 bg-white">
                  <Upload className="w-4 h-4 text-[#F26513]" />
                  <span>{uploadingField === 'logo' ? 'Téléversement...' : companyInfo.company_logo_url ? 'Logo joint' : 'Choisir un fichier'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0], 'logo')} />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <span className="text-xs font-semibold text-zinc-700 block">
                  Photos des produits ({companyInfo.product_photos.length})
                </span>
                <label className="cursor-pointer flex items-center justify-center gap-2 p-3 border border-dashed border-zinc-300 hover:border-[#F26513] rounded-lg text-xs text-zinc-600 bg-white">
                  <Upload className="w-4 h-4 text-[#F26513]" />
                  <span>{uploadingField === 'product_photo' ? 'Téléversement...' : 'Ajouter une photo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0], 'product_photo')} />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <span className="text-xs font-semibold text-zinc-700 block">Vidéo facultative</span>
                <label className="cursor-pointer flex items-center justify-center gap-2 p-3 border border-dashed border-zinc-300 hover:border-[#F26513] rounded-lg text-xs text-zinc-600 bg-white">
                  <Upload className="w-4 h-4 text-[#F26513]" />
                  <span>{uploadingField === 'video' ? 'Téléversement...' : companyInfo.presentation_video_url ? 'Vidéo jointe' : 'Joindre une vidéo'}</span>
                  <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0], 'video')} />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-3 rounded-xl bg-white border border-zinc-300 text-zinc-700 font-display font-bold text-xs uppercase tracking-wider"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => validateAndGoNext(6)}
                className="px-7 py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Suivant : Récapitulatif</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 6 : RÉCAPITULATIF ET CONFIRMATION */}
        {currentStep === 6 && (
          <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-2xl bg-white border border-zinc-200 p-7 sm:p-9 space-y-6">
              <h2 className="font-display text-2xl font-extrabold text-zinc-950 pb-3 border-b border-zinc-200">
                Récapitulatif de votre réservation
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <span className="text-xs font-bold uppercase text-zinc-400">Client</span>
                  <p className="font-bold text-zinc-950">{personalInfo.client_first_name} {personalInfo.client_last_name}</p>
                  <p className="text-xs text-zinc-600">{personalInfo.client_email}</p>
                  <p className="text-xs text-zinc-600">{personalInfo.client_phone} / WhatsApp : {personalInfo.client_whatsapp}</p>
                  <p className="text-xs text-zinc-600">{personalInfo.client_city}, {personalInfo.client_country}</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <span className="text-xs font-bold uppercase text-zinc-400">Entreprise</span>
                  <p className="font-bold text-zinc-950">{companyInfo.company_name}</p>
                  <p className="text-xs text-[#F26513] font-semibold">{companyInfo.sector}</p>
                  <p className="text-xs text-zinc-600">Produits : {companyInfo.approx_products_count}</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Mode de participation :</span>
                  <span className="font-bold text-zinc-950">
                    {participationMode === 'PRESENTIEL' ? 'Présentiel au Studio (Togo)' : 'À distance'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Date & Horaire (Africa/Lome) :</span>
                  <span className="font-bold text-[#F26513]">{selectedDate} • {selectedSlot?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Forfait ({selectedPackage?.name}) :</span>
                  <span className="font-bold text-zinc-950">{selectedPackage?.price_label}</span>
                </div>
                {participationMode === 'DISTANCE' && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Assistance équipe Togo :</span>
                    <span className="font-bold text-zinc-950">{remoteAssistance}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                  <span className="font-display font-bold text-base text-zinc-950">TOTAL :</span>
                  <span className="font-display text-2xl font-extrabold text-[#F26513]">
                    {pricingSummary.isCustom
                      ? 'Sur devis'
                      : `${pricingSummary.total.toLocaleString('fr-FR')} FCFA`}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-white border border-zinc-200 p-7 sm:p-9 space-y-5 flex flex-col justify-between">
              <div className="space-y-5">
                <h3 className="font-display text-xl font-extrabold text-zinc-950">
                  Règlement & Confirmation
                </h3>

                <p className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
                  {settings.payment_manual_instructions}
                </p>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-700">Mode de règlement *</label>
                  {[
                    { id: 'TMONEY_FLOOZ', label: 'Mobile Money (T-Money / Flooz)' },
                    { id: 'BANK_TRANSFER', label: 'Virement Bancaire' },
                    { id: 'STUDIO_CASH', label: 'Paiement au Studio à Lomé' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-bold ${
                        paymentMethod === m.id
                          ? 'bg-orange-50 border-[#F26513] text-zinc-950'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Référence de transaction (Facultatif)
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 text-xs outline-none focus:border-[#F26513]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Preuve de paiement (Facultatif)
                  </label>
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-3 border border-dashed border-zinc-300 hover:border-[#F26513] rounded-xl text-xs text-zinc-600 bg-zinc-50">
                    <Upload className="w-4 h-4 text-[#F26513]" />
                    <span>
                      {uploadingField === 'payment_proof'
                        ? 'Téléversement...'
                        : paymentProofUrl
                          ? 'Reçu joint'
                          : 'Joindre un reçu (JPG, PNG, PDF)'}
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
                    className="mt-1 accent-[#F26513]"
                  />
                  <span className="text-xs text-zinc-700">
                    J'accepte les conditions générales de réservation OCD LIVE et je prends acte que ma réservation sera confirmée après vérification du paiement par Boovan Group. *
                  </span>
                </label>
              </div>

              <div className="space-y-2.5 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  {submitting ? 'Enregistrement...' : 'Confirmer ma réservation'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="w-full py-2.5 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-semibold"
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

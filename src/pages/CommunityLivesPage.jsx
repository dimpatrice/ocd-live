import React, { useState, useEffect } from 'react';
import { fetchJson } from '../utils/api';
import { 
  Radio, 
  ExternalLink, 
  Phone, 
  Clock, 
  Send, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  ShoppingBag,
  Flame,
  Globe2,
  Check
} from 'lucide-react';

const AFRICAN_COUNTRIES = [
  { code: 'Bénin', label: 'Bénin', flag: '🇧🇯' },
  { code: 'Cameroun', label: 'Cameroun', flag: '🇨🇲' },
  { code: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'Togo', label: 'Togo', flag: '🇹🇬' },
  { code: 'Sénégal', label: 'Sénégal', flag: '🇸🇳' },
  { code: 'Gabon', label: 'Gabon', flag: '🇬🇦' },
  { code: 'Mali', label: 'Mali', flag: '🇲🇱' },
  { code: 'Burkina Faso', label: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'RD Congo', label: 'RD Congo', flag: '🇨🇩' },
  { code: 'Guinée', label: 'Guinée', flag: '🇬🇳' }
];

const CATEGORIES = [
  { id: 'Nourriture & Restauration', label: '🍲 Nourriture & Restauration' },
  { id: 'Mode & Habits', label: '👗 Mode & Habits' },
  { id: 'Beauté & Cosmétique', label: '💄 Beauté & Cosmétique' },
  { id: 'Électronique & High-Tech', label: '📱 High-Tech & Accessoires' },
  { id: 'Maison & Décoration', label: '🏠 Maison & Déco' },
  { id: 'Agroalimentaire & Épices', label: '🌶️ Produits du Terroir' }
];

export default function CommunityLivesPage() {
  const [lives, setLives] = useState([]);
  const [slotStatus, setSlotStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSlot, setSelectedSlot] = useState('ALL');

  // État du modal d'inscription
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    seller_name: '',
    business_name: '',
    country: 'Cameroun',
    category: 'Nourriture & Restauration',
    live_url: '',
    whatsapp: '',
    phone: '',
    time_slot: 'MATIN',
    description: ''
  });

  const loadLives = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCountry !== 'ALL') params.append('country', selectedCountry);
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (selectedSlot !== 'ALL') params.append('slot', selectedSlot);

      const data = await fetchJson(`/api/public/community-lives?${params.toString()}`);
      if (data && data.lives) {
        setLives(data.lives);
        setSlotStatus(data.slotStatus);
      }
    } catch (err) {
      console.error('Erreur chargement des lives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLives();
  }, [selectedCountry, selectedCategory, selectedSlot]);

  const handleTrackClick = async (liveId, url) => {
    try {
      fetchJson(`/api/public/community-lives/${liveId}/click`, { method: 'POST' }).catch(() => {});
    } catch (_) {}
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitLive = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      const res = await fetchJson('/api/public/community-lives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitSuccess(res.message || 'Votre direct a été soumis !');
      setFormData({
        seller_name: '',
        business_name: '',
        country: 'Cameroun',
        category: 'Nourriture & Restauration',
        live_url: '',
        whatsapp: '',
        phone: '',
        time_slot: 'MATIN',
        description: ''
      });
      loadLives();
    } catch (err) {
      setSubmitError(err.message || 'Une erreur est survenue lors de la soumission.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCountryFlag = (countryName) => {
    const found = AFRICAN_COUNTRIES.find((c) => c.code.toLowerCase() === (countryName || '').toLowerCase());
    return found ? found.flag : '🌍';
  };

  return (
    <div className="bg-white min-h-screen text-zinc-900 pb-20">
      {/* =====================================================================
          1. HERO BANNER — INSPIRÉ DIRECTEMENT DE BOVANN
      ===================================================================== */}
      <section className="bg-zinc-950 text-white border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F26513_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F26513]/20 border border-[#F26513]/40 text-[#F26513] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#F26513] animate-ping" />
                <span>Nouveau • Le TikTok Shop Africain</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-white leading-tight">
                LIVES DEPUIS CHEZ VOUS : <br />
                <span className="text-[#F26513]">TOUTE L'AFRIQUE VOUS REGARDE.</span>
              </h1>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Vous vendez de la nourriture, des vêtements ou des cosmétiques depuis votre maison ou boutique au <strong>Bénin</strong>, au <strong>Cameroun</strong>, en <strong>Côte d'Ivoire</strong> ou au <strong>Togo</strong> ? 
                Lancez votre direct sur TikTok, Facebook ou Instagram, transmettez votre lien : notre équipe vérifie votre vente et vous propulse en tête sur OCD LIVE !
              </p>

              {/* Créneaux Officiels & Badge en direct */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <Clock className="w-4 h-4 text-[#F26513]" />
                  <div className="text-xs">
                    <span className="text-zinc-400 block">Deux créneaux de diffusion / jour :</span>
                    <strong className="text-white">08h00 - 11h00 GMT &nbsp;|&nbsp; 18h00 - 21h00 GMT</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <div className="text-xs">
                    <span className="text-zinc-400 block">Abonnement vendeur :</span>
                    <strong className="text-emerald-400">5 000 FCFA / mois (soit ~166 FCFA/jour)</strong>
                  </div>
                </div>
              </div>

              {/* Statut du créneau en temps réel */}
              {slotStatus && (
                <div className="pt-2">
                  {slotStatus.isLiveNow ? (
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>CRÉNEAU EN COURS ({slotStatus.activeSlot?.label}) — Les équipes de Boovan Group valident vos directs en direct !</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{slotStatus.nextSlot?.label} (Actuellement {slotStatus.currentTimeLome}) — Vous pouvez soumettre votre lien dès maintenant !</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Carte CTA Vendeur */}
            <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between shadow-2xl">
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26513] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Espace Vendeurs & Mamans
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  Vous êtes en direct en ce moment ?
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Ne restez pas avec 1 ou 2 spectateurs. Rejoignez OCD LIVE et touchez des centaines d'acheteurs de votre pays et de la diaspora.
                </p>
                <div className="space-y-1.5 pt-1 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lien direct vers votre TikTok / Facebook</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bouton WhatsApp direct pour commander</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Validation humaine par Boovan Group</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccess(null);
                    setModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Diffuser mon live ici (5 000 F)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FILTRES RAPIDES PAR PAYS & PAR CATÉGORIE
      ===================================================================== */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Ligne 1 : Filtre par Pays */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Globe2 className="w-3.5 h-3.5" /> Pays :
            </span>
            <button
              type="button"
              onClick={() => setSelectedCountry('ALL')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                selectedCountry === 'ALL'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              🌍 Toute l'Afrique
            </button>
            {AFRICAN_COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setSelectedCountry(c.code)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                  selectedCountry === c.code
                    ? 'bg-[#F26513] text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Ligne 2 : Filtre par Catégorie & Créneau */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
              Rayon :
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Tous les rayons
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}

            <div className="h-4 w-px bg-zinc-300 mx-2 shrink-0" />

            {/* Filtre Créneau */}
            <button
              type="button"
              onClick={() => setSelectedSlot(selectedSlot === 'MATIN' ? 'ALL' : 'MATIN')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                selectedSlot === 'MATIN' ? 'bg-amber-500 text-white' : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              ☀️ Créneau Matin (08h-11h)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSlot(selectedSlot === 'SOIR' ? 'ALL' : 'SOIR')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                selectedSlot === 'SOIR' ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              🌙 Créneau Soir (18h-21h)
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. GRILLE DES LIVES ACTIFS
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-600 animate-pulse" />
              <span>Directs Vendeurs en cours</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-mono font-bold">
                {lives.length} en direct
              </span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Cliquez pour rejoindre le stream ou écrivez directement sur WhatsApp au vendeur.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSubmitSuccess(null);
              setModalOpen(true);
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Diffuser mon live</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#F26513] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-zinc-500 font-medium">Recherche des lives dans votre pays...</p>
          </div>
        ) : lives.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-zinc-200 p-12 text-center max-w-xl mx-auto space-y-4">
            <Radio className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="font-display font-bold text-lg text-zinc-800">
              Aucun direct actif dans cette sélection pour l'instant
            </h3>
            <p className="text-sm text-zinc-500">
              Soyez le premier à lancer votre direct dans ce pays ou cette catégorie et profitez de toute l'audience OCD LIVE !
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitSuccess(null);
                setModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#F26513] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Lancer mon live maintenant</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lives.map((live) => {
              const waClean = (live.whatsapp || '').replace(/[^0-9]/g, '');
              const waMsg = encodeURIComponent(
                `Bonjour ${live.seller_name}, j'ai vu votre live sur OCD Live (${live.business_name || ''}) et je souhaite voir vos articles et commander !`
              );
              const waLink = `https://wa.me/${waClean}?text=${waMsg}`;

              return (
                <div
                  key={live.id}
                  className="rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    {/* Header carte : Pays + Badge Live + Plateforme */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCountryFlag(live.country)}</span>
                        <span className="font-bold text-xs text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md">
                          {live.country}
                        </span>
                        <span className="text-[11px] font-semibold text-zinc-500">
                          {live.time_slot === 'MATIN' ? '☀️ Matin' : '🌙 Soir'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                        <span>EN DIRECT</span>
                      </div>
                    </div>

                    {/* Vendeur & Boutique */}
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-zinc-950 leading-snug">
                        {live.business_name || live.seller_name}
                      </h3>
                      <p className="text-xs text-zinc-500 font-medium">
                        Par <strong className="text-zinc-700">{live.seller_name}</strong> • {live.category}
                      </p>
                    </div>

                    {/* Description courte */}
                    {live.description && (
                      <p className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl line-clamp-3 leading-relaxed">
                        "{live.description}"
                      </p>
                    )}

                    {/* Badge Plateforme */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 font-mono">
                        Plateforme : <strong>{live.platform}</strong>
                      </span>
                      <span>👁️ {live.view_count || 0} clics</span>
                    </div>
                  </div>

                  {/* Boutons d'action : DIRECTS ET SANS DÉTOUR */}
                  <div className="p-4 bg-zinc-50 border-t border-zinc-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleTrackClick(live.id, live.live_url)}
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-transform active:scale-95"
                    >
                      <Radio className="w-4 h-4 animate-pulse" />
                      <span>Rejoindre le direct</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${live.phone || live.whatsapp}`}
                        className="py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Appeler</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =====================================================================
          4. MODAL D'INSCRIPTION ULTRA-SIMPLE ("Moins de textes, beaucoup d'actions")
      ===================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26513]">
                  Direct Panafricain
                </span>
                <h3 className="font-display font-extrabold text-xl text-zinc-950">
                  Diffuser mon Live sur OCD LIVE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-2xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="font-display font-bold text-xl text-zinc-900">
                  Votre live a bien été envoyé !
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed max-w-md mx-auto">
                  {submitSuccess} Nos modérateurs à Lomé (Boovan Group) vérifient votre direct. Dès validation, votre stream s'affiche pour toute l'Afrique.
                </p>
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 text-left space-y-1.5">
                  <p><strong>Abonnement : 5 000 FCFA / mois</strong></p>
                  <p>Pour activer votre forfait illimité 30 jours, réglez par T-Money, Flooz (+228 90 00 00 00) ou Wave / Orange Money.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-[#F26513] text-white font-bold text-xs uppercase tracking-wider"
                >
                  Fermer et voir les directs
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitLive} className="pt-4 space-y-4">
                {submitError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* 1. Nom & Nom de boutique */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Votre Nom / Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Maman Christine"
                      value={formData.seller_name}
                      onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-[#F26513] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Nom de votre commerce
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Christine Épices d'Abomey"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-[#F26513] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* 2. Pays & Catégorie */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Votre Pays en Afrique *
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-[#F26513] focus:outline-none text-sm bg-white"
                    >
                      {AFRICAN_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Ce que vous vendez *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-[#F26513] focus:outline-none text-sm bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Lien du direct */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Lien de votre Direct en cours (TikTok, Facebook, Insta...) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.tiktok.com/@votrecompte/live"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-[#F26513] focus:outline-none text-sm"
                  />
                  <span className="text-[11px] text-zinc-500">
                    Ouvrez votre direct sur votre téléphone, cliquez sur Partager &gt; Copier le lien et collez-le ici.
                  </span>
                </div>

                {/* 4. WhatsApp & Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Numéro WhatsApp (commandes) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+229 97 00 00 00"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-[#F26513] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Créneau souhaité *
                    </label>
                    <select
                      value={formData.time_slot}
                      onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-[#F26513] focus:outline-none text-sm bg-white"
                    >
                      <option value="MATIN">☀️ Matin (08h00 - 11h00 GMT)</option>
                      <option value="SOIR">🌙 Soir (18h00 - 21h00 GMT)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Description brève */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Que présentez-vous aujourd'hui ? (Court)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ex: Direct piment pur d'Abomey et crevettes séchées, réduction spéciale aujourd'hui !"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:border-[#F26513] focus:outline-none text-sm"
                  />
                </div>

                {/* Encadré explicatif abonnement 5 000 FCFA */}
                <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-[#F26513]">
                    <Sparkles className="w-4 h-4" /> Formule 5 000 FCFA / mois (~166 F / jour)
                  </div>
                  <p className="text-zinc-700 leading-relaxed">
                    Accès à nos 2 créneaux quotidiens de validation par l'équipe Boovan Group pour propulser vos directs devant toute l'Afrique.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Envoi en cours...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Envoyer mon live pour validation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

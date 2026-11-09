import React, { useState, useEffect } from 'react';
import { fetchJson } from '../utils/api';
import { 
  Radio, 
  ExternalLink, 
  Phone, 
  Clock, 
  Send, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag, 
  Globe2, 
  Check,
  Filter,
  X
} from 'lucide-react';

const AFRICAN_COUNTRIES = [
  { code: 'Bénin', label: 'Bénin' },
  { code: 'Cameroun', label: 'Cameroun' },
  { code: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire' },
  { code: 'Togo', label: 'Togo' },
  { code: 'Sénégal', label: 'Sénégal' },
  { code: 'Gabon', label: 'Gabon' },
  { code: 'Mali', label: 'Mali' },
  { code: 'Burkina Faso', label: 'Burkina Faso' },
  { code: 'RD Congo', label: 'RD Congo' },
  { code: 'Guinée', label: 'Guinée' }
];

const CATEGORIES = [
  { id: 'Nourriture & Restauration', label: 'Nourriture & Restauration' },
  { id: 'Mode & Habits', label: 'Mode & Habillement' },
  { id: 'Beauté & Cosmétique', label: 'Beauté & Cosmétique' },
  { id: 'Électronique & High-Tech', label: 'Électronique & High-Tech' },
  { id: 'Maison & Décoration', label: 'Maison & Décoration' },
  { id: 'Agroalimentaire & Épices', label: 'Terroir & Agroalimentaire' }
];

export default function CommunityLivesPage() {
  const [lives, setLives] = useState([]);
  const [slotStatus, setSlotStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSlot, setSelectedSlot] = useState('ALL');

  // Modal d'inscription
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
      console.error('Erreur chargement des directs:', err);
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
      setSubmitSuccess(res.message || 'Votre direct a été soumis avec succès.');
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
      setSubmitError(err.message || 'Une erreur est survenue lors de la transmission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      
      {/* =====================================================================
          1. EN-TÊTE SOBRE & DIRECT
      ===================================================================== */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                <Radio className="w-3.5 h-3.5 text-[#F26513]" />
                <span>Réseau de Vente en Direct Panafricain</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
                Directs Commerciaux Panafricains
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Retrouvez les entrepreneurs et commerçants actuellement en direct depuis leur boutique ou atelier au Bénin, Cameroun, Côte d'Ivoire, Togo et partout en Afrique. Rejoignez leur stream ou commandez directement sur WhatsApp.
              </p>

              {/* Créneaux et statut officiel */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>2 créneaux de modération : 08h00 - 11h00 GMT & 18h00 - 21h00 GMT</span>
                </div>

                {slotStatus && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium ${
                    slotStatus.isLiveNow
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${slotStatus.isLiveNow ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                    <span>
                      {slotStatus.isLiveNow
                        ? `Créneau ouvert en ce moment (${slotStatus.activeSlot?.label})`
                        : `Prochain créneau : ${slotStatus.nextSlot?.startsAt || 'Bientôt'} (Actuellement ${slotStatus.currentTimeLome})`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bouton pour les vendeurs */}
            <div className="shrink-0 bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3 max-w-sm">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Vous vendez en direct aujourd'hui ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Diffusez votre lien sur OCD LIVE pour 5 000 FCFA / mois (~166 FCFA / jour).
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(null);
                  setModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Soumettre mon direct</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FILTRES CLAIRS PAR PAYS & PAR RAYON
      ===================================================================== */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
          
          {/* Ligne 1 : Filtre Pays */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Pays :</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedCountry('ALL')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors ${
                selectedCountry === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tous les pays
            </button>
            {AFRICAN_COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setSelectedCountry(c.code)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors ${
                  selectedCountry === c.code
                    ? 'bg-[#F26513] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Ligne 2 : Filtre Rayon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Rayon :</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tous les rayons
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-300 mx-2 shrink-0" />

            <button
              type="button"
              onClick={() => setSelectedSlot(selectedSlot === 'MATIN' ? 'ALL' : 'MATIN')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors ${
                selectedSlot === 'MATIN' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Matin (08h-11h)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSlot(selectedSlot === 'SOIR' ? 'ALL' : 'SOIR')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium shrink-0 transition-colors ${
                selectedSlot === 'SOIR' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Soir (18h-21h)
            </button>
          </div>

        </div>
      </section>

      {/* =====================================================================
          3. GRILLE DES DIRECTS
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <span>Directs confirmés</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-medium">
                {lives.length} en cours
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Consultez le stream officiel du vendeur ou contactez-le directement par messagerie.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#F26513] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-medium">Chargement des directs...</p>
          </div>
        ) : lives.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-3">
            <Radio className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-semibold text-base text-slate-800">
              Aucun direct actif dans cette sélection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Vous vendez dans cette catégorie ou dans ce pays ? Soyez le premier à soumettre votre flux de vente.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitSuccess(null);
                setModalOpen(true);
              }}
              className="mt-2 px-4 py-2 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-medium text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Soumettre mon direct</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lives.map((live) => {
              const waClean = (live.whatsapp || '').replace(/[^0-9]/g, '');
              const waMsg = encodeURIComponent(
                `Bonjour ${live.seller_name}, j'ai vu votre direct sur OCD Live (${live.business_name || ''}) et je souhaite voir vos articles et commander.`
              );
              const waLink = `https://wa.me/${waClean}?text=${waMsg}`;

              return (
                <div
                  key={live.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3.5">
                    
                    {/* Header : Pays + Statut Live + Créneau */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {live.country}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {live.time_slot === 'MATIN' ? 'Créneau Matin' : 'Créneau Soir'}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>En direct</span>
                      </span>
                    </div>

                    {/* Vendeur & Commerce */}
                    <div>
                      <h3 className="font-semibold text-base text-slate-950 leading-snug">
                        {live.business_name || live.seller_name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Vendeur : {live.seller_name} • <span className="text-slate-700">{live.category}</span>
                      </p>
                    </div>

                    {/* Description */}
                    {live.description && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg leading-relaxed border border-slate-100">
                        "{live.description}"
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Canal : {live.platform}</span>
                      <span>{live.view_count || 0} consultations</span>
                    </div>
                  </div>

                  {/* Boutons d'action rapides */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleTrackClick(live.id, live.live_url)}
                      className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <span>Rejoindre le direct ({live.platform})</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Commander (WhatsApp)</span>
                      </a>
                      <a
                        href={`tel:${live.phone || live.whatsapp}`}
                        className="py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
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
          4. MODAL DE SOUMISSION ÉPURÉ & ACCESSIBLE
      ===================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-slate-200 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F26513]">
                  Vente en direct
                </span>
                <h3 className="font-semibold text-lg text-slate-950">
                  Diffuser mon direct sur OCD LIVE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg text-slate-900">
                  Lien de direct enregistré
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {submitSuccess} Nos modérateurs à Lomé (Boovan Group) vérifient la conformité de votre stream durant le créneau actif.
                </p>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 text-left space-y-1">
                  <p className="font-semibold">Tarif d'abonnement : 5 000 FCFA / mois</p>
                  <p className="text-slate-500">Pour activer votre accès illimité 30 jours, effectuez votre règlement par T-Money, Flooz (+228 90 00 00 00) ou Wave / Orange Money.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-xs"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitLive} className="pt-4 space-y-3.5 text-xs">
                {submitError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Votre nom et prénom *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Christine Lawson"
                      value={formData.seller_name}
                      onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Nom de votre commerce
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Épices Bio d'Abomey"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Pays d'origine *
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] focus:outline-none bg-white"
                    >
                      {AFRICAN_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Rayon de produits *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] focus:outline-none bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Lien direct de votre stream en cours *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.tiktok.com/@votrecompte/live"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] focus:outline-none font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Copiez le lien de partage depuis l'application TikTok, Facebook ou Instagram.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Numéro WhatsApp (commandes) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+228 90 00 00 00"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Créneau de passage *
                    </label>
                    <select
                      value={formData.time_slot}
                      onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] focus:outline-none bg-white"
                    >
                      <option value="MATIN">Matin (08h00 - 11h00 GMT)</option>
                      <option value="SOIR">Soir (18h00 - 21h00 GMT)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Description brève de la vente
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ex: Vente spéciale piment pur d'Abomey et crevettes séchées en direct."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-lg bg-orange-50/70 border border-orange-200 text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900">
                    Formule de diffusion : 5 000 FCFA / mois
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Validation continue par la direction de Boovan Group pour relayer vos passages devant l'audience panafricaine.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Transmission en cours...' : 'Transmettre mon direct pour validation'}
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

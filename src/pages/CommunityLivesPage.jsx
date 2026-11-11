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
  Filter,
  X,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { OcdButton, OcdSkeletonCard } from '../components/OcdLoader';

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
      setSubmitSuccess(res.message || 'Votre direct a été transmis à l\'équipe avec succès.');
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

  // Bloquer le scroll d'arrière-plan et gérer la touche Échap quand le modal est ouvert
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setModalOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [modalOpen]);

  return (
    <div className="bg-transparent min-h-screen text-slate-900 pb-20">
      
      {/* =====================================================================
          1. EN-TÊTE CHALEUREUX, VIVANT & DIRECT
      ===================================================================== */}
      <section className="bg-gradient-to-b from-orange-50/60 via-amber-50/30 to-white/60 border-b border-orange-200/70 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-2 max-w-2xl">

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                Directs de vente en Afrique
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Regardez les commerçants qui vendent en direct dans votre pays. Vous vendez vous-même ? Diffusez votre lien de stream ici pour toucher de nouveaux clients.
              </p>

              {/* Statut du créneau */}
              {slotStatus && (
                <div className="pt-1">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                    slotStatus.isLiveNow
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${slotStatus.isLiveNow ? 'bg-emerald-600 animate-ping' : 'bg-amber-500'}`} />
                    <span>
                      {slotStatus.isLiveNow
                        ? `Créneau ouvert en ce moment (${slotStatus.activeSlot?.label})`
                        : `Prochain créneau : ${slotStatus.nextSlot?.startsAt || '08h00 GMT'} (Lomé ${slotStatus.currentTimeLome})`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bouton d'action proéminent pour commerçants */}
            <div className="shrink-0 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 space-y-3 max-w-sm">
              <div>
                <strong className="block text-base font-extrabold text-slate-950">
                  Vous êtes en direct chez vous ?
                </strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Abonnement : <strong>5 000 FCFA / mois</strong> (166 FCFA / jour)
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(null);
                  setModalOpen(true);
                }}
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Envoyer mon lien de direct</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FILTRES PAYS & CATÉGORIES — GRANDES TOUCHES TACTILES (ACCESSIBILITÉ)
      ===================================================================== */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
          
          {/* Ligne 1 : Filtre Pays */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Pays :</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedCountry('ALL')}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedCountry === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
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
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                  selectedCountry === c.code
                    ? 'bg-[#F26513] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Ligne 2 : Filtre Rayon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Rayon :</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
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
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />

            <button
              type="button"
              onClick={() => setSelectedSlot(selectedSlot === 'MATIN' ? 'ALL' : 'MATIN')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedSlot === 'MATIN' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Matin (08h-11h)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSlot(selectedSlot === 'SOIR' ? 'ALL' : 'SOIR')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedSlot === 'SOIR' ? 'bg-indigo-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Soir (18h-21h)
            </button>
          </div>

        </div>
      </section>

      {/* =====================================================================
          3. GRILLE DES DIRECTS — ACTIONS DIRECTES À FORTE TAILLE
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <OcdSkeletonCard />
            <OcdSkeletonCard />
            <OcdSkeletonCard />
          </div>
        ) : lives.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center max-w-lg mx-auto space-y-4">
            <Radio className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-lg text-slate-900">
              Aucun direct actif dans cette sélection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Vous êtes actuellement en direct sur TikTok ou Facebook ? Transmettez votre lien en 30 secondes pour être visible ici.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitSuccess(null);
                setModalOpen(true);
              }}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Diffuser mon direct</span>
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
                  className="rounded-2xl border-2 border-slate-200 hover:border-[#F26513] bg-white shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 space-y-3.5">
                    
                    {/* Header : Pays + Statut Live */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-xs text-white bg-slate-900 px-3 py-1 rounded-lg">
                        {live.country}
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        <span>EN DIRECT</span>
                      </span>
                    </div>

                    {/* Vendeur & Commerce */}
                    <div>
                      <h3 className="font-extrabold text-xl text-slate-950 leading-snug">
                        {live.business_name || live.seller_name}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        {live.seller_name} • <span className="text-[#F26513]">{live.category}</span>
                      </p>
                    </div>

                    {/* Description */}
                    {live.description && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl leading-relaxed border border-slate-200 italic">
                        "{live.description}"
                      </p>
                    )}

                    <div className="text-[11px] text-slate-400 font-medium">
                      Diffusé via : <strong className="text-slate-700">{live.platform}</strong>
                    </div>
                  </div>

                  {/* Boutons d'action rapides — Grands et confortables */}
                  <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => handleTrackClick(live.id, live.live_url)}
                      className="w-full min-h-[48px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span>Rejoindre le direct ({live.platform})</span>
                      <ExternalLink className="w-4 h-4 text-slate-300" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Commander</span>
                      </a>
                      <a
                        href={`tel:${live.phone || live.whatsapp}`}
                        className="min-h-[44px] rounded-xl bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <Phone className="w-4 h-4 text-slate-500" />
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
          4. MODAL DE SOUMISSION DU DIRECT (ERGONOMIQUE, ACCESSIBLE, CENTRÉ)
      ===================================================================== */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/75 backdrop-blur-sm transition-all"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
            <div 
              className="relative w-full max-w-2xl text-left bg-white rounded-3xl shadow-2xl border-2 border-orange-200 overflow-hidden my-6 transform transition-all animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* En-tête du modal */}
              <div className="p-6 sm:p-7 border-b border-slate-200 bg-gradient-to-r from-orange-50/80 via-amber-50/40 to-white flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-[#F26513] text-xs font-black uppercase">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Abonnement 5 000 FCFA / mois (166 F / jour)</span>
                  </span>
                  <h3 className="font-black text-2xl sm:text-3xl text-slate-950 tracking-tight">
                    Diffuser mon direct sur OCD LIVE
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    Envoyez votre lien de live (TikTok, Facebook...). Notre équipe de régie à Lomé vérifie votre flux et l'affiche sur le site.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
                  aria-label="Fermer la boîte de dialogue"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Contenu du modal */}
              <div className="p-6 sm:p-7 max-h-[calc(85vh-130px)] overflow-y-auto space-y-5">
                
                {submitSuccess ? (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h4 className="font-black text-2xl text-slate-950">
                      Lien de direct enregistré !
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed max-w-md mx-auto font-medium">
                      {submitSuccess} Notre équipe de régie à Lomé vérifie votre flux pour l'afficher en tête des directs au Cameroun, Bénin, Togo ou dans votre pays.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="min-h-[48px] px-8 py-3 rounded-xl bg-slate-950 hover:bg-[#F26513] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                      >
                        Fermer et retourner aux directs
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitLive} className="space-y-4">
                    
                    {/* Rappel du fonctionnement */}
                    <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs text-slate-800 space-y-1">
                      <strong className="font-bold text-slate-900 block">
                        Créneaux de validation en régie :
                      </strong>
                      <p className="text-slate-700">
                        Matin (08h00 - 11h00 GMT) & Soir (18h00 - 21h00 GMT). Les acheteurs de votre pays peuvent vous regarder et commander sur votre WhatsApp.
                      </p>
                    </div>

                    {submitError && (
                      <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-900 text-sm mb-1.5">
                          Votre nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex. Christine Lawson"
                          value={formData.seller_name}
                          onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none text-slate-950 text-base sm:text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-900 text-sm mb-1.5">
                          Nom de votre commerce / marque
                        </label>
                        <input
                          type="text"
                          placeholder="Ex. Mode & Pagnes d'Abidjan"
                          value={formData.business_name}
                          onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none text-slate-950 text-base sm:text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-900 text-sm mb-1.5">
                          Pays d'où vous vendez *
                        </label>
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none bg-white text-slate-950 text-base sm:text-sm font-medium"
                        >
                          {AFRICAN_COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-900 text-sm mb-1.5">
                          Rayon / Catégorie de produits *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none bg-white text-slate-950 text-base sm:text-sm font-medium"
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
                      <label className="block font-bold text-slate-900 text-sm mb-1.5">
                        Lien direct de votre stream (TikTok, Facebook, Instagram...) *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://www.tiktok.com/@votrecompte/live"
                        value={formData.live_url}
                        onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                        className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none font-mono text-slate-950 text-base sm:text-sm font-medium"
                      />
                      <span className="text-xs text-slate-500 mt-1 block">
                        Sur votre application (TikTok/Facebook), cliquez sur « Partager » puis « Copier le lien » et collez-le ici.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-900 text-sm mb-1.5">
                          Numéro WhatsApp commercial *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+228 90 00 00 00"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none font-mono text-slate-950 text-base sm:text-sm font-medium"
                        />
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          Les clients cliqueront pour commander directement sur votre WhatsApp.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-900 text-sm mb-1.5">
                          Créneau de passage souhaité *
                        </label>
                        <select
                          value={formData.time_slot}
                          onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none bg-white text-slate-950 text-base sm:text-sm font-medium"
                        >
                          <option value="MATIN">Matinée (08h00 - 11h00 GMT)</option>
                          <option value="SOIR">Soirée (18h00 - 21h00 GMT)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-900 text-sm mb-1.5">
                        Description courte de vos produits
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ex. Robes en lin, pagnes wax de fête et sandales artisanales en cuir..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none text-slate-950 text-base sm:text-sm font-medium"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <OcdButton
                        type="submit"
                        variant="primary"
                        size="large"
                        loading={submitting}
                        loadingText="Transmission à l'équipe..."
                        className="flex-1 min-h-[52px] text-sm font-black"
                      >
                        Envoyer mon direct à l'équipe
                      </OcdButton>
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="px-6 py-3 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider"
                      >
                        Annuler
                      </button>
                    </div>

                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

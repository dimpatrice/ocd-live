import React, { useState, useEffect, useMemo } from 'react';
import { fetchJson } from '../utils/api';
import { 
  Radio, 
  ExternalLink, 
  Phone, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Globe2, 
  Filter, 
  X, 
  MessageCircle, 
  Search,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { OcdButton, OcdSkeletonCard } from '../components/OcdLoader';

const AFRICAN_COUNTRIES = [
  { code: 'Bénin', label: 'Bénin', flag: 'BJ' },
  { code: 'Cameroun', label: 'Cameroun', flag: 'CM' },
  { code: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire', flag: 'CI' },
  { code: 'Togo', label: 'Togo', flag: 'TG' },
  { code: 'Sénégal', label: 'Sénégal', flag: 'SN' },
  { code: 'Gabon', label: 'Gabon', flag: 'GA' },
  { code: 'Mali', label: 'Mali', flag: 'ML' },
  { code: 'Burkina Faso', label: 'Burkina Faso', flag: 'BF' },
  { code: 'RD Congo', label: 'RD Congo', flag: 'CD' },
  { code: 'Guinée', label: 'Guinée', flag: 'GN' }
];

const CATEGORIES = [
  { id: 'Nourriture & Restauration', label: 'Alimentation & Restauration' },
  { id: 'Mode & Habits', label: 'Mode, Vêtements & Tissus' },
  { id: 'Beauté & Cosmétique', label: 'Beauté, Soins & Parfumerie' },
  { id: 'Électronique & High-Tech', label: 'Électronique & Téléphonie' },
  { id: 'Maison & Décoration', label: 'Maison, Meubles & Déco' },
  { id: 'Agroalimentaire & Épices', label: 'Terroir & Produits locaux' }
];

export default function CommunityLivesPage() {
  const [lives, setLives] = useState([]);
  const [slotStatus, setSlotStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSlot, setSelectedSlot] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal d'inscription commerçant
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

  // Filtrage local par recherche textuelle (vendeur ou produit)
  const filteredLives = useMemo(() => {
    if (!searchQuery.trim()) return lives;
    const q = searchQuery.toLowerCase().trim();
    return lives.filter((item) => {
      const bName = (item.business_name || '').toLowerCase();
      const sName = (item.seller_name || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      return bName.includes(q) || sName.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [lives, searchQuery]);

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

  return (
    <div className="bg-transparent min-h-screen text-slate-900 pb-20">
      
      {/* =====================================================================
          1. EN-TÊTE ÉDITORIAL & CADRE DE VALIDATION BOOVAN GROUP
      ===================================================================== */}
      <section className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
                <span className="h-px w-5 bg-[#F26513] inline-block" />
                <span>RÉSEAU PANAFRICAIN • COMMERCE EN DIRECT</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950">
                Directs Commerçants d'Afrique
              </h1>

              <p className="text-base text-slate-700 leading-relaxed font-medium">
                Accédez aux flux en direct des vendeurs vérifiés dans votre pays. Les spectateurs découvrent les articles en vidéo et commandent en 1 clic sur WhatsApp.
              </p>

              {/* État officiel du créneau régie */}
              {slotStatus && (
                <div className="pt-2 flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-950 text-white border border-slate-800">
                    <span className={`w-2 h-2 rounded-xs ${slotStatus.isLiveNow ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="font-semibold uppercase tracking-wide">
                      {slotStatus.isLiveNow ? 'RÉGIE ACTIVE' : 'HORS CRÉNEAU'}
                    </span>
                  </div>
                  <span className="text-slate-600 font-medium">
                    {slotStatus.isLiveNow
                      ? `Validation en cours : ${slotStatus.activeSlot?.label}`
                      : `Prochain créneau : ${slotStatus.nextSlot?.startsAt || '08h00 GMT'} (Lomé ${slotStatus.currentTimeLome})`}
                  </span>
                </div>
              )}
            </div>

            {/* Fiche d'inscription commerçant sobre et prestigieuse */}
            <div className="shrink-0 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 max-w-md w-full lg:w-auto">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#F26513] block">
                  Abonnement Vendeur
                </span>
                <strong className="block text-xl font-black text-slate-950 mt-0.5">
                  5 000 FCFA / mois
                </strong>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Diffusez vos directs quotidiens devant notre audience sur les créneaux 08h-11h et 18h-21h.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(null);
                  setModalOpen(true);
                }}
                className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Soumettre mon direct</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          2. CONSOLE DE SÉLECTION ÉPURÉE (REMPLACE LES BOUTONS VULGAIRES)
      ===================================================================== */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          
          {/* Ligne A : Sélecteur de Territoires (Pays) */}
          <div className="flex items-center justify-between gap-4">
            
            {/* Version Desktop : Onglets épurés à soulignement architectural */}
            <div className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
              <button
                type="button"
                onClick={() => setSelectedCountry('ALL')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCountry === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                Tous les pays
              </button>

              {AFRICAN_COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCountry(c.code)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    selectedCountry === c.code
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-70">{c.flag}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            {/* Version Mobile : Menu déroulant propre et confortable */}
            <div className="md:hidden flex-1">
              <div className="relative">
                <Globe2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full min-h-[48px] pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold appearance-none outline-none focus:border-[#F26513]"
                >
                  <option value="ALL">Tous les pays d'Afrique</option>
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Compteur discret des flux actifs */}
            <div className="shrink-0 text-xs font-mono font-semibold text-slate-500 hidden sm:block">
              {filteredLives.length} {filteredLives.length > 1 ? 'directs disponibles' : 'direct disponible'}
            </div>
          </div>

          {/* Ligne B : Filtres secondaires compacts (Catégorie, Créneau, Recherche) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 border-t border-slate-100">
            
            {/* Rayon / Catégorie */}
            <div className="sm:col-span-5 relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full min-h-[42px] pl-10 pr-10 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-semibold appearance-none outline-none focus:border-[#F26513]"
              >
                <option value="ALL">Tous les rayons de vente</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Créneau horaire */}
            <div className="sm:col-span-3 relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full min-h-[42px] pl-10 pr-10 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-semibold appearance-none outline-none focus:border-[#F26513]"
              >
                <option value="ALL">Tous les créneaux</option>
                <option value="MATIN">Matin (08h00 - 11h00)</option>
                <option value="SOIR">Soir (18h00 - 21h00)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Barre de recherche rapide */}
            <div className="sm:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher vendeur ou article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[42px] pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium outline-none focus:border-[#F26513]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Effacer
                </button>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================================
          3. GRILLE DES DIRECTS — CARTES BROADCATER PRO (SANS CLICHÉ IA)
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <OcdSkeletonCard />
            <OcdSkeletonCard />
            <OcdSkeletonCard />
          </div>
        ) : filteredLives.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-950">
              Aucun direct actif dans cette sélection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Vous êtes actuellement en direct sur TikTok ou Facebook ? Enregistrez votre stream pour apparaître immédiatement devant les acheteurs de votre pays.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(null);
                  setModalOpen(true);
                }}
                className="min-h-[48px] px-6 py-2.5 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Diffuser mon direct</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLives.map((live) => {
              const waClean = (live.whatsapp || '').replace(/[^0-9]/g, '');
              const waMsg = encodeURIComponent(
                `Bonjour ${live.seller_name}, j'ai vu votre direct sur OCD Live (${live.business_name || ''}) et je souhaite voir vos articles et commander.`
              );
              const waLink = `https://wa.me/${waClean}?text=${waMsg}`;

              return (
                <div
                  key={live.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-[#F26513] hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    
                    {/* Header carte : Pays en tag sobre + Témoin direct broadcast */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                        {live.country}
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>DIRECT</span>
                      </span>
                    </div>

                    {/* Vendeur & Commerce */}
                    <div>
                      <h3 className="font-extrabold text-xl text-slate-950 leading-snug">
                        {live.business_name || live.seller_name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Responsable : <strong className="text-slate-800">{live.seller_name}</strong>
                      </p>
                      <div className="mt-2 inline-block px-2.5 py-0.5 rounded bg-orange-50 border border-orange-200 text-[#F26513] text-xs font-semibold">
                        {live.category}
                      </div>
                    </div>

                    {/* Description vendeur */}
                    {live.description && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed border border-slate-200">
                        {live.description}
                      </p>
                    )}

                    <div className="text-[11px] font-mono text-slate-400">
                      Canal : <strong className="text-slate-700 uppercase">{live.platform}</strong>
                    </div>
                  </div>

                  {/* Boutons d'action : Grands et sans fioriture */}
                  <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => handleTrackClick(live.id, live.live_url)}
                      className="w-full min-h-[48px] rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Rejoindre le direct ({live.platform})</span>
                      <ExternalLink className="w-4 h-4 text-slate-300" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${live.phone || live.whatsapp}`}
                        className="min-h-[44px] rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
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
          4. MODAL DE SOUMISSION SIMPLE & GUIDÉ
      ===================================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F26513]">
                  Abonnement 5 000 FCFA / mois
                </span>
                <h3 className="font-extrabold text-xl text-slate-950 mt-0.5">
                  Diffuser mon direct sur OCD LIVE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-lg"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-xl text-slate-950">
                  Lien de direct enregistré !
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {submitSuccess} Notre équipe à Lomé vérifie votre stream pendant le créneau en cours pour l'afficher sur le site.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitLive} className="space-y-4 pt-3 text-xs">
                {submitError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Votre Nom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex. Koffi Mensah"
                    value={formData.seller_name}
                    onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:border-[#F26513]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Nom de votre commerce ou boutique *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex. Douala Mode & Tissus"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:border-[#F26513]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Pays *</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white outline-none focus:border-[#F26513]"
                    >
                      {AFRICAN_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Rayon de vente *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white outline-none focus:border-[#F26513]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Lien de votre direct (TikTok, Facebook...) *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.tiktok.com/@votrecompte/live"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:border-[#F26513]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">WhatsApp de commande *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+237 600 000 000"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono outline-none focus:border-[#F26513]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Créneau horaire *</label>
                    <select
                      value={formData.time_slot}
                      onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-slate-900 bg-white outline-none focus:border-[#F26513]"
                    >
                      <option value="MATIN">Matin (08h00 - 11h00 GMT)</option>
                      <option value="SOIR">Soir (18h00 - 21h00 GMT)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Description courte des articles</label>
                  <textarea
                    rows={2}
                    placeholder="Ex. Pagnes traditionnels, robes wax et chemises artisanales..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 outline-none focus:border-[#F26513]"
                  />
                </div>

                <div className="pt-2">
                  <OcdButton
                    type="submit"
                    loading={submitting}
                    className="w-full min-h-[48px] text-xs font-bold"
                  >
                    Valider et soumettre mon direct
                  </OcdButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { fetchJson } from '../utils/api';
import { 
  ShoppingBag, 
  Phone, 
  Filter, 
  Globe2, 
  ShieldCheck, 
  Truck, 
  MessageCircle, 
  Search,
  ChevronDown
} from 'lucide-react';
import { OcdSkeletonCard } from '../components/OcdLoader';

const AFRICAN_COUNTRIES = [
  { code: 'Bénin', label: 'Bénin', flag: 'BJ' },
  { code: 'Cameroun', label: 'Cameroun', flag: 'CM' },
  { code: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire', flag: 'CI' },
  { code: 'Togo', label: 'Togo', flag: 'TG' },
  { code: 'Sénégal', label: 'Sénégal', flag: 'SN' },
  { code: 'Gabon', label: 'Gabon', flag: 'GA' }
];

const SHOP_CATEGORIES = [
  { id: 'Nourriture & Restauration', label: 'Alimentation & Terroir' },
  { id: 'Mode & Habits', label: 'Mode & Confection' },
  { id: 'Beauté & Cosmétique', label: 'Beauté & Bien-être' },
  { id: 'Électronique & High-Tech', label: 'Matériel & Téléphonie' },
  { id: 'Artisanat & Déco', label: 'Artisanat & Décoration' }
];

export default function ShopPage({ settings = {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCountry !== 'ALL') params.append('country', selectedCountry);
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);

      const data = await fetchJson(`/api/public/shop?${params.toString()}`);
      if (data && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Erreur chargement catalogue OCD Shop:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCountry, selectedCategory]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const title = (p.title || '').toLowerCase();
      const sName = (p.seller_name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      return title.includes(q) || sName.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [products, searchQuery]);

  const ocdWhatsapp = (settings.contact_whatsapp || '+228 90 00 00 00').replace(/[^0-9]/g, '');

  return (
    <div className="bg-transparent min-h-screen text-slate-900 pb-20">
      
      {/* =====================================================================
          1. EN-TÊTE ÉDITORIAL BOUTIQUE (SANS PILLULE IA)
      ===================================================================== */}
      <section className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
              <span className="h-px w-5 bg-[#F26513] inline-block" />
              <span>CATALOGUE COMMERCIAL CERTIFIÉ</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950">
              Boutique Officielle OCD LIVE
            </h1>

            <p className="text-base text-slate-700 leading-relaxed font-medium">
              Commandez directement auprès des créateurs et commerçants présentés sur nos plateaux. Pas de paiement carte obligatoire : échangez avec le vendeur sur WhatsApp et organisez votre livraison locale ou expédition.
            </p>

            {/* Garanties sobres en ligne */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
              <div className="flex items-center gap-2.5 bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">Vendeurs certifiés Boovan Group</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">Commande WhatsApp en direct</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                <Truck className="w-4 h-4 text-slate-700 shrink-0" />
                <span className="font-semibold text-slate-800">Remise locale ou expédition</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. CONSOLE DE SÉLECTION ÉPURÉE (REMPLACE LES PILLS VULGAIRES)
      ===================================================================== */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          
          {/* Ligne 1 : Sélecteur de Territoires (Pays) */}
          <div className="flex items-center justify-between gap-4">
            
            {/* Version Desktop : Onglets épurés */}
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

            {/* Version Mobile : Menu déroulant propre */}
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

            <div className="shrink-0 text-xs font-mono font-semibold text-slate-500 hidden sm:block">
              {filteredProducts.length} {filteredProducts.length > 1 ? 'articles référencés' : 'article référencé'}
            </div>
          </div>

          {/* Ligne 2 : Rayon + Recherche rapide */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 border-t border-slate-100">
            <div className="sm:col-span-6 relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full min-h-[42px] pl-10 pr-10 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-semibold appearance-none outline-none focus:border-[#F26513]"
              >
                <option value="ALL">Tous les rayons de la boutique</option>
                {SHOP_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher par article ou nom de vendeur..."
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
          3. GRILLE DES ARTICLES — DESIGN ÉPURÉ
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <OcdSkeletonCard />
            <OcdSkeletonCard />
            <OcdSkeletonCard />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-950">
              Aucun article dans cette sélection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Consultez d'autres rayons ou revenez lors des prochains directs diffusés sur OCD LIVE.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCountry('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => {
              const waClean = (item.whatsapp || ocdWhatsapp).replace(/[^0-9]/g, '');
              const waMsg = encodeURIComponent(
                `Bonjour ${item.seller_name}, je souhaite commander l'article "${item.title}" à ${Number(item.price_fcfa).toLocaleString('fr-FR')} FCFA vu sur la boutique OCD Shop.`
              );
              const waLink = `https://wa.me/${waClean}?text=${waMsg}`;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 hover:border-[#F26513] bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 bg-slate-100 overflow-hidden">
                      <img
                        src={item.image_url || '/brand/ocd-plateau-afrique.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/brand/ocd-plateau-afrique.jpg';
                        }}
                      />
                      {item.badge && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-mono font-bold border border-slate-200">
                        {item.country}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                          item.in_stock ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.in_stock ? 'EN STOCK' : 'COMMANDE'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-lg text-slate-950 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                        <div className="text-2xl font-black text-[#F26513]">
                          {Number(item.price_fcfa).toLocaleString('fr-FR')} FCFA
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {item.seller_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 border-t border-slate-200">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Commander sur WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { fetchJson } from '../utils/api';
import { 
  ShoppingBag, 
  Phone, 
  Filter, 
  Tag, 
  Sparkles, 
  Globe2, 
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle
} from 'lucide-react';

const AFRICAN_COUNTRIES = [
  { code: 'Bénin', label: 'Bénin', flag: '🇧🇯' },
  { code: 'Cameroun', label: 'Cameroun', flag: '🇨🇲' },
  { code: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'Togo', label: 'Togo', flag: '🇹🇬' },
  { code: 'Sénégal', label: 'Sénégal', flag: '🇸🇳' },
  { code: 'Gabon', label: 'Gabon', flag: '🇬🇦' }
];

const SHOP_CATEGORIES = [
  { id: 'Nourriture & Restauration', label: '🍲 Nourriture & Épices' },
  { id: 'Mode & Habits', label: '👗 Mode & Habits' },
  { id: 'Beauté & Cosmétique', label: '💄 Beauté & Cosmétique' },
  { id: 'Électronique & High-Tech', label: '📱 Matériel & High-Tech' },
  { id: 'Artisanat & Déco', label: '🏺 Artisanat & Déco' }
];

export default function ShopPage({ settings = {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

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

  const getCountryFlag = (countryName) => {
    const found = AFRICAN_COUNTRIES.find((c) => c.code.toLowerCase() === (countryName || '').toLowerCase());
    return found ? found.flag : '🌍';
  };

  const ocdWhatsapp = settings.contact_whatsapp || '+228 90 00 00 00';
  const ocdWaClean = ocdWhatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="bg-white min-h-screen text-zinc-900 pb-20">
      {/* =====================================================================
          1. HERO HEADER OCD SHOP
      ===================================================================== */}
      <section className="bg-zinc-950 text-white border-b border-zinc-800 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F26513]/20 border border-[#F26513]/40 text-[#F26513] text-xs font-bold uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Boutique Officielle • Produits d'Afrique</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              OCD SHOP : <br />
              <span className="text-[#F26513]">ACHETEZ DIRECTEMENT AUX PRODUCTEURS.</span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Retrouvez les produits phares présentés lors des directs OCD LIVE au Bénin, au Cameroun, en Côte d'Ivoire et au Togo. Commandez en 1 clic directement auprès du vendeur via WhatsApp.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Vendeurs vérifiés par Boovan Group</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                <MessageCircle className="w-4 h-4 text-[#F26513] shrink-0" />
                <span>Négociation & commande WhatsApp direct</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Livraison locale & expédition sous-régionale</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FILTRES PAYS & RAYONS
      ===================================================================== */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Ligne 1 : Pays */}
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
              🌍 Tout afficher
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

          {/* Ligne 2 : Rayons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
              Catégorie :
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
              Toutes les catégories
            </button>
            {SHOP_CATEGORIES.map((cat) => (
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
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. CATALOGUE DES PRODUITS
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F26513]" />
              <span>Articles Certifiés OCD</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F26513] font-mono font-bold">
                {products.length} articles
              </span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Cliquez sur "Commander via WhatsApp" pour échanger instantanément avec le vendeur.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#F26513] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-zinc-500 font-medium">Chargement des pépites du catalogue...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-zinc-200 p-12 text-center max-w-xl mx-auto space-y-4">
            <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="font-display font-bold text-lg text-zinc-800">
              Aucun produit disponible dans cette sélection pour l'instant
            </h3>
            <p className="text-sm text-zinc-500">
              Vous vendez des produits d'exception en Afrique ? Intégrez le catalogue officiel OCD Shop !
            </p>
            <a
              href={`https://wa.me/${ocdWaClean}?text=${encodeURIComponent('Bonjour, je souhaite référencer mes articles sur OCD Shop.')}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#F26513] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Référencer mes produits sur WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const waClean = (p.whatsapp || '').replace(/[^0-9]/g, '');
              const waMsg = encodeURIComponent(
                `Bonjour ${p.seller_name}, je souhaite commander l'article "${p.title}" vu sur OCD Shop au tarif de ${p.price_fcfa.toLocaleString('fr-FR')} FCFA. Êtes-vous disponible ?`
              );
              const waUrl = `https://wa.me/${waClean}?text=${waMsg}`;

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between group"
                >
                  <div>
                    {/* Image du produit avec badge */}
                    <div className="relative h-56 bg-zinc-100 overflow-hidden">
                      <img
                        src={p.image_url || '/brand/ocd-plateau-afrique.jpg'}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/brand/ocd-plateau-afrique.jpg';
                        }}
                      />
                      {p.badge && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#F26513] text-white text-[10px] font-black uppercase tracking-wider shadow">
                          {p.badge}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-zinc-900 text-xs font-bold flex items-center gap-1 shadow-sm">
                        <span>{getCountryFlag(p.country)}</span>
                        <span>{p.country}</span>
                      </div>
                    </div>

                    {/* Informations du produit */}
                    <div className="p-4 space-y-2.5">
                      <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        {p.category}
                      </div>

                      <h3 className="font-display font-extrabold text-base text-zinc-950 line-clamp-2 leading-snug">
                        {p.title}
                      </h3>

                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="pt-2 flex items-baseline justify-between border-t border-zinc-100">
                        <span className="font-display font-black text-xl text-[#F26513]">
                          {p.price_fcfa.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-zinc-600">FCFA</span>
                        </span>
                        <span className="text-[11px] text-zinc-500 font-medium">
                          Par {p.seller_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Rapides WhatsApp & Appel */}
                  <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center gap-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Commander</span>
                    </a>
                    <a
                      href={`tel:${p.phone || p.whatsapp}`}
                      aria-label="Appeler le vendeur"
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =====================================================================
          4. BANNIÈRE APPEL AUX PRODUCTEURS
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-3xl bg-zinc-900 text-white p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
              Espace Producteurs & Marques
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Vous avez des produits d'exception à distribuer en Afrique ?
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Exposez vos articles sur OCD Shop et bénéficiez de passages prioritaires lors des émissions OCD LIVE au Togo et en direct d'Afrique.
            </p>
          </div>

          <a
            href={`https://wa.me/${ocdWaClean}?text=${encodeURIComponent('Bonjour Boovan Group, je souhaite faire référencer mes articles sur OCD Shop.')}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-4 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-2 shadow-xl transition-transform active:scale-95"
          >
            <span>Contacter Boovan Group sur WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

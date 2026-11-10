import React, { useState, useEffect } from 'react';
import { fetchJson } from '../utils/api';
import { 
  ShoppingBag, 
  Phone, 
  Filter, 
  Globe2, 
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  PackageCheck
} from 'lucide-react';
import { OcdSkeletonCard } from '../components/OcdLoader';

const AFRICAN_COUNTRIES = [
  { code: 'Bénin', label: 'Bénin' },
  { code: 'Cameroun', label: 'Cameroun' },
  { code: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire' },
  { code: 'Togo', label: 'Togo' },
  { code: 'Sénégal', label: 'Sénégal' },
  { code: 'Gabon', label: 'Gabon' }
];

const SHOP_CATEGORIES = [
  { id: 'Nourriture & Restauration', label: 'Alimentation & Épices' },
  { id: 'Mode & Habits', label: 'Mode & Habits' },
  { id: 'Beauté & Cosmétique', label: 'Beauté & Soins' },
  { id: 'Électronique & High-Tech', label: 'Matériel & High-Tech' },
  { id: 'Artisanat & Déco', label: 'Artisanat & Déco' }
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

  const ocdWhatsapp = (settings.contact_whatsapp || '+228 90 00 00 00').replace(/[^0-9]/g, '');

  return (
    <div className="bg-transparent min-h-screen text-slate-900 pb-20">
      
      {/* =====================================================================
          1. HERO SHOP VIVANT & DIRECT
      ===================================================================== */}
      <section className="bg-gradient-to-b from-orange-50/60 via-amber-50/30 to-white/60 border-b border-orange-200/70 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#F26513] text-xs font-black uppercase">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Boutique Officielle</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Articles vendus en direct sur OCD LIVE
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Commandez directement auprès des commerçants présentés sur nos plateaux. Pas de paiement par carte bancaire obligatoire : échangez avec le vendeur sur WhatsApp et organisez la livraison.
            </p>

            {/* Garanties simples & rassurantes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">Vendeurs certifiés Boovan Group</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">Commande WhatsApp en 1 clic</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <Truck className="w-5 h-5 text-slate-700 shrink-0" />
                <span className="font-semibold text-slate-800">Livraison locale ou expédition</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FILTRES PAYS & CATÉGORIES (GRANDES TOUCHES TACTILES)
      ===================================================================== */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
          
          {/* Ligne 1 : Pays */}
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

          {/* Ligne 2 : Catégories */}
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
            {SHOP_CATEGORIES.map((cat) => (
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
          </div>

        </div>
      </section>

      {/* =====================================================================
          3. GRILLE DES ARTICLES AVEC ACTION DIRECTE WHATSAPP
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <OcdSkeletonCard />
            <OcdSkeletonCard />
            <OcdSkeletonCard />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center max-w-lg mx-auto space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-lg text-slate-900">
              Aucun article dans ce rayon pour le moment
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Consultez tous les rayons ou revenez bientôt lors des prochains directs diffusés sur OCD LIVE.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCountry('ALL');
                setSelectedCategory('ALL');
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider"
            >
              Voir tout le catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => {
              const waClean = (item.whatsapp || ocdWhatsapp).replace(/[^0-9]/g, '');
              const waMsg = encodeURIComponent(
                `Bonjour ${item.seller_name}, je souhaite commander l'article "${item.title}" à ${Number(item.price_fcfa).toLocaleString('fr-FR')} FCFA vu sur la boutique OCD Shop.`
              );
              const waLink = `https://wa.me/${waClean}?text=${waMsg}`;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border-2 border-slate-200 hover:border-[#F26513] bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
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
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#F26513] text-white text-[10px] font-black uppercase shadow">
                          {item.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs text-white text-xs font-bold">
                        {item.country}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          item.in_stock ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.in_stock ? 'En stock' : 'Sur commande'}
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
                        <span className="text-xs font-semibold text-slate-500">
                          Par {item.seller_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 border-t border-slate-200">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
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

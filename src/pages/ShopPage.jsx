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
  { id: 'Mode & Habits', label: 'Mode & Habillement' },
  { id: 'Beauté & Cosmétique', label: 'Beauté & Cosmétique' },
  { id: 'Électronique & High-Tech', label: 'Matériel & High-Tech' },
  { id: 'Artisanat & Déco', label: 'Artisanat & Décoration' }
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

  const ocdWhatsapp = settings.contact_whatsapp || '+228 90 00 00 00';
  const ocdWaClean = ocdWhatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      
      {/* =====================================================================
          1. HERO HEADER OCD SHOP
      ===================================================================== */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <ShoppingBag className="w-3.5 h-3.5 text-[#F26513]" />
              <span>Catalogue Officiel • Vente Directe d'Afrique</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
              Boutique OCD Shop
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Commandez directement auprès des producteurs et commerçants présentés lors des émissions OCD LIVE. Aucun intermédiaire : échangez et négociez en direct avec le vendeur sur WhatsApp.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vendeurs identifiés par Boovan Group</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <MessageCircle className="w-4 h-4 text-[#F26513] shrink-0" />
                <span>Commande directe par messagerie</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <Truck className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Livraison locale et régionale</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FILTRES PAYS & CATÉGORIES
      ===================================================================== */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
          
          {/* Ligne 1 : Pays */}
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

          {/* Ligne 2 : Catégories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Catégorie :</span>
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
              Toutes les catégories
            </button>
            {SHOP_CATEGORIES.map((cat) => (
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
          </div>

        </div>
      </section>

      {/* =====================================================================
          3. GRILLE DES PRODUITS
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <span>Articles référencés</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-medium">
                {products.length} articles
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cliquez sur "Commander via WhatsApp" pour échanger directement avec le vendeur.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#F26513] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-medium">Chargement des articles...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto space-y-3">
            <PackageCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-semibold text-base text-slate-800">
              Aucun produit disponible dans cette sélection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Vous êtes producteur ou commerçant ? Intégrez le catalogue officiel OCD Shop et bénéficiez de commandes directes.
            </p>
            <a
              href={`https://wa.me/${ocdWaClean}?text=${encodeURIComponent('Bonjour Boovan Group, je souhaite faire référencer mes articles sur OCD Shop.')}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 px-4 py-2 rounded-lg bg-[#F26513] text-white font-medium text-xs inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Proposer mes articles</span>
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
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Image du produit avec badge */}
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      <img
                        src={p.image_url || '/brand/ocd-plateau-afrique.jpg'}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/brand/ocd-plateau-afrique.jpg';
                        }}
                      />
                      {p.badge && (
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-semibold tracking-wide">
                          {p.badge}
                        </div>
                      )}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-white/95 text-slate-800 text-xs font-medium border border-slate-200 shadow-xs">
                        {p.country}
                      </div>
                    </div>

                    {/* Informations du produit */}
                    <div className="p-4 space-y-2">
                      <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                        {p.category}
                      </div>

                      <h3 className="font-semibold text-sm text-slate-950 line-clamp-2 leading-snug">
                        {p.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
                        <span className="font-semibold text-base text-slate-900 font-mono">
                          {p.price_fcfa.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span>
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Par {p.seller_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Commander</span>
                    </a>
                    <a
                      href={`tel:${p.phone || p.whatsapp}`}
                      aria-label="Appeler le vendeur"
                      className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =====================================================================
          4. BANNIÈRE PRODUCTEURS & MARQUES
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="rounded-xl bg-white border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F26513]">
              Espace Producteurs & Artisans
            </span>
            <h3 className="text-xl font-semibold text-slate-950">
              Vous fabriquez ou distribuez des produits de qualité en Afrique ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Exposez vos articles sur OCD Shop et bénéficiez de passages prioritaires lors des émissions en direct organisées par Boovan Group.
            </p>
          </div>

          <a
            href={`https://wa.me/${ocdWaClean}?text=${encodeURIComponent('Bonjour Boovan Group, je souhaite référencer mes articles sur OCD Shop.')}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shrink-0 flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>Contacter Boovan Group sur WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
}

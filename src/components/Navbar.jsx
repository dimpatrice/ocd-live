import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from '../router';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Tv, 
  HelpCircle, 
  Info, 
  Radio, 
  ShoppingBag, 
  Users, 
  Mail, 
  Calendar,
  FileCheck
} from 'lucide-react';
import InstallAppModal from './InstallAppModal';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [studioDropdownOpen, setStudioDropdownOpen] = useState(false);
  const [commerceDropdownOpen, setCommerceDropdownOpen] = useState(false);

  const location = useLocation();
  const studioMenuRef = useRef(null);
  const commerceMenuRef = useRef(null);

  // Fermer les menus lors d'un changement de page
  useEffect(() => {
    setMobileOpen(false);
    setStudioDropdownOpen(false);
    setCommerceDropdownOpen(false);
  }, [location.pathname]);

  // Fermer au clic extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (studioMenuRef.current && !studioMenuRef.current.contains(event.target)) {
        setStudioDropdownOpen(false);
      }
      if (commerceMenuRef.current && !commerceMenuRef.current.contains(event.target)) {
        setCommerceDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isStudioActive = ['/forfaits', '/comment-ca-marche', '/a-propos'].includes(location.pathname);
  const isCommerceActive = ['/lives-afrique', '/directs', '/boutique', '/shop'].includes(location.pathname);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-200/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo officiel sobre & institutionnel */}
        <Link to="/" className="flex items-center gap-3.5 focus:outline-none focus:ring-2 focus:ring-[#F26513] rounded-lg pr-2">
          <img
            src="/brand/ocd-logo.jpg"
            alt="OCD LIVE"
            className="h-10 w-auto object-contain rounded"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-tight text-slate-900 leading-none">
              OCD <span className="text-[#F26513]">LIVE</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium tracking-normal mt-0.5">
              Plateaux Médias & Diffusion
            </span>
          </div>
        </Link>

        {/* Navigation principale par catégories ordonnées */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'text-[#F26513] bg-orange-50/60 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            Accueil
          </NavLink>

          {/* Menu déroulant 1 : Studio & Plateaux */}
          <div className="relative" ref={studioMenuRef}>
            <button
              type="button"
              onClick={() => {
                setStudioDropdownOpen(!studioDropdownOpen);
                setCommerceDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isStudioActive || studioDropdownOpen
                  ? 'text-[#F26513] bg-orange-50/60 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Plateaux & Studio</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${studioDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {studioDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <Link
                  to="/forfaits"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                >
                  <Tv className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-medium">Forfaits de diffusion</div>
                    <div className="text-xs text-slate-400">Présentiel à Lomé et à distance</div>
                  </div>
                </Link>
                <Link
                  to="/comment-ca-marche"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-medium">Comment ça marche</div>
                    <div className="text-xs text-slate-400">Processus et déroulement d'un direct</div>
                  </div>
                </Link>
                <Link
                  to="/a-propos"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-t border-slate-100 mt-1 pt-2"
                >
                  <Info className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-medium">À propos de Boovan Group</div>
                    <div className="text-xs text-slate-400">Vision, promoteur et engagements</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Menu déroulant 2 : Directs Panafricains & E-Commerce */}
          <div className="relative" ref={commerceMenuRef}>
            <button
              type="button"
              onClick={() => {
                setCommerceDropdownOpen(!commerceDropdownOpen);
                setStudioDropdownOpen(false);
              }}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isCommerceActive || commerceDropdownOpen
                  ? 'text-[#F26513] bg-orange-50/60 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>Directs & E-Commerce</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${commerceDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {commerceDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <Link
                  to="/lives-afrique"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                >
                  <Radio className="w-4 h-4 text-[#F26513]" />
                  <div>
                    <div className="font-medium">Directs Panafricains</div>
                    <div className="text-xs text-slate-400">Flux vendeurs vérifiés depuis chez soi</div>
                  </div>
                </Link>
                <Link
                  to="/boutique"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-t border-slate-100 mt-1 pt-2"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-medium">Boutique OCD Shop</div>
                    <div className="text-xs text-slate-400">Produits certifiés d'Afrique en 1 clic</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <NavLink
            to="/recrutement"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'text-[#F26513] bg-orange-50/60 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            Recrutement
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'text-[#F26513] bg-orange-50/60 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Actions principales d'en-tête */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/suivi-reservation"
            className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Suivi de dossier
          </Link>

          <Link
            to="/reserver"
            className="px-5 py-2.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-medium text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F26513] focus:ring-offset-2"
          >
            Réserver un direct
          </Link>
        </div>

        {/* Bouton Menu Mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="lg:hidden p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Mobile Structuré et Accessible */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive ? 'bg-orange-50 text-[#F26513] font-semibold' : 'text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              Accueil
            </NavLink>

            {/* Section Plateaux */}
            <div className="pt-2 pb-1 border-t border-slate-100">
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Plateaux & Studio
              </span>
              <NavLink
                to="/forfaits"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-orange-50 text-[#F26513]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <Tv className="w-4 h-4 text-slate-400" />
                <span>Forfaits de diffusion</span>
              </NavLink>
              <NavLink
                to="/comment-ca-marche"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-orange-50 text-[#F26513]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Comment ça marche</span>
              </NavLink>
              <NavLink
                to="/a-propos"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-orange-50 text-[#F26513]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>À propos de Boovan Group</span>
              </NavLink>
            </div>

            {/* Section E-Commerce */}
            <div className="pt-2 pb-1 border-t border-slate-100">
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Directs & Ventes
              </span>
              <NavLink
                to="/lives-afrique"
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-orange-50 text-[#F26513]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <span className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-[#F26513]" />
                  <span>Directs Panafricains</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  Actif
                </span>
              </NavLink>
              <NavLink
                to="/boutique"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-orange-50 text-[#F26513]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                <span>Boutique OCD Shop</span>
              </NavLink>
            </div>

            {/* Section Autres */}
            <div className="pt-2 pb-1 border-t border-slate-100">
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Organisation
              </span>
              <NavLink
                to="/recrutement"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-orange-50 text-[#F26513]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <Users className="w-4 h-4 text-slate-400" />
                <span>Recrutement d'animatrices</span>
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-orange-50 text-[#F26513]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Contact & Localisation</span>
              </NavLink>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <Link
              to="/reserver"
              className="w-full py-3 rounded-lg bg-[#F26513] text-white font-medium text-center text-sm shadow-sm"
            >
              Réserver un direct
            </Link>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
              <Link to="/suivi-reservation" className="hover:text-slate-900 font-medium">
                Suivre une réservation
              </Link>
              <Link to="/admin" className="hover:text-slate-900 font-medium">
                Espace direction
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'installation PWA si sollicitée */}
      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />
    </header>
  );
}

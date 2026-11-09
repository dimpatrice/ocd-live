import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from '../router';
import { Menu, X, Smartphone } from 'lucide-react';
import InstallAppModal from './InstallAppModal';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/lives-afrique', label: 'Directs Afrique', isLive: true },
    { to: '/boutique', label: 'OCD Shop' },
    { to: '/forfaits', label: 'Plateau & Forfaits' },
    { to: '/comment-ca-marche', label: 'Comment ça marche' },
    { to: '/a-propos', label: 'À propos' },
    { to: '/recrutement', label: 'Recrutement' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo officiel OCD LIVE */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/brand/ocd-logo.jpg"
            alt="OCD LIVE"
            className="h-11 w-auto object-contain"
          />
          <span className="font-display font-extrabold text-xl tracking-tight text-zinc-900">
            Live
          </span>
        </Link>

        {/* Liens de navigation épurés */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#F26513] font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`
              }
            >
              {item.isLive && (
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
              )}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bouton principal sobre */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            type="button"
            onClick={() => setInstallModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#F26513]" />
            <span>Installer l'app</span>
          </button>
          <Link
            to="/suivi-reservation"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Suivi réservation
          </Link>
          <Link
            to="/reserver"
            className="px-5 py-2.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Réserver mon live
          </Link>
        </div>

        {/* Menu Mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          className="lg:hidden p-2 rounded-lg text-zinc-700 hover:bg-zinc-100"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Mobile déroulant propre */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-zinc-200 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-orange-50 text-[#F26513] font-semibold'
                    : 'text-zinc-700 hover:bg-zinc-50'
                }`
              }
            >
              <span className="flex items-center gap-2">
                {item.isLive && (
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                )}
                <span>{item.label}</span>
              </span>
              {item.isLive && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 uppercase">
                  En direct
                </span>
              )}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setInstallModalOpen(true);
              }}
              className="w-full py-2.5 rounded-lg bg-zinc-100 text-zinc-900 font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-[#F26513]" />
              <span>Installer l'application (Android / Apple)</span>
            </button>
            <Link
              to="/reserver"
              className="w-full py-3 rounded-lg bg-[#F26513] text-white font-display font-bold text-center text-xs uppercase tracking-wider"
            >
              Réserver mon live
            </Link>
            <div className="flex items-center justify-between pt-1 px-2 text-xs text-zinc-500">
              <Link to="/suivi-reservation" className="hover:text-zinc-900">
                Suivre ma réservation
              </Link>
              <Link to="/admin" className="hover:text-zinc-900">
                Administration
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'installation */}
      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />
    </header>
  );
}

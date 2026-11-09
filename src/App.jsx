import React, { useState, useEffect, useCallback } from 'react';
import { RouterContext, useRouter } from './router';
import { fetchJson } from './utils/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AmbientBackground from './components/AmbientBackground';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import PackagesPage from './pages/PackagesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import RecruitmentPage from './pages/RecruitmentPage';
import ContactPage from './pages/ContactPage';
import TrackBookingPage from './pages/TrackBookingPage';
import AdminPage from './pages/AdminPage';
import CommunityLivesPage from './pages/CommunityLivesPage';
import ShopPage from './pages/ShopPage';

export default function App() {
  const router = useRouter();
  const [config, setConfig] = useState({
    settings: {},
    packages: [],
    addons: [],
    studios: []
  });

  const fetchPublicConfig = useCallback(() => {
    fetchJson('/api/public/config')
      .then((data) => {
        if (data && data.packages) {
          setConfig(data);
        }
      })
      .catch((err) => {
        console.error('Erreur de chargement de la configuration publique OCD LIVE:', err);
      });
  }, []);

  useEffect(() => {
    fetchPublicConfig();
  }, [fetchPublicConfig]);

  // À chaque changement d'URL ou d'onglet, forcer le défilement immédiat tout en haut de la page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [router.pathname, router.search]);

  let pageView = null;
  const path = router.pathname;

  if (path === '/' || path === '') {
    pageView = <HomePage packages={config.packages} settings={config.settings} />;
  } else if (path === '/reserver') {
    pageView = (
      <BookingPage
        packages={config.packages}
        addons={config.addons}
        settings={config.settings}
      />
    );
  } else if (path === '/forfaits') {
    pageView = <PackagesPage packages={config.packages} addons={config.addons} />;
  } else if (path === '/comment-ca-marche') {
    pageView = <HowItWorksPage />;
  } else if (path === '/a-propos') {
    pageView = <AboutPage settings={config.settings} />;
  } else if (path === '/recrutement') {
    pageView = <RecruitmentPage />;
  } else if (path === '/contact') {
    pageView = <ContactPage settings={config.settings} />;
  } else if (path === '/suivi-reservation') {
    pageView = <TrackBookingPage settings={config.settings} />;
  } else if (path === '/lives-afrique' || path === '/directs') {
    pageView = <CommunityLivesPage settings={config.settings} />;
  } else if (path === '/boutique' || path === '/shop') {
    pageView = <ShopPage settings={config.settings} />;
  } else if (path === '/admin') {
    pageView = <AdminPage onConfigUpdated={fetchPublicConfig} />;
  } else {
    pageView = <HomePage packages={config.packages} settings={config.settings} />;
  }

  return (
    <RouterContext.Provider value={router}>
      <div className="relative min-h-screen flex flex-col bg-white text-zinc-900">
        <AmbientBackground />
        <Navbar settings={config.settings} />
        <main className="relative z-10 flex-1">{pageView}</main>
        <Footer settings={config.settings} />
      </div>
    </RouterContext.Provider>
  );
}


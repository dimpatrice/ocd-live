import React, { useState, useEffect } from 'react';
import { Smartphone, Apple, Download, Share2, PlusSquare, X } from 'lucide-react';

export default function InstallAppModal({ isOpen, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [activeTab, setActiveTab] = useState('android'); // 'android' | 'ios'

  useEffect(() => {
    // Détection iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);
    if (isIosDevice) setActiveTab('ios');

    // Détection si déjà installé en mode autonome
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(!!isInStandaloneMode);

    // Écouter l'événement standard PWA d'installation (Android / Chrome)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstallAndroid() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        onClose();
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-zinc-200 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête */}
        <div className="flex items-center gap-4">
          <img
            src="/brand/ocd-logo.jpg"
            alt="Logo OCD"
            className="w-14 h-14 rounded-2xl object-cover border border-orange-100 shadow-md"
          />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26513] block">
              Application Mobile Officielle
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950">
              Installer OCD LIVE
            </h3>
          </div>
        </div>

        {isStandalone ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            L'application est déjà installée sur cet appareil. Vous bénéficiez de l'expérience plein écran et des notifications.
          </div>
        ) : (
          <>
            {/* Onglets Système : Android vs Apple iOS */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-100 border border-zinc-200">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'android'
                    ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#F26513]" />
                <span>Android</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`py-2.5 rounded-xl text-xs font-display font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'ios'
                    ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <Apple className="w-4 h-4 text-zinc-900" />
                <span>iPhone / iPad</span>
              </button>
            </div>

            {/* Contenu Android */}
            {activeTab === 'android' && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-600">
                  Installez directement l'application sur votre smartphone Android sans passer par le store :
                </p>

                {deferredPrompt ? (
                  <button
                    type="button"
                    onClick={handleInstallAndroid}
                    className="w-full py-4 rounded-xl bg-[#F26513] hover:bg-[#d9550b] text-white font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Installer en un clic sur mon téléphone</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-2">
                    <p className="font-bold text-zinc-900">Procédure manuelle rapide sur Chrome :</p>
                    <ol className="list-decimal pl-4 space-y-1.5 text-zinc-600">
                      <li>Appuyez sur le menu <strong className="text-zinc-900">⋮ (les 3 points en haut à droite)</strong> de votre navigateur.</li>
                      <li>Sélectionnez <strong className="text-zinc-900">« Installer l'application »</strong> ou <strong className="text-zinc-900">« Ajouter à l'écran d'accueil »</strong>.</li>
                      <li>Validez pour retrouver l'icône OCD LIVE sur votre écran de téléphone.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Contenu Apple iOS */}
            {activeTab === 'ios' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26513] block">
                    Procédure officielle Apple iOS (Safari)
                  </span>
                  <p className="text-xs text-zinc-600">
                    Sur iPhone et iPad, Apple permet d'installer l'application directement depuis Safari :
                  </p>

                  <div className="space-y-2.5 text-xs text-zinc-700">
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-zinc-200">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#F26513] flex items-center justify-center font-bold text-xs shrink-0">
                        1
                      </div>
                      <p className="mt-0.5">
                        Ouvrez le site dans le navigateur <strong className="text-zinc-950">Safari</strong> sur votre iPhone.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-zinc-200">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#F26513] flex items-center justify-center font-bold text-xs shrink-0">
                        2
                      </div>
                      <div className="flex-1 mt-0.5">
                        <p>
                          Appuyez sur le bouton de <strong className="text-zinc-950">Partage</strong>{' '}
                          <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> situé en bas de l'écran.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-zinc-200">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#F26513] flex items-center justify-center font-bold text-xs shrink-0">
                        3
                      </div>
                      <div className="flex-1 mt-0.5">
                        <p>
                          Faites défiler et touchez <strong className="text-zinc-950">« Sur l'écran d'accueil »</strong>{' '}
                          <PlusSquare className="w-3.5 h-3.5 inline text-zinc-800" />.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-zinc-200">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#F26513] flex items-center justify-center font-bold text-xs shrink-0">
                        4
                      </div>
                      <p className="mt-0.5">
                        Touchez <strong className="text-zinc-950">« Ajouter »</strong> en haut à droite. L'application OCD LIVE apparaît comme une vraie appli native !
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Rapide • Sans stockage lourd • 100% Sécurisé</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-zinc-700 hover:text-zinc-950"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}


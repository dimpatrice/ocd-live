import React from 'react';

/**
 * OcdLoader - Loader officiel sur-mesure inspiré de l'emblème OCD LIVE.
 * Combine la lentille de caméra/signal de direct, l'onde de diffusion pulsante
 * et l'anneau dynamique orange (#F26513) de Boovan Group.
 */
export function OcdLoader({
  size = 'md', // 'sm' | 'md' | 'lg' | 'fullscreen' | 'button'
  text = 'Chargement en cours...',
  className = ''
}) {
  if (size === 'button') {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <svg
          className="animate-spin w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {text && <span className="font-semibold text-xs tracking-wide">{text}</span>}
      </span>
    );
  }

  if (size === 'fullscreen') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
      >
        <div className="relative flex items-center justify-center">
          {/* Onde de diffusion pulsante extérieure */}
          <div className="absolute w-28 h-28 rounded-full border-2 border-[#F26513]/30 animate-ping" />
          <div className="absolute w-24 h-24 rounded-full bg-orange-100/60 animate-pulse" />

          {/* Anneau rotatif de diffusion */}
          <div className="relative w-20 h-20 rounded-full border-3 border-slate-100 border-t-[#F26513] border-r-[#F26513] animate-spin" />

          {/* Emblème central OCD LIVE */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-black text-sm tracking-tight text-slate-900 leading-none">
              OCD
            </span>
            <span className="font-extrabold text-[10px] tracking-wider text-[#F26513] leading-none mt-0.5">
              LIVE
            </span>
            {/* Témoin de direct actif */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#F26513] animate-pulse mt-1" />
          </div>
        </div>

        {text && (
          <p className="mt-5 text-sm font-bold text-slate-700 tracking-tight animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-2 text-slate-600 ${className}`}>
        <div className="relative w-6 h-6 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-[#F26513] animate-spin" />
          <span className="absolute w-1.5 h-1.5 rounded-full bg-[#F26513]" />
        </div>
        {text && <span className="text-xs font-semibold text-slate-700">{text}</span>}
      </div>
    );
  }

  // Taille standard 'md' ou 'lg'
  const ringSize = size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
  const fontSize = size === 'lg' ? 'text-xs' : 'text-[10px]';

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Halo de signal */}
        <div className="absolute inset-0 rounded-full bg-orange-100/60 animate-ping" />

        {/* Anneau de chargement */}
        <div
          className={`${ringSize} rounded-full border-2 border-slate-200 border-t-[#F26513] border-r-[#F26513] animate-spin`}
        />

        {/* Sigle OCD */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-black tracking-tight text-slate-900 leading-none ${fontSize}`}>
            OCD
          </span>
          <span className="font-bold text-[8px] text-[#F26513] leading-none mt-0.5">
            LIVE
          </span>
        </div>
      </div>

      {text && (
        <span className="mt-3 text-xs font-bold text-slate-600 tracking-tight">
          {text}
        </span>
      )}
    </div>
  );
}

/**
 * Bouton d'action haute ergonomie avec loader OCD intégré,
 * confirmation visuelle et cible tactile minimale de 48px.
 */
export function OcdButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'whatsapp' | 'danger'
  loading = false,
  loadingText = 'Patientez...',
  disabled = false,
  className = '',
  size = 'normal', // 'normal' (min 48px) | 'large' (min 56px)
  icon: Icon = null
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center gap-2.5 rounded-xl font-bold uppercase tracking-wider transition-all duration-150 select-none focus:outline-none focus:ring-3 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100';

  const sizeStyles =
    size === 'large'
      ? 'min-h-[56px] px-8 py-4 text-sm'
      : 'min-h-[48px] px-6 py-3.5 text-xs';

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles =
        'bg-[#F26513] hover:bg-[#DC5309] text-white shadow-sm focus:ring-orange-200';
      break;
    case 'secondary':
      variantStyles =
        'bg-slate-900 hover:bg-slate-800 text-white shadow-sm focus:ring-slate-300';
      break;
    case 'whatsapp':
      variantStyles =
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-200';
      break;
    case 'outline':
      variantStyles =
        'bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 hover:border-slate-400 focus:ring-slate-200';
      break;
    case 'danger':
      variantStyles =
        'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-200';
      break;
    default:
      variantStyles = 'bg-[#F26513] text-white';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
    >
      {loading ? (
        <OcdLoader size="button" text={loadingText} />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}

/**
 * Skeleton Loader professionnel pour cartes produits, réservations ou directs
 */
export function OcdSkeletonCard({ lines = 3, hasImage = true }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 animate-pulse">
      {hasImage && <div className="h-44 bg-slate-200 rounded-xl" />}
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
      <div className="space-y-1.5 pt-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-2.5 bg-slate-100 rounded"
            style={{ width: `${85 - i * 15}%` }}
          />
        ))}
      </div>
      <div className="pt-2 flex justify-between items-center border-t border-slate-100">
        <div className="h-5 bg-slate-200 rounded w-24" />
        <div className="h-8 bg-slate-200 rounded w-28" />
      </div>
    </div>
  );
}

export default OcdLoader;

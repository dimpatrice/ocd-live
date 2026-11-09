import React, { useState, useEffect } from 'react';
import { useSearchParams } from '../router';
import { Search, Upload, CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from '../router';
import { fetchJson } from '../utils/api';

export default function TrackBookingPage({ settings = {} }) {
  const [searchParams] = useSearchParams();
  const [reference, setReference] = useState(searchParams.get('ref') || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  async function fetchBooking(refToLookup) {
    if (!refToLookup.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const data = await fetchJson(`/api/public/reservations/${encodeURIComponent(refToLookup.trim())}`);
      setBooking(data);
      setPaymentRef(data.payment_reference || '');
      setProofUrl(data.payment_proof_url || '');
    } catch (err) {
      setBooking(null);
      setErrorMsg(err.message || 'Réservation introuvable. Vérifiez la référence saisie.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialRef = searchParams.get('ref');
    if (initialRef) {
      fetchBooking(initialRef);
    }
  }, []);

  async function handleUploadProof(file) {
    if (!file) return;
    setUploading(true);
    setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const data = await fetchJson('/api/public/upload', { method: 'POST', body: fd });
      setProofUrl(data.url);
    } catch (err) {
      setErrorMsg(err.message || 'Erreur lors du téléversement du fichier.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveProof(e) {
    e.preventDefault();
    if (!booking) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const data = await fetchJson(`/api/public/reservations/${booking.reference}/payment-proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_reference: paymentRef,
          payment_proof_url: proofUrl
        })
      });
      setBooking((prev) => ({
        ...prev,
        payment_status: data.reservation.payment_status,
        payment_reference: data.reservation.payment_reference,
        payment_proof_url: data.reservation.payment_proof_url
      }));
      setSuccessMsg('Votre justificatif de règlement a bien été transmis à l\'administration de Boovan Group.');
    } catch (err) {
      setErrorMsg(err.message || 'Impossible d\'enregistrer le justificatif.');
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMEE':
      case 'PAYE_CONFIRME':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'EN_ATTENTE':
      case 'EN_ATTENTE_PAIEMENT':
      case 'PREUVE_TRANSMISE':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'ANNULEE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation retour */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        {/* En-tête */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
            Suivi de dossier
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Consulter une réservation
          </h1>
          <p className="text-sm text-slate-600 max-w-xl">
            Saisissez votre référence de dossier (ex. OCD-2026-XXXXXX) pour vérifier l'état de votre session et transmettre votre justificatif de paiement.
          </p>
        </div>

        {/* Formulaire de recherche */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchBooking(reference);
          }}
          className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-xl bg-white border border-slate-200 shadow-xs"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex. OCD-2026-123456"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-[#F26513] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-60"
          >
            {loading ? 'Recherche...' : 'Consulter le dossier'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm">
            {successMsg}
          </div>
        )}

        {/* Fiche de réservation */}
        {booking && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-[#F26513]">{booking.reference}</span>
                <h2 className="text-2xl font-bold text-slate-950 mt-0.5">
                  {booking.company_name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Contact : {booking.client_first_name} {booking.client_last_name} ({booking.client_city}, {booking.client_country})
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(booking.booking_status)}`}>
                  Dossier : {booking.booking_status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(booking.payment_status)}`}>
                  Paiement : {booking.payment_status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">Date et horaire (Togo GMT)</span>
                <p className="font-bold text-slate-950 mt-1">{booking.booking_date}</p>
                <p className="text-xs font-semibold text-[#F26513] mt-0.5">
                  {booking.start_time.replace(':', 'h')} – {booking.end_time.replace(':', 'h')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">Forfait et modalité</span>
                <p className="font-bold text-slate-950 mt-1">{booking.package_name}</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {booking.participation_mode === 'PRESENTIEL' ? 'Présentiel au studio (Lomé)' : 'À distance depuis votre pays'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">Montant du forfait</span>
                <p className="text-xl font-bold text-slate-950 mt-1">
                  {booking.is_custom_quote
                    ? 'Sur devis'
                    : `${Number(booking.total_price_fcfa).toLocaleString('fr-FR')} FCFA`}
                </p>
              </div>
            </div>

            {/* Formulaire justificatif de paiement si non validé */}
            {booking.payment_status !== 'PAYE_CONFIRME' && (
              <form onSubmit={handleSaveProof} className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">
                    Transmettre un justificatif de règlement
                  </h3>
                  {settings.payment_manual_instructions && (
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {settings.payment_manual_instructions}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Numéro ou référence de transaction
                    </label>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="Ex. Référence T-Money, Flooz ou Virement"
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs outline-none focus:border-[#F26513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Fichier du reçu ou capture d'écran
                    </label>
                    <label className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-dashed border-slate-300 hover:border-[#F26513] text-xs text-slate-700">
                      <Upload className="w-4 h-4 text-[#F26513]" />
                      <span className="truncate">
                        {uploading
                          ? 'Téléversement en cours...'
                          : proofUrl
                            ? 'Fichier joint'
                            : 'Sélectionner un fichier (JPG, PNG, PDF)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => handleUploadProof(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    Enregistrer le justificatif
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useSearchParams } from '../router';
import { Upload } from 'lucide-react';
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
      setErrorMsg(err.message);
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
      setErrorMsg(err.message);
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
      setSuccessMsg('Votre justificatif de règlement a bien été transmis à l\'administration Boovan Group.');
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
            Suivi de dossier
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-950">
            Suivre ma réservation OCD LIVE
          </h1>
          <p className="text-sm text-zinc-600">
            Entrez votre numéro de réservation (ex: OCD-2026-...) pour consulter son état ou ajouter une preuve de paiement.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchBooking(reference);
          }}
          className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl bg-white border border-zinc-200 shadow-sm"
        >
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Ex: OCD-2026-123456"
            className="flex-1 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm outline-none focus:border-[#F26513]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            {successMsg}
          </div>
        )}

        {booking && (
          <div className="rounded-2xl bg-white border border-zinc-200 p-7 sm:p-9 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-200">
              <div>
                <span className="text-xs font-bold text-[#F26513]">{booking.reference}</span>
                <h2 className="font-display text-2xl font-extrabold text-zinc-950 mt-0.5">
                  {booking.company_name}
                </h2>
                <p className="text-xs text-zinc-500">
                  Client : {booking.client_first_name} {booking.client_last_name} ({booking.client_city}, {booking.client_country})
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-md bg-zinc-100 text-zinc-800 text-xs font-bold">
                  Statut : {booking.booking_status}
                </span>
                <span className="px-3 py-1 rounded-md bg-orange-50 text-[#F26513] text-xs font-bold">
                  Paiement : {booking.payment_status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500 block">Date & Horaire (Togo)</span>
                <p className="font-bold text-zinc-950 mt-1">{booking.booking_date}</p>
                <p className="text-xs font-semibold text-[#F26513]">
                  {booking.start_time.replace(':', 'h')} – {booking.end_time.replace(':', 'h')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500 block">Forfait & Mode</span>
                <p className="font-bold text-zinc-950 mt-1">{booking.package_name}</p>
                <p className="text-xs text-zinc-600">
                  {booking.participation_mode === 'PRESENTIEL' ? 'Présentiel (Lomé)' : 'À distance'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500 block">Montant Total</span>
                <p className="font-display text-xl font-extrabold text-[#F26513] mt-1">
                  {booking.is_custom_quote
                    ? 'Sur devis'
                    : `${Number(booking.total_price_fcfa).toLocaleString('fr-FR')} FCFA`}
                </p>
              </div>
            </div>

            {booking.payment_status !== 'PAYE_CONFIRME' && (
              <form onSubmit={handleSaveProof} className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 space-y-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-zinc-950">
                    Transmettre une preuve de paiement
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1">
                    {settings.payment_manual_instructions}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Référence de transaction
                    </label>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="Ex: ID T-Money / Flooz / Virement"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-zinc-300 text-zinc-900 text-xs outline-none focus:border-[#F26513]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Fichier justificatif (Reçu / Capture)
                    </label>
                    <label className="cursor-pointer flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-dashed border-zinc-300 hover:border-[#F26513] text-xs text-zinc-700">
                      <Upload className="w-4 h-4 text-[#F26513]" />
                      <span>
                        {uploading
                          ? 'Téléversement...'
                          : proofUrl
                            ? 'Justificatif joint'
                            : 'Choisir un fichier'}
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

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider"
                >
                  Enregistrer ma preuve de paiement
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

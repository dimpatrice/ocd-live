import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from '../router';
import { Search, Upload, CheckCircle2, AlertCircle, ArrowLeft, Clock, ShieldCheck, FileCheck } from 'lucide-react';
import { fetchJson } from '../utils/api';
import { OcdButton, OcdLoader } from '../components/OcdLoader';

export default function TrackBookingPage({ settings = {} }) {
  const [searchParams] = useSearchParams();
  const [reference, setReference] = useState(searchParams.get('ref') || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [savingProof, setSavingProof] = useState(false);
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
      setErrorMsg(err.message || 'Réservation introuvable. Veuillez vérifier votre numéro de dossier (ex: OCD-2026-XXXXXX).');
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
    setSavingProof(true);
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
      setSuccessMsg('Votre justificatif de règlement a bien été enregistré. Notre équipe validera votre session rapidement.');
    } catch (err) {
      setErrorMsg(err.message || 'Impossible d\'enregistrer le justificatif.');
    } finally {
      setSavingProof(false);
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMEE':
      case 'PAYE_CONFIRME':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'EN_ATTENTE':
      case 'EN_ATTENTE_PAIEMENT':
      case 'PREUVE_TRANSMISE':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'ANNULEE':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation retour */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        {/* En-tête sans jargon */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
            <span className="h-px w-5 bg-[#F26513] inline-block" />
            <span>PORTAIL CLIENT • SUIVI DE DOSSIER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Suivre ma réservation
          </h1>
          <p className="text-base text-slate-700 max-w-xl font-medium">
            Entrez votre numéro de dossier reçu par e-mail ou SMS pour vérifier l'état de votre session et envoyer votre preuve de paiement.
          </p>
        </div>

        {/* Formulaire de recherche avec cibles larges */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchBooking(reference);
          }}
          className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl bg-white border-2 border-slate-200 shadow-sm"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Numéro de dossier (ex: OCD-2026-123456)"
              className="w-full min-h-[50px] pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 text-base font-medium outline-none focus:bg-white focus:border-[#F26513] transition-colors"
            />
          </div>
          <OcdButton
            type="submit"
            loading={loading}
            icon={Search}
            className="min-h-[50px] px-8 text-base font-bold shrink-0"
          >
            Vérifier
          </OcdButton>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-900 text-sm font-medium flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Fiche de réservation si trouvée */}
        {booking && (
          <div className="rounded-2xl bg-white border-2 border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-[#F26513] uppercase tracking-wider block">
                  Dossier N° {booking.reference}
                </span>
                <h2 className="text-2xl font-black text-slate-950 mt-1">
                  {booking.company_name}
                </h2>
                <p className="text-sm text-slate-700 font-medium mt-1">
                  Client : {booking.client_first_name} {booking.client_last_name} ({booking.client_city}, {booking.client_country})
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3.5 py-1.5 rounded-full text-xs font-black border ${getStatusBadge(booking.booking_status)}`}>
                  Statut : {booking.booking_status}
                </span>
                <span className={`px-3.5 py-1.5 rounded-full text-xs font-black border ${getStatusBadge(booking.payment_status)}`}>
                  Paiement : {booking.payment_status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Date & Heure (GMT)</span>
                <p className="text-base font-bold text-slate-950 mt-1">{booking.booking_date}</p>
                <p className="text-sm font-black text-[#F26513] mt-0.5">
                  {booking.start_time.replace(':', 'h')} – {booking.end_time.replace(':', 'h')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Forfait choisi</span>
                <p className="text-base font-bold text-slate-950 mt-1">{booking.package_name}</p>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  {booking.participation_mode === 'PRESENTIEL' ? 'Au Studio (Lomé)' : 'À distance (Depuis mon pays)'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tarif total</span>
                <p className="text-2xl font-black text-slate-950 mt-1">
                  {booking.is_custom_quote
                    ? 'Sur devis'
                    : `${Number(booking.total_price_fcfa).toLocaleString('fr-FR')} FCFA`}
                </p>
              </div>
            </div>

            {/* Formulaire justificatif de paiement si non validé */}
            {booking.payment_status !== 'PAYE_CONFIRME' && (
              <form onSubmit={handleSaveProof} className="p-5 sm:p-6 rounded-2xl bg-amber-50/60 border-2 border-amber-200 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    Envoyer votre preuve de paiement
                  </h3>
                  <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                    Effectuez le règlement par T-Money, Flooz ou virement, puis renseignez la référence ou chargez le reçu ci-dessous.
                  </p>
                  {settings.payment_manual_instructions && (
                    <div className="mt-3 p-3 rounded-xl bg-white border border-amber-300 text-xs text-slate-800 whitespace-pre-line font-medium">
                      {settings.payment_manual_instructions}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Référence de transaction
                    </label>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="Ex: TMONEY-123456 ou ID Transaction"
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-white border-2 border-slate-300 text-slate-950 text-sm font-medium outline-none focus:border-[#F26513]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Photo du reçu ou capture
                    </label>
                    <label className="cursor-pointer flex items-center justify-center gap-2.5 min-h-[48px] px-4 py-2.5 rounded-xl bg-white border-2 border-dashed border-slate-300 hover:border-[#F26513] text-sm font-medium text-slate-800 transition-colors">
                      <Upload className="w-5 h-5 text-[#F26513] shrink-0" />
                      <span className="truncate">
                        {uploading
                          ? 'Chargement du fichier...'
                          : proofUrl
                            ? 'Fichier joint (prêt)'
                            : 'Choisir la photo / PDF'}
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

                <div className="flex justify-end pt-2">
                  <OcdButton
                    type="submit"
                    loading={savingProof}
                    icon={FileCheck}
                    className="min-h-[48px] px-6 text-sm font-bold"
                  >
                    Valider le justificatif
                  </OcdButton>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

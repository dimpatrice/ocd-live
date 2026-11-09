import React, { useState } from 'react';
import { AFRICAN_COUNTRIES } from '../data/media';
import { fetchJson } from '../utils/api';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function ContactPage({ settings = {} }) {
  const [form, setForm] = useState({
    full_name: '',
    company: '',
    email: '',
    phone: '',
    country: 'Togo',
    subject: 'Demande d\'information sur OCD LIVE',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await fetchJson('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setSent(true);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-14 lg:py-20 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <span>Direction Générale • Lomé, Togo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
            Contact & Assistance Boovan Group
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Une question sur les forfaits de production, les modalités techniques de duplex ou les partenariats commerciaux ? Notre équipe vous répond avec diligence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Coordonnées officielles */}
          <div className="lg:col-span-5 rounded-xl bg-white border border-slate-200 p-7 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-lg font-semibold text-slate-950">
              Coordonnées du complexe média
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F26513] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-slate-900 block">Siège & Studio au Togo</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {settings.studio_address || 'Complexe Audiovisuel OCD LIVE — Boovan Group, Lomé, Togo'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-slate-900 block">Téléphone direct</span>
                  <p className="text-xs font-mono text-slate-700 mt-0.5">
                    {settings.contact_phone || '+228 90 00 00 00'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-slate-900 block">Courrier électronique</span>
                  <p className="text-xs font-mono text-slate-700 mt-0.5">
                    {settings.contact_email || 'contact@boovangroup.com'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <a
                  href={settings.social_facebook || 'https://www.facebook.com/Bovannofficiel'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={settings.social_tiktok || 'https://www.tiktok.com/@bovann'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-medium hover:bg-slate-200 transition-colors"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-7 rounded-xl bg-white border border-slate-200 p-7 sm:p-8 shadow-xs">
            {sent ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-950">Message transmis</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Merci pour votre message. L'équipe Boovan Group accusera réception et vous apportera une réponse sous 24 heures.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="pb-2 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-950">
                    Transmettre une demande écrite
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Renseignez vos coordonnées pour être recontacté.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Entreprise / Marque</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Adresse e-mail *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Téléphone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Pays *</label>
                    <select
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900 bg-white"
                    >
                      {AFRICAN_COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Objet de la demande *</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">Votre message *</label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-medium text-xs shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Transmission en cours...' : 'Envoyer mon message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

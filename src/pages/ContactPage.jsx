import React, { useState } from 'react';
import { AFRICAN_COUNTRIES } from '../data/media';
import { fetchJson } from '../utils/api';

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
    <div className="min-h-screen bg-zinc-50 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
            Contact • Boovan Group
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-zinc-950">
            Contactez l'équipe OCD LIVE
          </h1>
          <p className="text-zinc-600 text-base">
            Notre équipe au Togo est à votre écoute pour toute question sur les réservations, les forfaits ou les partenariats.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 rounded-2xl bg-white border border-zinc-200 p-8 space-y-6">
            <h2 className="font-display text-xl font-extrabold text-zinc-950">
              Coordonnées officielles
            </h2>
            <div className="space-y-4 text-sm text-zinc-700">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase">Studio</p>
                <p className="font-medium text-zinc-900 mt-0.5">
                  {settings.studio_address || 'Complexe Audiovisuel OCD LIVE — Boovan Group, Lomé, Togo'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase">Téléphone</p>
                <p className="font-semibold text-zinc-900 mt-0.5">
                  {settings.contact_phone || '+228 90 00 00 00'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase">WhatsApp</p>
                <p className="font-semibold text-zinc-900 mt-0.5">
                  {settings.contact_whatsapp || '+228 90 00 00 00'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase">E-mail</p>
                <p className="font-medium text-zinc-900 mt-0.5">
                  {settings.contact_email || 'dimpatrice3@gmail.com'}
                </p>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={settings.social_facebook || 'https://www.facebook.com/Bovannofficiel'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#F26513] text-white text-xs font-bold"
                >
                  Facebook : Bovann Officiel
                </a>
                <a
                  href={settings.social_tiktok || 'https://www.tiktok.com/@bovann'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-bold"
                >
                  TikTok : @bovann
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-white border border-zinc-200 p-8">
            {sent ? (
              <div className="py-12 text-center space-y-3">
                <h3 className="font-display text-2xl font-extrabold text-zinc-950">Message envoyé</h3>
                <p className="text-sm text-zinc-600">
                  Merci pour votre message. L'équipe Boovan Group vous répondra rapidement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-display text-xl font-extrabold text-zinc-950 pb-2 border-b border-zinc-200">
                  Envoyer un message
                </h3>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Entreprise</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">E-mail *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Téléphone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Pays *</label>
                    <select
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                    >
                      {AFRICAN_COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Objet *</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  {submitting ? 'Envoi...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

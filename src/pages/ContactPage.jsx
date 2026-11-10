import React, { useState } from 'react';
import { AFRICAN_COUNTRIES } from '../data/media';
import { fetchJson } from '../utils/api';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle, MessageCircle, Send, ArrowRight } from 'lucide-react';
import { OcdButton } from '../components/OcdLoader';

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

  const contactWhatsapp = settings.contact_whatsapp || '+228 90 00 00 00';
  const cleanPhone = contactWhatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Bonjour l'équipe OCD LIVE, je souhaite des renseignements sur vos services.")}`;

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
      setErrorMsg(err.message || "Erreur lors de l'envoi du message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-transparent py-10 lg:py-16 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header direct et sans fioriture */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Contacter le Studio OCD LIVE
          </h1>
          <p className="text-base text-slate-700 leading-relaxed font-medium">
            Pour une réponse immédiate, écrivez-nous directement sur WhatsApp ou remplissez le formulaire ci-dessous.
          </p>
        </div>

        {/* Bannière WhatsApp Prioritaire (Action immédiate pour l'Afrique) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow-md group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                Canal le plus rapide (Réponse sous 15 min)
              </span>
              <p className="text-xl sm:text-2xl font-black">
                Discuter sur WhatsApp avec le Studio
              </p>
              <p className="text-sm text-emerald-50 font-medium">
                {contactWhatsapp} • Conseillers disponibles 7j/7
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-800 font-bold text-sm shrink-0 shadow-xs group-hover:scale-105 transition-transform self-start sm:self-auto">
            <span>Ouvrir WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Coordonnées physiques et réseaux */}
          <div className="lg:col-span-5 rounded-2xl bg-white border-2 border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-xl font-bold text-slate-950">
              Coordonnées du complexe
            </h2>

            <div className="space-y-5 text-sm text-slate-700">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#F26513] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Siège & Studio au Togo</span>
                  <p className="text-sm text-slate-600 mt-1 leading-snug">
                    {settings.studio_address || 'Complexe Audiovisuel OCD LIVE — Boovan Group, Lomé, Togo'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Ligne directe</span>
                  <p className="text-sm font-mono font-semibold text-slate-800 mt-1">
                    {settings.contact_phone || '+228 90 00 00 00'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Adresse e-mail officielle</span>
                  <p className="text-sm font-mono text-slate-800 mt-1">
                    {settings.contact_email || 'contact@boovangroup.com'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Suivre nos émissions
              </span>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={settings.social_facebook || 'https://www.facebook.com/Bovannofficiel'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Facebook Bovann
                </a>
                <a
                  href={settings.social_tiktok || 'https://www.tiktok.com/@bovann'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  TikTok Bovann
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire de message écrit */}
          <div className="lg:col-span-7 rounded-2xl bg-white border-2 border-slate-200 p-6 sm:p-8 shadow-xs">
            {sent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-950">Message bien envoyé</h3>
                <p className="text-sm sm:text-base text-slate-700 max-w-md mx-auto">
                  Votre message a bien été transmis aux régisseurs de Boovan Group. Nous vous recontacterons sous 24 heures.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setForm({
                        full_name: '',
                        company: '',
                        email: '',
                        phone: '',
                        country: 'Togo',
                        subject: 'Demande d\'information sur OCD LIVE',
                        message: ''
                      });
                    }}
                    className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="pb-2 border-b border-slate-200">
                  <h3 className="text-xl font-bold text-slate-950">
                    Formulaire de contact écrit
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Tous les champs avec astérisque (*) sont requis.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-900 text-sm mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex. Koffi Mensah"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none text-slate-950 text-base font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-900 text-sm mb-1.5">
                      Entreprise / Marque
                    </label>
                    <input
                      type="text"
                      placeholder="Ex. Mode & Beauté Lomé"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none text-slate-950 text-base font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-900 text-sm mb-1.5">
                      Adresse e-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="votre-email@domaine.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none text-slate-950 text-base font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-900 text-sm mb-1.5">
                      Téléphone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+228 90 00 00 00"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none text-slate-950 text-base font-mono font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-900 text-sm mb-1.5">
                      Pays *
                    </label>
                    <select
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none text-slate-950 text-base font-medium bg-white"
                    >
                      {AFRICAN_COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-900 text-sm mb-1.5">
                      Objet de la demande *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none text-slate-950 text-base font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-900 text-sm mb-1.5">
                      Votre message détaillé *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Expliquez votre projet de vente en live ou posez votre question technique..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-[#F26513] focus:ring-0 outline-none text-slate-950 text-base font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <OcdButton
                    type="submit"
                    loading={submitting}
                    icon={Send}
                    className="w-full min-h-[52px] text-base font-bold"
                  >
                    Envoyer mon message
                  </OcdButton>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

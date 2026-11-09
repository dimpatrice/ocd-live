import React, { useState } from 'react';
import { Check, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchJson } from '../utils/api';

export default function RecruitmentPage() {
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    phone: '',
    whatsapp: '',
    city: 'Lomé',
    country: 'Togo',
    email: '',
    bio_presentation: '',
    experience_summary: '',
    availability: 'Immédiate',
    cv_url: '',
    video_url: ''
  });

  const [uploadingField, setUploadingField] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);

  async function handleFileUpload(file, fieldName) {
    if (!file) return;
    setUploadingField(fieldName);
    setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const data = await fetchJson('/api/public/upload', { method: 'POST', body: fd });
      setForm((prev) => ({ ...prev, [fieldName]: data.url }));
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploadingField(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const data = await fetchJson('/api/public/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setSubmittedApp(data.application);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-14 lg:py-20 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Présentation du poste */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <span>Recrutement Studio • Lomé, Togo</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">
              Rejoignez l'équipe d'animation OCD LIVE
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Nous recrutons une animatrice / présentatrice dynamique, éloquente et passionnée par le commerce pour accueillir et accompagner les entrepreneurs lors de leurs émissions en direct.
            </p>

            <div className="p-4 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 space-y-1 shadow-xs">
              <span className="font-semibold text-slate-900 block">Conditions d'accès :</span>
              <p>Aucun diplôme spécifique requis. Sens relationnel, excellente élocution et ponctualité indispensables. Poste basé au complexe audiovisuel de Lomé.</p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1000&q=85"
                alt="Présentatrice au studio"
                className="w-full h-[400px] object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Profil recherché & Missions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-7 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <h2 className="font-semibold text-lg text-slate-950">Profil recherché</h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {[
                'Résider au Togo (Lomé et agglomération)',
                'Aisance d\'expression orale et clarté d\'élocution',
                'Capacité d\'écoute et valorisation des produits exposés',
                'Dynamisme, esprit d\'équipe et ponctualité',
                'Sensibilité commerciale et goût du contact humain'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-7 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <h2 className="font-semibold text-lg text-slate-950">Missions principales</h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {[
                'Accueil physique des entrepreneurs au complexe de Lomé',
                'Briefing et mise en confiance des intervenants avant l\'antenne',
                'Relance dynamique et démonstration des articles en direct',
                'Assistance des participants connectés en duplex à distance',
                'Coordination fluide avec le réalisateur en régie centrale'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Formulaire de candidature */}
        <div className="max-w-3xl mx-auto rounded-xl bg-white border border-slate-200 p-7 sm:p-9 shadow-xs">
          {submittedApp ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">
                Candidature enregistrée avec succès
              </h3>
              <p className="text-xs font-mono text-slate-500">
                Référence dossier : {submittedApp.reference}
              </p>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Merci {submittedApp.full_name}. Votre dossier a été transmis à la direction de Boovan Group. En cas de sélection, notre équipe vous contactera pour un entretien au studio.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-950">
                  Formulaire de candidature
                </h2>
                <p className="text-slate-500 mt-0.5">
                  Les champs marqués d'un astérisque (*) sont obligatoires.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Nom et prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Âge (facultatif)
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Numéro WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Ville de résidence *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Adresse e-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Disponibilité pour débuter *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Présentation personnelle (motivation et atouts) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.bio_presentation}
                    onChange={(e) => setForm({ ...form, bio_presentation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Expérience éventuelle en communication, vente ou accueil *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.experience_summary}
                    onChange={(e) => setForm({ ...form, experience_summary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#F26513] focus:ring-1 focus:ring-[#F26513] outline-none text-slate-900"
                  />
                </div>

                <div>
                  <span className="block font-medium text-slate-700 mb-1">
                    Curriculum Vitae (facultatif)
                  </span>
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 border border-dashed border-slate-300 hover:border-slate-400 text-slate-700">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>
                      {uploadingField === 'cv_url'
                        ? 'Téléversement en cours...'
                        : form.cv_url
                          ? 'Fichier joint'
                          : 'Joindre un CV (PDF/Image)'}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'cv_url')}
                    />
                  </label>
                </div>

                <div>
                  <span className="block font-medium text-slate-700 mb-1">
                    Courte vidéo de présentation (facultatif)
                  </span>
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 border border-dashed border-slate-300 hover:border-slate-400 text-slate-700">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>
                      {uploadingField === 'video_url'
                        ? 'Téléversement en cours...'
                        : form.video_url
                          ? 'Vidéo jointe'
                          : 'Joindre une courte vidéo (MP4/WebM)'}
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'video_url')}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-medium text-xs shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Transmission en cours...' : 'Soumettre ma candidature'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

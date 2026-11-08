import React, { useState } from 'react';
import { Check, Upload } from 'lucide-react';
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
    <div className="min-h-screen bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Présentation du poste */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
              Recrutement Studio • Togo
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-zinc-950 leading-tight">
              REJOIGNEZ L'AVENTURE <span className="text-[#F26513]">OCD LIVE</span>
            </h1>
            <p className="text-base text-zinc-600 leading-relaxed">
              Nous recherchons une jeune femme dynamique, éloquente, présentable et passionnée par la communication pour accompagner les entrepreneurs pendant leurs sessions de livestreaming au Togo.
            </p>
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs font-semibold text-zinc-800">
              Aucun diplôme spécifique n'est exigé. Poste basé au Studio OCD LIVE à Lomé (Togo).
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-lg bg-zinc-100">
              <img
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1000&q=85"
                alt="Animatrice et présentatrice au studio"
                className="w-full h-[420px] object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Profil recherché & Missions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
            <h2 className="font-display text-2xl font-extrabold text-zinc-950">Profil recherché</h2>
            <ul className="space-y-3 text-sm text-zinc-700">
              {[
                'Résider au Togo.',
                'Être à l\'aise à l\'oral.',
                'Avoir une bonne capacité de communication.',
                'Savoir présenter et valoriser des produits.',
                'Être dynamique et sérieuse.',
                'Avoir le sens du contact.',
                'Être motivée et désireuse d\'apprendre.'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#F26513] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
            <h2 className="font-display text-2xl font-extrabold text-zinc-950">Missions</h2>
            <ul className="space-y-3 text-sm text-zinc-700">
              {[
                'Accueillir et accompagner les entrepreneurs.',
                'Assister les participants à distance.',
                'Participer à la présentation des produits.',
                'Faciliter les interventions pendant les lives.',
                'Accompagner le déroulement des émissions.'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#F26513] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Formulaire de candidature */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-zinc-200 p-8 sm:p-10 shadow-sm">
          {submittedApp ? (
            <div className="text-center py-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                Candidature enregistrée • {submittedApp.reference}
              </span>
              <h3 className="font-display text-2xl font-extrabold text-zinc-950">
                Merci {submittedApp.full_name}
              </h3>
              <p className="text-sm text-zinc-600">
                Votre candidature a bien été transmise à la direction de Boovan Group.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-display text-2xl font-extrabold text-zinc-950 pb-3 border-b border-zinc-200">
                Formulaire de candidature
              </h2>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Nom et prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Âge (Facultatif)
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Ville de résidence *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Adresse e-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Disponibilité *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Présentation personnelle *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.bio_presentation}
                    onChange={(e) => setForm({ ...form, bio_presentation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Expérience en communication ou vente *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.experience_summary}
                    onChange={(e) => setForm({ ...form, experience_summary: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-300 focus:border-[#F26513] outline-none text-zinc-900 text-sm"
                  />
                </div>

                <div>
                  <span className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    CV (Facultatif)
                  </span>
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-300 hover:border-[#F26513] text-xs text-zinc-700">
                    <Upload className="w-4 h-4 text-[#F26513]" />
                    <span>
                      {uploadingField === 'cv_url'
                        ? 'Téléversement...'
                        : form.cv_url
                          ? 'CV joint'
                          : 'Joindre un CV'}
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
                  <span className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Vidéo de présentation (Facultatif)
                  </span>
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-300 hover:border-[#F26513] text-xs text-zinc-700">
                    <Upload className="w-4 h-4 text-[#F26513]" />
                    <span>
                      {uploadingField === 'video_url'
                        ? 'Téléversement...'
                        : form.video_url
                          ? 'Vidéo jointe'
                          : 'Joindre une vidéo'}
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-[#F26513] hover:bg-[#DC5309] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {submitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

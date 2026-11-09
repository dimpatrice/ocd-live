import React, { useState } from 'react';
import { CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { fetchJson } from '../utils/api';
import { OcdButton } from '../components/OcdLoader';

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
      setErrorMsg(err.message || 'Erreur lors du téléversement du fichier.');
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
      setErrorMsg(err.message || 'Impossible d\'enregistrer votre candidature.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-16 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Présentation du poste */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#F26513]">
              Recrutement Studio
            </span>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Rejoignez l'équipe d'animation OCD LIVE à Lomé
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Nous recrutons une animatrice / présentatrice dynamique, souriante et passionnée par le commerce pour animer les émissions en direct et mettre en valeur les produits des commerçants sur le plateau de Lomé.
            </p>

            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs sm:text-sm text-slate-800 space-y-1 shadow-xs font-medium">
              <strong className="block text-slate-950 font-bold">Conditions :</strong>
              <p>Aucun diplôme spécifique exigé. Bonne élocution, dynamisme, aisance face à la caméra et sens commercial indispensables. Poste basé au complexe de Lomé.</p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1000&q=85"
                alt="Présentatrice au studio"
                className="w-full h-[380px] object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Profil recherché & Missions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-xs">
            <h2 className="font-black text-xl text-slate-950">Profil recherché</h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Excellente élocution en français (connaissance du mina / éwé appréciée)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Énergie communicative et sens naturel de la vente en direct</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 shrink-0 mt-0.5" />
                <span>Capacité à interagir avec le public et répondre aux commentaires</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Rigueur, ponctualité et présentation soignée</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-xs">
            <h2 className="font-black text-xl text-slate-950">Missions principales</h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0 mt-0.5" />
                <span>Accueillir les commerçants et tester les articles avant l'antenne</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0 mt-0.5" />
                <span>Présenter les articles en direct et inciter les spectateurs à commander</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0 mt-0.5" />
                <span>Répéter à l'antenne les coordonnées WhatsApp et prix des articles</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F26513] shrink-0 mt-0.5" />
                <span>Collaborer avec l'équipe technique de régie Boovan Group</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Formulaire de candidature direct */}
        <div className="rounded-2xl bg-white border-2 border-slate-200 p-6 sm:p-10 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-2xl font-black text-slate-950">
              Déposer votre candidature
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Remplissez ce formulaire et joignez une courte vidéo de présentation si possible.
            </p>
          </div>

          {submittedApp ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-950">Candidature bien reçue !</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Merci {submittedApp.full_name}. Notre équipe de direction à Lomé examine votre profil et vous recontactera par téléphone ou WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Nom et prénom *</label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Ex. Edwige Amouzou"
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-300 focus:border-[#F26513] outline-none text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Âge</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="Ex. 24"
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-300 focus:border-[#F26513] outline-none text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Téléphone d'appel *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+228 90 00 00 00"
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-300 focus:border-[#F26513] outline-none text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Numéro WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="+228 90 00 00 00"
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-300 focus:border-[#F26513] outline-none text-base sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">Adresse e-mail *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="edwige@example.com"
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-300 focus:border-[#F26513] outline-none text-base sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">Présentation personnelle (vos motivations) *</label>
                  <textarea
                    rows={3}
                    required
                    value={form.bio_presentation}
                    onChange={(e) => setForm({ ...form, bio_presentation: e.target.value })}
                    placeholder="Parlez-nous de vous, de votre dynamisme et de ce qui vous attire dans l'animation en direct..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-300 focus:border-[#F26513] outline-none text-base sm:text-sm"
                  />
                </div>
              </div>

              {/* Fichiers CV et Vidéo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 block">CV (facultatif)</span>
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 hover:border-[#F26513] rounded-xl text-xs text-slate-700 bg-white">
                    <Upload className="w-4 h-4 text-[#F26513]" />
                    <span className="truncate">{uploadingField === 'cv_url' ? 'Téléversement...' : form.cv_url ? 'CV joint' : 'Joindre mon CV'}</span>
                    <input type="file" accept=".pdf,.doc,.docx,image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0], 'cv_url')} />
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 block">Courte vidéo (recommandé)</span>
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 hover:border-[#F26513] rounded-xl text-xs text-slate-700 bg-white">
                    <Upload className="w-4 h-4 text-[#F26513]" />
                    <span className="truncate">{uploadingField === 'video_url' ? 'Téléversement...' : form.video_url ? 'Vidéo jointe' : 'Vidéo de 30s'}</span>
                    <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0], 'video_url')} />
                  </label>
                </div>
              </div>

              <div className="pt-3">
                <OcdButton
                  type="submit"
                  variant="primary"
                  size="large"
                  loading={submitting}
                  loadingText="Envoi en cours..."
                  className="w-full"
                >
                  Envoyer ma candidature
                </OcdButton>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

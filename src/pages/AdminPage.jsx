import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '../router';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  Layers,
  Users,
  Bell,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Plus,
  Trash2,
  Save,
  Lock,
  Radio,
  AlertCircle,
  Send,
  Building2,
  Phone,
  Globe2,
  FileText,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { AFRICAN_COUNTRIES } from '../data/media';
import { fetchJson } from '../utils/api';

export default function AdminPage({ onConfigUpdated }) {
  const [token, setToken] = useState(() => localStorage.getItem('ocd_admin_token') || '');
  const [adminUser, setAdminUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('direction@boovangroup.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | reservations | calendar | packages | recruitment | notifications | settings

  // Données chargées
  const [dashboardData, setDashboardData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [scheduleData, setScheduleData] = useState({ weekly: [], overrides: [] });
  const [packagesData, setPackagesData] = useState({ packages: [], addons: [] });
  const [applications, setApplications] = useState([]);
  const [notificationsData, setNotificationsData] = useState({ notifications: [], contacts: [] });
  const [settingsForm, setSettingsForm] = useState({});

  // Lives Panafricains & OCD Shop
  const [communityLives, setCommunityLives] = useState([]);
  const [shopProducts, setShopProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    category: 'Nourriture & Restauration',
    country: 'Togo',
    seller_name: '',
    whatsapp: '',
    phone: '',
    price_fcfa: 5000,
    description: '',
    image_url: '',
    badge: 'NOUVEAU',
    in_stock: true
  });

  const [statusFeedback, setStatusFeedback] = useState('');

  // Filtres Réservations
  const [resFilter, setResFilter] = useState({
    search: '',
    date: '',
    country: '',
    package_id: '',
    mode: '',
    booking_status: '',
    payment_status: ''
  });

  // Vue Calendrier Admin (Jour / Semaine / Mois)
  const [calViewMode, setCalViewMode] = useState('MONTH'); // 'DAY' | 'WEEK' | 'MONTH'
  const [calSelectedDate, setCalSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  });
  const [overrideForm, setOverrideForm] = useState({
    date_str: '',
    is_closed: true,
    reason: 'Journée privatisée / Maintenance Studio',
    custom_slots_text: '08:00, 10:00, 14:00, 16:00'
  });

  // Édition de Forfait
  const [editingPackage, setEditingPackage] = useState(null);
  const [newAddonForm, setNewAddonForm] = useState({
    name: '',
    description: '',
    price_fcfa: 10000,
    requires_team_validation: false
  });

  const [testEmailAddress, setTestEmailAddress] = useState('direction@boovangroup.com');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState('');

  async function handleSendTestEmail(e) {
    e.preventDefault();
    if (!testEmailAddress) return;
    setTestingEmail(true);
    setTestEmailResult('');
    try {
      const data = await fetchJson('/api/admin/send-test-email', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ target_email: testEmailAddress })
      });
      setTestEmailResult(data.message || 'E-mail envoyé.');
      showToast('E-mail de test déclenché.');
      await loadAllAdminData();
    } catch (err) {
      setTestEmailResult(`Erreur : ${err.message}`);
    } finally {
      setTestingEmail(false);
    }
  }

  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  }

  function showToast(msg) {
    setStatusFeedback(msg);
    setTimeout(() => setStatusFeedback(''), 4000);
  }

  // Vérification initiale du jeton
  useEffect(() => {
    if (!token) {
      setAdminUser(null);
      return;
    }
    fetchJson('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((d) => {
        setAdminUser(d.user);
        loadAllAdminData();
      })
      .catch(() => {
        localStorage.removeItem('ocd_admin_token');
        setToken('');
        setAdminUser(null);
      });
  }, [token]);

  async function loadAllAdminData() {
    if (!token) return;
    try {
      const [dashRes, resList, schedRes, pkgRes, appRes, notifRes, pubCfg, livesRes, shopRes] = await Promise.all([
        fetchJson('/api/admin/dashboard', { headers: authHeaders() }),
        fetchJson('/api/admin/reservations', { headers: authHeaders() }),
        fetchJson('/api/admin/schedule', { headers: authHeaders() }),
        fetchJson('/api/admin/packages', { headers: authHeaders() }),
        fetchJson('/api/admin/applications', { headers: authHeaders() }),
        fetchJson('/api/admin/notifications', { headers: authHeaders() }),
        fetchJson('/api/public/config'),
        fetchJson('/api/admin/community-lives', { headers: authHeaders() }).catch(() => ({ lives: [] })),
        fetchJson('/api/admin/shop', { headers: authHeaders() }).catch(() => ({ products: [] }))
      ]);

      if (dashRes.kpis) setDashboardData(dashRes);
      if (resList.reservations) setReservations(resList.reservations);
      if (schedRes.weekly) setScheduleData(schedRes);
      if (pkgRes.packages) setPackagesData(pkgRes);
      if (appRes.applications) setApplications(appRes.applications);
      if (notifRes.notifications) setNotificationsData(notifRes);
      if (pubCfg.settings) setSettingsForm(pubCfg.settings);
      if (livesRes.lives) setCommunityLives(livesRes.lives);
      if (shopRes.products) setShopProducts(shopRes.products);
    } catch (e) {
      console.error('Erreur chargement back-office:', e);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await fetchJson('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      localStorage.setItem('ocd_admin_token', data.token);
      setToken(data.token);
      setAdminUser(data.user);
    } catch (err) {
      setLoginError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('ocd_admin_token');
    setToken('');
    setAdminUser(null);
  }

  // Filtrage côté client instantané + multi-critères des réservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      if (resFilter.search) {
        const q = resFilter.search.toLowerCase();
        const match =
          r.reference.toLowerCase().includes(q) ||
          r.company_name.toLowerCase().includes(q) ||
          `${r.client_first_name} ${r.client_last_name}`.toLowerCase().includes(q) ||
          r.client_phone.toLowerCase().includes(q) ||
          r.client_email.toLowerCase().includes(q) ||
          r.sector.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (resFilter.date && r.booking_date !== resFilter.date) return false;
      if (resFilter.country && r.client_country !== resFilter.country) return false;
      if (resFilter.package_id && Number(r.package_id) !== Number(resFilter.package_id)) return false;
      if (resFilter.mode && r.participation_mode !== resFilter.mode) return false;
      if (resFilter.booking_status && r.booking_status !== resFilter.booking_status) return false;
      if (resFilter.payment_status && r.payment_status !== resFilter.payment_status) return false;
      return true;
    });
  }, [reservations, resFilter]);

  // Export CSV / Excel compatible UTF-8 BOM
  function handleExportExcelCsv() {
    const headers = [
      'Reference',
      'Date',
      'Heure_Debut',
      'Heure_Fin',
      'Mode',
      'Forfait',
      'Montant_FCFA',
      'Statut_Reservation',
      'Statut_Paiement',
      'Client_Nom',
      'Client_Prenom',
      'Client_Telephone',
      'Client_WhatsApp',
      'Client_Email',
      'Pays',
      'Ville',
      'Entreprise',
      'Secteur',
      'Assistance_Togo'
    ];
    const rows = filteredReservations.map((r) => [
      r.reference,
      r.booking_date,
      r.start_time,
      r.end_time,
      r.participation_mode,
      r.package_name,
      r.total_price_fcfa,
      r.booking_status,
      r.payment_status,
      r.client_last_name,
      r.client_first_name,
      r.client_phone,
      r.client_whatsapp,
      r.client_email,
      r.client_country,
      r.client_city,
      r.company_name,
      r.sector,
      r.remote_assistance
    ]);

    const csvContent =
      '\uFEFF' +
      [headers, ...rows]
        .map((row) => row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'))
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OCD_LIVE_Reservations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Export / Impression PDF officiel d'une fiche ou de la liste
  function handlePrintPdf() {
    window.print();
  }

  // Mise à jour d'une réservation
  async function handleUpdateReservation(id, updates) {
    try {
      const data = await fetchJson(`/api/admin/reservations/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(updates)
      });
      showToast(data.message || 'Réservation mise à jour.');
      setSelectedReservation(data.reservation);
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  // Sauvegarder horaires hebdomadaires
  async function handleSaveWeeklySchedule() {
    try {
      const data = await fetchJson('/api/admin/schedule/weekly', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ weekly: scheduleData.weekly })
      });
      showToast(data.message);
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  // Ajouter une exception calendrier (bloquer une date ou définir des créneaux spéciaux)
  async function handleAddOverride(e) {
    e.preventDefault();
    if (!overrideForm.date_str) return;
    const customSlots = overrideForm.is_closed
      ? []
      : overrideForm.custom_slots_text
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    try {
      await fetchJson('/api/admin/schedule/override', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          date_str: overrideForm.date_str,
          is_closed: overrideForm.is_closed,
          reason: overrideForm.reason,
          custom_slots: customSlots
        })
      });
      showToast('Configuration de la date enregistrée.');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteOverride(id) {
    try {
      await fetchJson(`/api/admin/schedule/override/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      showToast('Exception supprimée.');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  // Sauvegarder un forfait (Création ou Modification)
  async function handleSavePackage(e) {
    e.preventDefault();
    if (!editingPackage) return;
    const isNew = !editingPackage.id;
    const url = isNew ? '/api/admin/packages' : `/api/admin/packages/${editingPackage.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const payload = {
      ...editingPackage,
      features:
        typeof editingPackage.features_text === 'string'
          ? editingPackage.features_text
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean)
          : editingPackage.features || []
    };

    try {
      await fetchJson(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
      showToast(isNew ? 'Nouveau forfait créé.' : 'Forfait mis à jour.');
      setEditingPackage(null);
      await loadAllAdminData();
      if (onConfigUpdated) onConfigUpdated();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeletePackage(id) {
    try {
      await fetchJson(`/api/admin/packages/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      showToast('Forfait supprimé.');
      await loadAllAdminData();
      if (onConfigUpdated) onConfigUpdated();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleCreateAddon(e) {
    e.preventDefault();
    try {
      await fetchJson('/api/admin/addons', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newAddonForm)
      });
      setNewAddonForm({ name: '', description: '', price_fcfa: 10000, requires_team_validation: false });
      showToast('Supplément ajouté.');
      await loadAllAdminData();
      if (onConfigUpdated) onConfigUpdated();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteAddon(id) {
    try {
      await fetchJson(`/api/admin/addons/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      showToast('Supplément supprimé.');
      await loadAllAdminData();
      if (onConfigUpdated) onConfigUpdated();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleUpdateApplication(id, status, internal_notes) {
    try {
      await fetchJson(`/api/admin/applications/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status, internal_notes })
      });
      showToast('Statut de la candidature mis à jour.');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    try {
      await fetchJson('/api/admin/settings', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(settingsForm)
      });
      showToast('Paramètres généraux sauvegardés.');
      await loadAllAdminData();
      if (onConfigUpdated) onConfigUpdated();
    } catch (err) {
      alert(err.message);
    }
  }

  // Actions Lives Panafricains
  async function handleUpdateLiveStatus(liveId, newStatus) {
    try {
      await fetchJson(`/api/admin/community-lives/${liveId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      showToast(`Statut du live mis à jour : ${newStatus}`);
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleToggleLiveSubscription(liveId, currentSub) {
    try {
      await fetchJson(`/api/admin/community-lives/${liveId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ has_active_subscription: !currentSub })
      });
      showToast('Abonnement 5000 F mis à jour.');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteLive(liveId) {
    if (!window.confirm('Voulez-vous vraiment supprimer ce direct ?')) return;
    try {
      await fetchJson(`/api/admin/community-lives/${liveId}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      showToast('Live supprimé.');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  // Actions OCD Shop
  async function handleCreateShopProduct(e) {
    e.preventDefault();
    try {
      await fetchJson('/api/admin/shop', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newProductForm)
      });
      showToast('Article ajouté au catalogue OCD Shop.');
      setShowAddProductModal(false);
      setNewProductForm({
        title: '',
        category: 'Nourriture & Restauration',
        country: 'Togo',
        seller_name: '',
        whatsapp: '',
        phone: '',
        price_fcfa: 5000,
        description: '',
        image_url: '',
        badge: 'NOUVEAU',
        in_stock: true
      });
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleToggleProductStock(productId, currentStock) {
    try {
      await fetchJson(`/api/admin/shop/${productId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ in_stock: currentStock ? 0 : 1 })
      });
      showToast('Disponibilité du produit mise à jour.');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteProduct(productId) {
    if (!window.confirm('Voulez-vous retirer ce produit du catalogue ?')) return;
    try {
      await fetchJson(`/api/admin/shop/${productId}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      showToast('Produit retiré.');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  // Écran de connexion Administrateur
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-obsidian pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-3xl bg-anthracite border-2 border-gold-400/40 p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center text-obsidian">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block">
                BOOVAN GROUP • ACCÈS SÉCURISÉ
              </span>
              <h1 className="font-serif text-2xl font-bold text-white">
                Back-Office OCD LIVE
              </h1>
            </div>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                E-mail Administrateur
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-obsidian border border-white/15 focus:border-gold-400 outline-none text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-obsidian border border-white/15 focus:border-gold-400 outline-none text-white text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gold-gradient text-obsidian font-display font-extrabold text-xs uppercase tracking-wider shadow-lg"
            >
              SE CONNECTER AU TABLEAU DE BORD
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-obsidian/80 border border-white/10 text-xs text-zinc-400 space-y-1">
            <p className="text-gold-300 font-mono font-semibold">Accès Administrateur Initial :</p>
            <p>E-mail : <code className="text-zinc-200">direction@boovangroup.com</code></p>
            <p>Mot de passe : <code className="text-zinc-200">OcdLive@Boovan2026!</code></p>
          </div>
        </div>
      </div>
    );
  }

  const kpis = dashboardData?.kpis || {};

  return (
    <div className="min-h-screen bg-obsidian pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Barre supérieure Back-Office */}
        <div className="rounded-3xl bg-anthracite border border-gold-400/30 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center text-obsidian font-bold">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                  PORTAIL D'ADMINISTRATION • BOOVAN GROUP
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  {adminUser.role}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Direction & Gestion OCD LIVE
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {statusFeedback && (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                {statusFeedback}
              </span>
            )}
            <button
              type="button"
              onClick={loadAllAdminData}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-200 flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold-400" />
              <span>Actualiser</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-mono text-red-300 flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Navigation par onglets du Back-Office */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'dashboard', label: 'Vue d\'ensemble & KPI', icon: LayoutDashboard },
            { id: 'reservations', label: `Réservations (${reservations.length})`, icon: FileText },
            {
              id: 'community_lives',
              label: `Modération Lives (${communityLives.filter((l) => l.status === 'PENDING').length} attente)`,
              icon: Radio
            },
            { id: 'shop', label: `OCD Shop (${shopProducts.length})`, icon: ShoppingBag },
            { id: 'calendar', label: 'Gestion du Calendrier', icon: CalendarIcon },
            { id: 'packages', label: 'Forfaits & Options', icon: Layers },
            { id: 'recruitment', label: `Recrutement (${applications.length})`, icon: Users },
            {
              id: 'notifications',
              label: `Notifications (${kpis.unreadNotifications || 0})`,
              icon: Bell
            },
            { id: 'settings', label: 'Paramètres Généraux', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  active
                    ? 'bg-gold-gradient text-obsidian shadow-lg'
                    : 'bg-anthracite text-zinc-300 hover:text-white border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===================================================================
            ONGLET 1 : DASHBOARD & STATISTIQUES INTERACTIVES
        =================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Grille des 9 indicateurs exigés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  label: 'Nombre total de réservations',
                  value: kpis.totalReservations ?? 0,
                  sub: 'Toutes périodes confondues',
                  accent: 'text-white'
                },
                {
                  label: 'Réservations du jour (Lomé)',
                  value: kpis.todayReservations ?? 0,
                  sub: 'Sessions prévues aujourd\'hui',
                  accent: 'text-gold-300'
                },
                {
                  label: 'Réservations à venir',
                  value: kpis.upcomingReservations ?? 0,
                  sub: 'Créneaux futurs actifs',
                  accent: 'text-emerald-400'
                },
                {
                  label: 'Réservations confirmées',
                  value: kpis.confirmedReservations ?? 0,
                  sub: 'Validées par l\'administration',
                  accent: 'text-emerald-400'
                },
                {
                  label: 'Réservations en attente',
                  value: kpis.pendingReservations ?? 0,
                  sub: 'En attente de validation',
                  accent: 'text-amber-300'
                },
                {
                  label: 'Réservations annulées',
                  value: kpis.cancelledReservations ?? 0,
                  sub: 'Créneaux libérés',
                  accent: 'text-red-400'
                },
                {
                  label: 'Chiffre d\'affaires confirmé',
                  value: `${Number(kpis.confirmedRevenueFcfa || 0).toLocaleString('fr-FR')} FCFA`,
                  sub: 'Paiements vérifiés uniquement',
                  accent: 'text-gold-300'
                },
                {
                  label: 'Paiements en attente',
                  value: `${kpis.pendingPaymentsCount ?? 0} (${Number(kpis.pendingRevenueFcfa || 0).toLocaleString('fr-FR')} FCFA)`,
                  sub: 'À vérifier avant confirmation',
                  accent: 'text-amber-300'
                },
                {
                  label: 'Entreprises inscrites',
                  value: kpis.registeredCompaniesCount ?? 0,
                  sub: 'Marques et commerces distincts',
                  accent: 'text-white'
                }
              ].map((card, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-anthracite border border-white/10 space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                    {card.label}
                  </span>
                  <div className={`font-serif text-3xl font-bold ${card.accent}`}>{card.value}</div>
                  <p className="text-xs text-zinc-500">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Graphiques de répartition */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Répartition par Forfait */}
              <div className="p-6 rounded-3xl bg-anthracite border border-white/10 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-gold-400">
                  RÉPARTITION PAR FORFAIT
                </h3>
                {(dashboardData?.charts?.packageBreakdown || []).length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6">Aucune réservation enregistrée pour le moment.</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.charts.packageBreakdown.map((item) => {
                      const pct = Math.min(100, Math.round((item.count / Math.max(1, kpis.totalReservations)) * 100));
                      return (
                        <div key={item.name} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-200 font-semibold">{item.name}</span>
                            <span className="font-mono text-gold-300">{item.count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-obsidian overflow-hidden">
                            <div className="h-full bg-gold-gradient" style={{ width: `${Math.max(8, pct)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Répartition Présentiel vs À Distance */}
              <div className="p-6 rounded-3xl bg-anthracite border border-white/10 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-gold-400">
                  MODE DE PARTICIPATION
                </h3>
                <div className="space-y-4 pt-2">
                  {(dashboardData?.charts?.modeBreakdown || []).map((m) => {
                    const pct = Math.min(100, Math.round((m.count / Math.max(1, kpis.totalReservations)) * 100));
                    return (
                      <div key={m.mode} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-200">{m.mode}</span>
                          <span className="font-mono text-gold-300">{m.count}</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-obsidian overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${Math.max(5, pct)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Répartition Géographique */}
              <div className="p-6 rounded-3xl bg-anthracite border border-white/10 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-gold-400">
                  PAYS DES ENTREPRENEURS
                </h3>
                {(dashboardData?.charts?.countryBreakdown || []).length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6">Aucune donnée géographique disponible.</p>
                ) : (
                  <div className="space-y-2.5">
                    {dashboardData.charts.countryBreakdown.map((c) => (
                      <div key={c.country} className="flex items-center justify-between p-2.5 rounded-xl bg-obsidian text-xs">
                        <span className="text-zinc-200 font-medium">{c.country}</span>
                        <span className="font-mono text-gold-300 font-bold">{c.count} réserv.</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET 2 : GESTION DES RÉSERVATIONS & FICHE DÉTAILLÉE 8 SECTIONS
        =================================================================== */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            {/* Barre de filtres avancés & Exports */}
            <div className="p-6 rounded-3xl bg-anthracite border border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-serif text-2xl font-bold text-white">
                  Registre Complet des Réservations
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportExcelCsv}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Excel (CSV)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintPdf}
                    className="px-4 py-2.5 rounded-xl bg-gold-400/15 hover:bg-gold-400/25 border border-gold-400/30 text-gold-300 text-xs font-mono flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Export / Imprimer PDF</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <input
                  type="text"
                  value={resFilter.search}
                  onChange={(e) => setResFilter({ ...resFilter, search: e.target.value })}
                  placeholder="Rechercher réf, client, entreprise..."
                  className="lg:col-span-2 px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-xs text-white outline-none focus:border-gold-400"
                />
                <input
                  type="date"
                  value={resFilter.date}
                  onChange={(e) => setResFilter({ ...resFilter, date: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-xs text-white outline-none"
                />
                <select
                  value={resFilter.mode}
                  onChange={(e) => setResFilter({ ...resFilter, mode: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-xs text-white outline-none"
                >
                  <option value="">Tous les modes</option>
                  <option value="PRESENTIEL">Présentiel (Togo)</option>
                  <option value="DISTANCE">À distance</option>
                </select>
                <select
                  value={resFilter.booking_status}
                  onChange={(e) => setResFilter({ ...resFilter, booking_status: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-xs text-white outline-none"
                >
                  <option value="">Tous statuts dossier</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="CONFIRMEE">Confirmée</option>
                  <option value="TERMINEE">Terminée</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
                <select
                  value={resFilter.payment_status}
                  onChange={(e) => setResFilter({ ...resFilter, payment_status: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-xs text-white outline-none"
                >
                  <option value="">Tous paiements</option>
                  <option value="EN_ATTENTE_PAIEMENT">En attente paiement</option>
                  <option value="PREUVE_TRANSMISE">Preuve transmise</option>
                  <option value="PAYE_CONFIRME">Payé & Confirmé</option>
                </select>
              </div>
            </div>

            {/* Tableau professionnel des réservations */}
            <div className="rounded-3xl bg-anthracite border border-white/10 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-obsidian/50">
                    <th className="py-4 px-4">Référence</th>
                    <th className="py-4 px-4">Entreprise & Client</th>
                    <th className="py-4 px-4">Date & Horaire (Lomé)</th>
                    <th className="py-4 px-4">Mode & Pays</th>
                    <th className="py-4 px-4">Forfait & Montant</th>
                    <th className="py-4 px-4">Paiement</th>
                    <th className="py-4 px-4">Statut</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-zinc-500">
                        Aucune réservation ne correspond aux critères sélectionnés.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((r) => (
                      <tr key={r.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-gold-300">{r.reference}</td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-white">{r.company_name}</p>
                          <p className="text-zinc-400">
                            {r.client_first_name} {r.client_last_name} • {r.client_whatsapp}
                          </p>
                        </td>
                        <td className="py-4 px-4 font-mono">
                          <p className="text-white font-semibold">{r.booking_date}</p>
                          <p className="text-gold-300">
                            {r.start_time.replace(':', 'h')} – {r.end_time.replace(':', 'h')}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-200 font-mono text-[10px]">
                            {r.participation_mode}
                          </span>
                          <p className="text-zinc-400 mt-1">
                            {r.client_city}, {r.client_country}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-white">{r.package_name}</p>
                          <p className="font-mono text-gold-300">
                            {r.is_custom_quote
                              ? 'Sur devis'
                              : `${Number(r.total_price_fcfa).toLocaleString('fr-FR')} FCFA`}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                              r.payment_status === 'PAYE_CONFIRME'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : r.payment_status === 'PREUVE_TRANSMISE'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {r.payment_status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                              r.booking_status === 'CONFIRMEE'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : r.booking_status === 'ANNULEE'
                                  ? 'bg-red-500/20 text-red-300'
                                  : 'bg-zinc-700 text-zinc-200'
                            }`}
                          >
                            {r.booking_status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedReservation(r)}
                            className="px-3.5 py-2 rounded-xl bg-gold-400/15 hover:bg-gold-400 text-gold-300 hover:text-obsidian font-mono font-bold text-xs transition-all inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Fiche complète</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal / Fiche détaillée du client organisée en 8 sections */}
            {selectedReservation && (
              <div className="rounded-3xl bg-anthracite border-2 border-gold-400 p-7 sm:p-10 shadow-2xl space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                      FICHE DÉTAILLÉE DE LA RÉSERVATION • {selectedReservation.reference}
                    </span>
                    <h3 className="font-serif text-3xl font-bold text-white mt-1">
                      {selectedReservation.company_name} — {selectedReservation.client_first_name}{' '}
                      {selectedReservation.client_last_name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateReservation(selectedReservation.id, {
                          booking_status: 'CONFIRMEE'
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold"
                    >
                      Confirmer la réservation
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateReservation(selectedReservation.id, {
                          payment_status: 'PAYE_CONFIRME'
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-gold-gradient text-obsidian text-xs font-mono font-bold"
                    >
                      Valider le Paiement Réel
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateReservation(selectedReservation.id, {
                          send_reminder: true
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono"
                    >
                      Envoyer Rappel Live
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateReservation(selectedReservation.id, {
                          booking_status: 'ANNULEE'
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedReservation(null)}
                      className="px-4 py-2 rounded-xl bg-white/10 text-zinc-300 text-xs font-mono"
                    >
                      Fermer
                    </button>
                  </div>
                </div>

                {/* Les 8 sections réglementaires de la fiche client */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* 1. Informations personnelles */}
                  <div className="p-5 rounded-2xl bg-obsidian border border-white/10 space-y-2">
                    <h4 className="font-mono font-bold uppercase tracking-wider text-gold-400">
                      1. Informations personnelles
                    </h4>
                    <p><span className="text-zinc-400">Nom & Prénom :</span> {selectedReservation.client_last_name} {selectedReservation.client_first_name}</p>
                    <p><span className="text-zinc-400">Téléphone :</span> {selectedReservation.client_phone}</p>
                    <p><span className="text-zinc-400">WhatsApp :</span> {selectedReservation.client_whatsapp}</p>
                    <p><span className="text-zinc-400">E-mail :</span> {selectedReservation.client_email}</p>
                    <p><span className="text-zinc-400">Localisation :</span> {selectedReservation.client_address}, {selectedReservation.client_city} ({selectedReservation.client_country})</p>
                  </div>

                  {/* 2. Informations commerciales */}
                  <div className="p-5 rounded-2xl bg-obsidian border border-white/10 space-y-2">
                    <h4 className="font-mono font-bold uppercase tracking-wider text-gold-400">
                      2. Informations commerciales
                    </h4>
                    <p><span className="text-zinc-400">Entreprise :</span> {selectedReservation.company_name}</p>
                    <p><span className="text-zinc-400">Nom commercial :</span> {selectedReservation.trade_name || 'N/A'}</p>
                    <p><span className="text-zinc-400">Secteur :</span> {selectedReservation.sector}</p>
                    <p><span className="text-zinc-400">Description :</span> {selectedReservation.activity_description}</p>
                  </div>

                  {/* 3. Produits et services */}
                  <div className="p-5 rounded-2xl bg-obsidian border border-white/10 space-y-2">
                    <h4 className="font-mono font-bold uppercase tracking-wider text-gold-400">
                      3. Produits et services à présenter
                    </h4>
                    <p><span className="text-zinc-400">Produits :</span> {selectedReservation.products_to_present}</p>
                    <p><span className="text-zinc-400">Quantité approximative :</span> {selectedReservation.approx_products_count}</p>
                    <p><span className="text-zinc-400">Grille de prix :</span> {selectedReservation.products_price_range || 'Non précisée'}</p>
                    <p><span className="text-zinc-400">Objectifs du live :</span> {(selectedReservation.live_objectives || []).join(', ')}</p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      {selectedReservation.company_logo_url && (
                        <a
                          href={selectedReservation.company_logo_url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-gold-400/15 text-gold-300 border border-gold-400/30"
                        >
                          Télécharger le Logo
                        </a>
                      )}
                      {(selectedReservation.product_photos || []).map((photoUrl, idx) => (
                        <a
                          key={idx}
                          href={photoUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white/10 text-zinc-200"
                        >
                          Photo produit #{idx + 1}
                        </a>
                      ))}
                      {selectedReservation.presentation_video_url && (
                        <a
                          href={selectedReservation.presentation_video_url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300"
                        >
                          Télécharger Vidéo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* 4. Coordonnées commerciales */}
                  <div className="p-5 rounded-2xl bg-obsidian border border-white/10 space-y-2">
                    <h4 className="font-mono font-bold uppercase tracking-wider text-gold-400">
                      4. Coordonnées commerciales (Bandeau Live)
                    </h4>
                    <p><span className="text-zinc-400">Téléphone commercial :</span> {selectedReservation.business_phone}</p>
                    <p><span className="text-zinc-400">WhatsApp commercial :</span> {selectedReservation.business_whatsapp}</p>
                    <p><span className="text-zinc-400">Adresse physique :</span> {selectedReservation.business_address}</p>
                    <p><span className="text-zinc-400">Ville & Pays :</span> {selectedReservation.business_city}, {selectedReservation.business_country}</p>
                  </div>

                  {/* 5. Réseaux sociaux */}
                  <div className="p-5 rounded-2xl bg-obsidian border border-white/10 space-y-2">
                    <h4 className="font-mono font-bold uppercase tracking-wider text-gold-400">
                      5. Réseaux sociaux & Web
                    </h4>
                    <p><span className="text-zinc-400">Site Web :</span> {selectedReservation.website_url || 'Non renseigné'}</p>
                    <p><span className="text-zinc-400">Facebook :</span> {selectedReservation.social_facebook || 'Non renseigné'}</p>
                    <p><span className="text-zinc-400">Instagram :</span> {selectedReservation.social_instagram || 'Non renseigné'}</p>
                    <p><span className="text-zinc-400">TikTok :</span> {selectedReservation.social_tiktok || 'Non renseigné'}</p>
                  </div>

                  {/* 6. Réservation & Programmation */}
                  <div className="p-5 rounded-2xl bg-obsidian border border-white/10 space-y-3">
                    <h4 className="font-mono font-bold uppercase tracking-wider text-gold-400">
                      6. Réservation & Créneau (Modifiable)
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-400">Date</label>
                        <input
                          type="date"
                          value={selectedReservation.booking_date}
                          onChange={(e) =>
                            setSelectedReservation({ ...selectedReservation, booking_date: e.target.value })
                          }
                          className="w-full px-2 py-1.5 rounded bg-anthracite border border-white/15 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400">Début</label>
                        <input
                          type="text"
                          value={selectedReservation.start_time}
                          onChange={(e) =>
                            setSelectedReservation({ ...selectedReservation, start_time: e.target.value })
                          }
                          className="w-full px-2 py-1.5 rounded bg-anthracite border border-white/15 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400">Fin</label>
                        <input
                          type="text"
                          value={selectedReservation.end_time}
                          onChange={(e) =>
                            setSelectedReservation({ ...selectedReservation, end_time: e.target.value })
                          }
                          className="w-full px-2 py-1.5 rounded bg-anthracite border border-white/15 text-white"
                        />
                      </div>
                    </div>
                    <p><span className="text-zinc-400">Forfait :</span> {selectedReservation.package_name}</p>
                    <p><span className="text-zinc-400">Mode :</span> {selectedReservation.participation_mode}</p>
                    <p><span className="text-zinc-400">Assistance Studio Togo :</span> {selectedReservation.remote_assistance}</p>
                  </div>

                  {/* 7. Paiement */}
                  <div className="p-5 rounded-2xl bg-obsidian border border-white/10 space-y-2">
                    <h4 className="font-mono font-bold uppercase tracking-wider text-gold-400">
                      7. Paiement & Justificatifs
                    </h4>
                    <p><span className="text-zinc-400">Méthode :</span> {selectedReservation.payment_method}</p>
                    <p><span className="text-zinc-400">Statut paiement :</span> <strong className="text-gold-300">{selectedReservation.payment_status}</strong></p>
                    <p><span className="text-zinc-400">Réf. transaction :</span> {selectedReservation.payment_reference || 'Aucune'}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="text-zinc-400">Montant (FCFA) :</label>
                      <input
                        type="number"
                        value={selectedReservation.total_price_fcfa}
                        onChange={(e) =>
                          setSelectedReservation({
                            ...selectedReservation,
                            total_price_fcfa: Number(e.target.value)
                          })
                        }
                        className="px-2.5 py-1 rounded bg-anthracite border border-white/15 text-white font-mono"
                      />
                    </div>
                    {selectedReservation.payment_proof_url && (
                      <div className="pt-2">
                        <a
                          href={selectedReservation.payment_proof_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block"
                        >
                          Consulter / Télécharger la preuve de paiement
                        </a>
                      </div>
                    )}
                  </div>

                  {/* 8. Notes internes */}
                  <div className="p-5 rounded-2xl bg-obsidian border border-white/10 space-y-2">
                    <h4 className="font-mono font-bold uppercase tracking-wider text-gold-400">
                      8. Notes internes (Administration & Régie)
                    </h4>
                    <textarea
                      rows={4}
                      value={selectedReservation.internal_notes || ''}
                      onChange={(e) =>
                        setSelectedReservation({ ...selectedReservation, internal_notes: e.target.value })
                      }
                      placeholder="Consignes pour l'animatrice, remarques sur le paiement, test technique..."
                      className="w-full p-3 rounded-xl bg-anthracite border border-white/15 text-white text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateReservation(selectedReservation.id, {
                          booking_date: selectedReservation.booking_date,
                          start_time: selectedReservation.start_time,
                          end_time: selectedReservation.end_time,
                          total_price_fcfa: selectedReservation.total_price_fcfa,
                          internal_notes: selectedReservation.internal_notes
                        })
                      }
                      className="px-5 py-2.5 rounded-xl bg-gold-gradient text-obsidian font-display font-bold text-xs uppercase tracking-wider"
                    >
                      Enregistrer les modifications de la fiche
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            ONGLET 3 : GESTION DU CALENDRIER (Vues Jour / Semaine / Mois + Horaires)
        =================================================================== */}
        {activeTab === 'calendar' && (
          <div className="space-y-8">
            {/* Sélecteur de vue Calendrier : Journalier, Hebdomadaire, Mensuel */}
            <div className="p-6 rounded-3xl bg-anthracite border border-white/10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                    PLANNING OPÉRATIONNEL DU STUDIO (AFRICA/LOME)
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white mt-1">
                    Consultation du Calendrier : Journalier, Hebdomadaire & Mensuel
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={calSelectedDate}
                    onChange={(e) => setCalSelectedDate(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-obsidian border border-white/15 text-xs text-white"
                  />
                  {[
                    { id: 'DAY', label: 'Journalier' },
                    { id: 'WEEK', label: 'Hebdomadaire' },
                    { id: 'MONTH', label: 'Mensuel' }
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setCalViewMode(v.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold ${
                        calViewMode === v.id
                          ? 'bg-gold-400 text-obsidian'
                          : 'bg-obsidian text-zinc-300 border border-white/10'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Affichage des réservations selon la vue choisie */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reservations
                  .filter((r) => {
                    if (r.booking_status === 'ANNULEE') return false;
                    if (calViewMode === 'DAY') return r.booking_date === calSelectedDate;
                    if (calViewMode === 'MONTH') return r.booking_date.slice(0, 7) === calSelectedDate.slice(0, 7);
                    // WEEK : +/- 3 jours autour de la date
                    const tTarget = new Date(calSelectedDate).getTime();
                    const tBook = new Date(r.booking_date).getTime();
                    return Math.abs(tBook - tTarget) <= 4 * 86400000;
                  })
                  .map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedReservation(r);
                        setActiveTab('reservations');
                      }}
                      className="cursor-pointer p-4 rounded-2xl bg-obsidian border border-gold-400/30 hover:border-gold-400 space-y-1.5"
                    >
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gold-300 font-bold">{r.booking_date}</span>
                        <span className="text-emerald-400">
                          {r.start_time.replace(':', 'h')} – {r.end_time.replace(':', 'h')}
                        </span>
                      </div>
                      <p className="font-bold text-white text-sm">{r.company_name}</p>
                      <p className="text-xs text-zinc-400">
                        {r.package_name} • {r.participation_mode}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Configuration des horaires hebdomadaires */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-anthracite border border-white/10 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                      DISPONIBILITÉS STANDARDS
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      Ouvrir / Fermer les journées et définir les créneaux
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveWeeklySchedule}
                    className="px-5 py-2.5 rounded-xl bg-gold-gradient text-obsidian font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {scheduleData.weekly.map((day, idx) => (
                    <div
                      key={day.day_of_week}
                      className="p-4 rounded-2xl bg-obsidian border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <label className="flex items-center gap-3 cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={day.is_open}
                          onChange={(e) => {
                            const next = [...scheduleData.weekly];
                            next[idx] = { ...day, is_open: e.target.checked };
                            setScheduleData({ ...scheduleData, weekly: next });
                          }}
                          className="accent-gold-400 w-4 h-4"
                        />
                        <span className="font-display font-bold text-sm text-white w-28">
                          {day.day_name}
                        </span>
                      </label>

                      <input
                        type="text"
                        disabled={!day.is_open}
                        value={(day.slots || []).join(', ')}
                        onChange={(e) => {
                          const slotsArr = e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean);
                          const next = [...scheduleData.weekly];
                          next[idx] = { ...day, slots: slotsArr };
                          setScheduleData({ ...scheduleData, weekly: next });
                        }}
                        placeholder="Ex: 08:00, 10:00, 12:00, 14:00, 16:00"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-anthracite border border-white/15 text-xs font-mono text-gold-300 disabled:opacity-40"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloquer une date spécifique ou créer des créneaux sur-mesure */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-anthracite border border-white/10 space-y-5">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                    EXCEPTIONS & BLOCAGE DE DATES
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Bloquer une date ou définir des horaires spéciaux
                  </h3>
                </div>

                <form onSubmit={handleAddOverride} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1">Date concernée *</label>
                    <input
                      type="date"
                      required
                      value={overrideForm.date_str}
                      onChange={(e) => setOverrideForm({ ...overrideForm, date_str: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-xs text-white"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-200">
                    <input
                      type="checkbox"
                      checked={overrideForm.is_closed}
                      onChange={(e) => setOverrideForm({ ...overrideForm, is_closed: e.target.checked })}
                      className="accent-gold-400"
                    />
                    <span>Fermer complètement cette journée aux réservations</span>
                  </label>

                  {!overrideForm.is_closed && (
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">
                        Créneaux horaires spécifiques (HH:MM séparés par virgule)
                      </label>
                      <input
                        type="text"
                        value={overrideForm.custom_slots_text}
                        onChange={(e) =>
                          setOverrideForm({ ...overrideForm, custom_slots_text: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-xs font-mono text-gold-300"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1">Motif / Note</label>
                    <input
                      type="text"
                      value={overrideForm.reason}
                      onChange={(e) => setOverrideForm({ ...overrideForm, reason: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gold-gradient text-obsidian font-display font-bold text-xs uppercase tracking-wider"
                  >
                    Appliquer sur le calendrier
                  </button>
                </form>

                <div className="space-y-2 pt-4 border-t border-white/10">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                    Dates spéciales / bloquées enregistrées :
                  </span>
                  {scheduleData.overrides.length === 0 ? (
                    <p className="text-xs text-zinc-500">Aucune date bloquée actuellement.</p>
                  ) : (
                    scheduleData.overrides.map((ov) => (
                      <div
                        key={ov.id}
                        className="p-3 rounded-xl bg-obsidian border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-gold-300">{ov.date_str}</span>
                          <span className="ml-2 text-zinc-400">
                            {ov.is_closed ? 'Fermé' : `Horaires: ${(ov.custom_slots || []).join(', ')}`}
                          </span>
                          {ov.reason && <p className="text-[11px] text-zinc-500">{ov.reason}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteOverride(ov.id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET 4 : GESTION DES FORFAITS & SUPPLÉMENTS OPTIONNELS
        =================================================================== */}
        {activeTab === 'packages' && (
          <div className="space-y-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                  CATALOGUE COMMERCIAL ADMINISTRABLE
                </span>
                <h2 className="font-serif text-3xl font-bold text-white">
                  Gestion des Forfaits OCD LIVE
                </h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingPackage({
                    name: '',
                    subtitle: '',
                    duration_label: '2 heures',
                    duration_minutes: 120,
                    price_fcfa: 25000,
                    price_label: '',
                    badge: 'NOUVEAU',
                    is_recommended: false,
                    description: '',
                    features_text: 'Session en direct HD\nAccompagnement régie Boovan Group',
                    image_url: '/brand/ocd-plateau-afrique.jpg',
                    allows_remote_assistance: true,
                    remote_assistance_included: false,
                    remote_assistance_fee_fcfa: 5000,
                    is_active: true,
                    display_order: packagesData.packages.length + 1
                  })
                }
                className="px-5 py-3 rounded-xl bg-gold-gradient text-obsidian font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Créer un nouveau forfait</span>
              </button>
            </div>

            {/* Formulaire d'édition ou création d'un forfait */}
            {editingPackage && (
              <form
                onSubmit={handleSavePackage}
                className="p-7 rounded-3xl bg-anthracite border-2 border-gold-400 space-y-5"
              >
                <h3 className="font-serif text-2xl font-bold text-white">
                  {editingPackage.id ? `Modifier ${editingPackage.name}` : 'Nouveau Forfait OCD LIVE'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1">Nom du forfait *</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.name}
                      onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Durée affichée (ex: 1h30, 1 journée) *</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.duration_label}
                      onChange={(e) => setEditingPackage({ ...editingPackage, duration_label: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Durée en minutes (calcul calendrier) *</label>
                    <input
                      type="number"
                      required
                      value={editingPackage.duration_minutes}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, duration_minutes: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Prix FCFA (vide si Sur mesure)</label>
                    <input
                      type="number"
                      value={editingPackage.price_fcfa ?? ''}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          price_fcfa: e.target.value === '' ? null : Number(e.target.value)
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Libellé du prix (ex: 15 000 FCFA)</label>
                    <input
                      type="text"
                      value={editingPackage.price_label || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, price_label: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Badge promotionnel</label>
                    <input
                      type="text"
                      value={editingPackage.badge || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1">Sous-titre court</label>
                    <input
                      type="text"
                      value={editingPackage.subtitle || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Ordre d'affichage</label>
                    <input
                      type="number"
                      value={editingPackage.display_order || 1}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, display_order: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-zinc-400 mb-1">URL de la photographie</label>
                    <input
                      type="text"
                      value={editingPackage.image_url || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, image_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-zinc-400 mb-1">Description détaillée</label>
                    <textarea
                      rows={2}
                      value={editingPackage.description || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-zinc-400 mb-1">Avantages inclus (1 avantage par ligne)</label>
                    <textarea
                      rows={4}
                      value={editingPackage.features_text ?? (editingPackage.features || []).join('\n')}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, features_text: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-xs text-zinc-200 pt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingPackage.is_recommended}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, is_recommended: e.target.checked })
                      }
                      className="accent-gold-400"
                    />
                    <span>Mettre en évidence (Forfait Recommandé)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingPackage.remote_assistance_included}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          remote_assistance_included: e.target.checked
                        })
                      }
                      className="accent-gold-400"
                    />
                    <span>Assistance animatrice Togo incluse gratuitement</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingPackage.is_active}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, is_active: e.target.checked })
                      }
                      className="accent-gold-400"
                    />
                    <span>Forfait visible sur le site</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gold-gradient text-obsidian font-display font-bold text-xs uppercase tracking-wider"
                  >
                    Enregistrer le forfait
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    className="px-6 py-3 rounded-xl bg-white/10 text-zinc-200 text-xs font-mono"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}

            {/* Liste des forfaits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packagesData.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-3xl bg-anthracite border border-white/10 p-6 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gold-400">{pkg.duration_label}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          pkg.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {pkg.is_active ? 'ACTIF' : 'DÉSACTIVÉ'}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">{pkg.name}</h3>
                    <p className="font-serif text-2xl font-bold text-gold-300">{pkg.price_label}</p>
                    <p className="text-xs text-zinc-400 line-clamp-2">{pkg.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingPackage({
                          ...pkg,
                          features_text: (pkg.features || []).join('\n')
                        })
                      }
                      className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-gold-400 hover:text-obsidian text-xs font-mono font-bold transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-2 rounded-xl bg-red-500/15 text-red-300 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET 5 : GESTION DES CANDIDATURES RECRUTEMENT
        =================================================================== */}
        {activeTab === 'recruitment' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-anthracite border border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                RECRUTEMENT ANIMATRICE STUDIO TOGO
              </span>
              <h2 className="font-serif text-2xl font-bold text-white mt-1">
                Candidatures reçues ({applications.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {applications.length === 0 ? (
                <div className="p-12 rounded-3xl bg-anthracite border border-white/10 text-center text-sm text-zinc-500">
                  Aucune candidature reçue pour le moment.
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 rounded-3xl bg-anthracite border border-white/10 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-mono text-gold-400">{app.reference}</span>
                        <h3 className="font-serif text-2xl font-bold text-white">
                          {app.full_name} {app.age ? `(${app.age} ans)` : ''}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          {app.city} ({app.country}) • Tél: {app.phone} • WhatsApp: {app.whatsapp} • {app.email}
                        </p>
                      </div>

                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateApplication(app.id, e.target.value, app.internal_notes)}
                        className="px-4 py-2 rounded-xl bg-obsidian border border-gold-400/40 text-xs font-mono font-bold text-gold-300"
                      >
                        <option value="NOUVELLE">Nouvelle candidature</option>
                        <option value="EN_ETUDE">En étude</option>
                        <option value="PRESELECTIONNEE">Présélectionnée</option>
                        <option value="ACCEPTEE">Acceptée</option>
                        <option value="REFUSEE">Refusée</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-obsidian border border-white/5">
                        <span className="text-gold-400 font-mono block mb-1">Présentation personnelle :</span>
                        <p className="text-zinc-300 leading-relaxed">{app.bio_presentation}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-obsidian border border-white/5">
                        <span className="text-gold-400 font-mono block mb-1">Expérience & Disponibilité :</span>
                        <p className="text-zinc-300 leading-relaxed">{app.experience_summary}</p>
                        <p className="text-gold-300 mt-2 font-mono">Disponibilité : {app.availability}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {app.cv_url && (
                        <a
                          href={app.cv_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-gold-400/15 text-gold-300 text-xs font-mono"
                        >
                          Télécharger le CV
                        </a>
                      )}
                      {app.video_url && (
                        <a
                          href={app.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-300 text-xs font-mono"
                        >
                          Visionner la vidéo de présentation
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET LIVES PANAFRICAINS : MODÉRATION & VALIDATION EN DIRECT
        =================================================================== */}
        {activeTab === 'community_lives' && (
          <div className="space-y-6">
            <div className="p-7 rounded-3xl bg-anthracite border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#F26513]">
                  DIFFUSION COMMERCIALE PANAFRICAINE • 5 000 FCFA / MOIS
                </span>
                <h2 className="font-serif text-3xl font-bold text-white mt-1">
                  Modération des Lives depuis chez soi
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Créneaux : Matin (08h00 - 11h00 GMT) & Soir (18h00 - 21h00 GMT). Vérifiez que le vendeur présente des produits, puis validez pour affichage public.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                  {communityLives.filter((l) => l.status === 'PENDING').length} en attente
                </span>
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  {communityLives.filter((l) => l.status === 'APPROVED').length} en ligne
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {communityLives.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-anthracite border border-white/10 text-zinc-400">
                  Aucun live communautaire enregistré pour le moment.
                </div>
              ) : (
                communityLives.map((live) => (
                  <div
                    key={live.id}
                    className="p-6 rounded-3xl bg-anthracite border border-white/10 hover:border-white/20 transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-lg bg-obsidian text-white text-xs font-bold font-mono">
                          {live.country}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 text-xs font-mono">
                          {live.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 text-xs font-mono">
                          Créneau : {live.time_slot === 'MATIN' ? '☀️ 08h-11h' : '🌙 18h-21h'}
                        </span>
                      </div>

                      {/* Statuts */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                            live.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : live.status === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : live.status === 'REJECTED'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : 'bg-zinc-700 text-zinc-300'
                          }`}
                        >
                          {live.status === 'APPROVED' && '🟢 EN LIGNE (VALIDÉ)'}
                          {live.status === 'PENDING' && '🟡 EN ATTENTE MODÉRATION'}
                          {live.status === 'REJECTED' && '🔴 REJETÉ'}
                          {live.status === 'ENDED' && '⚪ TERMINÉ'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleLiveSubscription(live.id, live.has_active_subscription)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                            live.has_active_subscription
                              ? 'bg-gold-400/20 border-gold-400/50 text-gold-300'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {live.has_active_subscription ? '⭐ Abonnement 5 000 F Actif' : 'Abonnement Inactif'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-zinc-500 block">Vendeur / Marque :</span>
                        <strong className="text-white text-sm">{live.business_name}</strong>
                        <span className="text-zinc-400 block">({live.seller_name})</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">WhatsApp & Téléphone :</span>
                        <a href={`https://wa.me/${(live.whatsapp || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline block font-mono">
                          {live.whatsapp}
                        </a>
                        <span className="text-zinc-400 font-mono">{live.phone}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Plateforme & Clics :</span>
                        <span className="text-white font-mono">{live.platform}</span>
                        <span className="text-zinc-400 block font-mono">👁️ {live.view_count || 0} clics générés</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Date de soumission :</span>
                        <span className="text-zinc-300 font-mono">{live.created_at}</span>
                      </div>
                    </div>

                    {live.description && (
                      <p className="p-3 rounded-xl bg-obsidian border border-white/5 text-xs text-zinc-300 italic">
                        "{live.description}"
                      </p>
                    )}

                    {/* Actions de modération Boovan Group */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                      <a
                        href={live.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ouvrir & Vérifier le Live ({live.platform})</span>
                      </a>

                      <div className="flex flex-wrap items-center gap-2">
                        {live.status !== 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateLiveStatus(live.id, 'APPROVED')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Valider & Diffuser sur le site</span>
                          </button>
                        )}

                        {live.status !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateLiveStatus(live.id, 'REJECTED')}
                            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Rejeter</span>
                          </button>
                        )}

                        {live.status === 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateLiveStatus(live.id, 'ENDED')}
                            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-display font-bold text-xs uppercase tracking-wider"
                          >
                            <span>Marquer comme Terminé</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteLive(live.id)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET OCD SHOP : GESTION DU CATALOGUE PRODUITS
        =================================================================== */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            <div className="p-7 rounded-3xl bg-anthracite border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#F26513]">
                  MARKETPLACE PANAFRICAINE • PRODUITS CERTIFIÉS
                </span>
                <h2 className="font-serif text-3xl font-bold text-white mt-1">
                  Catalogue OCD Shop ({shopProducts.length} articles)
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Les acheteurs peuvent commander directement auprès de chaque vendeur en un clic WhatsApp.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddProductModal(true)}
                className="px-5 py-3 rounded-xl bg-gold-gradient text-obsidian font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un article</span>
              </button>
            </div>

            {/* Grille des articles Shop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopProducts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-3xl bg-anthracite border border-white/10 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 bg-obsidian overflow-hidden">
                      <img
                        src={p.image_url || '/brand/ocd-plateau-afrique.jpg'}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/brand/ocd-plateau-afrique.jpg';
                        }}
                      />
                      {p.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#F26513] text-white text-[10px] font-black uppercase">
                          {p.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/70 text-white text-xs font-mono">
                        {p.country}
                      </span>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <span className="text-[11px] font-mono text-gold-400 uppercase">
                        {p.category}
                      </span>
                      <h3 className="font-display font-bold text-base text-white line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                      <div className="pt-2 flex items-baseline justify-between border-t border-white/10">
                        <span className="font-display font-black text-xl text-gold-300">
                          {p.price_fcfa.toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="text-xs text-zinc-400">
                          Par {p.seller_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-obsidian/60 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleProductStock(p.id, p.in_stock)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                        p.in_stock
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {p.in_stock ? 'En Stock' : 'Épuisé'}
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${(p.whatsapp || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/30 text-emerald-300 text-xs font-mono hover:bg-emerald-600/50"
                      >
                        WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal d'ajout de produit Shop */}
            {showAddProductModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="bg-anthracite border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 my-8">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="font-serif text-xl font-bold text-white">
                      Ajouter un article au catalogue OCD Shop
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddProductModal(false)}
                      className="text-zinc-400 hover:text-white text-2xl font-bold"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleCreateShopProduct} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-zinc-300 mb-1">Titre de l'article *</label>
                      <input
                        type="text"
                        required
                        placeholder="ex: Chemise Homme Lin Blanc & Broderie"
                        value={newProductForm.title}
                        onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-300 mb-1">Prix en FCFA *</label>
                        <input
                          type="number"
                          required
                          value={newProductForm.price_fcfa}
                          onChange={(e) => setNewProductForm({ ...newProductForm, price_fcfa: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 mb-1">Badge visuel</label>
                        <input
                          type="text"
                          placeholder="ex: EN DIRECT, POPULAIRE..."
                          value={newProductForm.badge}
                          onChange={(e) => setNewProductForm({ ...newProductForm, badge: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-300 mb-1">Catégorie *</label>
                        <select
                          value={newProductForm.category}
                          onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                        >
                          <option value="Nourriture & Restauration">Nourriture & Épices</option>
                          <option value="Mode & Habits">Mode & Habits</option>
                          <option value="Beauté & Cosmétique">Beauté & Cosmétique</option>
                          <option value="Électronique & High-Tech">Matériel & High-Tech</option>
                          <option value="Artisanat & Déco">Artisanat & Déco</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-zinc-300 mb-1">Pays d'origine *</label>
                        <select
                          value={newProductForm.country}
                          onChange={(e) => setNewProductForm({ ...newProductForm, country: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                        >
                          <option value="Bénin">🇧🇯 Bénin</option>
                          <option value="Cameroun">🇨🇲 Cameroun</option>
                          <option value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                          <option value="Togo">🇹🇬 Togo</option>
                          <option value="Sénégal">🇸🇳 Sénégal</option>
                          <option value="Gabon">🇬🇦 Gabon</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-300 mb-1">Nom du vendeur / Marque *</label>
                        <input
                          type="text"
                          required
                          placeholder="ex: Maman Christine"
                          value={newProductForm.seller_name}
                          onChange={(e) => setNewProductForm({ ...newProductForm, seller_name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-300 mb-1">WhatsApp commandes *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+228 90 00 00 00"
                          value={newProductForm.whatsapp}
                          onChange={(e) => setNewProductForm({ ...newProductForm, whatsapp: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Lien de la photo produit (URL)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newProductForm.image_url}
                        onChange={(e) => setNewProductForm({ ...newProductForm, image_url: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 mb-1">Description courte du produit</label>
                      <textarea
                        rows={2}
                        value={newProductForm.description}
                        onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian border border-white/15 text-white"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-gold-gradient text-obsidian font-display font-bold text-xs uppercase tracking-wider shadow-lg"
                      >
                        Enregistrer l'article dans le catalogue
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            ONGLET 6 : CENTRE DE NOTIFICATIONS & E-MAILS ADMINISTRATIFS
        =================================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-anthracite border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                  JOURNAL TRANSACTIONNEL & E-MAILS BOOVAN GROUP
                </span>
                <h2 className="font-serif text-2xl font-bold text-white mt-1">
                  Notifications Administratives & Clients
                </h2>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await fetchJson('/api/admin/notifications/read-all', {
                    method: 'PUT',
                    headers: authHeaders()
                  });
                  await loadAllAdminData();
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-xs font-mono text-zinc-200"
              >
                Tout marquer comme lu
              </button>
            </div>

            {/* Test de distribution des e-mails */}
            <form onSubmit={handleSendTestEmail} className="p-6 rounded-3xl bg-anthracite border border-gold-400/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Test d'envoi d'e-mail en direct</h3>
                  <p className="text-xs text-zinc-400">Déclenchez un e-mail transactionnel de test pour contrôler la bonne réception.</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="email@example.com"
                    className="px-3.5 py-2 rounded-xl bg-obsidian border border-white/15 text-xs text-white outline-none w-64"
                  />
                  <button
                    type="submit"
                    disabled={testingEmail}
                    className="px-4 py-2 rounded-xl bg-gold-gradient text-obsidian font-display font-bold text-xs uppercase tracking-wider shrink-0 disabled:opacity-50"
                  >
                    {testingEmail ? 'Envoi...' : 'Envoyer test'}
                  </button>
                </div>
              </div>
              {testEmailResult && (
                <p className="text-xs font-mono text-gold-300 pt-2 border-t border-white/5">{testEmailResult}</p>
              )}
            </form>

            <div className="space-y-4">
              {notificationsData.notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-6 rounded-3xl border space-y-3 ${
                    Number(n.is_read) === 0
                      ? 'bg-anthracite border-gold-400/50'
                      : 'bg-anthracite/60 border-white/10'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded bg-gold-400/15 text-gold-300 font-bold">
                      {n.type}
                    </span>
                    <span className="text-zinc-400">
                      Destinataire : {n.recipient_email} • {n.created_at}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white">{n.subject}</h3>
                  <pre className="p-4 rounded-2xl bg-obsidian border border-white/10 text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {n.body_text}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET 7 : PARAMÈTRES GÉNÉRAUX DE LA PLATEFORME
        =================================================================== */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            className="p-7 sm:p-10 rounded-3xl bg-anthracite border border-white/10 space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                  CONFIGURATION GLOBALE
                </span>
                <h2 className="font-serif text-3xl font-bold text-white mt-1">
                  Paramètres généraux de Boovan Group — OCD LIVE
                </h2>
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gold-gradient text-obsidian font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer la configuration</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1.5">Nom de l'organisation</label>
                <input
                  type="text"
                  value={settingsForm.organization_name || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, organization_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-white/15 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1.5">Adresse du Studio (Togo)</label>
                <input
                  type="text"
                  value={settingsForm.studio_address || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, studio_address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-white/15 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1.5">Numéro de téléphone officiel</label>
                <input
                  type="text"
                  value={settingsForm.contact_phone || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contact_phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-white/15 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1.5">Numéro WhatsApp officiel</label>
                <input
                  type="text"
                  value={settingsForm.contact_whatsapp || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contact_whatsapp: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-white/15 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1.5">Adresse e-mail publique</label>
                <input
                  type="email"
                  value={settingsForm.contact_email || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-white/15 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1.5">E-mail de réception des notifications Boovan Group</label>
                <input
                  type="email"
                  value={settingsForm.admin_notification_email || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, admin_notification_email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-white/15 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1.5">Fuseau horaire du studio</label>
                <input
                  type="text"
                  value={settingsForm.timezone || 'Africa/Lome'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, timezone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-white/15 text-gold-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1.5">Lien Facebook (Promoteur / Officiel)</label>
                <input
                  type="text"
                  value={settingsForm.social_facebook || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, social_facebook: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-white/15 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1.5">Lien TikTok (@bovann)</label>
                <input
                  type="text"
                  value={settingsForm.social_tiktok || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, social_tiktok: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-white/15 text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1.5">Instructions de paiement manuel affichées aux clients</label>
                <textarea
                  rows={3}
                  value={settingsForm.payment_manual_instructions || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, payment_manual_instructions: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-white/15 text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1.5">Conditions générales de réservation OCD LIVE</label>
                <textarea
                  rows={5}
                  value={settingsForm.terms_and_conditions || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, terms_and_conditions: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-white/15 text-white"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


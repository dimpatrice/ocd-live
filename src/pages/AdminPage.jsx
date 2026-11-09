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
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AFRICAN_COUNTRIES } from '../data/media';
import { fetchJson } from '../utils/api';
import { OcdButton, OcdLoader } from '../components/OcdLoader';

export default function AdminPage({ onConfigUpdated }) {
  const [token, setToken] = useState(() => localStorage.getItem('ocd_admin_token') || '');
  const [adminUser, setAdminUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('direction@boovangroup.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | reservations | community_lives | shop | calendar | packages | recruitment | notifications | settings

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

  // Vue Calendrier Admin
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
      showToast('E-mail de test envoyé avec succès.');
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
    setLoggingIn(true);
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
      setLoginError(err.message || 'Identifiants invalides');
    } finally {
      setLoggingIn(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('ocd_admin_token');
    setToken('');
    setAdminUser(null);
  }

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

  function handlePrintPdf() {
    window.print();
  }

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

  async function handleSaveWeeklySchedule() {
    try {
      const data = await fetchJson('/api/admin/schedule/weekly', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ weekly: scheduleData.weekly })
      });
      showToast(data.message || 'Planning hebdomadaire sauvegardé.');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

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
      showToast('Exception de calendrier enregistrée.');
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
    if (!window.confirm('Confirmer la suppression de ce forfait ?')) return;
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

  async function handleUpdateApplication(id, status, internal_notes) {
    try {
      await fetchJson(`/api/admin/applications/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status, internal_notes })
      });
      showToast('Statut de la candidature actualisé.');
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

  async function handleUpdateLiveStatus(liveId, newStatus) {
    try {
      await fetchJson(`/api/admin/community-lives/${liveId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      showToast(`Statut du direct mis à jour : ${newStatus}`);
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
      showToast('Statut de l\'abonnement mis à jour.');
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
      showToast('Direct supprimé.');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

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
      showToast('Produit retiré du catalogue.');
      await loadAllAdminData();
    } catch (err) {
      alert(err.message);
    }
  }

  // Écran de connexion Administrateur épuré et sécurisé
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-slate-100 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
              Boovan Group • Espace sécurisé
            </span>
            <h1 className="text-2xl font-extrabold text-slate-950">
              Connexion Back-Office
            </h1>
            <p className="text-xs text-slate-600">
              Accès réservé à la direction et aux régisseurs de la plateforme OCD LIVE.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Adresse e-mail
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-white border-2 border-slate-300 focus:border-[#F26513] outline-none text-slate-950 text-base font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-white border-2 border-slate-300 focus:border-[#F26513] outline-none text-slate-950 text-base font-medium"
              />
            </div>

            <OcdButton
              type="submit"
              loading={loggingIn}
              icon={Lock}
              className="w-full min-h-[50px] text-sm font-bold"
            >
              Se connecter au tableau de bord
            </OcdButton>
          </form>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Identifiants par défaut :</p>
            <p>E-mail : <code className="text-slate-900 font-mono">direction@boovangroup.com</code></p>
            <p>Mot de passe : <code className="text-slate-900 font-mono">OcdLive@Boovan2026!</code></p>
          </div>
        </div>
      </div>
    );
  }

  const kpis = dashboardData?.kpis || {};

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Barre supérieure Back-Office */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                Portail de Gestion • Boovan Group
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono font-medium">
                {adminUser.role}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-950 mt-0.5">
              Direction OCD LIVE
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {statusFeedback && (
              <span className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                {statusFeedback}
              </span>
            )}
            <button
              type="button"
              onClick={loadAllAdminData}
              className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Actualiser</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'dashboard', label: 'Vue d\'ensemble & KPI', icon: LayoutDashboard },
            { id: 'reservations', label: `Réservations (${reservations.length})`, icon: FileText },
            {
              id: 'community_lives',
              label: `Modération Lives (${communityLives.filter((l) => l.status === 'PENDING').length} en attente)`,
              icon: Radio
            },
            { id: 'shop', label: `OCD Shop (${shopProducts.length})`, icon: ShoppingBag },
            { id: 'calendar', label: 'Gestion du calendrier', icon: CalendarIcon },
            { id: 'packages', label: 'Forfaits & Tarifs', icon: Layers },
            { id: 'recruitment', label: `Candidatures (${applications.length})`, icon: Users },
            {
              id: 'notifications',
              label: `Journal & E-mails (${kpis.unreadNotifications || 0})`,
              icon: Bell
            },
            { id: 'settings', label: 'Paramètres généraux', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  active
                    ? 'bg-[#F26513] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===================================================================
            ONGLET 1 : DASHBOARD & KPI
        =================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: 'Nombre total de réservations',
                  value: kpis.totalReservations ?? 0,
                  sub: 'Toutes périodes confondues',
                  accent: 'text-slate-950'
                },
                {
                  label: 'Réservations du jour (Lomé)',
                  value: kpis.todayReservations ?? 0,
                  sub: 'Sessions prévues aujourd\'hui',
                  accent: 'text-[#F26513]'
                },
                {
                  label: 'Réservations à venir',
                  value: kpis.upcomingReservations ?? 0,
                  sub: 'Créneaux futurs actifs',
                  accent: 'text-emerald-700'
                },
                {
                  label: 'Réservations confirmées',
                  value: kpis.confirmedReservations ?? 0,
                  sub: 'Validées par l\'administration',
                  accent: 'text-emerald-700'
                },
                {
                  label: 'Réservations en attente',
                  value: kpis.pendingReservations ?? 0,
                  sub: 'En attente de vérification',
                  accent: 'text-amber-800'
                },
                {
                  label: 'Réservations annulées',
                  value: kpis.cancelledReservations ?? 0,
                  sub: 'Créneaux libérés',
                  accent: 'text-rose-700'
                },
                {
                  label: 'Chiffre d\'affaires confirmé',
                  value: `${Number(kpis.confirmedRevenueFcfa || 0).toLocaleString('fr-FR')} FCFA`,
                  sub: 'Règlements encaissés',
                  accent: 'text-[#F26513]'
                },
                {
                  label: 'Paiements en attente',
                  value: `${kpis.pendingPaymentsCount ?? 0} (${Number(kpis.pendingRevenueFcfa || 0).toLocaleString('fr-FR')} FCFA)`,
                  sub: 'À rapprocher avant validation',
                  accent: 'text-amber-800'
                },
                {
                  label: 'Entreprises enregistrées',
                  value: kpis.registeredCompaniesCount ?? 0,
                  sub: 'Marques et boutiques clientes',
                  accent: 'text-slate-950'
                }
              ].map((card, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">
                    {card.label}
                  </span>
                  <div className={`text-2xl font-bold ${card.accent}`}>{card.value}</div>
                  <p className="text-xs text-slate-500">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Graphiques / Répartitions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Répartition par forfait */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Répartition par forfait
                </h3>
                {(dashboardData?.charts?.packageBreakdown || []).length === 0 ? (
                  <p className="text-xs text-slate-500 py-6">Aucune réservation pour le moment.</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.charts.packageBreakdown.map((item) => {
                      const pct = Math.min(100, Math.round((item.count / Math.max(1, kpis.totalReservations)) * 100));
                      return (
                        <div key={item.name} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-800 font-medium">{item.name}</span>
                            <span className="font-semibold text-slate-900">{item.count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-[#F26513]" style={{ width: `${Math.max(8, pct)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mode de participation */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mode de participation
                </h3>
                <div className="space-y-4 pt-1">
                  {(dashboardData?.charts?.modeBreakdown || []).map((m) => {
                    const pct = Math.min(100, Math.round((m.count / Math.max(1, kpis.totalReservations)) * 100));
                    return (
                      <div key={m.mode} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-800 font-medium">
                            {m.mode === 'PRESENTIEL' ? 'Présentiel (Studio Togo)' : 'À distance'}
                          </span>
                          <span className="font-semibold text-slate-900">{m.count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-emerald-600" style={{ width: `${Math.max(5, pct)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Répartition géographique */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Pays des entrepreneurs
                </h3>
                {(dashboardData?.charts?.countryBreakdown || []).length === 0 ? (
                  <p className="text-xs text-slate-500 py-6">Aucune donnée géographique disponible.</p>
                ) : (
                  <div className="space-y-2">
                    {dashboardData.charts.countryBreakdown.map((c) => (
                      <div key={c.country} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                        <span className="text-slate-800 font-medium">{c.country}</span>
                        <span className="font-semibold text-slate-900">{c.count} session(s)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET 2 : RÉSERVATIONS & FICHE DÉTAILLÉE
        =================================================================== */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Registre des réservations
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {filteredReservations.length} dossier(s) affiché(s)
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleExportExcelCsv}
                    className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Export Excel (CSV)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintPdf}
                    className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>Imprimer / PDF</span>
                  </button>
                </div>
              </div>

              {/* Filtres multi-critères */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
                <input
                  type="text"
                  value={resFilter.search}
                  onChange={(e) => setResFilter({ ...resFilter, search: e.target.value })}
                  placeholder="Recherche réf, client, entreprise..."
                  className="lg:col-span-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                />
                <input
                  type="date"
                  value={resFilter.date}
                  onChange={(e) => setResFilter({ ...resFilter, date: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                />
                <select
                  value={resFilter.mode}
                  onChange={(e) => setResFilter({ ...resFilter, mode: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                >
                  <option value="">Tous les modes</option>
                  <option value="PRESENTIEL">Présentiel (Togo)</option>
                  <option value="DISTANCE">À distance</option>
                </select>
                <select
                  value={resFilter.booking_status}
                  onChange={(e) => setResFilter({ ...resFilter, booking_status: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
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
                  className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                >
                  <option value="">Tous paiements</option>
                  <option value="EN_ATTENTE_PAIEMENT">En attente règlement</option>
                  <option value="PREUVE_TRANSMISE">Preuve transmise</option>
                  <option value="PAYE_CONFIRME">Payé & Confirmé</option>
                </select>
              </div>
            </div>

            {/* Tableau épuré des réservations */}
            <div className="rounded-2xl bg-white border border-slate-200 overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50">
                    <th className="py-3 px-4">Référence</th>
                    <th className="py-3 px-4">Entreprise & Contact</th>
                    <th className="py-3 px-4">Date & Horaire (GMT)</th>
                    <th className="py-3 px-4">Modalité</th>
                    <th className="py-3 px-4">Forfait & Montant</th>
                    <th className="py-3 px-4">Paiement</th>
                    <th className="py-3 px-4">Dossier</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        Aucune réservation ne correspond aux critères sélectionnés.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#F26513]">{r.reference}</td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-950">{r.company_name}</p>
                          <p className="text-slate-500">
                            {r.client_first_name} {r.client_last_name} • {r.client_whatsapp}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-900">{r.booking_date}</p>
                          <p className="text-slate-500">
                            {r.start_time.replace(':', 'h')} – {r.end_time.replace(':', 'h')}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {r.participation_mode === 'PRESENTIEL' ? 'Présentiel' : 'À distance'}
                          </span>
                          <p className="text-slate-500 mt-0.5">
                            {r.client_city}, {r.client_country}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-900">{r.package_name}</p>
                          <p className="font-semibold text-slate-700">
                            {r.is_custom_quote
                              ? 'Sur devis'
                              : `${Number(r.total_price_fcfa).toLocaleString('fr-FR')} FCFA`}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              r.payment_status === 'PAYE_CONFIRME'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : r.payment_status === 'PREUVE_TRANSMISE'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {r.payment_status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              r.booking_status === 'CONFIRMEE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : r.booking_status === 'ANNULEE'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {r.booking_status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedReservation(r)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Détails</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Fiche détaillée du client */}
            {selectedReservation && (
              <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#F26513]">
                      FICHE DE DOSSIER • {selectedReservation.reference}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-950 mt-0.5">
                      {selectedReservation.company_name} — {selectedReservation.client_first_name} {selectedReservation.client_last_name}
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
                      className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold"
                    >
                      Confirmer dossier
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateReservation(selectedReservation.id, {
                          payment_status: 'PAYE_CONFIRME'
                        })
                      }
                      className="px-3.5 py-2 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white text-xs font-semibold"
                    >
                      Valider paiement
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateReservation(selectedReservation.id, {
                          send_reminder: true
                        })
                      }
                      className="px-3.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold"
                    >
                      Envoyer rappel e-mail
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateReservation(selectedReservation.id, {
                          booking_status: 'ANNULEE'
                        })
                      }
                      className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedReservation(null)}
                      className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                    >
                      Fermer
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* 1. Informations personnelles */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-semibold uppercase tracking-wider text-slate-700">
                      1. Responsable du dossier
                    </h4>
                    <p><span className="text-slate-500">Nom et prénom :</span> <strong className="text-slate-900">{selectedReservation.client_last_name} {selectedReservation.client_first_name}</strong></p>
                    <p><span className="text-slate-500">Téléphone :</span> {selectedReservation.client_phone}</p>
                    <p><span className="text-slate-500">WhatsApp :</span> {selectedReservation.client_whatsapp}</p>
                    <p><span className="text-slate-500">E-mail :</span> {selectedReservation.client_email}</p>
                    <p><span className="text-slate-500">Localisation :</span> {selectedReservation.client_address}, {selectedReservation.client_city} ({selectedReservation.client_country})</p>
                  </div>

                  {/* 2. Informations commerciales */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-semibold uppercase tracking-wider text-slate-700">
                      2. Entreprise & Secteur
                    </h4>
                    <p><span className="text-slate-500">Raison sociale :</span> <strong className="text-slate-900">{selectedReservation.company_name}</strong></p>
                    <p><span className="text-slate-500">Nom commercial :</span> {selectedReservation.trade_name || 'Non renseigné'}</p>
                    <p><span className="text-slate-500">Secteur d'activité :</span> {selectedReservation.sector}</p>
                    <p><span className="text-slate-500">Description :</span> {selectedReservation.activity_description}</p>
                  </div>

                  {/* 3. Produits et services */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-semibold uppercase tracking-wider text-slate-700">
                      3. Produits & Fichiers
                    </h4>
                    <p><span className="text-slate-500">Produits présentés :</span> {selectedReservation.products_to_present}</p>
                    <p><span className="text-slate-500">Nombre d'articles :</span> {selectedReservation.approx_products_count}</p>
                    <p><span className="text-slate-500">Grille tarifaire :</span> {selectedReservation.products_price_range || 'Non précisée'}</p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      {selectedReservation.company_logo_url && (
                        <a
                          href={selectedReservation.company_logo_url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:border-[#F26513]"
                        >
                          Télécharger Logo
                        </a>
                      )}
                      {(selectedReservation.product_photos || []).map((photoUrl, idx) => (
                        <a
                          key={idx}
                          href={photoUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:border-[#F26513]"
                        >
                          Photo #{idx + 1}
                        </a>
                      ))}
                      {selectedReservation.presentation_video_url && (
                        <a
                          href={selectedReservation.presentation_video_url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          Télécharger Vidéo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* 4. Coordonnées commerciales */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-semibold uppercase tracking-wider text-slate-700">
                      4. Coordonnées de diffusion
                    </h4>
                    <p><span className="text-slate-500">Téléphone public :</span> {selectedReservation.business_phone}</p>
                    <p><span className="text-slate-500">WhatsApp commandes :</span> {selectedReservation.business_whatsapp}</p>
                    <p><span className="text-slate-500">Adresse boutique :</span> {selectedReservation.business_address}</p>
                    <p><span className="text-slate-500">Ville et pays :</span> {selectedReservation.business_city}, {selectedReservation.business_country}</p>
                  </div>

                  {/* 5. Programmation modifiable */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-semibold uppercase tracking-wider text-slate-700">
                      5. Programmation de la session
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Date</label>
                        <input
                          type="date"
                          value={selectedReservation.booking_date}
                          onChange={(e) =>
                            setSelectedReservation({ ...selectedReservation, booking_date: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Début</label>
                        <input
                          type="text"
                          value={selectedReservation.start_time}
                          onChange={(e) =>
                            setSelectedReservation({ ...selectedReservation, start_time: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Fin</label>
                        <input
                          type="text"
                          value={selectedReservation.end_time}
                          onChange={(e) =>
                            setSelectedReservation({ ...selectedReservation, end_time: e.target.value })
                          }
                          className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-slate-900"
                        />
                      </div>
                    </div>
                    <p><span className="text-slate-500">Forfait :</span> {selectedReservation.package_name}</p>
                    <p><span className="text-slate-500">Modalité :</span> {selectedReservation.participation_mode}</p>
                  </div>

                  {/* 6. Paiement & Justificatif */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-semibold uppercase tracking-wider text-slate-700">
                      6. Suivi financier
                    </h4>
                    <p><span className="text-slate-500">Méthode :</span> {selectedReservation.payment_method}</p>
                    <p><span className="text-slate-500">Statut :</span> <strong className="text-[#F26513]">{selectedReservation.payment_status}</strong></p>
                    <p><span className="text-slate-500">Référence saisie :</span> {selectedReservation.payment_reference || 'Aucune'}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="text-slate-500">Montant (FCFA) :</label>
                      <input
                        type="number"
                        value={selectedReservation.total_price_fcfa}
                        onChange={(e) =>
                          setSelectedReservation({
                            ...selectedReservation,
                            total_price_fcfa: Number(e.target.value)
                          })
                        }
                        className="px-2 py-1 rounded bg-white border border-slate-300 text-slate-900 font-semibold"
                      />
                    </div>
                    {selectedReservation.payment_proof_url && (
                      <div className="pt-1">
                        <a
                          href={selectedReservation.payment_proof_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block font-medium"
                        >
                          Consulter la preuve de règlement
                        </a>
                      </div>
                    )}
                  </div>

                  {/* 7. Notes internes */}
                  <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-semibold uppercase tracking-wider text-slate-700">
                      7. Notes internes & Régie
                    </h4>
                    <textarea
                      rows={3}
                      value={selectedReservation.internal_notes || ''}
                      onChange={(e) =>
                        setSelectedReservation({ ...selectedReservation, internal_notes: e.target.value })
                      }
                      placeholder="Consignes régie, tests techniques ou remarques sur l'encaissement..."
                      className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs outline-none focus:border-[#F26513]"
                    />
                    <div className="flex justify-end">
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
                        className="px-4 py-2 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs transition-colors"
                      >
                        Enregistrer les modifications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            ONGLET 3 : MODÉRATION LIVES DEPUIS CHEZ SOI
        =================================================================== */}
        {activeTab === 'community_lives' && (
          <div className="space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                  Directs panafricains • Abonnement 5 000 FCFA / mois
                </span>
                <h2 className="text-xl font-bold text-slate-950 mt-0.5">
                  Modération des directs commerciaux
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Créneaux officiels : Matin (08h00 - 11h00 GMT) et Soir (18h00 - 21h00 GMT). Vérifiez le contenu avant de valider la diffusion.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                  {communityLives.filter((l) => l.status === 'PENDING').length} en attente
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  {communityLives.filter((l) => l.status === 'APPROVED').length} en ligne
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {communityLives.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs">
                  Aucun direct enregistré pour le moment.
                </div>
              ) : (
                communityLives.map((live) => (
                  <div
                    key={live.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white text-xs font-semibold">
                          {live.country}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                          {live.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                          Créneau : {live.time_slot === 'MATIN' ? 'Matin (08h-11h GMT)' : 'Soir (18h-21h GMT)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            live.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : live.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : live.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {live.status === 'APPROVED' && 'Validé / En ligne'}
                          {live.status === 'PENDING' && 'En attente de modération'}
                          {live.status === 'REJECTED' && 'Rejeté'}
                          {live.status === 'ENDED' && 'Terminé'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleLiveSubscription(live.id, live.has_active_subscription)}
                          className={`px-2.5 py-0.5 rounded text-xs border font-medium transition-colors ${
                            live.has_active_subscription
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          {live.has_active_subscription ? 'Abonnement 5 000 F Actif' : 'Abonnement non réglé'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">Vendeur / Enseigne :</span>
                        <strong className="text-slate-900 text-sm">{live.business_name}</strong>
                        <span className="text-slate-500 block">({live.seller_name})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">WhatsApp et appel :</span>
                        <a href={`https://wa.me/${(live.whatsapp || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline block font-semibold">
                          {live.whatsapp}
                        </a>
                        <span className="text-slate-500">{live.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Plateforme & Clics :</span>
                        <span className="text-slate-900 font-medium">{live.platform}</span>
                        <span className="text-slate-500 block">{live.view_count || 0} clics générés</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Date de soumission :</span>
                        <span className="text-slate-700">{live.created_at}</span>
                      </div>
                    </div>

                    {live.description && (
                      <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        {live.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-200">
                      <a
                        href={live.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>Vérifier le flux ({live.platform})</span>
                      </a>

                      <div className="flex flex-wrap items-center gap-2">
                        {live.status !== 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateLiveStatus(live.id, 'APPROVED')}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Valider et afficher</span>
                          </button>
                        )}

                        {live.status !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateLiveStatus(live.id, 'REJECTED')}
                            className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Rejeter</span>
                          </button>
                        )}

                        {live.status === 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateLiveStatus(live.id, 'ENDED')}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                          >
                            <span>Marquer comme terminé</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteLive(live.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
            ONGLET 4 : CATALOGUE OCD SHOP
        =================================================================== */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                  Boutique officielle OCD Shop
                </span>
                <h2 className="text-xl font-bold text-slate-950 mt-0.5">
                  Catalogue des produits ({shopProducts.length} articles)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Gérez la mise en avant des produits présentés lors des directs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shopProducts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img
                        src={p.image_url || '/brand/ocd-plateau-afrique.jpg'}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/brand/ocd-plateau-afrique.jpg';
                        }}
                      />
                      {p.badge && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#F26513] text-white text-[10px] font-bold uppercase">
                          {p.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-white/90 text-slate-800 text-[11px] font-semibold">
                        {p.country}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">
                        {p.category}
                      </span>
                      <h3 className="font-bold text-base text-slate-950 line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                      <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
                        <span className="text-lg font-bold text-slate-950">
                          {p.price_fcfa.toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="text-xs text-slate-500">
                          {p.seller_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleProductStock(p.id, p.in_stock)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                        p.in_stock
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      {p.in_stock ? 'En stock' : 'Épuisé'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/${(p.whatsapp || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 text-xs font-medium"
                      >
                        WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Retirer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal ajout d'article */}
            {showAddProductModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
                <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 my-8 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-950">
                      Ajouter un article au catalogue
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddProductModal(false)}
                      className="text-slate-400 hover:text-slate-700 text-xl font-bold"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleCreateShopProduct} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-700 mb-1 font-medium">Titre de l'article *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex. Chemise brodée lin blanc"
                        value={newProductForm.title}
                        onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 mb-1 font-medium">Prix en FCFA *</label>
                        <input
                          type="number"
                          required
                          value={newProductForm.price_fcfa}
                          onChange={(e) => setNewProductForm({ ...newProductForm, price_fcfa: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1 font-medium">Badge visuel</label>
                        <input
                          type="text"
                          placeholder="Ex. NOUVEAU, PROMOTION..."
                          value={newProductForm.badge}
                          onChange={(e) => setNewProductForm({ ...newProductForm, badge: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 mb-1 font-medium">Catégorie *</label>
                        <select
                          value={newProductForm.category}
                          onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                        >
                          <option value="Nourriture & Restauration">Nourriture & Restauration</option>
                          <option value="Mode & Habits">Mode & Habits</option>
                          <option value="Beauté & Cosmétique">Beauté & Cosmétique</option>
                          <option value="Électronique & High-Tech">Matériel & Électronique</option>
                          <option value="Artisanat & Déco">Artisanat & Décoration</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1 font-medium">Pays d'origine *</label>
                        <select
                          value={newProductForm.country}
                          onChange={(e) => setNewProductForm({ ...newProductForm, country: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                        >
                          <option value="Bénin">Bénin</option>
                          <option value="Cameroun">Cameroun</option>
                          <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                          <option value="Togo">Togo</option>
                          <option value="Sénégal">Sénégal</option>
                          <option value="Gabon">Gabon</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 mb-1 font-medium">Nom du vendeur / Marque *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex. Maison Bovann"
                          value={newProductForm.seller_name}
                          onChange={(e) => setNewProductForm({ ...newProductForm, seller_name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1 font-medium">WhatsApp commandes *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+228 90 00 00 00"
                          value={newProductForm.whatsapp}
                          onChange={(e) => setNewProductForm({ ...newProductForm, whatsapp: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1 font-medium">URL de l'image</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newProductForm.image_url}
                        onChange={(e) => setNewProductForm({ ...newProductForm, image_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1 font-medium">Description</label>
                      <textarea
                        rows={2}
                        value={newProductForm.description}
                        onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-xs"
                      >
                        Enregistrer l'article
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            ONGLET 5 : GESTION DU CALENDRIER
        =================================================================== */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                    Planning studio • Africa/Lome (GMT)
                  </span>
                  <h2 className="text-xl font-bold text-slate-950 mt-0.5">
                    Consultation du calendrier
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={calSelectedDate}
                    onChange={(e) => setCalSelectedDate(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none"
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        calViewMode === v.id
                          ? 'bg-[#F26513] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Réservations de la période */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {reservations
                  .filter((r) => {
                    if (r.booking_status === 'ANNULEE') return false;
                    if (calViewMode === 'DAY') return r.booking_date === calSelectedDate;
                    if (calViewMode === 'MONTH') return r.booking_date.slice(0, 7) === calSelectedDate.slice(0, 7);
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
                      className="cursor-pointer p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#F26513] transition-colors space-y-1"
                    >
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#F26513]">{r.booking_date}</span>
                        <span className="font-medium text-slate-600">
                          {r.start_time.replace(':', 'h')} – {r.end_time.replace(':', 'h')}
                        </span>
                      </div>
                      <p className="font-bold text-slate-950 text-sm">{r.company_name}</p>
                      <p className="text-xs text-slate-500">
                        {r.package_name} • {r.participation_mode === 'PRESENTIEL' ? 'Studio Togo' : 'À distance'}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Horaires hebdomadaires */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-bold text-slate-950">
                      Disponibilités hebdomadaires standards
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cochez les jours ouverts et indiquez les heures de début de session.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveWeeklySchedule}
                    className="px-4 py-2 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {scheduleData.weekly.map((day, idx) => (
                    <div
                      key={day.day_of_week}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={day.is_open}
                          onChange={(e) => {
                            const next = [...scheduleData.weekly];
                            next[idx] = { ...day, is_open: e.target.checked };
                            setScheduleData({ ...scheduleData, weekly: next });
                          }}
                          className="accent-[#F26513] w-4 h-4"
                        />
                        <span className="font-semibold text-xs text-slate-900 w-24">
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
                        placeholder="Ex. 08:00, 10:00, 14:00, 16:00"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 disabled:opacity-50"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Blocage de dates / exceptions */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-950">
                    Fermeture ou dates d'exception
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bloquer un jour férié ou définir des horaires spécifiques.
                  </p>
                </div>

                <form onSubmit={handleAddOverride} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Date concernée *</label>
                    <input
                      type="date"
                      required
                      value={overrideForm.date_str}
                      onChange={(e) => setOverrideForm({ ...overrideForm, date_str: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={overrideForm.is_closed}
                      onChange={(e) => setOverrideForm({ ...overrideForm, is_closed: e.target.checked })}
                      className="accent-[#F26513]"
                    />
                    <span>Fermer complètement le studio à cette date</span>
                  </label>

                  {!overrideForm.is_closed && (
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Créneaux spécifiques (séparés par virgule)
                      </label>
                      <input
                        type="text"
                        value={overrideForm.custom_slots_text}
                        onChange={(e) =>
                          setOverrideForm({ ...overrideForm, custom_slots_text: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Motif</label>
                    <input
                      type="text"
                      value={overrideForm.reason}
                      onChange={(e) => setOverrideForm({ ...overrideForm, reason: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    Enregistrer l'exception
                  </button>
                </form>

                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Exceptions enregistrées :
                  </span>
                  {scheduleData.overrides.length === 0 ? (
                    <p className="text-xs text-slate-500">Aucune exception enregistrée.</p>
                  ) : (
                    scheduleData.overrides.map((ov) => (
                      <div
                        key={ov.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{ov.date_str}</span>
                          <span className="ml-2 text-slate-600">
                            {ov.is_closed ? 'Fermé' : `Créneaux : ${(ov.custom_slots || []).join(', ')}`}
                          </span>
                          {ov.reason && <p className="text-[11px] text-slate-500">{ov.reason}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteOverride(ov.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
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
            ONGLET 6 : FORFAITS & TARIFS
        =================================================================== */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                  Offres commerciales
                </span>
                <h2 className="text-xl font-bold text-slate-950 mt-0.5">
                  Gestion des forfaits OCD LIVE
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Configurez les tarifs, durées et prestations incluses affichées aux entrepreneurs.
                </p>
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
                className="px-4 py-2.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau forfait</span>
              </button>
            </div>

            {/* Formulaire d'édition */}
            {editingPackage && (
              <form
                onSubmit={handleSavePackage}
                className="p-6 rounded-2xl bg-white border-2 border-[#F26513] space-y-4 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-950">
                  {editingPackage.id ? `Modifier : ${editingPackage.name}` : 'Nouveau forfait OCD LIVE'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nom du forfait *</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.name}
                      onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Durée affichée (ex: 1h30, 2h) *</label>
                    <input
                      type="text"
                      required
                      value={editingPackage.duration_label}
                      onChange={(e) => setEditingPackage({ ...editingPackage, duration_label: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Durée en minutes *</label>
                    <input
                      type="number"
                      required
                      value={editingPackage.duration_minutes}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, duration_minutes: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Prix en FCFA (laisser vide si sur devis)</label>
                    <input
                      type="number"
                      value={editingPackage.price_fcfa ?? ''}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          price_fcfa: e.target.value === '' ? null : Number(e.target.value)
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Libellé du tarif (ex: 15 000 FCFA)</label>
                    <input
                      type="text"
                      value={editingPackage.price_label || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, price_label: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Badge promotionnel</label>
                    <input
                      type="text"
                      value={editingPackage.badge || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">Sous-titre court</label>
                    <input
                      type="text"
                      value={editingPackage.subtitle || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Ordre d'affichage</label>
                    <input
                      type="number"
                      value={editingPackage.display_order || 1}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, display_order: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-slate-700 font-medium mb-1">Prestations incluses (1 par ligne)</label>
                    <textarea
                      rows={3}
                      value={editingPackage.features_text ?? (editingPackage.features || []).join('\n')}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, features_text: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-700 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPackage.is_recommended}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, is_recommended: e.target.checked })
                      }
                      className="accent-[#F26513]"
                    />
                    <span>Forfait recommandé (mis en avant)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPackage.remote_assistance_included}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          remote_assistance_included: e.target.checked
                        })
                      }
                      className="accent-[#F26513]"
                    />
                    <span>Assistance animatrice Lomé incluse d'office</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPackage.is_active}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, is_active: e.target.checked })
                      }
                      className="accent-[#F26513]"
                    />
                    <span>Forfait visible sur le site</span>
                  </label>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {packagesData.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F26513]">{pkg.duration_label}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          pkg.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {pkg.is_active ? 'ACTIF' : 'INACTIF'}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-950">{pkg.name}</h3>
                    <p className="text-xl font-bold text-slate-900">{pkg.price_label}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{pkg.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingPackage({
                          ...pkg,
                          features_text: (pkg.features || []).join('\n')
                        })
                      }
                      className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
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
            ONGLET 7 : CANDIDATURES RECRUTEMENT
        =================================================================== */}
        {activeTab === 'recruitment' && (
          <div className="space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                Recrutement studio Togo
              </span>
              <h2 className="text-xl font-bold text-slate-950 mt-0.5">
                Candidatures d'animatrices ({applications.length})
              </h2>
            </div>

            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                  Aucune candidature reçue pour le moment.
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#F26513]">{app.reference}</span>
                        <h3 className="text-xl font-bold text-slate-950 mt-0.5">
                          {app.full_name} {app.age ? `(${app.age} ans)` : ''}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {app.city} ({app.country}) • Tél: {app.phone} • WhatsApp: {app.whatsapp} • {app.email}
                        </p>
                      </div>

                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateApplication(app.id, e.target.value, app.internal_notes)}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900"
                      >
                        <option value="NOUVELLE">Nouvelle</option>
                        <option value="EN_ETUDE">En étude</option>
                        <option value="PRESELECTIONNEE">Présélectionnée</option>
                        <option value="ACCEPTEE">Acceptée</option>
                        <option value="REFUSEE">Refusée</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="font-semibold text-slate-800 block">Présentation :</span>
                        <p className="text-slate-600 leading-relaxed">{app.bio_presentation}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="font-semibold text-slate-800 block">Expérience & Disponibilité :</span>
                        <p className="text-slate-600 leading-relaxed">{app.experience_summary}</p>
                        <p className="text-slate-800 mt-1.5 font-medium">Disponibilité : {app.availability}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {app.cv_url && (
                        <a
                          href={app.cv_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                        >
                          Télécharger le CV
                        </a>
                      )}
                      {app.video_url && (
                        <a
                          href={app.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                        >
                          Visionner la vidéo
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
            ONGLET 8 : NOTIFICATIONS & E-MAILS TRANSACTIONNELS
        =================================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                  Journal transactionnel
                </span>
                <h2 className="text-xl font-bold text-slate-950 mt-0.5">
                  E-mails et alertes système
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
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
              >
                Tout marquer comme lu
              </button>
            </div>

            {/* Testeur d'envoi d'e-mail */}
            <form onSubmit={handleSendTestEmail} className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-950">Test d'envoi d'e-mail en direct</h3>
                  <p className="text-xs text-slate-500">Envoyez un e-mail de test immédiat vers l'adresse de votre choix pour vérifier le serveur SMTP.</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="email@example.com"
                    className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 outline-none w-64"
                  />
                  <button
                    type="submit"
                    disabled={testingEmail}
                    className="px-4 py-2 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {testingEmail ? 'Envoi...' : 'Tester'}
                  </button>
                </div>
              </div>
              {testEmailResult && (
                <p className="text-xs font-medium text-slate-700 pt-2 border-t border-slate-100">{testEmailResult}</p>
              )}
            </form>

            <div className="space-y-3">
              {notificationsData.notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-5 rounded-2xl border space-y-2 shadow-xs ${
                    Number(n.is_read) === 0
                      ? 'bg-orange-50/50 border-orange-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                      {n.type}
                    </span>
                    <span className="text-slate-500">
                      Destinataire : {n.recipient_email} • {n.created_at}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-950">{n.subject}</h3>
                  <pre className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
                    {n.body_text}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET 9 : PARAMÈTRES GÉNÉRAUX
        =================================================================== */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26513]">
                  Configuration système
                </span>
                <h2 className="text-xl font-bold text-slate-950 mt-0.5">
                  Paramètres généraux de Boovan Group — OCD LIVE
                </h2>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#F26513] hover:bg-[#DC5309] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nom de l'organisation</label>
                <input
                  type="text"
                  value={settingsForm.organization_name || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, organization_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Adresse physique du studio (Lomé)</label>
                <input
                  type="text"
                  value={settingsForm.studio_address || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, studio_address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Numéro de téléphone officiel</label>
                <input
                  type="text"
                  value={settingsForm.contact_phone || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contact_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Numéro WhatsApp officiel</label>
                <input
                  type="text"
                  value={settingsForm.contact_whatsapp || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contact_whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Adresse e-mail publique</label>
                <input
                  type="email"
                  value={settingsForm.contact_email || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">E-mail de notification direction</label>
                <input
                  type="email"
                  value={settingsForm.admin_notification_email || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, admin_notification_email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Fuseau horaire de référence</label>
                <input
                  type="text"
                  value={settingsForm.timezone || 'Africa/Lome'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, timezone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-mono outline-none focus:bg-white focus:border-[#F26513]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Lien TikTok (@bovann)</label>
                <input
                  type="text"
                  value={settingsForm.social_tiktok || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, social_tiktok: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Consignes de paiement affichées aux entrepreneurs</label>
                <textarea
                  rows={3}
                  value={settingsForm.payment_manual_instructions || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, payment_manual_instructions: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Conditions générales de vente et de diffusion</label>
                <textarea
                  rows={4}
                  value={settingsForm.terms_and_conditions || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, terms_and_conditions: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 outline-none focus:bg-white focus:border-[#F26513]"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

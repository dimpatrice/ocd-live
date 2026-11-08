-- =============================================================================
-- OCD LIVE — SCHÉMA DE BASE DE DONNÉES RELATIONNELLE (SQLite / PostgreSQL compatible)
-- Boovan Group — Plateforme de Réservation & Livestream Commercial
-- =============================================================================

-- 1. Administrateurs & Rôles (extensible multi-studios / présentateurs)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'SUPER_ADMIN', -- SUPER_ADMIN, STUDIO_MANAGER, PRESENTER, CLIENT
  studio_id INTEGER DEFAULT 1,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

-- 2. Studios (Architecture extensible multi-studios en Afrique & International)
CREATE TABLE IF NOT EXISTS studios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Africa/Lome',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 3. Paramètres Généraux de la Plateforme
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 4. Forfaits OCD LIVE (Entièrement administrables)
CREATE TABLE IF NOT EXISTS packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  duration_label TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL, -- ex: 90, 120, 240, 480
  price_fcfa INTEGER, -- NULL si "Sur mesure / À définir par l'administrateur"
  price_label TEXT, -- ex: "15 000 FCFA" ou "Sur devis personnalisé"
  badge TEXT, -- ex: "POPULAIRE", "RECOMMANDÉ", "VIP", "ABONNEMENT"
  is_recommended INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  features_json TEXT NOT NULL, -- Liste JSON des avantages
  image_url TEXT NOT NULL,
  allows_remote_assistance INTEGER NOT NULL DEFAULT 1,
  remote_assistance_included INTEGER NOT NULL DEFAULT 0,
  remote_assistance_fee_fcfa INTEGER NOT NULL DEFAULT 5000,
  is_active INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 5. Suppléments Optionnels Configurables par l'Administrateur
CREATE TABLE IF NOT EXISTS package_addons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_fcfa INTEGER NOT NULL,
  requires_team_validation INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 1
);

-- 6. Configuration Hebdomadaire des Horaires d'Ouverture
CREATE TABLE IF NOT EXISTS weekly_schedule (
  day_of_week INTEGER PRIMARY KEY, -- 0 = Dimanche, 1 = Lundi ... 6 = Samedi
  day_name TEXT NOT NULL,
  is_open INTEGER NOT NULL DEFAULT 1,
  slots_json TEXT NOT NULL -- ex: ["08:00","10:00","12:00","14:00","16:00"]
);

-- 7. Exceptions & Dates Bloquées / Horaires Spéciaux du Calendrier
CREATE TABLE IF NOT EXISTS calendar_overrides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date_str TEXT UNIQUE NOT NULL, -- YYYY-MM-DD
  is_closed INTEGER NOT NULL DEFAULT 0,
  reason TEXT,
  custom_slots_json TEXT, -- Si non null, remplace les créneaux standards pour ce jour
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 8. Réservations Complètes (Clients + Entreprises + Créneaux + Paiements)
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT UNIQUE NOT NULL, -- ex: OCD-2026-8492
  studio_id INTEGER NOT NULL DEFAULT 1,
  participation_mode TEXT NOT NULL, -- 'PRESENTIEL' | 'DISTANCE'
  booking_date TEXT NOT NULL, -- YYYY-MM-DD
  start_time TEXT NOT NULL, -- HH:MM
  end_time TEXT NOT NULL, -- HH:MM
  duration_minutes INTEGER NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Africa/Lome',
  
  -- Forfait & Options
  package_id INTEGER NOT NULL,
  package_name TEXT NOT NULL,
  package_price_fcfa INTEGER NOT NULL DEFAULT 0,
  remote_assistance TEXT NOT NULL DEFAULT 'NON_APPLICABLE', -- 'OUI' | 'NON' | 'NON_APPLICABLE'
  remote_assistance_fee_fcfa INTEGER NOT NULL DEFAULT 0,
  addons_json TEXT NOT NULL DEFAULT '[]',
  addons_total_fcfa INTEGER NOT NULL DEFAULT 0,
  total_price_fcfa INTEGER NOT NULL DEFAULT 0,
  is_custom_quote INTEGER NOT NULL DEFAULT 0,

  -- Étape 4 : Informations Personnelles
  client_last_name TEXT NOT NULL,
  client_first_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_whatsapp TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_country TEXT NOT NULL,
  client_city TEXT NOT NULL,
  client_address TEXT NOT NULL,

  -- Étape 5 : Informations sur l'Entreprise
  company_name TEXT NOT NULL,
  trade_name TEXT,
  sector TEXT NOT NULL,
  activity_description TEXT NOT NULL,
  products_to_present TEXT NOT NULL,
  approx_products_count TEXT NOT NULL,
  products_price_range TEXT,
  business_phone TEXT NOT NULL,
  business_whatsapp TEXT NOT NULL,
  business_address TEXT NOT NULL,
  business_country TEXT NOT NULL,
  business_city TEXT NOT NULL,
  website_url TEXT,
  social_facebook TEXT,
  social_instagram TEXT,
  social_tiktok TEXT,
  social_other TEXT,
  live_objectives_json TEXT NOT NULL DEFAULT '[]',
  live_objectives_details TEXT,
  company_logo_url TEXT,
  product_photos_json TEXT NOT NULL DEFAULT '[]',
  presentation_video_url TEXT,

  -- Paiement & Statuts (Aucune réservation n'est considérée payée sans validation réelle)
  payment_method TEXT NOT NULL, -- 'TMONEY_FLOOZ' | 'BANK_TRANSFER' | 'STUDIO_CASH' | 'ONLINE_GATEWAY'
  payment_status TEXT NOT NULL DEFAULT 'EN_ATTENTE_PAIEMENT', -- 'EN_ATTENTE_PAIEMENT', 'PREUVE_TRANSMISE', 'PAYE_PARTIELLEMENT', 'PAYE_CONFIRME', 'REMBOURSE'
  payment_proof_url TEXT,
  payment_reference TEXT,
  booking_status TEXT NOT NULL DEFAULT 'EN_ATTENTE', -- 'EN_ATTENTE', 'CONFIRMEE', 'EN_COURS', 'TERMINEE', 'ANNULEE'
  terms_accepted INTEGER NOT NULL DEFAULT 1,
  internal_notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 9. Candidatures Recrutement ("Rejoignez l'aventure OCD LIVE")
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Togo',
  email TEXT NOT NULL,
  bio_presentation TEXT NOT NULL,
  experience_summary TEXT NOT NULL,
  availability TEXT NOT NULL,
  cv_url TEXT,
  video_url TEXT,
  status TEXT NOT NULL DEFAULT 'NOUVELLE', -- 'NOUVELLE', 'EN_ETUDE', 'PRESELECTIONNEE', 'ACCEPTEE', 'REFUSEE'
  internal_notes TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 10. Notifications & Emails Administratifs / Clients
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL, -- 'NEW_BOOKING', 'PAYMENT_PROOF', 'PAYMENT_CONFIRMED', 'BOOKING_UPDATED', 'BOOKING_CANCELLED', 'BOOKING_CONFIRMED', 'LIVE_REMINDER', 'NEW_APPLICATION', 'CONTACT_MESSAGE'
  title TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  related_reference TEXT,
  is_read INTEGER NOT NULL DEFAULT 0,
  email_delivery_status TEXT NOT NULL DEFAULT 'LOGGED_AND_QUEUED', -- 'SENT_SMTP' | 'LOGGED_AND_QUEUED'
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 11. Messages de Contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);


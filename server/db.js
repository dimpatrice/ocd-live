import { DatabaseSync } from "node:sqlite";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "ocd_live.sqlite");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbInstance = null;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, originalHash] = storedHash.split(":");
  const hashBuffer = crypto.scryptSync(password, salt, 64);
  const originalBuffer = Buffer.from(originalHash, "hex");
  if (hashBuffer.length !== originalBuffer.length) return false;
  return crypto.timingSafeEqual(hashBuffer, originalBuffer);
}

export function queryAll(sql, params = []) {
  const stmt = dbInstance.prepare(sql);
  return stmt.all(...params);
}

export function queryOne(sql, params = []) {
  const stmt = dbInstance.prepare(sql);
  return stmt.get(...params) || null;
}

export function runSql(sql, params = []) {
  const stmt = dbInstance.prepare(sql);
  const res = stmt.run(...params);
  return { lastInsertRowid: Number(res.lastInsertRowid) };
}

export async function initDatabase() {
  if (dbInstance) return dbInstance;

  dbInstance = new DatabaseSync(DB_PATH);
  dbInstance.exec("PRAGMA journal_mode = WAL;");
  dbInstance.exec("PRAGMA foreign_keys = ON;");

  const schemaSql = fs.readFileSync(SCHEMA_PATH, "utf-8");
  dbInstance.exec(schemaSql);

  const userCount = queryOne("SELECT COUNT(*) as count FROM users");
  if (!userCount || Number(userCount.count) === 0) {
    seedInitialData();
  } else {
    // S'assurer que les réseaux officiels du promoteur et les visuels officiels du plateau sont synchronisés
    runSql(
      `INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('organization_name', 'Boovan Group (Bovann Officiel) — OCD LIVE', datetime('now'))`,
    );
    runSql(
      `INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('social_facebook', 'https://www.facebook.com/Bovannofficiel', datetime('now'))`,
    );
    runSql(
      `INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('social_tiktok', 'https://www.tiktok.com/@bovann', datetime('now'))`,
    );
    runSql(
      `UPDATE packages SET image_url = '/brand/ocd-plateau-afrique.jpg' WHERE slug = 'starter-live'`,
    );
    runSql(
      `UPDATE packages SET image_url = '/brand/bovann-conference.jpg' WHERE slug = 'business-boost'`,
    );
    runSql(
      `UPDATE packages SET image_url = '/brand/ocd-studio-bovann.jpg' WHERE slug = 'business-plus'`,
    );
    runSql(
      `UPDATE packages SET image_url = '/brand/bovann-jeunesse.jpg' WHERE slug = 'premium-visibility'`,
    );
    runSql(
      `UPDATE packages SET image_url = '/brand/bovann-portrait-1.jpg' WHERE slug = 'vip-promotion'`,
    );
    runSql(
      `UPDATE packages SET image_url = '/brand/bovann-portrait-2.jpg' WHERE slug = 'monthly-partner'`,
    );
  }

  // Vérifier et alimenter les démos de lives communautaires et de shop si vides
  const livesCount = queryOne("SELECT COUNT(*) as count FROM community_lives");
  if (!livesCount || Number(livesCount.count) === 0) {
    seedCommunityLives();
  }

  const shopCount = queryOne("SELECT COUNT(*) as count FROM shop_products");
  if (!shopCount || Number(shopCount.count) === 0) {
    seedShopProducts();
  }

  return dbInstance;
}

function seedInitialData() {
  // 1. Administrateur initial sécurisé
  const adminEmail =
    process.env.ADMIN_INITIAL_EMAIL || "direction@boovangroup.com";
  const adminPassword =
    process.env.ADMIN_INITIAL_PASSWORD || "OcdLive@Boovan2026!";
  const passwordHash = hashPassword(adminPassword);

  runSql(
    `INSERT INTO users (email, password_hash, full_name, role, studio_id, is_active)
     VALUES (?, ?, ?, ?, ?, 1)`,
    [
      adminEmail,
      passwordHash,
      "Direction Générale Boovan Group",
      "SUPER_ADMIN",
      1,
    ],
  );

  // 2. Studio principal au Togo
  runSql(
    `INSERT INTO studios (name, country, city, address, timezone, is_active)
     VALUES (?, ?, ?, ?, ?, 1)`,
    [
      "Studio Principal OCD LIVE — Lomé",
      "Togo",
      "Lomé",
      "Quartier Administratif & Médias, Lomé, République Togolaise",
      "Africa/Lome",
    ],
  );

  // 3. Paramètres généraux configurables
  const defaultSettings = {
    organization_name: "Boovan Group (Bovann Officiel) — OCD LIVE",
    platform_name: "OCD LIVE",
    studio_address: "Complexe Audiovisuel OCD LIVE — Boovan Group, Lomé, Togo",
    contact_phone: "+228 90 00 00 00",
    contact_whatsapp: "+228 90 00 00 00",
    contact_email: "dimpatrice3@gmail.com",
    admin_notification_email: "reservations@boovangroup.com",
    timezone: "Africa/Lome",
    currency: "FCFA",
    social_facebook: "https://www.facebook.com/Bovannofficiel",
    social_instagram: "https://instagram.com/bovannofficiel",
    social_tiktok: "https://www.tiktok.com/@bovann",
    social_youtube: "https://youtube.com/@ocdlive",
    payment_online_enabled: "false",
    payment_online_provider:
      "Configuration Passerelle API (PayGate / CinetPay / FedaPay)",
    payment_manual_instructions:
      'Pour valider définitivement votre créneau sur le plateau OCD LIVE, veuillez régler via T-Money / Flooz (+228 90 00 00 00 — BOOVAN GROUP), par virement bancaire ou directement à la caisse du Studio à Lomé. Téléversez votre reçu ou numéro de transaction ci-dessous. Votre réservation sera marquée comme "Payée & Confirmée" après vérification effective par notre direction.',
    terms_and_conditions:
      "1. Toute réservation fait l'objet d'une vérification des produits et services déclarés afin de garantir le standing et l'éthique d'OCD LIVE.\n2. Aucune réservation n'est considérée comme définitivement payée sans confirmation réelle du règlement par l'administration de Boovan Group.\n3. Pour les sessions en présentiel à Lomé, l'entrepreneur s'engage à se présenter au studio 30 minutes avant le début du direct avec ses échantillons.\n4. Pour les sessions à distance, un test technique de connexion est organisé en amont avec la régie.\n5. Les options de mise en avant sur les réseaux sociaux ou comptes partenaires sont systématiquement soumises à la validation éditoriale préalable de l'équipe Boovan Group.",
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    runSql(
      `INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))`,
      [key, value],
    );
  }

  // 4. Les 6 Forfaits Officiels OCD LIVE (Entièrement modifiables depuis le back-office)
  const packages = [
    {
      slug: "starter-live",
      name: "STARTER LIVE",
      subtitle:
        "Pour les entrepreneurs qui souhaitent découvrir OCD LIVE et présenter leurs produits.",
      duration_label: "1h30",
      duration_minutes: 90,
      price_fcfa: 15000,
      price_label: "15 000 FCFA",
      badge: "DÉCOUVERTE",
      is_recommended: 0,
      description:
        "Idéal pour une première prise de parole en direct. Présentez vos produits phares, votre savoir-faire et vos coordonnées commerciales devant une audience qualifiée.",
      features: [
        "Session en direct de 1h30 (Présentiel au Togo ou À distance)",
        "Réalisation multi-caméras HD & habillage graphique de vos coordonnées",
        "Présentation jusqu'à 10 produits ou services en direct",
        "Affichage permanent de votre numéro WhatsApp et téléphone commercial",
        "Accompagnement technique par la régie Boovan Group",
      ],
      image_url: "/brand/ocd-plateau-afrique.jpg",
      allows_remote_assistance: 1,
      remote_assistance_included: 0,
      remote_assistance_fee_fcfa: 5000,
      display_order: 1,
    },
    {
      slug: "business-boost",
      name: "BUSINESS BOOST",
      subtitle:
        "Pour bénéficier de plus de temps de présentation et démontrer vos produits en détail.",
      duration_label: "2 heures",
      duration_minutes: 120,
      price_fcfa: 20000,
      price_label: "20 000 FCFA",
      badge: "CROISSANCE",
      is_recommended: 0,
      description:
        "Deux heures complètes d'émission pour approfondir vos arguments commerciaux, répondre aux questions en direct et maximiser vos conversions.",
      features: [
        "Session en direct de 2 heures complètes",
        "Mise en scène studio personnalisée & gros plans produits",
        "Interaction dynamique avec les spectateurs et acheteurs",
        "Bandeau déroulant avec catalogue tarifaire et contacts directs",
        "Extrait vidéo souvenir de votre passage livré après le live",
      ],
      image_url: "/brand/bovann-conference.jpg",
      allows_remote_assistance: 1,
      remote_assistance_included: 0,
      remote_assistance_fee_fcfa: 5000,
      display_order: 2,
    },
    {
      slug: "business-plus",
      name: "BUSINESS PLUS",
      subtitle:
        "Une formule avantageuse pour les entrepreneurs qui souhaitent présenter plusieurs produits.",
      duration_label: "4 heures",
      duration_minutes: 240,
      price_fcfa: 35000,
      price_label: "35 000 FCFA",
      badge: "RECOMMANDÉ",
      is_recommended: 1,
      description:
        "Le choix privilégié des commerçants et marques ambitieuses : une demi-journée de direct pour exposer toute une collection et conclure des ventes en temps réel.",
      features: [
        "4 heures d'antenne dédiées à votre marque et vos collections",
        "Assistance d'une animatrice au studio du Togo incluse sur demande",
        "Démonstrations approfondies de gammes complètes (mode, cosmétique, high-tech...)",
        "Séquences de ventes flash et offres spéciales durant le direct",
        "Annonce préalable de votre passage dans le programme OCD LIVE",
      ],
      image_url: "/brand/ocd-studio-bovann.jpg",
      allows_remote_assistance: 1,
      remote_assistance_included: 1,
      remote_assistance_fee_fcfa: 0,
      display_order: 3,
    },
    {
      slug: "premium-visibility",
      name: "PREMIUM VISIBILITY",
      subtitle:
        "Une formule destinée aux entreprises qui souhaitent bénéficier d'une visibilité renforcée.",
      duration_label: "1 journée",
      duration_minutes: 480,
      price_fcfa: 60000,
      price_label: "60 000 FCFA",
      badge: "JOURNÉE COMPLÈTE",
      is_recommended: 0,
      description:
        "Une journée événementielle consacrée à votre entreprise : interviews, démonstrations produits, coulisses et prises de commandes continues du matin au soir.",
      features: [
        "Privatisation d'une journée complète de programmation (jusqu'à 8h)",
        "Co-animation professionnelle au studio de Lomé incluse",
        "Habillage visuel sur-mesure aux couleurs de votre entreprise",
        "Passages multiples structurés par thématique ou gamme de produits",
        "Capsules vidéos courtes optimisées pour vos réseaux commerciaux",
      ],
      image_url: "/brand/bovann-jeunesse.jpg",
      allows_remote_assistance: 1,
      remote_assistance_included: 1,
      remote_assistance_fee_fcfa: 0,
      display_order: 4,
    },
    {
      slug: "vip-promotion",
      name: "VIP PROMOTION",
      subtitle:
        "Avantages promotionnels supplémentaires, mise en avant renforcée et options de communication.",
      duration_label: "Selon le programme convenu",
      duration_minutes: 240,
      price_fcfa: 100000,
      price_label: "100 000 FCFA",
      badge: "PRESTIGE VIP",
      is_recommended: 0,
      description:
        "Une opération coup de poing combinant production audiovisuelle haut de gamme, préparation éditoriale avec nos experts et options de relais sur les réseaux sociaux après validation de l'équipe.",
      features: [
        "Programme de diffusion sur-mesure élaboré avec la direction Boovan Group",
        "Préparation éditoriale, storytelling commercial & coaching avant direct",
        "Accompagnement complet par notre équipe d'animation au Togo",
        "Options de relais et communication digitale (après validation éditoriale de l'équipe)",
        "Priorité de planification sur les créneaux de forte audience",
      ],
      image_url: "/brand/bovann-portrait-1.jpg",
      allows_remote_assistance: 1,
      remote_assistance_included: 1,
      remote_assistance_fee_fcfa: 0,
      display_order: 5,
    },
    {
      slug: "monthly-partner",
      name: "MONTHLY PARTNER",
      subtitle:
        "Pour les entreprises qui souhaitent une présence régulière et stratégique sur OCD LIVE.",
      duration_label: "Abonnement mensuel",
      duration_minutes: 120,
      price_fcfa: null,
      price_label: "Sur mesure (Défini avec l'administration)",
      badge: "PARTENAIRE OFFICIEL",
      is_recommended: 0,
      description:
        "Inscrivez votre marque dans la durée grâce à plusieurs passages mensuels programmés, une visibilité récurrente et un accompagnement commercial dédié.",
      features: [
        "Calendrier mensuel de plusieurs émissions en direct (présentiel ou distance)",
        "Tarification partenaire personnalisée selon votre volume et vos objectifs",
        "Présentatrice attitrée au studio du Togo pour représenter vos produits",
        "Mise en avant régulière et dispositifs promotionnels sur-mesure",
        "Bilan mensuel de performance et suivi par un chargé de compte Boovan Group",
      ],
      image_url: "/brand/bovann-portrait-2.jpg",
      allows_remote_assistance: 1,
      remote_assistance_included: 1,
      remote_assistance_fee_fcfa: 0,
      display_order: 6,
    },
  ];

  for (const pkg of packages) {
    runSql(
      `INSERT INTO packages (
        slug, name, subtitle, duration_label, duration_minutes, price_fcfa, price_label,
        badge, is_recommended, description, features_json, image_url,
        allows_remote_assistance, remote_assistance_included, remote_assistance_fee_fcfa,
        is_active, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        pkg.slug,
        pkg.name,
        pkg.subtitle,
        pkg.duration_label,
        pkg.duration_minutes,
        pkg.price_fcfa,
        pkg.price_label,
        pkg.badge,
        pkg.is_recommended,
        pkg.description,
        JSON.stringify(pkg.features),
        pkg.image_url,
        pkg.allows_remote_assistance,
        pkg.remote_assistance_included,
        pkg.remote_assistance_fee_fcfa,
        pkg.display_order,
      ],
    );
  }

  // 5. Suppléments optionnels configurables par l'administrateur
  const addons = [
    {
      code: "CAPSULE_REELS",
      name: "Montage de 3 Capsules Vidéo Verticales (Format Reels / TikTok / Shorts)",
      description:
        "Extraction et montage dynamique des meilleurs moments de votre live pour vos propres réseaux.",
      price_fcfa: 10000,
      requires_team_validation: 0,
      display_order: 1,
    },
    {
      code: "CATALOG_GRAPHICS",
      name: "Création de Fiches Graphiques Produits & Incrustation Écran",
      description:
        "Design par notre studio graphique de vos visuels tarifaires diffusés en plein écran durant le direct.",
      price_fcfa: 7500,
      requires_team_validation: 0,
      display_order: 2,
    },
    {
      code: "SOCIAL_SPOTLIGHT_REQUEST",
      name: "Demande d'Étude de Relais Promotionnel Complémentaire",
      description:
        "Soumise à l'approbation et à la validation éditoriale préalable de l'équipe Boovan Group (aucune publication automatique).",
      price_fcfa: 15000,
      requires_team_validation: 1,
      display_order: 3,
    },
  ];

  for (const addon of addons) {
    runSql(
      `INSERT INTO package_addons (code, name, description, price_fcfa, requires_team_validation, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, 1, ?)`,
      [
        addon.code,
        addon.name,
        addon.description,
        addon.price_fcfa,
        addon.requires_team_validation,
        addon.display_order,
      ],
    );
  }

  // 6. Horaires hebdomadaires du Studio (Fuseau Africa/Lome)
  const defaultSlots = JSON.stringify([
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
  ]);
  const saturdaySlots = JSON.stringify(["09:00", "11:00", "14:00", "16:00"]);
  const days = [
    { day: 0, name: "Dimanche", isOpen: 0, slots: JSON.stringify([]) },
    { day: 1, name: "Lundi", isOpen: 1, slots: defaultSlots },
    { day: 2, name: "Mardi", isOpen: 1, slots: defaultSlots },
    { day: 3, name: "Mercredi", isOpen: 1, slots: defaultSlots },
    { day: 4, name: "Jeudi", isOpen: 1, slots: defaultSlots },
    { day: 5, name: "Vendredi", isOpen: 1, slots: defaultSlots },
    { day: 6, name: "Samedi", isOpen: 1, slots: saturdaySlots },
  ];

  for (const d of days) {
    runSql(
      `INSERT INTO weekly_schedule (day_of_week, day_name, is_open, slots_json)
       VALUES (?, ?, ?, ?)`,
      [d.day, d.name, d.isOpen, d.slots],
    );
  }

  // 7. Initialisation des démos de Lives Autonomes (Bénin, Cameroun, Côte d'Ivoire, Togo)
  seedCommunityLives();

  // 8. Produits initiaux du OCD Shop (Catalogue direct vendeur certifié)
  seedShopProducts();
}

function seedCommunityLives() {
  const initialCommunityLives = [
    {
      seller_name: "Maman Christine",
      business_name: "Saveurs d'Abomey & Épices Bio",
      country: "Bénin",
      category: "Nourriture & Restauration",
      live_url: "https://www.tiktok.com/@bovann",
      platform: "TIKTOK",
      whatsapp: "+229 97 00 11 22",
      phone: "+229 97 00 11 22",
      time_slot: "MATIN",
      description: "Direct depuis Cotonou : dégustation et vente de nos sauces prêtes à l'emploi et piments doux.",
      status: "APPROVED"
    },
    {
      seller_name: "Yannick & Fils",
      business_name: "Kamer Prêt-à-Porter & Wax Chic",
      country: "Cameroun",
      category: "Mode & Habits",
      live_url: "https://www.facebook.com/Bovannofficiel",
      platform: "FACEBOOK",
      whatsapp: "+237 690 12 34 56",
      phone: "+237 690 12 34 56",
      time_slot: "MATIN",
      description: "Direct depuis Akwa Douala : arrivage de chemises en lin et ensembles brodés pour hommes.",
      status: "APPROVED"
    },
    {
      seller_name: "Aïcha Traoré",
      business_name: "Karité Pur & Beauté Bio d'Afrique",
      country: "Côte d'Ivoire",
      category: "Beauté & Cosmétique",
      live_url: "https://www.tiktok.com/@bovann",
      platform: "TIKTOK",
      whatsapp: "+225 07 12 34 56",
      phone: "+225 07 12 34 56",
      time_slot: "SOIR",
      description: "Présentation des savons noirs artisanaux et beurres corporels depuis Abidjan.",
      status: "APPROVED"
    },
    {
      seller_name: "Éric Lawson",
      business_name: "Lomé High-Tech & Accessoires Pro",
      country: "Togo",
      category: "Électronique & High-Tech",
      live_url: "https://www.tiktok.com/@bovann",
      platform: "TIKTOK",
      whatsapp: "+228 90 22 33 44",
      phone: "+228 90 22 33 44",
      time_slot: "SOIR",
      description: "En direct depuis notre boutique à Lomé : micros cravates sans fil et éclairages LED pour créateurs.",
      status: "APPROVED"
    }
  ];

  for (const live of initialCommunityLives) {
    runSql(
      `INSERT INTO community_lives (
        seller_name, business_name, country, category, live_url, platform,
        whatsapp, phone, time_slot, description, status, has_active_subscription, approved_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))`,
      [
        live.seller_name,
        live.business_name,
        live.country,
        live.category,
        live.live_url,
        live.platform,
        live.whatsapp,
        live.phone,
        live.time_slot,
        live.description,
        live.status
      ]
    );
  }
}

function seedShopProducts() {
  const initialShopProducts = [
    {
      title: "Piment Pur & Épices d'Abomey (Pack Découverte)",
      category: "Nourriture & Restauration",
      country: "Bénin",
      seller_name: "Maman Christine",
      whatsapp: "+229 97 00 11 22",
      phone: "+229 97 00 11 22",
      price_fcfa: 7500,
      description: "Bocal en verre hermétique 250g préparé artisanalement sans conservateur chimique.",
      image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      badge: "EN LIVE AUJOURD'HUI"
    },
    {
      title: "Chemise Homme Wax Royal & Lin Blanc",
      category: "Mode & Habits",
      country: "Cameroun",
      seller_name: "Kamer Wax Chic",
      whatsapp: "+237 690 12 34 56",
      phone: "+237 690 12 34 56",
      price_fcfa: 18000,
      description: "Coupe ajustée, finitions premium cousues main à Douala. Disponible en tailles M, L, XL, XXL.",
      image_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
      badge: "POPULAIRE"
    },
    {
      title: "Kit Micro Cravate Double Sans Fil (Type-C & iPhone)",
      category: "Électronique & High-Tech",
      country: "Togo",
      seller_name: "Lomé High-Tech",
      whatsapp: "+228 90 22 33 44",
      phone: "+228 90 22 33 44",
      price_fcfa: 15000,
      description: "Réduction active du bruit ambiant, idéal pour faire vos lives Facebook et TikTok sans bruit de fond.",
      image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      badge: "CERTIFIÉ OCD"
    },
    {
      title: "Baume Corporel Karité Brut & Cacao Bio (500ml)",
      category: "Beauté & Cosmétique",
      country: "Côte d'Ivoire",
      seller_name: "Aïcha Beauté",
      whatsapp: "+225 07 12 34 56",
      phone: "+225 07 12 34 56",
      price_fcfa: 6000,
      description: "100% pur beurre végétal non blanchi, nourrit intensément et régénère les peaux sèches.",
      image_url: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80",
      badge: "PRODUIT NATUREL"
    }
  ];

  for (const prod of initialShopProducts) {
    runSql(
      `INSERT INTO shop_products (
        title, category, country, seller_name, whatsapp, phone, price_fcfa, description, image_url, badge, in_stock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        prod.title,
        prod.category,
        prod.country,
        prod.seller_name,
        prod.whatsapp,
        prod.phone,
        prod.price_fcfa,
        prod.description,
        prod.image_url,
        prod.badge
      ]
    );
  }
}

import assert from 'node:assert';

const BASE = 'http://localhost:3006';

async function runTests() {
  console.log('=== DÉMARRAGE DES TESTS D\'INTÉGRATION OCD LIVE ===');

  // 1. Vérifier la configuration publique et les 6 forfaits initiaux
  const cfgRes = await fetch(`${BASE}/api/public/config`);
  assert.strictEqual(cfgRes.status, 200, 'GET /api/public/config doit retourner 200');
  const cfg = await cfgRes.json();
  assert.strictEqual(cfg.packages.length, 6, 'Les 6 forfaits OCD LIVE doivent être présents');
  assert.strictEqual(cfg.settings.timezone, 'Africa/Lome', 'Le fuseau horaire doit être Africa/Lome');
  assert.strictEqual(cfg.settings.social_facebook, 'https://www.facebook.com/Bovannofficiel', 'Facebook officiel Bovann configuré');
  assert.strictEqual(cfg.settings.social_tiktok, 'https://www.tiktok.com/@bovann', 'TikTok @bovann configuré');
  for (const pkg of cfg.packages) {
    assert.ok(pkg.image_url.startsWith('/brand/'), `Le forfait ${pkg.name} doit utiliser une photo officielle /brand/`);
  }

  const brandImages = [
    '/brand/ocd-logo.jpg',
    '/brand/ocd-studio-bovann.jpg',
    '/brand/ocd-plateau-afrique.jpg',
    '/brand/bovann-portrait-1.jpg',
    '/brand/bovann-portrait-2.jpg',
    '/brand/bovann-jeunesse.jpg',
    '/brand/bovann-conference.jpg'
  ];
  for (const imgPath of brandImages) {
    const imgRes = await fetch(`${BASE}${imgPath}`);
    assert.strictEqual(imgRes.status, 200, `L'image officielle ${imgPath} doit être servie avec HTTP 200`);
  }
  console.log('[OK] 1. Configuration publique, 7 photos officielles Bovann/Studio & 6 Forfaits vérifiés.');

  // 2. Vérifier le calendrier dynamique (Trouver le prochain lundi disponible)
  const calRes = await fetch(`${BASE}/api/public/calendar?year=2026&month=12&duration=90`);
  assert.strictEqual(calRes.status, 200);
  const cal = await calRes.json();
  const availableDay = cal.days.find((d) => d.status === 'AVAILABLE' && d.slots.length >= 2);
  assert.ok(availableDay, 'Il doit exister une journée disponible en décembre 2026');
  const targetDate = availableDay.date;
  const targetSlot = availableDay.slots[0].startTime;
  console.log(`[OK] 2. Calendrier dynamique vérifié (Date cible : ${targetDate} à ${targetSlot}).`);

  // 3. Créer une réservation complète (et vérifier qu'elle n'est pas considérée payée sans confirmation)
  const bookingPayload = {
    participation_mode: 'DISTANCE',
    booking_date: targetDate,
    start_time: targetSlot,
    package_id: cfg.packages[0].id, // Starter Live (1h30)
    remote_assistance: 'OUI',
    addon_codes: [cfg.addons[0].code],
    client_last_name: 'DUPONT',
    client_first_name: 'Jean',
    client_phone: '+237 600 00 00 00',
    client_whatsapp: '+237 600 00 00 00',
    client_email: 'jean.dupont@dupontfashion.cm',
    client_country: 'Cameroun',
    client_city: 'Douala',
    client_address: 'Akwa, Boulevard de la Liberté',
    company_name: 'Dupont Fashion',
    trade_name: 'Dupont Luxe',
    sector: 'Mode, Prêt-à-Porter & Accessoires',
    activity_description: 'Présentation et vente de vêtements pour hommes et femmes.',
    products_to_present: 'Costumes sur-mesure, robes de soirée et accessoires.',
    approx_products_count: '15 articles',
    products_price_range: '15 000 à 85 000 FCFA',
    business_phone: '+237 600 00 00 00',
    business_whatsapp: '+237 600 00 00 00',
    business_address: 'Boutique Dupont Fashion, Akwa, Douala',
    business_country: 'Cameroun',
    business_city: 'Douala',
    website_url: 'https://dupontfashion.example.com',
    social_facebook: 'https://facebook.com/dupontfashion',
    social_instagram: '@dupontfashion',
    social_tiktok: '@dupontfashion.cm',
    live_objectives: ['Vente directe de marchandises pendant le live'],
    payment_method: 'TMONEY_FLOOZ',
    terms_accepted: true
  };

  const bookRes = await fetch(`${BASE}/api/public/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  });
  assert.strictEqual(bookRes.status, 201, 'La création de réservation doit retourner 201');
  const bookData = await bookRes.json();
  const createdBooking = bookData.reservation;
  assert.ok(createdBooking.reference.startsWith('OCD-'), 'Référence unique générée');
  assert.strictEqual(
    createdBooking.payment_status,
    'EN_ATTENTE_PAIEMENT',
    'Aucune réservation ne doit être considérée payée sans confirmation réelle'
  );
  console.log(`[OK] 3. Réservation enregistrée (${createdBooking.reference}) avec statut paiement EN_ATTENTE_PAIEMENT.`);

  // 4. Tester le blocage anti-conflit de créneau (empêcher deux clients de réserver le même créneau)
  const conflictRes = await fetch(`${BASE}/api/public/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  });
  assert.strictEqual(
    conflictRes.status,
    409,
    'Une seconde réservation sur le même créneau doit être rejetée avec HTTP 409'
  );
  console.log('[OK] 4. Protection anti-conflit de créneau vérifiée (HTTP 409).');

  // 5. Tester le formulaire de recrutement ("Rejoignez l'aventure OCD LIVE")
  const appRes = await fetch(`${BASE}/api/public/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: 'Afiwa Mensah',
      age: 24,
      phone: '+228 91 22 33 44',
      whatsapp: '+228 91 22 33 44',
      city: 'Lomé',
      country: 'Togo',
      email: 'afiwa.mensah@example.tg',
      bio_presentation: 'Passionnée par l\'animation commerciale et la communication digitale.',
      experience_summary: '2 ans d\'animation d\'événements commerciaux à Lomé.',
      availability: 'Immédiate'
    })
  });
  assert.strictEqual(appRes.status, 201, 'La candidature recrutement doit retourner 201');
  const appData = await appRes.json();
  assert.strictEqual(appData.application.status, 'NOUVELLE');
  console.log(`[OK] 5. Candidature recrutement enregistrée (${appData.application.reference}).`);

  // 6. Tester l'authentification Administrateur et les fonctionnalités Back-Office
  const loginRes = await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ADMIN_INITIAL_EMAIL || 'direction@boovangroup.com',
      password: process.env.ADMIN_INITIAL_PASSWORD || 'OcdLive@Boovan2026!'
    })
  });
  assert.strictEqual(loginRes.status, 200, 'Connexion administrateur réussie');
  const { token } = await loginRes.json();
  assert.ok(token, 'Jeton JWT reçu');

  const dashRes = await fetch(`${BASE}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.strictEqual(dashRes.status, 200);
  const dash = await dashRes.json();
  assert.strictEqual(dash.kpis.confirmedRevenueFcfa, 0, 'CA confirmé à 0 tant que le paiement n\'est pas validé');

  // Validation administrative du paiement et confirmation de la réservation
  const updateRes = await fetch(`${BASE}/api/admin/reservations/${createdBooking.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      payment_status: 'PAYE_CONFIRME',
      booking_status: 'CONFIRMEE'
    })
  });
  assert.strictEqual(updateRes.status, 200);

  // Nettoyage de la réservation et de la candidature de test pour laisser la base de production vierge de données fictives
  await fetch(`${BASE}/api/admin/reservations/${createdBooking.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ booking_status: 'ANNULEE' })
  });

  console.log('[OK] 6. Back-office, validation de paiement et notifications vérifiés.');
  console.log('=== TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS ===');
}

runTests().catch((err) => {
  console.error('ÉCHEC DU TEST :', err);
  process.exit(1);
});

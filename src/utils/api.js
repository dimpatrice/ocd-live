/**
 * Utilitaire de requêtes API sécurisé pour OCD LIVE.
 * Évite les crashs "Unexpected end of JSON input" quand un proxy ou un serveur retourne 502/HTML.
 */
export async function fetchJson(url, options = {}) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (netErr) {
    throw new Error(
      `Impossible de contacter le serveur OCD LIVE (${netErr.message}). Vérifiez votre connexion.`
    );
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Réponse JSON invalide reçue du serveur.');
    }
    if (!res.ok) {
      throw new Error(data.error || `Erreur serveur HTTP ${res.status}`);
    }
    return data;
  }

  // Si ce n'est pas du JSON (ex: 502 Bad Gateway de Vite proxy, ou page HTML 404/500)
  const rawText = await res.text();
  if (!res.ok) {
    if (res.status === 502 || res.status === 504) {
      throw new Error(
        'Le serveur API OCD LIVE démarre ou n\'est pas encore accessible sur le port 3006. Veuillez patienter quelques secondes.'
      );
    }
    if (res.status === 404) {
      throw new Error('Ressource introuvable (HTTP 404).');
    }
    throw new Error(rawText || `Erreur HTTP ${res.status}`);
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return { text: rawText };
  }
}


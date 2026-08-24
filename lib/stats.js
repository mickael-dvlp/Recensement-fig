// ============================================================
// STATS — helpers partagés pour l'agrégation de l'inventaire
// ============================================================

// Une même figurine physique peut être référencée par plusieurs entrées de
// faction (ex: le Roi-Sorcier apparaît dans Angmar ET Mordor via inventaireId).
// Cet accumulateur évite de compter deux fois le même ID dans un total global,
// tout en laissant chaque entrée s'afficher normalement dans sa propre faction.
// Utilisé dans accueil/page.jsx et amis/[amiUid]/page.jsx.
export function creerAccumulateurDedupe() {
  const vus = new Set();
  return function compterUneFois(id) {
    if (vus.has(id)) return false;
    vus.add(id);
    return true;
  };
}

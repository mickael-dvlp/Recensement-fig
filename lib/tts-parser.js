/**
 * Parseur du format TTS (army builder export)
 *
 * Format attendu :
 *   (Héros: option1, option2)
 *       (Nx Troupe: option1, option2)
 *
 * - Lignes non-indentées = héros (chef de warband)
 * - Lignes indentées (4 espaces ou tab) = troupes
 * - Nx = quantité (ex: "5x")
 */

/**
 * Parse le texte TTS brut en liste de figurines.
 * @returns {{ nom: string, options: string[], quantite: number, estHero: boolean }[]}
 */
export function parseTTS(texte) {
  const lignes = texte.split("\n");
  const figurines = [];

  for (const ligne of lignes) {
    const estIndente = ligne.startsWith("    ") || ligne.startsWith("\t");
    const trimmed = ligne.trim();
    if (!trimmed) continue;

    // Match : (optional_qty x Name: options)
    const match = trimmed.match(/^\((?:(\d+)x\s+)?(.+?):\s*(.*?)\)$/);
    if (!match) continue;

    const quantite = match[1] ? parseInt(match[1], 10) : 1;
    const nom = match[2].trim();
    const optionsStr = match[3].trim();
    // Le "and" devant le dernier élément (Oxford comma) est supprimé : "shield, and throwing spears" → ["shield", "throwing spears"]
    const options = optionsStr
      ? optionsStr.split(",").map((o) => o.trim().toLowerCase().replace(/^and\s+/, "")).filter(Boolean)
      : [];

    figurines.push({ nom, options, quantite, estHero: !estIndente });
  }

  return figurines;
}

/**
 * Agrège les figurines en groupant par nom + options
 * (plusieurs warbands peuvent contenir le même type de troupe)
 */
export function aggregerFigurines(figurines) {
  const map = new Map();
  for (const fig of figurines) {
    const cle = cleTTS(fig.nom, fig.options);
    if (map.has(cle)) {
      map.get(cle).quantite += fig.quantite;
    } else {
      map.set(cle, { ...fig });
    }
  }
  return Array.from(map.values());
}

/**
 * Génère la clé de correspondance TTS (nom + options triées, tout en minuscules).
 */
export function cleTTS(nom, options) {
  const opts = [...options].sort().join(",");
  return `${nom.toLowerCase()}:${opts}`;
}

/**
 * Résout un nom TTS vers un ID de figurine de l'app.
 * 1. Essaie la correspondance exacte nom complet + options triées
 * 2. Repli sur le nom complet seul
 * 3. Si le nom contient des parenthèses (ex: "Nazgul (Khamul)"), réessaie sans
 *    — permet de gérer les notes de contexte TTS type "King of Men (Cirion)"
 */
export function resoudreId(nom, options, mapping) {
  const cleExacte = cleTTS(nom, options);
  if (mapping[cleExacte]) return mapping[cleExacte];

  const cleNom = `${nom.toLowerCase()}:`;
  if (mapping[cleNom]) return mapping[cleNom];

  const nomSansParens = nom.replace(/\s*\([^)]*\)/g, "").trim();
  if (nomSansParens !== nom) {
    const cleExacteSansParens = cleTTS(nomSansParens, options);
    if (mapping[cleExacteSansParens]) return mapping[cleExacteSansParens];

    const cleNomSansParens = `${nomSansParens.toLowerCase()}:`;
    if (mapping[cleNomSansParens]) return mapping[cleNomSansParens];
  }

  return null;
}

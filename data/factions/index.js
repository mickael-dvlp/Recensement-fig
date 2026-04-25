// ============================================================
// REGISTRE DES FACTIONS
// ============================================================
// Pour ajouter une nouvelle faction :
//   1. Crée son fichier dans ce dossier
//   2. Importe-le ici et ajoute-le dans FACTIONS_DATA
//
// La clé doit correspondre exactement au nom de faction
// utilisé dans FACTIONS_BIEN / FACTIONS_MAL (data/figurines/index.js)

import lacville from "./armee-de-lacville.js";
import communauteDeLAnneau from "./communaute-de-l-anneau.js";
import dale from "./dale.js";
import ereborReconquis from "./erebor-reconquis.js";
import fiefsduGondor from "./fiefs-du-gondor.js";
import khazadDum from "./khazad-dum.js";
import numenor from "./numenor.js";
import compagnieDeThorin from "./compagnie-de-thorin.js";
import druadan from "./druadan.js";
import ereborRestaure from "./erebor-restaure.js";
import fondcombe from "./fondcombe.js";

const FACTIONS_DATA = {
  "Lacville": lacville,
  "La Communauté de l'Anneau": communauteDeLAnneau,
  "Dale": dale,
  "Erebor Reconquis": ereborReconquis,
  "Les Fiefs du Gondor": fiefsduGondor,
  "Khazad-dûm": khazadDum,
  "Númenor": numenor,
  "La Compagnie de Thorin": compagnieDeThorin,
  "Drúadan": druadan,
  "Erebor Restauré": ereborRestaure,
  "Fondcombe": fondcombe,
};

export default FACTIONS_DATA;

// Retourne toutes les figurines de toutes les factions sous forme de liste plate.
// Chaque entrée contient l'id, le nom, la faction et le type (heros/guerriers).
export function getAllFigurines() {
  return Object.entries(FACTIONS_DATA).flatMap(([nomFaction, data]) => [
    ...(data.heros ?? []).map((f) => ({ ...f, faction: nomFaction, type: "heros" })),
    ...(data.guerriers ?? []).map((f) => ({ ...f, faction: nomFaction, type: "guerriers" })),
  ]);
}

// ============================================================
// REGISTRE DES FACTIONS
// ============================================================
// Pour ajouter une nouvelle faction :
//   1. Crée son fichier dans ce dossier
//   2. Importe-le ici et ajoute-le dans FACTIONS_DATA
//
// La clé doit correspondre exactement au nom de faction
// utilisé dans FACTIONS_BIEN / FACTIONS_MAL (data/figurines/index.js)

// ---- CAMP DU BIEN ----
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
import laLothlorien from "./lothlorien.js";
import erebor from "./erebor.js";
import leConseilBlanc from "./conseil-blanc.js";
import laComte from "./comte.js";
import lEriador from "./eriador.js";
import fangorn from "./fangorn.js";
import lesMontsBrumeux from "./monts-brumeux.js";
import leCarrock from "./carrock.js";
import dunharrow from "./dunharrow.js";
import lArnor from "./arnor.js";
import leGondor from "./gondor.js";
import leRohan from "./rohan.js";
import laForetNoire from "./foret-noire.js";
import lesMontsDeFer from "./monts-de-fer.js";

// ---- CAMP DU MAL ----
import baradDur from "./barad-dur.js";
import mordor from "./mordor.js";
import angmar from "./angmar.js";
import dolGuldur from "./dol-guldur.js";
import legionAzog from "./legion-azog.js";
import chasseursAzog from "./chasseurs-azog.js";
import carnDum from "./carn-dum.js";
import nazguls from "./nazguls.js";
import orientaux from "./orientaux.js";
import hordeSerpent from "./horde-serpent.js";
import extremeHarad from "./extreme-harad.js";
import khand from "./khand.js";
import corsairesUmbar from "./corsaires-umbar.js";
import isengard from "./isengard.js";
import paysDeDun from "./pays-de-dun.js";
import brigandsSharcoux from "./brigands-sharcoux.js";
import moria from "./moria.js";
import goblinville from "./goblinville.js";
import trollsMontagnes from "./trolls-montagnes.js";
import sinistresHabitants from "./sinistres-habitants.js";
import calamiteNord from "./calamite-nord.js";

const FACTIONS_DATA = {
  // Camp du Bien
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
  "La Lothlórien": laLothlorien,
  "Erebor": erebor,
  "Le Conseil Blanc": leConseilBlanc,
  "La Comté": laComte,
  "L'Eriador": lEriador,
  "Fangorn": fangorn,
  "Les Monts Brumeux": lesMontsBrumeux,
  "Le Carrock": leCarrock,
  "Dunharrow": dunharrow,
  "L'Arnor": lArnor,
  "Le Gondor": leGondor,
  "Le Rohan": leRohan,
  "La Forêt Noire": laForetNoire,
  "Les Monts de Fer": lesMontsDeFer,
  // Camp du Mal
  "Barad-Dûr": baradDur,
  "Mordor": mordor,
  "Angmar": angmar,
  "Puissances Obscures de Dol Guldur": dolGuldur,
  "La Légion d'Azog": legionAzog,
  "Les Chasseurs d'Azog": chasseursAzog,
  "Carn-Dûm": carnDum,
  "Les Nazguls": nazguls,
  "Orientaux": orientaux,
  "Horde Serpent": hordeSerpent,
  "Extrême-Harad": extremeHarad,
  "Khand": khand,
  "Les Corsaires d'Umbar": corsairesUmbar,
  "Isengard": isengard,
  "Le Pays de Dun": paysDeDun,
  "Brigands de Sharcoûx": brigandsSharcoux,
  "La Moria": moria,
  "Goblinville": goblinville,
  "Trolls des Montagnes": trollsMontagnes,
  "Les Sinistres Habitants de la Forêt Noire": sinistresHabitants,
  "Calamité du Nord": calamiteNord,
};

export default FACTIONS_DATA;

// Retourne toutes les figurines de toutes les factions sous forme de liste plate.
// Chaque entrée contient l'id, le nom, la faction et le type (heros/guerriers).
// FACTIONS_DATA est statique : le résultat est calculé une seule fois puis mis en cache,
// plutôt que reconstruit (spread sur des centaines d'objets) à chaque appel — cette
// fonction est invoquée sur quasiment toutes les pages, parfois à chaque render.
let _toutesLesFigurines = null;
export function getAllFigurines() {
  if (!_toutesLesFigurines) {
    _toutesLesFigurines = Object.entries(FACTIONS_DATA).flatMap(([nomFaction, data]) => [
      ...(data.heros ?? []).map((f) => ({ ...f, faction: nomFaction, type: "heros" })),
      ...(data.guerriers ?? []).map((f) => ({ ...f, faction: nomFaction, type: "guerriers" })),
    ]);
  }
  return _toutesLesFigurines;
}

// ---- CLASSIFICATION BIEN / MAL ----
// Source de vérité unique : les noms doivent correspondre exactement aux clés de FACTIONS_DATA.

export const FACTIONS_BIEN_GROUPES = [
  {
    titre: "LES COMPAGNIES HÉROÏQUES",
    factions: [
      "La Communauté de l'Anneau",
      "La Compagnie de Thorin",
      "Le Conseil Blanc",
    ],
  },
  {
    titre: "LES CONTRÉES OUBLIÉES",
    factions: [
      "La Comté",
      "L'Eriador",
      "Fangorn",
      "Les Monts Brumeux",
      "Le Carrock",
      "Drúadan",
      "Dunharrow",
    ],
  },
  {
    titre: "LES ROYAUMES DES HOMMES",
    factions: [
      "Númenor",
      "L'Arnor",
      "Le Gondor",
      "Les Fiefs du Gondor",
      "Le Rohan",
      "Dale",
      "Lacville",
    ],
  },
  {
    titre: "LES ENCLAVES ELFIQUES",
    factions: ["Fondcombe", "La Lothlórien", "La Forêt Noire"],
  },
  {
    titre: "LES FORTERESSES DES NAINS",
    factions: [
      "Khazad-dûm",
      "Les Monts de Fer",
      "Erebor",
      "Erebor Reconquis",
      "Erebor Restauré",
    ],
  },
];

export const FACTIONS_BIEN = FACTIONS_BIEN_GROUPES.flatMap((g) => g.factions);

export const FACTIONS_MAL_GROUPES = [
  {
    titre: "LES FORTERESSES DE SAURON",
    factions: [
      "Barad-Dûr",
      "Mordor",
      "Angmar",
      "Puissances Obscures de Dol Guldur",
      "La Légion d'Azog",
      "Les Chasseurs d'Azog",
      "Carn-Dûm",
      "Les Nazguls",
    ],
  },
  {
    titre: "LES HOMMES CORROMPUS",
    factions: [
      "Orientaux",
      "Horde Serpent",
      "Extrême-Harad",
      "Khand",
      "Les Corsaires d'Umbar",
    ],
  },
  {
    titre: "LES SERVITEURS DE L'OMBRE",
    factions: [
      "Isengard",
      "Le Pays de Dun",
      "Brigands de Sharcoûx",
      "La Moria",
      "Goblinville",
    ],
  },
  {
    titre: "LES CRÉATURES DES TÉNÈBRES",
    factions: [
      "Trolls des Montagnes",
      "Les Sinistres Habitants de la Forêt Noire",
      "Calamité du Nord",
    ],
  },
];

export const FACTIONS_MAL = FACTIONS_MAL_GROUPES.flatMap((g) => g.factions);

export const FACTIONS = [...FACTIONS_BIEN, ...FACTIONS_MAL];

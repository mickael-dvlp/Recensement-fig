// ============================================================
// REGISTRE DES HÉROS
// ============================================================
// Chaque fichier lettre contient les héros dont le nom
// commence par cette lettre (articles ignorés).

import HEROS_A from "./a.js";
import HEROS_B from "./b.js";
import HEROS_C from "./c.js";
import HEROS_D from "./d.js";
import HEROS_E from "./e.js";
import HEROS_F from "./f.js";
import HEROS_G from "./g.js";
import HEROS_H from "./h.js";
import HEROS_I from "./i.js";
import HEROS_K from "./k.js";
import HEROS_L from "./l.js";
import HEROS_M from "./m.js";
import HEROS_N from "./n.js";
import HEROS_O from "./o.js";
import HEROS_P from "./p.js";
import HEROS_R from "./r.js";
import HEROS_S from "./s.js";
import HEROS_T from "./t.js";
import HEROS_U from "./u.js";
import HEROS_V from "./v.js";
import HEROS_W from "./w.js";
import HEROS_Y from "./y.js";
import HEROS_Z from "./z.js";

// Liste plate de tous les héros
export const TOUS_LES_HEROS = [
  ...HEROS_A,
  ...HEROS_B,
  ...HEROS_C,
  ...HEROS_D,
  ...HEROS_E,
  ...HEROS_F,
  ...HEROS_G,
  ...HEROS_H,
  ...HEROS_I,
  ...HEROS_K,
  ...HEROS_L,
  ...HEROS_M,
  ...HEROS_N,
  ...HEROS_O,
  ...HEROS_P,
  ...HEROS_R,
  ...HEROS_S,
  ...HEROS_T,
  ...HEROS_U,
  ...HEROS_V,
  ...HEROS_W,
  ...HEROS_Y,
  ...HEROS_Z,
];

// Map id → héros pour un accès rapide
export const HEROS_PAR_ID = Object.fromEntries(
  TOUS_LES_HEROS.map((h) => [h.id, h])
);

export default TOUS_LES_HEROS;

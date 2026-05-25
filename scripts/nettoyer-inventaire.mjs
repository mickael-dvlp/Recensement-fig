// ============================================================
// NETTOYAGE INVENTAIRE FIRESTORE
// Supprime les entrées orphelines (IDs qui n'existent plus
// dans les fichiers de données factions/héros).
//
// Usage :
//   node scripts/nettoyer-inventaire.mjs <email> <mot-de-passe>
// ============================================================

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const API_KEY = "AIzaSyA7Uz_JTUxSBzyaEUOZ3ou0gPXGXnsE3-g";
const PROJECT_ID = "app-figurine";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ---- 1. COLLECTE DES IDs VALIDES ----

function lireIdsValides() {
  const ids = new Set();

  const lireDossier = (dossier) => {
    const fichiers = readdirSync(dossier).filter(
      (f) => f.endsWith(".js") && f !== "index.js"
    );
    for (const f of fichiers) {
      const contenu = readFileSync(join(dossier, f), "utf8");
      // id: "xxx"
      for (const m of contenu.matchAll(/\bid:\s*"([^"]+)"/g)) ids.add(m[1]);
      // inventaireId: "xxx"
      for (const m of contenu.matchAll(/\binventaireId:\s*"([^"]+)"/g)) ids.add(m[1]);
    }
  };

  lireDossier(join(ROOT, "data", "factions"));
  lireDossier(join(ROOT, "data", "heros"));

  return ids;
}

// ---- 2. AUTHENTIFICATION FIREBASE ----

async function seConnecter(email, password) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`Connexion échouée : ${data.error?.message}`);
  return { uid: data.localId, token: data.idToken };
}

// ---- 3. LECTURE INVENTAIRE FIRESTORE (avec pagination) ----

async function getInventaireIds(uid, token) {
  const ids = [];
  let pageToken = null;

  do {
    const url =
      `${FIRESTORE_BASE}/utilisateurs/${uid}/inventaire?pageSize=300` +
      (pageToken ? `&pageToken=${pageToken}` : "");

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Lecture Firestore échouée : ${data.error?.message}`);

    if (data.documents) {
      for (const doc of data.documents) {
        ids.push(doc.name.split("/").pop());
      }
    }
    pageToken = data.nextPageToken ?? null;
  } while (pageToken);

  return ids;
}

// ---- 4. SUPPRESSION ----

async function supprimerDoc(uid, id, token) {
  const url = `${FIRESTORE_BASE}/utilisateurs/${uid}/inventaire/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? "Erreur inconnue");
  }
}

// ---- MAIN ----

async function main() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error(
      "Usage : node scripts/nettoyer-inventaire.mjs <email> <mot-de-passe>"
    );
    process.exit(1);
  }

  console.log("📚 Lecture des IDs valides depuis les fichiers de données...");
  const idsValides = lireIdsValides();
  console.log(`   ${idsValides.size} IDs valides trouvés\n`);

  console.log("🔐 Connexion à Firebase...");
  const { uid, token } = await seConnecter(email, password);
  console.log(`   Connecté (UID : ${uid})\n`);

  console.log("📦 Récupération de l'inventaire Firestore...");
  const idsInventaire = await getInventaireIds(uid, token);
  console.log(`   ${idsInventaire.length} entrée(s) dans l'inventaire\n`);

  const orphelins = idsInventaire.filter(
    (id) => !idsValides.has(id) && !id.startsWith("custom-")
  );

  if (orphelins.length === 0) {
    console.log("✅ Aucune entrée orpheline. Inventaire déjà propre !");
    return;
  }

  console.log(`🗑  ${orphelins.length} entrée(s) orpheline(s) détectée(s) :`);
  orphelins.forEach((id) => console.log(`   - ${id}`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const reponse = await new Promise((resolve) =>
    rl.question("\nSupprimer ces entrées ? (oui/non) : ", resolve)
  );
  rl.close();

  if (reponse.trim().toLowerCase() !== "oui") {
    console.log("Annulé.");
    return;
  }

  console.log("\nSuppression en cours...");
  let ok = 0, ko = 0;
  for (const id of orphelins) {
    try {
      await supprimerDoc(uid, id, token);
      console.log(`   ✓ ${id}`);
      ok++;
    } catch (e) {
      console.error(`   ✗ ${id} — ${e.message}`);
      ko++;
    }
  }

  console.log(`\n✅ Terminé : ${ok} supprimée(s), ${ko} erreur(s).`);
}

main().catch(console.error);

// ============================================================
// NETTOYAGE INVENTAIRE FIRESTORE
// Supprime les entrées orphelines (IDs qui n'existent plus
// dans les fichiers de données factions/héros).
//
// Usage :
//   node scripts/nettoyer-inventaire.mjs [email]
//   (email en argument optionnel ; le mot de passe est toujours
//   demandé en saisie masquée, jamais en argument — évite qu'il
//   se retrouve dans l'historique du shell ou la liste des process)
// ============================================================

import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Lit .env.local à la main (script Node autonome, hors pipeline Next.js qui
// charge ces variables automatiquement) plutôt que de dupliquer la clé en dur.
function lireEnvLocal() {
  const chemin = join(ROOT, ".env.local");
  if (!existsSync(chemin)) return {};
  const contenu = readFileSync(chemin, "utf8").replace(/^﻿/, "");
  const env = {};
  for (const ligne of contenu.split(/\r?\n/)) {
    const m = ligne.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

const env = lireEnvLocal();
const API_KEY = env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!API_KEY || !PROJECT_ID) {
  console.error("NEXT_PUBLIC_FIREBASE_API_KEY / NEXT_PUBLIC_FIREBASE_PROJECT_ID manquants dans .env.local");
  process.exit(1);
}

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

// ---- SAISIE ----

function lireLigne(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (reponse) => { rl.close(); resolve(reponse); }));
}

// Saisie masquée : évite que le mot de passe apparaisse en clair dans le terminal,
// contrairement à un argument CLI qui reste visible dans l'historique du shell
// et dans la liste des process (ps/tasklist) tant que la commande tourne.
// Les codes de contrôle sont construits via fromCharCode pour rester des sources
// non ambigus (évite d'embarquer des octets de contrôle bruts dans le fichier).
function lireMotDePasseCache(question) {
  const NEWLINE = String.fromCharCode(10);
  const RETOUR_CHARIOT = String.fromCharCode(13);
  const FIN_TRANSMISSION = String.fromCharCode(4); // Ctrl+D
  const INTERRUPTION = String.fromCharCode(3); // Ctrl+C
  const RETOUR_ARRIERE = String.fromCharCode(127); // Backspace

  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    let mdp = "";
    const onData = (char) => {
      if (char === NEWLINE || char === RETOUR_CHARIOT || char === FIN_TRANSMISSION) {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(mdp);
      } else if (char === INTERRUPTION) {
        process.stdout.write("\n");
        process.exit(1);
      } else if (char === RETOUR_ARRIERE) {
        mdp = mdp.slice(0, -1);
      } else {
        mdp += char;
      }
    };
    stdin.on("data", onData);
  });
}

// ---- MAIN ----

async function main() {
  const [, , emailArg] = process.argv;
  const email = emailArg || (await lireLigne("Email : "));
  const password = await lireMotDePasseCache("Mot de passe : ");
  if (!email || !password) {
    console.error("Usage : node scripts/nettoyer-inventaire.mjs [email]");
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

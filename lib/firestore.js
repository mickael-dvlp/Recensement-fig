// ============================================================
// FONCTIONS FIRESTORE - Gestion de l'inventaire utilisateur
// ============================================================

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  collection,
  getDocs,
  getCountFromServer,
  writeBatch,
  runTransaction,
  increment,
  serverTimestamp,
} from "firebase/firestore";

const LIMITE_MEMOS = 100;
const LIMITE_FIGURINES_CUSTOM = 200;
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { getAllFigurines } from "@/data/factions/index.js";
import TOUS_LES_HEROS from "@/data/heros/index.js";

// ---- PROFIL UTILISATEUR ----

// Les compteurs sont initialisés explicitement car les règles Firestore
// les lisent pour appliquer les limites (mémos ≤ 100, customs ≤ 200).
export async function creerProfil(profil) {
  await setDoc(doc(db, "utilisateurs", profil.uid), {
    ...profil,
    compteurMemos: 0,
    compteurCustom: 0,
    nettoyageFait: serverTimestamp(),
  });
}

export async function getProfil(uid) {
  const snap = await getDoc(doc(db, "utilisateurs", uid));
  return snap.exists() ? snap.data() : null;
}

// ---- MÉMOS PROJET ----

// Tri : mémos réordonnés par drag-drop (champ `ordre`) en premier, sinon date de création desc.
// Les mémos sans `ordre` remontent en haut pour rétrocompatibilité avec les anciens documents.
export async function getMemos(uid) {
  const snap = await getDocs(collection(db, "utilisateurs", uid, "memos"));
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  docs.sort((a, b) => {
    const aHasOrdre = a.ordre !== undefined && a.ordre !== null;
    const bHasOrdre = b.ordre !== undefined && b.ordre !== null;
    if (aHasOrdre && bHasOrdre) return a.ordre - b.ordre;
    if (aHasOrdre) return 1;
    if (bHasOrdre) return -1;
    return (b.creeLe?.seconds ?? 0) - (a.creeLe?.seconds ?? 0);
  });
  return docs;
}

// Transactionnel : la vérification du compteur et son incrément doivent être atomiques
// pour empêcher deux créations concurrentes (double-clic, plusieurs onglets) de dépasser
// la limite — un simple read-then-write (getCountFromServer + batch) laissait une fenêtre
// de course où les deux requêtes pouvaient lire le même compteur avant d'écrire.
export async function creerMemo(uid, { titre, texte, type = "memo", figurines = [] }) {
  const userRef = doc(db, "utilisateurs", uid);
  const newRef = doc(collection(db, "utilisateurs", uid, "memos"));
  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef);
    const compteur = userSnap.data()?.compteurMemos ?? 0;
    if (compteur >= LIMITE_MEMOS) throw new Error("limite_memos_atteinte");
    tx.set(newRef, { titre, texte, type, figurines, creeLe: serverTimestamp(), ordre: -Date.now() });
    tx.update(userRef, { compteurMemos: compteur + 1 });
  });
  return newRef.id;
}

export async function modifierMemo(uid, memoId, data) {
  await updateDoc(doc(db, "utilisateurs", uid, "memos", memoId), data);
}

export async function supprimerMemo(uid, memoId) {
  const batch = writeBatch(db);
  batch.delete(doc(db, "utilisateurs", uid, "memos", memoId));
  batch.update(doc(db, "utilisateurs", uid), { compteurMemos: increment(-1) });
  await batch.commit();
}

export async function mettreAJourOrdreMemos(uid, orderedIds) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "utilisateurs", uid, "memos", id), { ordre: index });
  });
  await batch.commit();
}

// ---- INVENTAIRE FIGURINES ----

export async function getInventaireUtilisateur(uid) {
  const colRef = collection(db, "utilisateurs", uid, "inventaire");
  const snap = await getDocs(colRef);
  const result = {};
  snap.forEach((d) => {
    result[d.id] = d.data();
  });
  return result;
}

// ---- FIGURINES CUSTOM ----

export async function getFigurinesCustom(uid) {
  const snap = await getDocs(collection(db, "utilisateurs", uid, "figurinesCustom"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// La vérification avant upload est une sécurité rapide côté client pour éviter un upload
// inutile si la limite est déjà manifestement atteinte ; la vérification qui compte
// réellement se fait dans la transaction juste avant l'écriture (atomique, contrairement
// à un read-then-write, ça empêche deux créations concurrentes de dépasser la limite).
// Si la transaction échoue (limite atteinte entre-temps), le fichier tout juste uploadé
// est supprimé pour ne pas laisser d'orphelin dans Storage.
export async function creerFigurineCustom(uid, { nom, faction, section, file }) {
  const userRef = doc(db, "utilisateurs", uid);
  const countSnap = await getCountFromServer(collection(db, "utilisateurs", uid, "figurinesCustom"));
  if (countSnap.data().count >= LIMITE_FIGURINES_CUSTOM) throw new Error("limite_custom_atteinte");

  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const storageRef = ref(storage, `utilisateurs/${uid}/figurinesCustom/${id}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  try {
    await runTransaction(db, async (tx) => {
      const userSnap = await tx.get(userRef);
      const compteur = userSnap.data()?.compteurCustom ?? 0;
      if (compteur >= LIMITE_FIGURINES_CUSTOM) throw new Error("limite_custom_atteinte");
      tx.set(doc(db, "utilisateurs", uid, "figurinesCustom", id), {
        nom, faction, section, imageUrl, creeLe: serverTimestamp(),
      });
      tx.update(userRef, { compteurCustom: compteur + 1 });
    });
  } catch (err) {
    await deleteObject(storageRef).catch(() => {});
    throw err;
  }

  return { id, nom, faction, section, imageUrl };
}

export async function modifierFigurineCustom(uid, id, { nom, file } = {}) {
  const updates = {};
  if (nom !== undefined) updates.nom = nom;
  if (file) {
    const storageRef = ref(storage, `utilisateurs/${uid}/figurinesCustom/${id}`);
    await uploadBytes(storageRef, file);
    updates.imageUrl = await getDownloadURL(storageRef);
  }
  if (Object.keys(updates).length > 0) {
    await updateDoc(doc(db, "utilisateurs", uid, "figurinesCustom", id), updates);
  }
  return updates;
}

// Supprime aussi l'entrée inventaire pour éviter les données orphelines.
// La suppression Storage est en try/catch car le fichier peut déjà être absent
// (upload partiel, suppression manuelle…) et ne bloque pas la cohérence Firestore.
export async function supprimerFigurineCustom(uid, id) {
  const batch = writeBatch(db);
  batch.delete(doc(db, "utilisateurs", uid, "figurinesCustom", id));
  batch.delete(doc(db, "utilisateurs", uid, "inventaire", id));
  batch.update(doc(db, "utilisateurs", uid), { compteurCustom: increment(-1) });
  await batch.commit();
  try {
    await deleteObject(ref(storage, `utilisateurs/${uid}/figurinesCustom/${id}`));
  } catch {
    // fichier absent — pas bloquant
  }
}

// ---- PSEUDOS (unicité + recherche) ----

export async function verifierPseudoDisponible(pseudo) {
  const snap = await getDoc(doc(db, "pseudos", pseudo.toLowerCase()));
  return !snap.exists();
}

export async function reserverPseudo(pseudo, uid) {
  await setDoc(doc(db, "pseudos", pseudo.toLowerCase()), { uid, pseudo });
}

// Libère un pseudo réservé. Utilisé pour annuler une réservation quand une étape
// suivante de l'inscription échoue (rollback), pas dans le flux normal.
export async function libererPseudo(pseudo) {
  await deleteDoc(doc(db, "pseudos", pseudo.toLowerCase()));
}

export async function modifierPseudo(uid, ancienPseudo, nouveauPseudo) {
  const dispo = await verifierPseudoDisponible(nouveauPseudo);
  if (!dispo) throw new Error("pseudo_indisponible");
  const batch = writeBatch(db);
  batch.delete(doc(db, "pseudos", ancienPseudo.toLowerCase()));
  batch.set(doc(db, "pseudos", nouveauPseudo.toLowerCase()), { uid, pseudo: nouveauPseudo });
  batch.update(doc(db, "utilisateurs", uid), {
    pseudo: nouveauPseudo,
    dernierChangementPseudo: serverTimestamp(),
  });
  await batch.commit();
}

// ---- AMIS ----

export async function getAmis(uid) {
  const snap = await getDocs(collection(db, "utilisateurs", uid, "amis"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Protocole à 2 états : expéditeur reçoit "envoyé", destinataire reçoit "reçu".
// Les deux documents sont créés dans un batch atomique ; les règles Firestore
// valident les champs et les statuts côté serveur.
export async function envoyerDemandeAmi(uid, monPseudo, pseudoCible) {
  const pseudoSnap = await getDoc(doc(db, "pseudos", pseudoCible.toLowerCase()));
  if (!pseudoSnap.exists()) throw new Error("pseudo_introuvable");
  const amiUid = pseudoSnap.data().uid;
  if (amiUid === uid) throw new Error("soi_meme");
  const dejaAmi = await getDoc(doc(db, "utilisateurs", uid, "amis", amiUid));
  if (dejaAmi.exists()) throw new Error("deja_ami");
  const pseudoCibleReel = pseudoSnap.data().pseudo || pseudoCible;
  const batch = writeBatch(db);
  batch.set(doc(db, "utilisateurs", uid, "amis", amiUid), {
    statut: "envoyé",
    pseudo: pseudoCibleReel,
  });
  batch.set(doc(db, "utilisateurs", amiUid, "amis", uid), {
    statut: "reçu",
    pseudo: monPseudo,
  });
  await batch.commit();
  return amiUid;
}

export async function accepterDemandeAmi(uid, amiUid) {
  const batch = writeBatch(db);
  batch.update(doc(db, "utilisateurs", uid, "amis", amiUid), { statut: "accepté" });
  batch.update(doc(db, "utilisateurs", amiUid, "amis", uid), { statut: "accepté" });
  await batch.commit();
}

export async function supprimerRelationAmi(uid, amiUid) {
  const batch = writeBatch(db);
  batch.delete(doc(db, "utilisateurs", uid, "amis", amiUid));
  batch.delete(doc(db, "utilisateurs", amiUid, "amis", uid));
  await batch.commit();
}

// ---- NETTOYAGE INVENTAIRE ORPHELIN ----

// Supprime les entrées inventaire dont l'ID ne correspond plus à aucune figurine connue.
// Les documents "custom-*" sont explicitement exclus : ils sont valides même sans entrée dans les données.
// Limite de 500 documents par batch (contrainte Firestore).
export async function nettoyerInventaireOrphelins(uid) {
  const idsValides = new Set();

  for (const fig of getAllFigurines()) {
    idsValides.add(fig.id);
    if (fig.inventaireId) idsValides.add(fig.inventaireId);
  }
  for (const hero of TOUS_LES_HEROS) {
    for (const v of hero.variantes ?? []) idsValides.add(v.id);
  }

  const snap = await getDocs(collection(db, "utilisateurs", uid, "inventaire"));
  const orphelins = snap.docs.filter(
    (d) => !idsValides.has(d.id) && !d.id.startsWith("custom-")
  );

  for (let i = 0; i < orphelins.length; i += 500) {
    const batch = writeBatch(db);
    orphelins.slice(i, i + 500).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }

  // Timestamp uniquement si des orphelins ont été supprimés (évite une écriture inutile à chaque appel).
  if (orphelins.length > 0) {
    await updateDoc(doc(db, "utilisateurs", uid), { nettoyageFait: serverTimestamp() });
  }

  return orphelins.length;
}

// ---- INVENTAIRE FIGURINES ----

export async function mettreAJourFigurine(uid, figurineId, data) {
  const docRef = doc(db, "utilisateurs", uid, "inventaire", figurineId);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    await updateDoc(docRef, data);
  } else {
    await setDoc(docRef, {
      figurineId,
      enInventaire: false,
      quantiteInventaire: 0,
      souhaite: false,
      quantiteSouhaitee: 0,
      enProjet: false,
      ...data,
    });
  }
}

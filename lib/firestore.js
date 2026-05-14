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
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

// ---- PROFIL UTILISATEUR ----

export async function creerProfil(profil) {
  await setDoc(doc(db, "utilisateurs", profil.uid), profil);
}

export async function getProfil(uid) {
  const snap = await getDoc(doc(db, "utilisateurs", uid));
  return snap.exists() ? snap.data() : null;
}

// ---- MÉMOS PROJET ----

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

export async function creerMemo(uid, { titre, texte }) {
  await addDoc(collection(db, "utilisateurs", uid, "memos"), {
    titre,
    texte,
    creeLe: serverTimestamp(),
    ordre: -Date.now(),
  });
}

export async function modifierMemo(uid, memoId, { titre, texte }) {
  await updateDoc(doc(db, "utilisateurs", uid, "memos", memoId), {
    titre,
    texte,
  });
}

export async function supprimerMemo(uid, memoId) {
  await deleteDoc(doc(db, "utilisateurs", uid, "memos", memoId));
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

export async function creerFigurineCustom(uid, { nom, faction, section, file }) {
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const storageRef = ref(storage, `utilisateurs/${uid}/figurinesCustom/${id}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);
  await setDoc(doc(db, "utilisateurs", uid, "figurinesCustom", id), {
    nom,
    faction,
    section,
    imageUrl,
    creeLe: serverTimestamp(),
  });
  return { id, nom, faction, section, imageUrl };
}

export async function supprimerFigurineCustom(uid, id) {
  await deleteDoc(doc(db, "utilisateurs", uid, "figurinesCustom", id));
  await deleteDoc(doc(db, "utilisateurs", uid, "inventaire", id));
  try {
    await deleteObject(ref(storage, `utilisateurs/${uid}/figurinesCustom/${id}`));
  } catch {
    // fichier absent — pas bloquant
  }
}

// ---- INVENTAIRE FIGURINES ----

export async function mettreAJourFigurine(uid, figurineId, data) {
  const ref = doc(db, "utilisateurs", uid, "inventaire", figurineId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, data);
  } else {
    await setDoc(ref, {
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

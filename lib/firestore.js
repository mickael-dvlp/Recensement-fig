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

export async function creerMemo(uid, { titre, texte, type = "memo", figurines = [] }) {
  const newDoc = await addDoc(collection(db, "utilisateurs", uid, "memos"), {
    titre,
    texte,
    type,
    figurines,
    creeLe: serverTimestamp(),
    ordre: -Date.now(),
  });
  return newDoc.id;
}

export async function modifierMemo(uid, memoId, data) {
  await updateDoc(doc(db, "utilisateurs", uid, "memos", memoId), data);
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

// ---- PSEUDOS (unicité + recherche) ----

export async function verifierPseudoDisponible(pseudo) {
  const snap = await getDoc(doc(db, "pseudos", pseudo.toLowerCase()));
  return !snap.exists();
}

export async function reserverPseudo(pseudo, uid) {
  await setDoc(doc(db, "pseudos", pseudo.toLowerCase()), { uid, pseudo });
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
    statut: "en_attente",
    initiateur: uid,
    pseudo: pseudoCibleReel,
  });
  batch.set(doc(db, "utilisateurs", amiUid, "amis", uid), {
    statut: "en_attente",
    initiateur: uid,
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

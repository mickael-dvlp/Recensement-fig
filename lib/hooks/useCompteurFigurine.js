"use client";

import { useState, useEffect } from "react";

/**
 * Logique commune de gestion du compteur inventaire, partagée entre FigurineRow
 * et CartePeinture (peinture/page.jsx) : ajout, +/-, bascule "souhaité".
 *
 * @param {string}   id                     - ID inventaire de l'entrée (figurine ou peinture)
 * @param {object}   donneesUtilisateur     - Données inventaire courantes (peut être undefined)
 * @param {Function} onMettreAJour          - Callback (id, data) => Promise, du hook useInventaire
 * @param {number}   [quantitePeinte]       - Si fourni, plafonné automatiquement à la nouvelle quantité
 *                                            possédée (comportement propre aux figurines, absent des peintures)
 * @param {boolean}  [avecQuantiteSouhaitee] - Si true (défaut), toggleSouhaite initialise/remet à zéro
 *                                            quantiteSouhaitee ; les peintures n'utilisent pas ce champ.
 */
export function useCompteurFigurine({
  id,
  donneesUtilisateur,
  onMettreAJour,
  quantitePeinte,
  avecQuantiteSouhaitee = true,
}) {
  const quantite = donneesUtilisateur?.quantiteInventaire ?? 0;
  const souhaite = donneesUtilisateur?.souhaite ?? false;
  const quantiteSouhaitee = donneesUtilisateur?.quantiteSouhaitee ?? 0;
  const [compteurVisible, setCompteurVisible] = useState(quantite > 0);

  useEffect(() => {
    setCompteurVisible(quantite > 0);
  }, [quantite]);

  async function ajouter() {
    setCompteurVisible(true);
    await onMettreAJour(id, { enInventaire: true, quantiteInventaire: 1 });
  }

  async function modifierQuantite(delta) {
    const nouvelleQuantite = Math.max(0, quantite + delta);
    if (nouvelleQuantite === 0) setCompteurVisible(false);
    const updates = {
      enInventaire: nouvelleQuantite > 0,
      quantiteInventaire: nouvelleQuantite,
    };
    if (quantitePeinte !== undefined && quantitePeinte > nouvelleQuantite) {
      updates.quantitePeinte = nouvelleQuantite;
    }
    await onMettreAJour(id, updates);
  }

  async function toggleSouhaite() {
    const newSouhaite = !souhaite;
    const updates = { souhaite: newSouhaite };
    if (avecQuantiteSouhaitee) {
      if (newSouhaite && quantiteSouhaitee === 0) updates.quantiteSouhaitee = 1;
      if (!newSouhaite) updates.quantiteSouhaitee = 0;
    }
    await onMettreAJour(id, updates);
  }

  return { quantite, souhaite, quantiteSouhaitee, compteurVisible, ajouter, modifierQuantite, toggleSouhaite };
}

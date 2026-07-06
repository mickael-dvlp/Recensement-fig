# Patterns UI — E-commerce

## Principes spécifiques à l'e-commerce

L'e-commerce chaud et accessible vise la **confiance d'achat**.
L'utilisateur doit se sentir rassuré à chaque étape : qui vend, ce qu'il achète,
que son argent est en sécurité, que la livraison est prévisible.

Références : Sézane (chaleur + premium accessible), Patagonia (confiance + valeurs),
Decathlon (clarté + accessibilité).

---

## Pages clés et leur priorité

```
1. Page produit ← la plus importante, maximum de soin
2. Page liste / catégorie ← découverte, filtres clairs
3. Panier + checkout ← frictionless, rassurant
4. Page d'accueil ← vitrine, pas e-commerce pur
```

---

## Page produit — structure recommandée

```tsx
<div className="max-w-7xl mx-auto px-4 py-8">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

    {/* Colonne gauche — visuels */}
    <div className="space-y-4">
      {/* Image principale */}
      <div className="aspect-square rounded-brand-lg overflow-hidden bg-neutral-100">
        <img className="h-full w-full object-cover" src="..." alt="..." />
      </div>
      {/* Miniatures */}
      <div className="grid grid-cols-4 gap-2">
        {/* ... */}
      </div>
    </div>

    {/* Colonne droite — infos achat */}
    <div className="lg:sticky lg:top-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-neutral-500">...</nav>

      {/* Nom + note */}
      <div>
        <h1 className="text-display-sm font-heading font-bold text-neutral-900">
          Nom du produit
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex text-brand-400">{'★★★★★'}</div>
          <span className="text-sm text-neutral-500">4.8 (127 avis)</span>
        </div>
      </div>

      {/* Prix — hiérarchie claire */}
      <div className="flex items-baseline gap-3">
        <span className="text-display-xs font-bold text-neutral-900">89,00 €</span>
        <span className="text-base text-neutral-400 line-through">119,00 €</span>
        <span className="text-sm font-semibold text-success bg-success/10
                         px-2 py-0.5 rounded">-25%</span>
      </div>

      {/* Variantes (couleur, taille) */}
      <div className="space-y-4">
        {/* ... sélecteurs */}
      </div>

      {/* CTA principal */}
      <button className="w-full rounded-brand bg-brand-500 py-4 px-8
                         text-base font-semibold text-white
                         hover:bg-brand-600 transition-colors
                         shadow-brand focus-visible:ring-2
                         focus-visible:ring-brand-500">
        Ajouter au panier
      </button>

      {/* Réassurance */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {[
          { icon: '🚚', text: 'Livraison offerte dès 50€' },
          { icon: '↩️', text: 'Retour gratuit 30 jours' },
          { icon: '🔒', text: 'Paiement sécurisé' },
          { icon: '⭐', text: 'Garantie 2 ans' },
        ].map(item => (
          <div key={item.text}
               className="flex items-center gap-2 text-xs text-neutral-600">
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Description courte */}
      <div className="border-t border-neutral-200 pt-6 prose prose-sm
                      text-neutral-700 max-w-none">
        <p>Description courte, bénéfices avant caractéristiques.</p>
      </div>
    </div>
  </div>
</div>
```

---

## Grille produits — bonnes pratiques

```tsx
// ✅ Grille responsive avec card propre
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
  {products.map(product => (
    <article key={product.id} className="group">
      {/* Image avec ratio forcé */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-brand bg-neutral-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300
                     group-hover:scale-105"
        />
        {/* Badge promo */}
        {product.discount && (
          <span className="absolute top-2 left-2 bg-error text-white
                           text-xs font-semibold px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
        {/* Quick add au hover — desktop uniquement */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full
                        group-hover:translate-y-0 transition-transform duration-200
                        p-3 hidden md:block">
          <button className="w-full rounded-brand bg-neutral-900/90 backdrop-blur-sm
                             py-2 text-sm font-medium text-white
                             hover:bg-neutral-900 transition-colors">
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Infos produit */}
      <div className="mt-3 space-y-1">
        <p className="text-sm text-neutral-500">{product.category}</p>
        <h3 className="font-medium text-neutral-900 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-900">
            {product.price} €
          </span>
          {product.originalPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {product.originalPrice} €
            </span>
          )}
        </div>
      </div>
    </article>
  ))}
</div>
```

---

## Checkout — règles UX critiques

```
- Maximum 3 étapes visibles (indicateur de progression obligatoire)
- Chaque champ : label visible TOUJOURS (pas placeholder seul)
- Erreurs : message sous le champ, jamais en toast
- Récapitulatif panier toujours visible (sticky sur desktop)
- Bouton "Passer commande" : couleur brand, libellé clair avec montant
- Logos cartes (Visa, MC) visibles près du champ carte
- HTTPS + cadenas mentionné textuellement si public non-averti
- Option "Continuer sans créer de compte" toujours présente
```

---

## Typographie e-commerce recommandée

**Option A — Chaud + premium accessible**
- Heading : `Playfair Display` (700) — élégant, intemporel
- Body : `Lato` (400/700) — très lisible, polyvalent

**Option B — Moderne + accessible**
- Heading : `Outfit` (700/800) — géométrique chaud
- Body : `Outfit` (400/500) — cohérence totale

**Règles e-commerce :**
- Prix toujours en `font-bold` ou `font-semibold`, jamais en regular
- Noms de produits : `leading-snug` pour les listes, `leading-normal` pour les pages
- CTA : `font-semibold` minimum, jamais `font-medium`

---

## Ce qu'on évite en e-commerce

- Fond noir / dark mode (réduit la confiance d'achat)
- Images produits de taille incohérente dans la grille
- Prix trop petits ou peu contrastés
- "Ajouter au panier" en couleur secondaire ou ghost button
- Plus de 2 popups sur le parcours d'achat
- Checkout multi-page sans indicateur de progression
- Compte obligatoire avant d'acheter

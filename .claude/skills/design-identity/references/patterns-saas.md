# Patterns UI — SaaS / App métier

## Principes spécifiques au SaaS

Le SaaS doit inspirer **confiance et efficacité** dès la première vue.
L'utilisateur doit comprendre en 5 secondes : ce que c'est, pour qui, et l'action suivante.

Registre chaud + SaaS = **accessibilité professionnelle** : pas corporate froid, pas startup flashy.
Références : Basecamp, Notion (version claire), Linear si couleur forte.

---

## Layout patterns recommandés

### Page d'accueil SaaS

```
Hero (60-80vh)
├── Badge de catégorie (optionnel)
├── Titre H1 — fort, bénéfice direct (pas feature)
├── Sous-titre — qui, quoi, pourquoi maintenant
├── CTA primaire + CTA secondaire (lien texte)
└── Social proof immédiat (logos clients OU chiffre clé)

Features (3-4 items)
├── Titre de section court
├── Layout : alternance texte/visuel (pas grid 3 colonnes)
└── Chaque feature : 1 bénéfice, 1 phrase, 1 visuel

Pricing
├── 2-3 tiers maximum
├── Plan recommandé visuellement différencié (border brand)
└── Toggle annuel/mensuel si applicable

Social proof
└── Testimonials : citation + nom + titre + photo (pas juste initiales)

CTA final
└── Répéter le bénéfice principal + bouton primaire
```

### Dashboard app

```tsx
// Layout standard dashboard
<div className="flex h-screen bg-neutral-50">
  {/* Sidebar */}
  <aside className="w-64 flex-shrink-0 border-r border-neutral-200 bg-white">
    <nav className="p-4 space-y-1">
      {/* Nav items */}
    </nav>
  </aside>

  {/* Main content */}
  <main className="flex-1 overflow-auto">
    {/* Top bar */}
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80
                       backdrop-blur-sm px-6 py-4">
      {/* Page title + actions */}
    </header>

    {/* Content */}
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* KPI cards */}
      {/* Data tables / charts */}
    </div>
  </main>
</div>
```

---

## Composants SaaS fréquents

### Stat card (KPI)

```tsx
// ✅ Avec hiérarchie claire
<div className="rounded-brand-lg bg-white border border-neutral-200 p-6
                shadow-brand-sm hover:shadow-brand transition-shadow">
  <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
    Revenus ce mois
  </p>
  <p className="mt-2 text-display-md font-heading font-bold text-neutral-900">
    24 380 €
  </p>
  <p className="mt-1 text-sm text-success">
    ↑ 12% vs mois dernier
  </p>
</div>
```

### Pricing card

```tsx
// Plan recommandé
<div className="rounded-brand-lg border-2 border-brand-500 bg-brand-50 p-8
                relative shadow-brand">
  <span className="absolute -top-3 left-1/2 -translate-x-1/2
                   bg-brand-500 text-white text-xs font-semibold
                   px-3 py-1 rounded-full">
    Recommandé
  </span>
  {/* ... */}
</div>

// Plan standard
<div className="rounded-brand-lg border border-neutral-200 bg-white p-8">
  {/* ... */}
</div>
```

### Feature item (alterné texte/visuel)

```tsx
// ✅ Alterné — bien plus mémorable qu'une grille
<section className="py-24 bg-neutral-50">
  <div className="max-w-6xl mx-auto px-6 space-y-24">
    {features.map((feature, i) => (
      <div key={i} className={`flex flex-col md:flex-row items-center gap-12
                               ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
        <div className="flex-1 space-y-4">
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-wide">
            {feature.tag}
          </span>
          <h3 className="text-display-sm font-heading font-bold text-neutral-900">
            {feature.title}
          </h3>
          <p className="text-lg text-neutral-600 leading-relaxed">
            {feature.description}
          </p>
        </div>
        <div className="flex-1">
          {/* Visuel / screenshot / illustration */}
        </div>
      </div>
    ))}
  </div>
</section>
```

---

## Typographie SaaS recommandée

**Option A — Sobre + accessible**
- Heading : `Plus Jakarta Sans` (800) — moderne, lisible, pas Inter
- Body : `DM Sans` (400/500) — très lisible, légèrement chaud

**Option B — Distinctif + confiant**
- Heading : `Fraunces` (700) — serif variable, fort caractère
- Body : `DM Sans` (400/500)

**Option C — Premium + sérieux**
- Heading : `Instrument Serif` (400 italic pour accents) + bold regular
- Body : `Inter` accepté ici car contra-typique dans le SaaS "chaud"

---

## Ce qu'on évite en SaaS

- Hero avec image stock de laptop / téléphone générique
- "Simple, powerful, and secure" comme headline
- Grid de 6 feature cards avec icône centrée
- Testimonials sans photo ni titre de poste
- Pricing avec 5+ tiers
- Animations de parallax sur la hero section

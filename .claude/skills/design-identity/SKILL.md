---
name: design-identity
description: >
  Establish and enforce a unique visual identity before writing any UI code. Trigger
  this skill whenever the user starts a new project, asks to "create a page", "build
  a component", "design a layout", "make it look better", or mentions UI/design work
  in Next.js + Tailwind CSS projects. Also trigger when the user says the design
  feels generic, boring, templated, or "like every other SaaS". The skill runs a
  mandatory design brief phase first, then generates Tailwind tokens, then writes
  components — never the reverse. Use for SaaS apps, landing pages, and e-commerce
  projects with a warm, accessible visual register.
---

# Design Identity Skill — Next.js + Tailwind CSS

## Philosophie fondamentale

**Le problème n°1 du code UI généré par IA : l'absence de brief.**
Claude génère du code fonctionnel mais visuellement amnésique — Inter partout, gris neutres,
cards empilées, boutons arrondis à l'identique. Pas parce que Claude est mauvais en design,
mais parce qu'on ne lui a pas donné de point de vue.

Ce skill impose un ordre strict :
1. **Brief** — définir l'identité avant tout code
2. **Tokens** — ancrer l'identité dans des variables Tailwind
3. **Composants** — construire en cohérence avec les tokens

Ne jamais inverser cet ordre. Si un utilisateur demande un composant sans brief préalable,
établir le brief d'abord (même en 3 questions rapides).

---

## Registre visuel cible

Projets visés : **SaaS/app métier, landing pages marketing, e-commerce**
Registre : **Chaud et accessible** — grand public, confiance immédiate, lisibilité maximale

Ce que ça signifie concrètement :
- Couleurs chaudes comme base (ambre, terracotta, sable, vert sauge) plutôt que bleu corporate
- Typographie humaine et lisible, pas strictement géométrique
- Espacement généreux — ça respire
- Contrastes clairs — accessible WCAG AA minimum
- Pas d'effets décoratifs qui distraient (glassmorphism, néons, dark mode agressif)
- Animations subtiles et fonctionnelles uniquement

---

## Phase 1 — Brief obligatoire (5 questions max)

Avant d'écrire la moindre classe Tailwind, poser ces questions. S'arrêter dès qu'on a
assez pour trancher — ne pas toutes les poser si le contexte répond déjà à certaines.

```
1. C'est quoi le produit en une phrase ? (audience + promesse principale)
2. 3 adjectifs que l'utilisateur doit ressentir en arrivant sur la page
3. Une référence visuelle qui te plaît (site, app, marque) — même hors de ton secteur
4. Une chose à éviter absolument (visuellement ou en UX)
5. Couleur dominante souhaitée, ou liberté totale ?
```

À partir de ces réponses, **Claude doit prendre des décisions tranchées** et les annoncer
avant de coder. Exemple :

> "Pour ce projet, je pars sur : palette terracotta + crème, typographie Lora (titres) +
> DM Sans (corps), layouts asymétriques avec une forte hiérarchie verticale, zéro ombre
> portée — uniquement des bordures. Voici les tokens."

---

## Phase 2 — Génération des tokens Tailwind

Créer ou mettre à jour `tailwind.config.ts` avec les tokens du projet.
Toujours générer UN fichier `design-system.md` à la racine du projet pour mémoriser
les décisions (consulté à chaque nouvelle session).

### Structure de tokens attendue

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette principale — toujours nommer par rôle, pas par couleur
        brand: {
          50:  '#fdf8f0',   // surfaces très légères
          100: '#faefd9',   // surfaces légères / hover subtil
          200: '#f3d9a8',   // bordures légères
          300: '#e8bb6e',   // accents secondaires
          400: '#dd9d3a',   // accent principal léger
          500: '#c97f1e',   // brand primary
          600: '#a8630f',   // brand dark / hover
          700: '#874d0a',   // texte sur fond clair
          800: '#6b3c08',   // texte emphasis
          900: '#4f2b06',   // texte très fort
        },
        neutral: {
          // Base chaude — légèrement teintée, jamais pure grise froide
          50:  '#fafaf9',
          100: '#f5f5f3',
          200: '#e8e8e4',
          300: '#d4d4ce',
          400: '#a8a8a0',
          500: '#737370',
          600: '#525250',
          700: '#3d3d3a',
          800: '#262624',
          900: '#141412',
        },
        success: { DEFAULT: '#2d7d52', light: '#d1fae5' },
        warning: { DEFAULT: '#c97f1e', light: '#fef3c7' },
        error:   { DEFAULT: '#b91c1c', light: '#fee2e2' },
      },
      fontFamily: {
        // Titres : serif ou humaniste selon le brief
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        // Corps : sans-serif lisible, jamais Inter par défaut
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        // Mono : code uniquement
        mono:    ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        // Échelle typographique — toujours définir explicitement
        'display-2xl': ['4.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg':  ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-md':  ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm':  ['1.875rem',{ lineHeight: '1.25' }],
        'display-xs':  ['1.5rem',  { lineHeight: '1.3' }],
        // Corps standard Tailwind conservé en dessous
      },
      spacing: {
        // Grille 4px — cohérence absolue
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        // Choisir UN niveau d'arrondi dominant et s'y tenir
        'brand': '0.5rem',   // composants standard
        'brand-lg': '1rem',  // cards, modals
        'brand-xl': '1.5rem',// éléments hero
      },
      boxShadow: {
        // Ombres subtiles et chaudes (légèrement teintées)
        'brand-sm': '0 1px 3px 0 rgb(201 127 30 / 0.08)',
        'brand':    '0 4px 12px 0 rgb(201 127 30 / 0.1)',
        'brand-lg': '0 8px 32px 0 rgb(201 127 30 / 0.12)',
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'scale-in':   'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Phase 3 — Règles de composition UI

### Hiérarchie visuelle — règle des 3 niveaux

Chaque page doit avoir exactement 3 niveaux de poids visuel :
1. **Ancre** — 1 seul élément dominant (titre hero, stat clé, image principale)
2. **Structure** — groupes de contenu clairs, espacés
3. **Détail** — texte courant, labels, métadonnées

Si tout a le même poids → tout est fade. Toujours identifier l'ancre avant de coder.

### Typographie — règles strictes

```
- Titres : font-heading, toujours en font-weight 700 ou 800
- Corps : font-body, font-weight 400, line-height généreuse (1.6-1.75)
- Labels/UI : font-body, font-weight 500 ou 600, letter-spacing légèrement positif
- JAMAIS : font-weight 300 sur corps (illisible sur mobile)
- JAMAIS : text-gray-500 sur fond blanc pour texte important (contraste insuffisant)
- TOUJOURS : utiliser l'échelle typographique définie dans les tokens
```

### Couleurs — règles d'utilisation

```
- brand-500 : CTA principal uniquement (bouton primaire, lien d'action)
- brand-50/100 : backgrounds de sections alternées
- neutral-800/900 : texte principal
- neutral-500/600 : texte secondaire (jamais sur fond coloré)
- Fond par défaut : neutral-50 (pas blanc pur — trop froid)
- Jamais plus de 2 couleurs de marque sur la même page
```

### Espacement — règle du 4x

Tout espacement est un multiple de 4px (Tailwind : 1, 2, 3, 4, 6, 8, 10, 12, 16...).
Jamais de valeurs arbitraires comme `mt-[13px]` sauf exception justifiée.

Section padding standard : `py-16 md:py-24` (desktop), `px-4 md:px-6 lg:px-8`
Gap entre composants : `gap-6` (compact) / `gap-8` (standard) / `gap-12` (aéré)

### Patterns par type de projet

Lire le fichier de référence correspondant avant de coder :
- **SaaS / app métier** → `references/patterns-saas.md`
- **Landing page marketing** → `references/patterns-landing.md`
- **E-commerce** → `references/patterns-ecommerce.md`

---

## Phase 4 — Fichier design-system.md

Créer ce fichier à la racine à la fin de chaque brief. Il est relu au début de chaque
nouvelle session pour éviter la dérive stylistique.

```markdown
# Design System — [Nom du projet]

## Identité
- **Registre** : [ex: Chaud et accessible / SaaS B2B sobre / E-commerce premium]
- **Adjectifs** : [3 mots choisis au brief]
- **Référence** : [ex: "ambiance Airbnb mais pour une app RH"]

## Tokens actifs
- **Couleur brand** : brand-500 = #c97f1e (terracotta ambre)
- **Fond** : neutral-50
- **Heading** : Lora 700/800
- **Body** : DM Sans 400/500

## Décisions prises
- [ ] Pas de dark mode sur ce projet
- [ ] Bordures arrondies : brand (8px) sur composants, brand-lg (16px) sur cards
- [ ] Ombres légères teintées brand uniquement (pas de gray shadows)
- [ ] Animations : fade-in et slide-up uniquement, durée max 300ms

## Anti-patterns pour ce projet
- [ ] Pas de gradient violet/bleu
- [ ] Pas de glassmorphism
- [ ] Pas de fond dark sur les sections hero
- [ ] [anti-pattern spécifique au brief]

## Composants existants
- Button (primary, secondary, ghost)
- Card
- [autres au fil du projet]
```

---

## Checklist avant de livrer un composant

- [ ] Les couleurs utilisées viennent uniquement des tokens définis
- [ ] La typographie respecte l'échelle et les font-families du projet
- [ ] L'espacement est un multiple de 4px
- [ ] Il y a une hiérarchie visuelle claire (ancre identifiable)
- [ ] Les états interactifs sont définis (hover, focus, disabled)
- [ ] Le composant est accessible (contrast ratio ≥ 4.5:1 pour texte normal)
- [ ] Aucune valeur arbitraire Tailwind non justifiée (`[]` syntax)
- [ ] Le composant est cohérent avec les composants existants du projet

---

## Anti-patterns à refuser systématiquement

Ces éléments signalent un design générique — les éviter sauf demande explicite :

```
❌ font-family: Inter (police par défaut AI #1)
❌ Gradient bg-gradient-to-r from-purple-600 to-blue-600
❌ rounded-full sur les boutons (trop SaaS générique)
❌ Cards avec shadow-lg partout sans hiérarchie
❌ bg-white comme fond principal (trop froid)
❌ text-gray-500 comme texte secondaire sur bg blanc (contraste borderline)
❌ Sections alternées bg-white / bg-gray-50 (visuellement plat)
❌ Icônes + titre centré sur chaque feature card (pattern sur-utilisé)
❌ Animations au scroll sur tous les éléments (distrait, ralentit)
❌ Bouton CTA rounded-full avec gradient (vieilli)
```

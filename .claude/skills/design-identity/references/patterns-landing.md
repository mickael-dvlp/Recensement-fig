# Patterns UI — Landing Page Marketing

## Principes spécifiques aux landing pages

Une landing page a **un seul objectif** : convertir. Tout élément qui ne sert pas
la conversion doit être retiré ou réduit.

Registre chaud + landing = **émotion + preuve + urgence légère**.
Pas de pression agressive — confiance d'abord, action ensuite.

Références : Mailchimp (chaleur), Stripe (précision), Framer (mouvement subtil).

---

## Structure narrative — toujours dans cet ordre

```
1. HOOK (above the fold)
   → Problème ou bénéfice en 6 mots max
   → Sous-titre qui qualifie l'audience ("Pour les équipes qui...")
   → CTA visible sans scroll
   → 1 élément de réassurance immédiat (note, utilisateurs, garantie)

2. PROBLÈME
   → Nommer la douleur avant de vendre la solution
   → 2-3 phrases max, ton empathique

3. SOLUTION
   → Présenter le produit comme la réponse naturelle
   → Visuel du produit en contexte (pas un mockup générique)

4. PREUVE
   → Chiffres clés (3 max, formatés grands)
   → Testimonials (avec photo, prénom, contexte)
   → Logos clients ou médias

5. FONCTIONNEMENT
   → 3 étapes max ("Comment ça marche")
   → Visuel ou numérotation claire

6. OBJECTIONS
   → FAQ ou section "Pour qui c'est fait / pas fait"

7. CTA FINAL
   → Répéter la promesse principale
   → Bouton primaire + mention garantie / sans CB
```

---

## Hero — patterns qui convertissent

```tsx
// ✅ Hero centré avec social proof immédiat
<section className="min-h-[85vh] flex flex-col items-center justify-center
                    text-center px-4 py-20 bg-neutral-50">

  {/* Badge de catégorie ou nouveauté */}
  <div className="mb-6 inline-flex items-center gap-2 rounded-full
                  bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full
                       rounded-full bg-brand-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
    </span>
    Nouveau — Version 2.0 disponible
  </div>

  {/* Titre — ancre visuelle principale */}
  <h1 className="max-w-4xl text-display-xl md:text-display-2xl
                 font-heading font-bold text-neutral-900
                 tracking-tight leading-[1.05]">
    Le titre qui nomme{' '}
    <span className="text-brand-500">le bénéfice</span>{' '}
    pas la feature
  </h1>

  {/* Sous-titre */}
  <p className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-600 leading-relaxed">
    Pour qui c'est, ce que ça fait, pourquoi maintenant.
    Une phrase claire vaut mieux que trois vagues.
  </p>

  {/* CTAs */}
  <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
    <a href="#" className="rounded-brand bg-brand-500 px-8 py-4
                           text-base font-semibold text-white
                           hover:bg-brand-600 transition-colors
                           shadow-brand focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-brand-500">
      Action principale — gratuit
    </a>
    <a href="#" className="text-base font-medium text-neutral-600
                           hover:text-neutral-900 transition-colors
                           underline underline-offset-2">
      Voir une démo →
    </a>
  </div>

  {/* Social proof immédiat */}
  <div className="mt-12 flex flex-col sm:flex-row items-center gap-6
                  text-sm text-neutral-500">
    <div className="flex items-center gap-2">
      {/* Avatars empilés */}
      <div className="flex -space-x-2">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-8 w-8 rounded-full border-2 border-white
                                  bg-brand-200 flex items-center justify-center
                                  text-xs font-semibold text-brand-700">
            {i}
          </div>
        ))}
      </div>
      <span>+2 400 équipes actives</span>
    </div>
    <span className="hidden sm:block text-neutral-300">|</span>
    <div className="flex items-center gap-1">
      {'★★★★★'.split('').map((s, i) => (
        <span key={i} className="text-brand-400">{s}</span>
      ))}
      <span className="ml-1">4.9/5 (312 avis)</span>
    </div>
  </div>
</section>
```

---

## Section chiffres clés

```tsx
// 3 stats max — grand format
<section className="py-16 bg-brand-500">
  <div className="max-w-5xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
      {[
        { value: '94%', label: 'taux de satisfaction client' },
        { value: '3×', label: 'plus rapide qu\'à la main' },
        { value: '0€', label: 'pour commencer' },
      ].map(stat => (
        <div key={stat.label}>
          <p className="text-display-lg font-heading font-bold">{stat.value}</p>
          <p className="mt-1 text-base text-brand-100">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## Typographie landing recommandée

**Option A — Chaleur + conviction**
- Heading : `Lora` (700) — serif classique, inspire confiance
- Body : `Source Sans 3` (400/600) — très lisible, accessible

**Option B — Énergie + clarté**
- Heading : `Sora` (800) — géométrique mais chaud
- Body : `Nunito Sans` (400/600) — rond, accessible

**À éviter sur landing page :**
- Serif trop classique sur fond coloré (illisible)
- Condensed fonts sur mobile
- Plus de 2 graisses différentes par section

---

## Ce qu'on évite en landing

- Navbar chargée avec 8+ liens (distraction)
- Hero avec vidéo autoplay (performance + UX)
- Formulaire de capture email trop long (> 2 champs)
- Pop-up dès l'arrivée
- Compteur d'urgence artificiel
- "Révolutionnaire / disruptif / game-changer" dans le copy
- Footer complet avec toutes les pages (déconcentre)

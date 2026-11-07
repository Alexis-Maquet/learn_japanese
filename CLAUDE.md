# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Application web (PWA) pour apprendre le japonais : référence de kanjis par niveau JLPT, listes personnelles, entraînements (cartes, phrases, conjugaison), fiches de grammaire, scan d'images. React 19 + TypeScript + Vite + Tailwind + zustand, sans backend. L'interface et les commentaires sont en français.

## Commandes

```bash
npm ci               # installer (node_modules n'est pas fourni)
npm run dev          # serveur de dev Vite
npm run build        # tsc -b && vite build (le typage fait partie du build)
npm run lint         # eslint . — 16 problèmes (11 erreurs) déjà présents sur main
npx tsc -b           # typage seul
npm run generate-words   # régénère public/kanji_words.json depuis JMdict
```

Il n'y a **aucun test** (ni script `test`, ni fichier `*.test.*`). Les vérifications possibles sont `tsc -b`, `lint` et `build`.

## Données volumineuses non versionnées

`public/kanjiapi_full.json` (~98 Mo), `public/kanji_words.json` et `public/svg/` (tracés KanjiVG) sont dans `.gitignore`. Sans eux, l'app démarre mais la liste des kanjis, les mots d'exemple et les tracés ne chargent pas. `resources/kanjiapi_full.json` est une copie locale (aussi ignorée) à recopier dans `public/`. Le workflow de déploiement les récupère depuis la branche `gh-pages` (`git show origin/gh-pages:...`) : ne pas supprimer cette branche. Il ne restaure que les deux JSON, pas `public/svg/`.

## Architecture

- **Pas de backend** : tout est servi en statique. `base` Vite = `/learn_japanese/`, donc toujours construire les URLs de ressources avec `import.meta.env.BASE_URL` (voir `src/utils/api.ts`). Le routage SPA sur GitHub Pages repose sur `public/404.html` + le script de restauration de chemin dans `index.html` : ne pas retirer l'un sans l'autre.
- **Alias** `@/` → `src/`. Routes déclarées dans `src/App.tsx` (pages dans `src/pages/`).
- **Données kanjis** : `src/utils/api.ts` charge une seule fois le gros JSON (promesse mise en cache au niveau module, `dbCache` pour les recherches synchrones) ; `src/store/kanjiStore.ts` (zustand) expose niveaux JLPT, fréquence, détails, mots et filtres.
- **État** : stores zustand dans `src/store/` (kanji, listes, entraînement, stats). Les sessions d'entraînement en pause sont persistées en `localStorage`.
- **PWA** : `vite-plugin-pwa` (workbox) met en cache-first les gros JSON et les SVG de tracés ; la config est dans `vite.config.ts`. Viewport verrouillé (zoom désactivé) pour un rendu fixe sur téléphone : voir `index.html`, `src/index.css` et le listener `gesturestart` dans `src/main.tsx`.

### Deux moteurs d'exercices, une taxonomie partagée

- **Conjugaison** (`src/utils/conjugationLocal.ts`) : 100 % local, sans API. `TEMPLATES` décrit chaque règle de grammaire (`categoryId`, `generate`, `hint`…) appliquée à `LOCAL_WORD_LIST`. Le tirage pondère par famille de formes puis par `freq` de catégorie.
- **Phrases** (`src/utils/geminiVision.ts`, `generateSentenceExercises`) : appelle Gemini avec un prompt qui impose thème, structure et sujet par phrase, puis valide le JSON. La clé API de l'utilisateur est dans `localStorage` (`gemini_api_key`) ; le quota de 1500 appels/jour est compté côté client (`trackApiCall`). Le modèle est choisi à l'exécution par `pickModel` selon `MODEL_PREFERENCE`.
- **`GRAMMAR_CATEGORIES`** (exportée par `conjugationLocal.ts`) est la liste maîtresse des catégories : elle alimente les boutons de `TrainingPage`, les onglets de `GrammarPage` et la pondération du tirage. Ajouter une catégorie implique de toucher ses `TEMPLATES` **et** `CATEGORY_CARDS` dans `src/pages/GrammarPage.tsx` (sinon l'onglet est vide). `GrammarPage` ajoute en plus des onglets de référence (`REFERENCE_TABS`) sans exercice associé.
- Éviter de dupliquer un modèle de règle dans deux catégories : la page grammaire et l'exercice doivent rester d'accord sur la catégorie d'une règle.

## Design

Thème sombre uniquement. Les couleurs viennent des jetons de `tailwind.config.js` ; ne jamais écrire de valeur hexadécimale en dur (ni `bg-[#…]`, ni `style={{ color: '#…' }}`) : ajouter un jeton si besoin.

- Jetons : `japan-dark` (fond de page), `japan-card` (cartes), `japan-surface` (boutons secondaires, survols), `japan-border`, `japan-muted`, `japan-deep` (verso des fiches), `japan-thumb` (barre de défilement). Accent unique : `japan-red` (`#DC143C`). Utilisables avec toutes les utilitaires et l'opacité (`bg-japan-dark/90`).
- Composants CSS de `src/index.css` à réutiliser : `.card`, `.btn-primary`, `.btn-secondary`, `.badge-jlpt` avec `.badge-n1` à `.badge-n5` et `.badge-none`.
- Tout texte japonais affiché en grand prend `.kanji-char` (police Noto Sans JP).
- Couleurs de score (≥ 80 %, ≥ 50 %, en dessous) : `text-green-500`, `text-yellow-500`, `text-red-500`.
- Dans le CSS brut, passer par `theme('colors.…')` plutôt qu'une valeur en dur (voir les tracés `.stroke-order-svg`).
- Mobile : champs de saisie à 16 px minimum (règle globale dans `index.css`, sinon iOS zoome), `100dvh` plutôt que `100vh`, pas de dépendance au zoom (désactivé).

## CI et automatisations

- `.github/workflows/deploy.yml` : à chaque push sur `main`, build puis déploiement GitHub Pages via GitHub Actions (la source Pages n'est pas une branche). Fusionner dans `main` redéploie le site.
- `.github/workflows/pr-review.yml` : revue de PR par le sous-agent `.claude/agents/pr-reviewer.md`, déclenchée **uniquement** par un commentaire contenant `@claude` sur une PR, par un propriétaire, membre ou collaborateur. Nécessite le secret `CLAUDE_CODE_OAUTH_TOKEN`.
- `.claude/skills/format-pr/SKILL.md` : format attendu des descriptions de PR (résumé, modifications point par point, résultats des tests). `.claude/settings.local.json` est local ; le reste de `.claude/` est versionné.

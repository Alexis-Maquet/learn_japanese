# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

PWA pour apprendre le japonais (kanjis JLPT, listes, entraînements, grammaire, scan). React 19 + TypeScript + Vite + Tailwind + zustand, sans backend, déployée sur GitHub Pages. Interface, commentaires et commits en français.

## Avant de livrer

Il n'y a **aucun test** : la vérification repose sur ces trois commandes, à lancer avant tout commit.

```bash
npm ci            # si node_modules est absent
npx tsc -b        # typage
npm run build     # tsc -b + vite build
npm run lint      # eslint .
```

- `npm run lint` signale des erreurs qui existent déjà sur `main` : le total ne doit pas augmenter. Lance-le aussi sur `main` pour comparer, ne te fie pas à un chiffre mémorisé.
- Dis explicitement ce que tu n'as **pas** pu vérifier : le rendu dans un navigateur, et tout ce qui passe par Gemini (en général, aucune clé API n'est disponible dans l'environnement de travail). Ne présente jamais un résultat non vérifié comme acquis.
- Pour voir l'app : `npm run dev` (nécessite les données, voir la procédure plus bas).

## Procédures

### Ajouter une catégorie de grammaire
1. Ajouter l'entrée dans `GRAMMAR_CATEGORIES` (`src/utils/conjugationLocal.ts`) : `id`, `nameFR`, `nameJP`, `level`, `freq`. Le `level` détermine les filtres N5/N4/N3 de `TrainingPage`.
2. Ajouter ses `TEMPLATES` avec ce `categoryId`. Le tirage les regroupe par famille de formes (`getFamily`) puis pondère par `freq`.
3. Ajouter `CATEGORY_CARDS[id]` dans `src/pages/GrammarPage.tsx`, sinon l'onglet s'affiche vide.
4. Vérifier qu'aucune règle n'existe déjà dans une autre catégorie : exercice et fiche doivent classer une règle au même endroit.

### Modifier la génération des phrases (Gemini)
Le prompt est dans `generateSentenceExercises` (`src/utils/geminiVision.ts`). La variété vient du tirage de thème, structure et sujet par phrase ; le naturel, des règles du prompt et de la limite de deux kanjis par phrase. Le format JSON de réponse est lu par `SentenceExercise` : ne pas le changer sans adapter le parsing. Sans clé API, le résultat ne peut pas être testé : l'écrire dans le compte rendu.

### Ajouter ou changer une couleur
Créer ou modifier le jeton dans `tailwind.config.js` (`japan.*`), puis l'utiliser par son nom (`bg-japan-card`). Jamais de valeur hexadécimale dans le code.

### Restaurer les données manquantes
`public/kanjiapi_full.json`, `public/kanji_words.json` et `public/svg/` ne sont pas versionnés. Sans eux, l'app démarre mais les kanjis, les mots et les tracés ne chargent pas.
- `kanjiapi_full.json` : copier `resources/kanjiapi_full.json`, ou `git show origin/gh-pages:kanjiapi_full.json > public/kanjiapi_full.json`.
- `kanji_words.json` : `npm run generate-words`, ou `git show origin/gh-pages:kanji_words.json > public/kanji_words.json`.
- `public/svg/` : `git archive origin/gh-pages svg | tar -x -C public` (la branche `gh-pages` contient les ~6700 tracés).

## Livraison

- Travailler sur la branche indiquée par la session. Commits en Conventional Commits, en français (`fix(grammar): …`, `feat(mobile): …`).
- Ne créer une PR que si l'utilisateur la demande. Rédiger sa description avec le skill `format-pr` (résumé, modifications, résultats réels des tests).
- **Fusionner dans `main` met le site en production** : `deploy.yml` redéploie GitHub Pages à chaque push sur `main`. Ne fusionner que sur demande explicite, puis indiquer l'état du déploiement.
- Si la PR d'une branche est déjà fusionnée, repartir de `main` à jour (même nom de branche) au lieu d'empiler des commits.
- La revue automatique (`pr-review.yml`, sous-agent `pr-reviewer`) ne se déclenche que par un commentaire `@claude` d'un propriétaire, membre ou collaborateur, et exige le secret `CLAUDE_CODE_OAUTH_TOKEN`.

## Garde-fous

- Ne jamais committer `public/kanjiapi_full.json`, `public/kanji_words.json` ni `public/svg/` (gitignorés, ~98 Mo).
- Ne jamais supprimer la branche `gh-pages` : le workflow de déploiement y lit les deux JSON et les tracés `svg/`.
- Ne jamais pousser directement sur `main`.
- Ne pas écrire de couleur en dur (`bg-[#…]`, `style={{ color: '#…' }}`) ; dans le CSS brut, utiliser `theme('colors.…')`.
- Construire les URLs de ressources avec `import.meta.env.BASE_URL` (le site est servi sous `/learn_japanese/`) et importer via l'alias `@/`.
- Ne retirer `public/404.html` et le script de restauration de chemin de `index.html` que ensemble : le routage SPA sur Pages en dépend.
- Ne pas désactiver le verrouillage du zoom mobile (viewport, `index.css`, `gesturestart` dans `main.tsx`) sans demande.
- Ne pas dupliquer un modèle de règle entre deux catégories.

## Contexte indispensable

- **Taxonomie partagée** : `GRAMMAR_CATEGORIES` alimente à la fois les boutons de `TrainingPage`, les onglets de `GrammarPage` et la pondération du tirage de conjugaison. `GrammarPage` ajoute des onglets de référence (`REFERENCE_TABS`) sans exercice associé.
- **Conjugaison** : 100 % locale (`conjugationLocal.ts`, sans API). **Phrases, scan d'image et définitions de mots** passent par Gemini avec la clé de l'utilisateur (`localStorage`, `gemini_api_key`) ; le quota de 1500 appels par jour est compté côté client (`trackApiCall`).
- **Gros JSON** : chargés une fois (promesse mise en cache dans `src/utils/api.ts`) et mis en cache par le service worker (`vite.config.ts`).
- **Design** : thème sombre uniquement, accent unique `japan-red` (`#DC143C`). Réutiliser les classes de `src/index.css` (`.card`, `.btn-primary`, `.btn-secondary`, `.badge-jlpt` + `.badge-n1` à `.badge-n5`) ; `.kanji-char` pour le texte japonais en grand ; `text-green-500` / `text-yellow-500` / `text-red-500` pour les scores. Mobile : champs de saisie à 16 px minimum (sinon iOS zoome), `100dvh` plutôt que `100vh`.
- **Logs** : utiliser `logger.info(contexte, message)` (`src/utils/logger.ts`, persisté en `localStorage`) plutôt que `console.*`.

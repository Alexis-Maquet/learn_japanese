---
name: format-pr
description: Rédige le titre et la description d'une pull request dans le format du projet (résumé, modifications point par point, résultats des tests). À utiliser avant de créer ou de mettre à jour une PR.
---

# Format des pull requests

Rédige en français la description de la PR à partir des commits et du diff de la branche (`git log main..HEAD`, `git diff main...HEAD`). Si le dépôt contient un modèle de PR (`.github/pull_request_template.md`), il prime sur ce format.

## Titre

Style Conventional Commits, à l'impératif, 70 caractères maximum : `fix(grammar): corriger les étiquettes des fiches`.

## Corps : trois sections, dans cet ordre

```markdown
## Résumé
Deux à quatre phrases : quelle feature ou quel bugfix, pourquoi, et l'effet pour l'utilisateur.

## Modifications
- `chemin/fichier.ts` : ce qui change, en une ligne.
- …

## Tests
- Tests unitaires : <commande> → <résultat>
- Non-régression : <commande> → <résultat>
```

### Règles

- **Résumé** : le « pourquoi » avant le « comment ». Pas de liste, pas de jargon inutile.
- **Modifications** : un point par changement logique, concis, avec le fichier concerné. Regroupe les changements mécaniques identiques. Ne recopie pas le diff.
- **Tests** : exécute réellement les vérifications avant de rédiger, puis recopie les vrais résultats (réussite, échec, nombre de tests). Ne déclare jamais un test réussi sans l'avoir lancé.
  - Commandes de ce dépôt : `npx tsc -b` (typage), `npm run lint`, `npm run build`. Il n'y a pas de tests unitaires configurés pour le moment : écris « Aucun test unitaire configuré dans le dépôt » plutôt que de laisser la ligne vide ou d'inventer un résultat. Si un script `test` existe dans `package.json`, utilise-le pour la ligne « Tests unitaires ».
  - Non-régression : typage, lint et build comptent comme vérifications de non-régression tant qu'il n'y a pas de suite dédiée. Ajoute toute vérification manuelle réellement faite (page ouverte dans le navigateur, parcours testé).
  - En cas d'échec, indique-le tel quel avec la commande et l'erreur ; ne contourne pas.
  - Ce qui n'a pas pu être vérifié (par exemple le rendu dans un navigateur) est dit explicitement.

## Pied de page

Termine le corps avec les lignes d'attribution demandées par le contexte de la session, le cas échéant.

## Étapes

1. Lis l'historique et le diff de la branche par rapport à `main`.
2. Lance les vérifications et note leurs résultats.
3. Rédige titre et corps selon le format ci-dessus.
4. Affiche-les à l'utilisateur, puis crée ou met à jour la PR seulement s'il l'a demandé.

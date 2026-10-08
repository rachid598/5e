# Maths-5e : contexte du projet

## Le projet
PWA de maths pour des élèves de collège (zone d'éducation prioritaire), mobile d'abord, en français.
Cette année, l'enseignant n'a que la classe **5G2**.

- **Stack** : React 19, Vite 7, Tailwind CSS v4 (`@theme` dans `src/index.css`), lucide-react, canvas-confetti, vite-plugin-pwa
- **Hébergement** : Cloudflare Pages (preset « None », commande `npm run build`, dossier `dist`). Les en-têtes de sécurité et de cache sont dans `public/_headers`. Déploiement manuel possible avec `npm run deploy`.
- **RGPD** : aucune donnée ne quitte l'appareil. Le prénom et la classe sont dans le `localStorage` (clé `maths5e_player`, hook `src/hooks/usePlayer.js`).
- **Dépôt** : `https://github.com/rachid598/5e`, branche de travail `claude/math-education-pwa-EPDy8`

## Structure
```
src/
  App.jsx                 routeur simple (état currentModule)
  pages/Hub.jsx           liste des modules (drapeau active, seuls les actifs sont affichés)
  components/PlayerForm.jsx
  hooks/usePlayer.js
  modules/
    frac-strike/          simplification de fractions (4 niveaux, dont Expert)
    prio-calcul/          priorités des opérations
    divi-check/           grille de critères de divisibilité
    Proportionnalite/     un seul fichier, style plus simple
    VolumesAires/         un seul fichier, style plus simple
```
Chaque module de jeu suit le même schéma : `engine.js` (logique pure) + composant principal avec prop `onBack` + sous-composants. Trois écrans : choix du niveau, jeu, résultats. Le clavier numérique est partagé : `frac-strike/components/Keypad.jsx`.

## État actuel (dernier commit : `fb45f95`, poussé)
- **Hub** : seul **Prio-Calcul** est affiché. Les 4 autres modules sont passés à `active: false` dans `Hub.jsx` et filtrés. Pour les réactiver, repasser le drapeau à `true`.
- **Formulaire** : une seule classe proposée, `5G2`, présélectionnée.
- **Bouton « Suivant »** (Prio-Calcul et Frac-Strike) : plus d'avance automatique, l'élève relit sa chaîne de calcul puis clique.

## Dernier travail : exercices Prio-Calcul sans parenthèses
Demande : des exercices comme sur la photo du manuel (`A = 8 − 3 + 16 + 4`, `D = 24 : 8 : 2 × 6`, `C = 22 : 2 − 12 : 2`…).

Réécriture de `src/modules/prio-calcul/engine.js` :
- **Division `:`** ajoutée (priorité égale à ×).
- **Règle « de gauche à droite »** : entre opérations de même priorité, seule la plus à gauche est acceptée. Si l'élève clique une autre, le message est « On calcule de gauche à droite ! » (`getWrongOpMessage`).
- **3 niveaux**
  - Facile : 4 nombres, soit uniquement + et − (au moins un −), soit uniquement × et : (au moins une division)
  - Moyen : une seule priorité (`5 + 3 × 5`, `13 − 24 : 8`)
  - Difficile : plusieurs priorités (`9 + 7 × 4 + 6`, `22 : 2 − 12 : 2`)
- **Contraintes de tirage** : chaque expression est « jouée » par le moteur avant d'être proposée. Divisions toujours exactes, étapes jamais négatives ni nulles, résultats ≤ 200 (≤ 100 au niveau Facile), pas de doublon parmi les 15 derniers calculs.
- `HelpModal.jsx` mentionne les divisions et le sens gauche-droite.

Vérifié par script (exemples générés) et `npm run build`. Pas testé dans un navigateur.

## Historique utile
- Les anciens niveaux avec **parenthèses** ont été remplacés. Ils sont dans l'historique git, avant `fb45f95`. Le moteur sait toujours gérer les parenthèses (`findSelectableOps`, `stripEmptyParens`) et `ExpressionDisplay` les affiche : il suffira d'ajouter des générateurs.
- **Proportionnalité** et **Volumes & Aires** ont été ajoutés en dehors de nos sessions (commit `86ea011`) et n'ont pas le même style que les trois autres modules (pas de niveaux, pas de confetti, emojis).
- Un module **Euclide** (division euclidienne posée et vocabulaire) a été créé puis **annulé** (revert `d1bf60e`) parce qu'il était destiné à un autre dépôt.
- Les icônes PWA sont des SVG (`public/icons/`), pas de PNG.

## Pistes pour la suite
- Niveaux avec parenthèses pour Prio-Calcul, une fois les chaînes sans parenthèses maîtrisées
- Réactiver les autres modules quand ils seront utiles
- Harmoniser le style de Proportionnalité et Volumes & Aires avec les autres modules
- Tester Prio-Calcul sur téléphone (zones tactiles, affichage des longues expressions)

## Commandes
```
npm install
npm run dev
npm run build
git push -u origin claude/math-education-pwa-EPDy8
```
Ne pas commiter `package-lock.json` après un simple `npm install` s'il n'y a pas de vrai changement de dépendances.

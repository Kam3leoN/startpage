# K3 Start Page — PWA

Page de démarrage installable (PWA), **mobile-first**, refonte de l'ancienne version Materialize/jQuery/Isotope vers une stack moderne.

## Stack

- **Vite + React 18 + TypeScript** (strict)
- **SCSS** + **Tailwind** (utilitaires, `preflight` désactivé pour ne pas écraser k3ui)
- **k3ui** (`k3ui.min.js` / `k3ui.min.css`) — Web Components Material 3 Expressive
- **@material/material-color-utilities** — génération dynamique des palettes M3
- **i18next** — internationalisation FR / EN
- **vite-plugin-pwa** — manifest + service worker (installable, hors-ligne)

## Ce qui a été retiré (et remplacé)

| Ancien | Remplacé par |
|---|---|
| Materialize CSS/JS | k3ui (Web Components M3) |
| jQuery | React + DOM natif |
| Isotope (filtres) | `k3ui` IsoFilter natif (`data-isofilter-*`) |
| Masonry | `k3ui-mason` natif |

## Thème — 4 modes

Géré par `src/hooks/useTheme.ts` :

- **light** — clair forcé
- **dark** — sombre forcé
- **system** — suit `prefers-color-scheme` (réactif en direct)
- **auto** — bascule selon l'heure locale (sombre 19h–7h), réévalué chaque minute

La couleur d'accent (seed) est passée à `material-color-utilities`, qui génère tout le
schéma M3 ; les tokens `--md-sys-color-*` sont écrits sur `:root` et consommés par le CSS
k3ui. Les rôles de surface tonale absents de la lib v0.3 (`surface-container*`) sont
dérivés de la palette neutre aux tons fixes définis par M3. Préférences persistées en
`localStorage`. Le `ThemeManager` natif de k3ui est synchronisé en parallèle.

## Données

`src/data/favorites.ts` : liste unique de favoris taggés par catégorie (jeux / infos /
boutiques / divertissement / dev). La couleur d'accent est réglable dans les paramètres.

## Déploiement

| Environnement | URL |
|---|---|
| Production | [startpage-ten-iota.vercel.app](https://startpage-ten-iota.vercel.app/) |
| GitHub | [github.com/Kam3leoN/startpage](https://github.com/Kam3leoN/startpage) |
| Vercel | [vercel.com/kam3leons-projects/startpage](https://vercel.com/kam3leons-projects/startpage) |

Chaque push sur `master` déclenche un déploiement automatique sur Vercel.
La PWA utilise `registerType: "autoUpdate"` — les visiteurs reçoivent la nouvelle version au prochain rechargement.

## Lancer

```bash
npm install
npm run dev      # développement
npm run build    # build de production -> dist/
npm run preview  # prévisualiser le build
npx vercel       # déploiement manuel (preview)
npx vercel --prod  # déploiement manuel (production)
```

## Personnalisation

- Favoris : `src/data/favorites.ts`
- Couleurs de tuiles par marque : `src/styles/tiles.scss`
- Traductions : `src/i18n/index.ts`
- Icônes : `public/icons/`

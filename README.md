# Mochileaf

A warm, elegant cozy gaming content platform built with **Astro** and **Tailwind CSS**. Inspired by Studio Ghibli atmospheres, soft fantasy aesthetics, and editorial calm — not esports energy.

**Editorial direction:** [`docs/EDITORIAL.md`](docs/EDITORIAL.md)

## Features

- **Global home page** — hero, featured games, updates, articles, trending, promos, newsletter, ad placeholders
- **Per-game content hubs** — scalable routing under `/[game]/`
- **Consistent design system** — pastel palette, cozy typography, dark/light mode
- **Left sidebar navigation** — desktop sidebar + responsive mobile menu
- **SEO-friendly** — meta tags, semantic HTML, static generation
- **Future-ready** — AdSense slots, API/CMS hooks, multi-game data layer

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Scripts

| Command        | Action                          |
| -------------- | ------------------------------- |
| `npm run dev`  | Start dev server                |
| `npm run build`| Build static site to `./dist`   |
| `npm run preview` | Preview production build     |

## Project structure

```
src/
├── components/
│   ├── game/          # Game hub UI (CharacterCard, TierRow, …)
│   ├── home/          # Home page sections
│   ├── layout/        # Sidebar, MobileNav, Footer, …
│   └── ui/            # Buttons, cards, badges, ads, theme
├── data/              # Placeholder content (games, articles, …)
├── layouts/
│   ├── BaseLayout.astro
│   ├── GlobalLayout.astro
│   └── GameHubLayout.astro
├── pages/
│   ├── index.astro           # Global home
│   ├── about.astro
│   ├── articles/[slug].astro
│   └── [game]/               # Dynamic game hubs
│       ├── index.astro
│       ├── characters/
│       ├── builds/
│       ├── tier-list/
│       ├── news/
│       ├── guides/
│       ├── search/
│       └── about/
├── styles/global.css   # Design tokens & utilities
├── types/
└── utils/
public/                 # Static assets
```

## Adding a new game

1. Add an entry to `src/data/games.ts` with `status: 'active'`.
2. Add characters, builds, articles, and tier data in `src/data/`.
3. Astro automatically generates routes from `src/pages/[game]/` via `getStaticPaths`.

Example hub URLs:

- `/whisperwood`
- `/whisperwood/characters`
- `/whisperwood/builds`
- `/whisperwood/tier-list`

## Theming

- CSS variables and Tailwind `@theme` tokens live in `src/styles/global.css`.
- Dark mode uses the `dark` class on `<html>`, toggled via `ThemeToggle` and persisted in `localStorage` (`mochileaf-theme`).

## Ads & API integration

- **AdSense**: Replace `AdPlaceholder` components with your ad units. Slots use `data-ad-slot` attributes.
- **Content API**: Replace imports from `src/data/` with `fetch()` in page frontmatter or Astro endpoints.
- **Search**: The search page form is ready for Pagefind, Fuse.js, or a search API.

## Sample games (MVP)

| Game           | Slug            | Hub        |
| -------------- | --------------- | ---------- |
| Whisperwood    | `whisperwood`   | Full demo  |
| Stardew Valley | `stardew-valley` | Villagers, mods, guides |
| Moonlit Tides  | `moonlit-tides` | Hub shell  |
| Petal Dreams   | `petal-dreams`  | Coming soon|

Whisperwood includes sample characters, builds, and tier list data.

## License

MIT — craft something cozy.

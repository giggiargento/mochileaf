# Mochileaf content

Written copy lives here — **not** in Astro components. All entries are validated with **Zod** at build time.

**Voice & tone:** see [`docs/EDITORIAL.md`](../../docs/EDITORIAL.md) (cozy magazine, not tier-list optimizer).

## Layout

| Folder | Format | Astro collection | Schema |
|--------|--------|------------------|--------|
| `games/` | JSON | `games` | `src/content/schemas/game.ts` |
| `characters/` | JSON | `characters` | `src/content/schemas/character.ts` |
| `guides/` | JSON | `guides` | `src/content/schemas/guide.ts` |
| `guides/_defaults/` | JSON | `guideDefaults` | `src/content/schemas/guide.ts` |
| `articles/` | Markdown | `articles` | `src/content/schemas/article.ts` |

Config: `src/content.config.ts` · Runtime registry: `src/lib/content/registry.ts`

## Editorial exports (review only)

Combined Markdown for ChatGPT / reviewer workflows — does not affect the site.

```bash
npm run export:all
npm run export:acnh
```

Files land in `exports/review/`. See `exports/review/README.md`.

## Validation & linting

```bash
npm run content:lint   # fast check without full build
npm run build          # Astro + Zod validation on all collections
```

**Required on every entry:** `seo.title` and `seo.description` (non-empty).

**TODO placeholders** (`TODO: …` at the start of a string) are allowed in drafts but:
- Hidden in the UI via `displayText()` / `displayStringList()`
- Excluded from static routes when they appear in required fields (`description`, `excerpt`, `buildSummary`)
- Reported as **warnings** by `content:lint`

**Route safety:** Only `routableGames`, `routableCharacters`, and publishable articles get pages. Set `"draft": true` or `"publishable": false` to keep a file in the repo without generating a route.

**Slug rules:** JSON `slug` / `characterSlug` must match the filename (`raymond.json` → `"slug": "raymond"`).

## Add a new entry

### Game hub

1. Copy `games/stardew-valley.json` → `games/your-game-slug.json`
2. Required: `slug`, `name`, `tagline`, `description`, `accent`, `coverGradient`, `status`, **`seo`**
3. Optional lists: `genres`, `platforms`, `cozyMechanics`, `beginnerTips`, `similarGames` (omit TODO strings — they are filtered out)
4. Register nav in `src/data/game-nav.ts` if needed

### Character

1. Copy an existing file in `characters/`
2. Required: `slug`, `gameSlug`, `name`, `role`, `description`, **`seo`**
3. Optional: `likes`, `favoriteGifts`, `routines`, `relationships`, `trivia`, `acnh`, etc.
4. `gameSlug` must match an existing game

### NTE build guide

1. `guides/{character-slug}.json` — `characterSlug` must match filename and a real character
2. Role baselines: `guides/_defaults/{attack|support|defense|assist}.json`

### Article

```md
---
title: "Your title"
excerpt: "Card + SEO summary"
category: guide
gameSlug: stardew-valley
publishedAt: "2026-05-28"
readTime: "8 min"
coverImage: "/images/games/stardew-valley/cover.jpg"
coverCaption: "Optional credit under the hero image"
seo:
  title: "Page title"
  description: "Meta description"
---

Markdown body…

<!-- Inline image with caption (HTML in .md is fine): -->
<figure class="article-inline-figure">
  <img src="/images/games/stardew-valley/header.jpg" alt="Describe the image" width="1200" height="675" loading="lazy" decoding="async" />
  <figcaption>Caption text</figcaption>
</figure>
```

Put images under `public/images/` (often `public/images/games/{game-slug}/`). `coverImage` shows above the body; `seo.image` can override the social preview if set.

Use `draft: true` while writing. Global editorials omit `gameSlug`.

## SEO

| Layer | File |
|-------|------|
| Per entry | `seo` in JSON / article frontmatter |
| Fallbacks | `src/lib/content/seo.ts` (`resolveContentSeo`) |
| Site-wide | `src/utils/seo.ts`, `src/layouts/BaseLayout.astro` |

## TypeScript types

After `astro sync`, use generated collection types:

```ts
import type { CollectionEntry } from 'astro:content';

type GameEntry = CollectionEntry<'games'>;
type CharacterEntry = CollectionEntry<'characters'>;
```

Inferred shapes also live in `src/content/schemas/*.ts` as `GameContent`, `CharacterContent`, etc.

## Re-import ACNH villager facts

```bash
npm run villagers:import-details
npm run content:migrate
```

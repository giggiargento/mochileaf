# Mochileaf i18n

## Two layers (by design)

| Layer | Where | What |
|-------|--------|------|
| **UI** | `src/i18n/ui/en.json` + `es.json` | Buttons, nav, labels — hand-written |
| **Content** | `src/i18n/generated/es/**` | Articles, guides, characters, games — generated from English source |

English stays the source of truth in `src/content/`. Spanish is **overlay JSON**, not duplicate pages.

## Global rule: always pass `locale`

Do **not** call `localizeArticle()` in pages or cards. Use the data layer:

```ts
import { loadArticles, renderArticleForLocale } from '../data/articles';
import { getCharactersByGame } from '../data/characters';
import { getGame } from '../data/games';

const articles = await loadArticles(locale);
const guide = await renderArticleForLocale(slug, locale);
const villager = getCharacterBySlug('molly', locale);
const game = getGame('stardew-valley', locale);
```

Stardew **guides** are articles with `category: "guide"` — same pipeline as news.

## When you add content

1. Add English file under `src/content/`
2. Run `npm run i18n:sync` (DeepL) or `npm run i18n:sync:free -- --resume` (MyMemory, free, slow — add `MYMEMORY_EMAIL=` in `.env` for higher daily limit)
3. Run `npm run i18n:check` to see gaps
4. Commit new files under `src/i18n/generated/es/`

## URLs

- English: `/stardew-valley/guides/...`
- Spanish: `/es/stardew-valley/guides/...` (mirrored via `scripts/generate-es-pages.mjs`)

`Astro.currentLocale` drives which overlay is applied at build time.

# Mochileaf editorial direction

Mochileaf is a **curated cozy gaming magazine**, not a competitive tier-list database. This document is the source of truth for voice, tone, and content balance.

## Brand feel

### Should NOT feel like

- A spreadsheet-heavy gacha optimizer
- A generic tier-list website
- A sterile gaming wiki
- An SEO content farm
- A hyper-competitive min-max community hub

### Should feel like

- A curated cozy gaming magazine
- An aesthetic character guide hub
- A welcoming discovery platform
- A relaxed, visually driven gaming space
- A community-oriented companion for casual and dedicated players alike

## Writing style

- Write naturally and warmly.
- Prioritize readability on mobile (short blocks, scannable headings).
- Avoid robotic AI phrasing and filler transitions.
- Avoid sounding overly authoritative about meta or balance.
- Keep technical explanations beginner-friendly.

### Focus on

- Playstyle feel
- Atmosphere
- Visual identity
- Accessibility for new players
- Character personality
- Emotional appeal
- Cozy gameplay loops (daily rituals, exploration, city modes, etc.)

### Avoid exaggerated claims

Examples to avoid:

- “must pull”
- “best in slot”
- “meta defining”
- “mandatory unit”

### Avoid spreadsheet / optimizer language

Unless strictly necessary for a build section:

- resonance lines, roster filling, meta anchor, filler, BIS, mandatory slot, etc.

### Content balance (mixed pages)

Approximate split:

| Editorial / cozy / readable | Technical / build |
|----------------------------|-------------------|
| ~70%                       | ~30%              |

Character **descriptions** and **excerpts** skew editorial. **Build guides** (`src/content/guides/`) may include Arcs, modules, and skill priority — keep notes plain-language, not spreadsheet dumps.

## Design philosophy

- Information should feel **curated**, not dumped.
- Visual presentation matters as much as raw data.
- Pages should encourage exploration and comfort, not overload.
- Help users discover characters, games, and playstyles they **emotionally connect with**.

## SEO philosophy

- Trustworthy, evergreen writing.
- No speculative or temporary meta claims in public copy.
- No clickbait.
- Optimize for clarity and discoverability, not keyword stuffing.
- `seo.title` and `seo.description` must read like human magazine copy, not ranking spam.

## Factual accuracy

- Preserve facts only when verifiable from game sources or approved project notes.
- If uncertain or community-speculative: soften wording, omit, or use `TODO: …` in draft content.
- Do not invent banners, stats, patch timings, or tier placements.

## Out of scope

- **`src/pages/about.astro`** — personal creator page; do not rewrite unless Giggi asks.

## Content locations

| Area | Path |
|------|------|
| Games | `src/content/games/` |
| Characters | `src/content/characters/` |
| Build guides | `src/content/guides/` |
| Articles | `src/content/articles/` |
| Lint | `npm run content:lint` |
| Review exports | `npm run export:nte` etc. → `exports/review/` |

## Cursor / AI

Agents should follow `.cursor/rules/editorial-direction.mdc` when writing or rewriting Mochileaf content.

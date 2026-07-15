# Mochileaf — AI handoff

Documento para que Claude, Cursor u otra IA retome el proyecto tras un formateo o cambio de máquina. **Léelo primero** junto con las reglas en `.cursor/rules/` y `docs/EDITORIAL.md`.

> **Path local actual (Windows):** `D:\giggiland\Mochileaf`  
> Si Cursor sigue apuntando a `Documents\giggiland\Mochileaf`, reabrir la carpeta desde `D:\`.

---

## Qué es

**Mochileaf** (`https://mochileaf.com`) — plataforma de contenido *cozy gaming*: hubs por juego, guías, personajes, artículos, wallpapers, Cozy Creators.

| Dato | Valor |
|------|--------|
| Repo | `https://github.com/giggiargento/mochileaf.git` |
| Rama principal | `main` |
| Stack | Astro 6 + Tailwind 4 + TypeScript |
| Deploy | Vercel (sitio **estático**) |
| Node | `>= 22.12.0` |
| Idioma del sitio | **Solo inglés** (i18n ES se removió; UI en `src/i18n/ui/en.json`) |
| Dueña / IG | Giggi — `@giggiland` — display name `Giggi シシランド` |

---

## Setup en máquina nueva

```bash
git clone https://github.com/giggiargento/mochileaf.git
cd Mochileaf
npm install
cp .env.example .env
# Completar .env según necesites (ver más abajo)
npm run dev
```

Dev: [http://localhost:4321](http://localhost:4321)

### Variables de entorno (opcionales)

| Variable | Uso |
|----------|-----|
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Meta tag Search Console |
| `PUBLIC_ADSENSE_*` / `ADSENSE_ENABLED` | Ads — ver `src/data/adsense.ts` |
| `TAVILY_API_KEY` | `npm run content:refresh` (live intel NTE/ACNH) — ver `docs/LIVE_CONTENT.md` |
| `INSTAGRAM_ACCESS_TOKEN` + `INSTAGRAM_BUSINESS_USER_ID` | Sync estable de Cozy Creators (Graph API). Sin esto, scrapea la página y a menudo cae en **429** |

`.env` **no** va a git. Tras formatear, recrearlo a mano.

---

## Hubs activos (juegos)

Rutas bajo `src/pages/[game]/`. Slugs canónicos:

| Juego | Slug | Atajo redirect |
|-------|------|----------------|
| Animal Crossing: New Horizons | `animal-crossing-new-horizons` | `/acnh` |
| Stardew Valley | `stardew-valley` | `/stardew-haven` → `/stardew-valley` |
| Neverness to Everness | `neverness-to-everness` | `/nte` |

**Ya no hay hubs** de Whisperwood / Moonlit Tides / Petal Dreams (redirect a `/games`). El README raíz está **desactualizado** en esa parte — preferir este handoff y el código.

Registro de juegos: `src/lib/content/games` (reexportado por `src/data/games.ts`).

---

## Dónde vive el contenido

| Tipo | Ubicación |
|------|-----------|
| Colecciones Astro (JSON/MD) | `src/content/` (`characters`, `articles`, `guides`, `games`, …) |
| Schemas | `src/content/schemas`, `src/content.config.ts` |
| Datos / merges | `src/data/` |
| Cache / sync en vivo | `src/data/live/` (ej. `cozy-creators.json`, `cache.json`) |
| Imágenes | `public/images/` (juegos, creators, artículos) |
| Copy UI | `src/i18n/ui/en.json` |
| Páginas | `src/pages/` |
| Componentes | `src/components/` |
| Scripts operativos | `scripts/` |

Patrón habitual: **config estática** + **JSON live** opcional (Instagram, Tavily).

---

## Scripts que más se usan

```bash
npm run dev              # ads.txt + astro sync + schema check + dev
npm run build            # redirects Vercel + ads + sync + build → dist/
npm run preview
npm run seo:verify       # content:lint + ads:verify
npm run content:lint
npm run ads:verify

npm run creators:sync            # foto + bio IG → live JSON + public/images/creators/
npm run creators:download-avatar # fallback: node scripts/download-creator-from-ig-page.mjs <user> [slug]
npm run sync:images              # imágenes de hubs (incluye NTE vía sync-nte-images)
npm run content:refresh          # Tavily → live cache

# ACNH villagers (hechos / prosa)
npm run villagers:import-details
npm run villagers:merge-details
npm run villagers:apply-original-prose
```

Lista completa en `package.json`.

---

## Reglas de producto (siempre)

Cursor las aplica vía `.cursor/rules/`:

1. **`operational-safeguards.mdc`** — No romper `public/ads.txt` ni el generador; covers de artículos **únicos**; search pages con `noIndex`.
2. **`content-originality.mdc`** — Nunca publicar prosa copy-paste de wikis. Wikis = hechos; voz propia. ACNH: `acnh.proseStatus: "original"`.
3. **`editorial-direction.mdc`** — Revista cozy, no wiki de meta/tier. Frases baneadas tipo “must pull”, “best in slot”, etc.
4. **`guides-refresh.mdc` / `news-refresh.mdc` / `browser-style-changes.mdc`** — flujos editoriales / estilo.

Más voz y fuentes: `docs/EDITORIAL.md`, live data: `docs/LIVE_CONTENT.md`.

### Diseño frontend

Si se pide UI nueva: composición clara, tipografía expresiva, atmósfera (no fondos planos), sin stacks genéricos (Inter/Roboto), evitar temas “AI púrpura / cream + terracotta / broadsheet”. En hubs existentes, **respetar** el design system (`src/styles/global.css`).

---

## Cozy Creators

- Página: `/cozy-creators`
- Config: `src/data/cozy-creators.ts` + `scripts/sync-cozy-creators.mjs` (mantener **ambas** listas alineadas)
- Live: `src/data/live/cozy-creators.json`
- Avatares: `public/images/creators/{slug}.jpg` (+ `.webp`)

**Listadas hoy:**

| Slug | Instagram | Nombre display (approx) | Accent |
|------|-----------|-------------------------|--------|
| `giggiland` | `giggiland` | Giggi シシランド | sage (featured) |
| `cozyquartzz` | `cozyquartzz` | courtney ₊˚✩ | blossom |
| `madisons-horizons` | `madisons.horizons` | Madison's Horizons | lavender |
| `sadgirltypes` | `sadgirltypes` | sad girl | mist |

Para agregar otra creadora:

1. Entrada en `SOURCES` de `cozy-creators.ts` y `sync-cozy-creators.mjs`
2. `npm run creators:sync` (o download-avatar si hay 429)
3. Limpiar `name` en live JSON si el scrape trae og:title sucio (el parser en `scripts/lib/instagram-profile.mjs` ya decodifica entidades HTML)
4. Commit de JSON + imágenes

---

## Neverness to Everness — cuidado con retratos

En julio 2026 se corrompieron 4 retratos al sincronizar desde nteguide.com (arte de otros personajes).

**No re-descargar / fijados en el repo:**

- `daffodil`, `jiuyuan`, `hathor`, `baicang`
- Archivos: `public/images/games/neverness-to-everness/characters/{slug}.webp`
- Skip en código: `PORTRAITS_SKIP_SYNC` en `scripts/sync-nte-images.mjs`

Buenas versiones: commit ~`8904396` (hub NTE inicial); regresión en `7ce103f`; fix restaurado en `a8e0f0f`.

Si alguien corre `npm run sync:images` y “arregla” esos slugs quitando el skip, **vuelven las imágenes malas**.

---

## Commits recientes relevantes (contexto)

| Commit | Qué |
|--------|-----|
| `8677c94` | Display name Giggi シシランド en Cozy Creators |
| `9ac7121` | Add sadgirltypes + fix parseo nombres IG |
| `a8e0f0f` | Restore NTE portraits + skip sync |
| `7491899` | Prosa ACNH original + pause ad display |
| `64ff3e0` | English-only + fix hub content delivery |

Antes de commitear: el usuario debe **pedirlo explícitamente**. Push solo si lo pide.

---

## Gotchas conocidos

1. **`npm run build`** puede fallar por issues Vite/Tailwind con `global.css` en algunos entornos — confirmar antes de asumir regresión nueva.
2. Instagram web API **429** frecuente → Graph API o `download-creator-from-ig-page.mjs`.
3. README.md describe demos viejos; **no** añadir Whisperwood como juego activo.
4. No borrar / reinventar `ads.txt`; generar con el script y verificar.
5. Covers de artículos: una ruta única por juego; `npm run content:lint`.
6. No copiar prosa de Nookipedia/Fandom a JSON de villagers.
7. Carpeta `.tmp/` a veces aparece local — no commitear.

---

## Checklist post-formateo

- [ ] Clonar repo / abrir `D:\giggiland\Mochileaf` (o el path nuevo) en el IDE
- [ ] Node 22.12+
- [ ] `npm install`
- [ ] Recrear `.env` (Tavily / AdSense / IG si aplica)
- [ ] `npm run dev` y smoke: home, un hub ACNH/Stardew/NTE, `/cozy-creators`
- [ ] Confirmar `public/ads.txt` presente
- [ ] Confirmar retratos NTE Daffodil / Jiuyuan / Hathor / Baicang se ven bien
- [ ] Si usás Cursor: rules en `.cursor/rules/` ya vienen en el repo

---

## Cómo pedirle trabajo a una IA

Ejemplos de prompts útiles:

- “Seguí `claude.md` y `.cursor/rules`. Agregá a Cozy Creators @usuario.”
- “No toques `PORTRAITS_SKIP_SYNC` ni re-sync de Daffodil/Jiuyuan/Hathor/Baicang.”
- “Prosa ACNH: original only, marcar `proseStatus: original`, correr `content:lint`.”
- “Commit + push solo si te lo pedí.”

Owner: **Giggi** · Proyecto cozy, no esports · Preferir claridad y calidez editorial.

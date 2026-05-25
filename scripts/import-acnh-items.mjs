/**
 * Imports ACNH item catalog from Nookipedia list pages (images via dodo.ac CDN).
 * Run: npm run items:import
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PATH = path.join(ROOT, 'src', 'data', 'items-acnh-catalog.json');
const CACHE_DIR = path.join(ROOT, 'scripts', '.cache');

const USER_AGENT = 'Mochileaf/1.0 (fan site; nookipedia item import)';

/** @type {{ id: string; label: string; wikiPage: string }[]} */
const SOURCES = [
  { id: 'housewares', label: 'Housewares', wikiPage: 'Furniture/New Horizons/Housewares' },
  { id: 'miscellaneous', label: 'Miscellaneous', wikiPage: 'Furniture/New Horizons/Miscellaneous' },
  { id: 'wall-mounted', label: 'Wall-mounted', wikiPage: 'Furniture/New Horizons/Wall-mounted' },
  { id: 'ceiling-decor', label: 'Ceiling decor', wikiPage: 'Furniture/New Horizons/Ceiling decor' },
  { id: 'wallpaper', label: 'Wallpaper', wikiPage: 'Wallpaper/New Horizons' },
  { id: 'rugs', label: 'Rugs', wikiPage: 'Rug/New Horizons' },
  { id: 'flooring', label: 'Flooring', wikiPage: 'Flooring/New Horizons' },
];

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, ', ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Prefer 128px dodo.ac thumb instead of full-size icon PNG. */
function pickImageUrl(imageCellHtml) {
  const srcset = imageCellHtml.match(/srcset="([^"]+)"/)?.[1];
  if (srcset) {
    const candidates = srcset.split(',').map((part) => part.trim().split(/\s+/)[0]);
    const thumb128 = candidates.find((url) => /\/128px-/.test(url));
    if (thumb128) return thumb128;
    const thumb64 = candidates.find((url) => /\/64px-/.test(url));
    if (thumb64) return thumb64;
    const full = [...candidates].reverse().find((url) => url && !url.includes('/thumb/'));
    if (full) return toDodoThumb(full, 128) ?? full;
  }
  const direct = imageCellHtml.match(
    /https:\/\/dodo\.ac\/np\/images\/[0-9a-f]\/[0-9a-f]+\/[^"'\s]+\.png/g,
  );
  if (direct?.[0]) return toDodoThumb(direct[0], 128) ?? direct[0];
  const src = imageCellHtml.match(/src="(https:\/\/dodo\.ac\/[^"]+)"/)?.[1];
  return src ? (toDodoThumb(src, 128) ?? src) : '';
}

function toDodoThumb(fullUrl, px = 128) {
  if (!fullUrl?.includes('dodo.ac/np/images/') || fullUrl.includes('/thumb/')) return fullUrl;
  const m = fullUrl.match(/dodo\.ac\/np\/images\/(.+)\/([^/]+\.png)$/i);
  if (!m) return fullUrl;
  return `https://dodo.ac/np/images/thumb/${m[1]}/${px}px-${m[2]}`;
}

/** @param {string} html */
function parseTableRows(html) {
  const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) => m[1]);
  const items = [];
  for (const row of rows) {
    if (row.includes('<th')) continue;
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
    if (cells.length < 6) continue;

    const name =
      cells[1].match(/<a[^>]*>([^<]+)<\/a>/i)?.[1]?.trim() ||
      stripHtml(cells[1]);
    if (!name) continue;

    const image = pickImageUrl(cells[2]);
    if (!image) continue;

    const buy = stripHtml(cells[3]);
    const sell = stripHtml(cells[4]);
    const source = stripHtml(cells[5]);

    items.push({
      name,
      image,
      buy: buy || undefined,
      sell: sell || undefined,
      source: source || '—',
    });
  }
  return items;
}

async function fetchWikiHtml(wikiPage) {
  const cacheFile = path.join(CACHE_DIR, `${wikiPage.replace(/\//g, '__')}.json`);
  if (fs.existsSync(cacheFile)) {
    const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    return cached.parse.text['*'];
  }

  const url = new URL('https://nookipedia.com/w/api.php');
  url.searchParams.set('action', 'parse');
  url.searchParams.set('page', wikiPage);
  url.searchParams.set('prop', 'text');
  url.searchParams.set('format', 'json');

  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${wikiPage}`);
  const json = await res.json();
  if (!json.parse?.text?.['*']) throw new Error(`No parse text for ${wikiPage}`);

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(json));
  return json.parse.text['*'];
}

async function main() {
  /** @type {Record<string, { label: string; items: object[] }>} */
  const catalog = {};
  const slugSeen = new Set();

  for (const { id, label, wikiPage } of SOURCES) {
    console.log(`Fetching ${label}…`);
    const html = await fetchWikiHtml(wikiPage);
    const parsed = parseTableRows(html);
    const items = [];

    for (const row of parsed) {
      const base = slugify(row.name);
      let slug = base;
      let n = 2;
      while (slugSeen.has(`${id}:${slug}`)) {
        slug = `${base}-${n++}`;
      }
      slugSeen.add(`${id}:${slug}`);

      items.push({
        slug,
        name: row.name,
        image: row.image,
        buy: row.buy,
        sell: row.sell,
        source: row.source,
      });
    }

    catalog[id] = { label, items };
    console.log(`  → ${items.length} items`);
  }

  const total = Object.values(catalog).reduce((n, g) => n + g.items.length, 0);
  const payload = {
    importedAt: new Date().toISOString(),
    source: 'https://nookipedia.com/wiki/Furniture/New_Horizons',
    imageCredit: 'Nookipedia / dodo.ac',
    total,
    tabs: SOURCES.map(({ id, label }) => ({ id, label })),
    categories: catalog,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(payload));
  console.log(`\nWrote ${total} items → ${path.relative(ROOT, OUT_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

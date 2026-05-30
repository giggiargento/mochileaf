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
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, ', ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

import { pickImageUrlFromWikiCell } from './lib/dodo-images.mjs';
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

    const image = pickImageUrlFromWikiCell(cells[2]);
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

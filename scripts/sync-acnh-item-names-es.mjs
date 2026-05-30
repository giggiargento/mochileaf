/**
 * Map ACNH catalog slugs → official Spanish names (uSes) from Norviah/animal-crossing.
 * Run: node scripts/sync-acnh-item-names-es.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG_PATH = path.join(ROOT, 'src/data/items-acnh-catalog.json');
const OUT_PATH = path.join(ROOT, 'src/data/items-acnh-names-es.json');
const BASE_URL =
  'https://raw.githubusercontent.com/Norviah/animal-crossing/master/json/data';

/** @type {Record<string, string>} */
const SHEET_BY_CATEGORY = {
  housewares: 'Housewares.json',
  miscellaneous: 'Miscellaneous.json',
  'wall-mounted': 'Wall-mounted.json',
  'ceiling-decor': 'Ceiling Decor.json',
  wallpaper: 'Wallpaper.json',
  rugs: 'Rugs.json',
  flooring: 'Floors.json',
};

function normalizeName(value) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** @type {Map<string, Map<string, string>>} */
const namesByCategory = new Map();

async function loadSheet(categoryId, fileName) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(fileName)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${fileName}`);
  /** @type {{ name: string; translations?: { uSes?: string; eUes?: string } }[]} */
  const rows = await res.json();
  const map = new Map();
  for (const row of rows) {
    const en = row.name?.trim();
    const es = row.translations?.uSes?.trim() || row.translations?.eUes?.trim();
    if (!en || !es) continue;
    map.set(normalizeName(en), es);
  }
  namesByCategory.set(categoryId, map);
  console.log(`  ${categoryId}: ${map.size} Spanish names`);
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  console.log('Fetching translation sheets…');
  for (const [categoryId, fileName] of Object.entries(SHEET_BY_CATEGORY)) {
    await loadSheet(categoryId, fileName);
  }

  /** @type {Record<string, string>} */
  const namesEs = {};
  let matched = 0;
  let missing = 0;

  for (const [categoryId, group] of Object.entries(catalog.categories)) {
    const sheet = namesByCategory.get(categoryId);
    if (!sheet) continue;
    for (const item of group.items) {
      const key = `${categoryId}:${item.slug}`;
      const es = sheet.get(normalizeName(item.name));
      if (es) {
        namesEs[key] = es;
        matched++;
      } else {
        missing++;
      }
    }
  }

  const payload = {
    syncedAt: new Date().toISOString(),
    source: 'Norviah/animal-crossing (ACNH translation sheet, uSes)',
    matched,
    missing,
    names: namesEs,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2));
  console.log(`\nWrote ${matched} names (${missing} without match) → ${path.relative(ROOT, OUT_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

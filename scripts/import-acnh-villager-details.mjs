/**
 * Import NH villager detail sections from Nookipedia wikitext.
 * Run: npm run villagers:import-details
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseVillagerWikitext } from './lib/parse-nookipedia-villager.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PATH = path.join(ROOT, 'src', 'data', 'acnh-villager-details.json');
const CACHE_DIR = path.join(ROOT, 'scripts', '.cache', 'villager-wikitext');
const USER_AGENT = 'Mochileaf/1.0 (fan site; ACNH villager details import)';

/** Slug → Nookipedia page title */
const VILLAGERS = [
  ['raymond', 'Raymond'],
  ['marshal', 'Marshal'],
  ['judy', 'Judy'],
  ['ankha', 'Ankha'],
  ['sherb', 'Sherb'],
  ['diana', 'Diana'],
  ['bob', 'Bob'],
  ['molly', 'Molly'],
  ['marina', 'Marina'],
  ['zucker', 'Zucker'],
  ['beau', 'Beau'],
  ['bea', 'Bea'],
  ['audie', 'Audie'],
  ['stitches', 'Stitches'],
  ['maple', 'Maple'],
  ['fauna', 'Fauna'],
  ['coco', 'Coco'],
  ['chrissy', 'Chrissy'],
  ['tangy', 'Tangy'],
  ['merengue', 'Merengue'],
  ['lolly', 'Lolly'],
  ['poppy', 'Poppy'],
];

async function fetchWikitext(pageTitle) {
  const cacheFile = path.join(CACHE_DIR, `${pageTitle}.json`);
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8')).parse.wikitext['*'];
  }

  const url = new URL('https://nookipedia.com/w/api.php');
  url.searchParams.set('action', 'parse');
  url.searchParams.set('page', pageTitle);
  url.searchParams.set('prop', 'wikitext');
  url.searchParams.set('format', 'json');

  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${pageTitle}`);
  const json = await res.json();
  const wt = json.parse?.wikitext?.['*'];
  if (!wt) throw new Error(`No wikitext for ${pageTitle}`);

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(json));
  return wt;
}

async function main() {
  const villagers = {};

  for (const [slug, wikiName] of VILLAGERS) {
    try {
      console.log(`  ${wikiName}…`);
      const wt = await fetchWikitext(wikiName);
      villagers[slug] = parseVillagerWikitext(wt, wikiName);
      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      console.warn(`  ✗ ${slug}: ${err.message}`);
    }
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    source: 'https://nookipedia.com/',
    villagers,
  };
  fs.writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${OUT_PATH} (${Object.keys(villagers).length} villagers)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

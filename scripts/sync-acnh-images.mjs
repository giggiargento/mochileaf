/**
 * Animal Crossing: New Horizons assets → public/images/games/animal-crossing-new-horizons/
 * Villagers: Fandom wiki og:image (Animal Crossing Wiki).
 * Hub banner/card: src/assets/games/animal-crossing-new-horizons/hub-hero.png (CozyImage) — not synced here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = path.join(ROOT, 'public', 'images', 'games', 'animal-crossing-new-horizons');
const VILLAGERS = path.join(BASE, 'villagers');
const USER_AGENT = 'Mochileaf/1.0 (fan site; local asset sync)';

/**
 * Hub banner: wide gameplay still (1920×1067) — box art is ~316px square and pixelates on the hero.
 * Home card: 1280px box art (reads well at 16:10).
 */
const HUB_ART = {
  cover:
    'https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Animal_Crossing_New_Horizons_Gameplay.jpg/1920px-Animal_Crossing_New_Horizons_Gameplay.jpg',
  header:
    'https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Animal_Crossing_New_Horizons_Gameplay.jpg/1920px-Animal_Crossing_New_Horizons_Gameplay.jpg',
  card:
    'https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Animal_Crossing_New_Horizons.jpg/1280px-Animal_Crossing_New_Horizons.jpg',
};

/** Direct CDN URLs when wiki fetch is blocked. */
const FALLBACK_IMAGES = {
  /** Fandom CDN often 404s; Nookipedia redirect is reliable. */
  raymond: 'https://nookipedia.com/wiki/Special:Redirect/file/Raymond%20NH.png',
};

/** slug → Fandom wiki page title */
const WIKI_NAMES = {
  raymond: 'Raymond',
  marshal: 'Marshal',
  judy: 'Judy',
  ankha: 'Ankha',
  sherb: 'Sherb',
  diana: 'Diana',
  bob: 'Bob',
  molly: 'Molly',
  marina: 'Marina',
  zucker: 'Zucker',
  beau: 'Beau',
  bea: 'Bea',
  audie: 'Audie',
  stitches: 'Stitches',
  maple: 'Maple',
  fauna: 'Fauna',
  coco: 'Coco',
  chrissy: 'Chrissy',
  tangy: 'Tangy',
  merengue: 'Merengue',
  lolly: 'Lolly',
  poppy: 'Poppy',
};

async function download(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'image/*,*/*' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) throw new Error(`too small (${buf.length}b)`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function tryDl(url, dest) {
  try {
    const n = await download(url, dest);
    console.log(`  OK ${path.basename(dest)} (${n}b)`);
    return true;
  } catch (e) {
    console.log(`  skip ${path.basename(dest)} — ${e.message}`);
    return false;
  }
}

async function fandomOgImage(wikiName) {
  const res = await fetch(`https://animalcrossing.fandom.com/wiki/${encodeURIComponent(wikiName)}`, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw new Error(`wiki HTTP ${res.status}`);
  const html = await res.text();
  const og = html.match(/property="og:image" content="([^"]+)"/);
  if (!og?.[1]) throw new Error('no og:image');
  return og[1];
}

export async function syncAnimalCrossingNewHorizons() {
  console.log('ACNH — villager portraits (Animal Crossing Wiki / Fandom)…');
  for (const [slug, wikiName] of Object.entries(WIKI_NAMES)) {
    const dest = path.join(VILLAGERS, `${slug}.png`);
    if (FALLBACK_IMAGES[slug]) {
      const ok = await tryDl(FALLBACK_IMAGES[slug], dest);
      if (ok) continue;
    }
    try {
      const imgUrl = await fandomOgImage(wikiName);
      await tryDl(imgUrl, dest);
    } catch (e) {
      console.log(`  skip ${slug} — ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 450));
  }

  console.log('ACNH — hub box art (Wikimedia)…');
  await tryDl(HUB_ART.cover, path.join(BASE, 'cover.jpg'));
  await tryDl(HUB_ART.header, path.join(BASE, 'header.jpg'));
  await tryDl(HUB_ART.card, path.join(BASE, 'card.jpg'));

  console.log('ACNH — villager WebP (128 + 256)…');
  const { writeSquareWebp } = await import('./lib/image-optimize.mjs');
  for (const slug of Object.keys(WIKI_NAMES)) {
    const png = path.join(VILLAGERS, `${slug}.png`);
    if (!fs.existsSync(png)) continue;
    const buf = fs.readFileSync(png);
    for (const size of [128, 256]) {
      await writeSquareWebp(buf, path.join(VILLAGERS, `${slug}-${size}.webp`), size);
    }
  }

  fs.writeFileSync(
    path.join(BASE, 'ATTRIBUTION.txt'),
    `Animal Crossing: New Horizons — Mochileaf fan cache

Villager portraits: Fandom og:image; Raymond uses Nookipedia file redirect.
Hub banner/header: Wikipedia gameplay still (1920px wide).
Hub card: Wikipedia box art (1280px).
Animal Crossing © Nintendo. Unofficial fan site.
`,
    'utf8',
  );
}

/**
 * Downloads game assets into public/images/games/{slug}/.
 * Run: npm run sync:images
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_GAMES = path.join(ROOT, 'public', 'images', 'games');

const USER_AGENT = 'Mochileaf/1.0 (fan site; local asset sync)';

async function download(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'image/*,*/*' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 200) throw new Error(`File too small (${buf.length} bytes): ${url}`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

async function syncStardewValley() {
  const base = path.join(PUBLIC_GAMES, 'stardew-valley');
  const charsDir = path.join(base, 'characters');

  console.log('Stardew Valley — Steam art…');
  await download(
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/library_hero.jpg',
    path.join(base, 'cover.jpg'),
  );
  await download(
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/library_600x900.jpg',
    path.join(base, 'card.jpg'),
  );
  await download(
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg',
    path.join(base, 'header.jpg'),
  );

  const { STARDEW_VILLAGER_SLUGS } = await import('./stardew-villager-data.mjs');
  const villagers = STARDEW_VILLAGER_SLUGS;

  const dataPkg = path.join(ROOT, 'node_modules', 'stardew-valley-data');
  if (!fs.existsSync(dataPkg)) {
    console.log('Stardew Valley — installing stardew-valley-data (MIT, dev-only)…');
    execSync('npm install stardew-valley-data --no-save --no-package-lock', {
      cwd: ROOT,
      stdio: 'inherit',
    });
  }
  if (fs.existsSync(dataPkg)) {
    const dataRootCandidates = [
      path.join(dataPkg, 'assets', 'Characters'),
      path.join(dataPkg, 'Characters'),
      path.join(dataPkg, 'dist', 'Characters'),
    ];
    const dataRoot = dataRootCandidates.find((p) => fs.existsSync(p));
    if (dataRoot) {
      console.log('Stardew Valley — portraits from stardew-valley-data (MIT)…');
      for (const slug of villagers) {
        const title = slug.charAt(0).toUpperCase() + slug.slice(1);
        const candidates = [
          path.join(dataRoot, `${slug}.png`),
          path.join(dataRoot, `${title}.png`),
          path.join(dataRoot, slug, `${slug}.png`),
        ];
        const src = candidates.find((p) => fs.existsSync(p));
        if (src) copyFile(src, path.join(charsDir, `${slug}.png`));
      }
    }
  }

  const modsDir = path.join(base, 'mods');
  console.log('Stardew Valley — mod card art (Nexus headers / previews)…');
  const modCovers = [
    {
      file: '14434.jpg',
      url: 'https://staticdelivery.nexusmods.com/mods/1303/images/headers/14434_1668153081.jpg',
    },
    {
      file: '4852.jpg',
      url: 'https://images.nexusmods.com/mod-headers/1303/4852.jpg',
    },
    {
      file: '5407.jpg',
      url: 'https://images.nexusmods.com/mod-headers/1303/5407.jpg',
    },
    {
      file: '21531.jpg',
      url: 'https://staticdelivery.nexusmods.com/mods/1303/images/headers/21531_1712857406.jpg',
    },
    {
      file: '13752.jpg',
      url: 'https://staticdelivery.nexusmods.com/mods/1303/images/thumbnails/13752/13752-1665815047-1842292892.png',
    },
    {
      file: '26340.jpg',
      url: 'https://staticdelivery.nexusmods.com/mods/1303/images/thumbnails/26340/26340-1722987501-380541643.png',
    },
    {
      file: '22966.jpg',
      url: 'https://staticdelivery.nexusmods.com/mods/1303/images/thumbnails/22966/22966-1714304662-1696729932.png',
    },
    {
      file: '22350.jpg',
      url: 'https://staticdelivery.nexusmods.com/mods/1303/images/headers/22350_1712948054.jpg',
    },
    {
      file: '40483.jpg',
      url: 'https://staticdelivery.nexusmods.com/mods/1303/images/thumbnails/40483/40483-1766431559-1603908778.png',
    },
    {
      file: '40635.jpg',
      url: 'https://staticdelivery.nexusmods.com/mods/1303/images/thumbnails/40635/40635-1767032408-551277235.png',
    },
  ];
  for (const { file, url } of modCovers) {
    try {
      await download(url, path.join(modsDir, file));
    } catch (err) {
      console.warn(`  skip ${file} — ${err.message}`);
    }
  }

  const missing = villagers.filter((s) => !fs.existsSync(path.join(charsDir, `${s}.png`)));
  if (missing.length) {
    console.log(`Stardew Valley — wiki portraits for ${missing.length} villager(s)…`);
    for (const slug of missing) {
      const wikiTitle = slug.charAt(0).toUpperCase() + slug.slice(1);
      const dest = path.join(charsDir, `${slug}.png`);
      try {
        const api = `https://stardewvalleywiki.com/mediawiki/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=256`;
        const res = await fetch(api, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const page = Object.values(data.query?.pages ?? {})[0];
        const thumb = page?.thumbnail?.source;
        if (!thumb) throw new Error(`no thumbnail for ${wikiTitle}`);
        await download(thumb, dest);
      } catch (err) {
        console.warn(`  skip ${slug} portrait — ${err.message}`);
      }
    }
  }

  const attribution = `Stardew Valley game images — Mochileaf fan site cache

Steam store art (cover.jpg, card.jpg, header.jpg)
  App ID 413150 — Stardew Valley by ConcernedApe
  https://store.steampowered.com/app/413150/
  Used for promotional context on this fan hub.

Mod card covers (mods/*)
  Nexus Mods headers/thumbnails and mod-author previews where noted.
  Sea Breeze farmhouse/cellar cards use Sea Breeze Farm Map previews (same author) until dedicated headers are synced.
  Global God Rays preview from the mod author's GitHub readme asset.

Villager portraits (characters/*.png)
  Primary: stardew-valley-data npm package (MIT), if available
  Fallback: Stardew Valley Wiki API thumbnails (https://stardewvalleywiki.com/)

Trademarks belong to their respective owners. This site is unofficial.
`;
  fs.writeFileSync(path.join(base, 'ATTRIBUTION.txt'), attribution, 'utf8');
}

async function syncNevernessToEverness() {
  const { syncNevernessToEverness: syncNte } = await import('./sync-nte-images.mjs');
  await syncNte();
}

async function syncAnimalCrossingNewHorizons() {
  const { syncAnimalCrossingNewHorizons: syncAcnh } = await import('./sync-acnh-images.mjs');
  await syncAcnh();
}

async function main() {
  console.log('Syncing game images…\n');
  await syncStardewValley();
  console.log('');
  await syncNevernessToEverness();
  console.log('');
  await syncAnimalCrossingNewHorizons();
  console.log('\nDone. Files under public/images/games/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

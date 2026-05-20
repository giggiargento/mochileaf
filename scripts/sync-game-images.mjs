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
  if (buf.length < 500) throw new Error(`File too small (${buf.length} bytes): ${url}`);
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

  const villagers = [
    'pierre',
    'robin',
    'abigail',
    'sebastian',
    'lewis',
    'emily',
    'linus',
  ];

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

  const missing = villagers.filter((s) => !fs.existsSync(path.join(charsDir, `${s}.png`)));
  if (missing.length) {
    console.log(`Stardew Valley — Fandom fallback for: ${missing.join(', ')}…`);
    const fandom = {
      abigail:
        'https://static.wikia.nocookie.net/stardewvalley/images/8/88/Abigail.png/revision/latest?cb=20171021194604',
      pierre:
        'https://static.wikia.nocookie.net/stardewvalley/images/7/7e/Pierre.png/revision/latest?cb=20160321193844',
      robin:
        'https://static.wikia.nocookie.net/stardewvalley/images/1/1b/Robin.png/revision/latest?cb=20160321193844',
      sebastian:
        'https://static.wikia.nocookie.net/stardewvalley/images/a/a8/Sebastian.png/revision/latest?cb=20160321193844',
      lewis:
        'https://static.wikia.nocookie.net/stardewvalley/images/2/2b/Lewis.png/revision/latest?cb=20160321193844',
      emily:
        'https://static.wikia.nocookie.net/stardewvalley/images/2/28/Emily.png/revision/latest?cb=20160321193844',
      linus:
        'https://static.wikia.nocookie.net/stardewvalley/images/3/31/Linus.png/revision/latest?cb=20160321193844',
    };
    for (const slug of missing) {
      await download(fandom[slug], path.join(charsDir, `${slug}.png`));
    }
  }

  const attribution = `Stardew Valley game images — Mochileaf fan site cache

Steam store art (cover.jpg, card.jpg, header.jpg)
  App ID 413150 — Stardew Valley by ConcernedApe
  https://store.steampowered.com/app/413150/
  Used for promotional context on this fan hub.

Villager portraits (characters/*.png)
  Primary: stardew-valley-data npm package (MIT), if available
  Fallback: Stardew Valley Wiki (Fandom) portrait files

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

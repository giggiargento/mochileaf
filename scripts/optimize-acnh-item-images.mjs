/**
 * Normalize ACNH item icons: repair URLs, optional 64px thumbs, optional local WebP (--local).
 * Run: npm run items:optimize-images
 *      npm run items:optimize-images -- --local
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { toFullDodoIcon, toDodoThumb } from './lib/dodo-images.mjs';
import { fetchImageBuffer, mapPool, writeSquareWebp } from './lib/image-optimize.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG_PATH = path.join(ROOT, 'src', 'data', 'items-acnh-catalog.json');
const ITEMS_DIR = path.join(ROOT, 'public', 'images', 'games', 'animal-crossing-new-horizons', 'items');
const SIZE = 128;
const CONCURRENCY = 10;
const mirrorLocal = process.argv.includes('--local');
const useThumbs = process.argv.includes('--thumbs');
const force = process.argv.includes('--force');

function publicPath(categoryId, slug) {
  return `/images/games/animal-crossing-new-horizons/items/${categoryId}/${slug}.webp`;
}

function diskPath(categoryId, slug) {
  return path.join(ITEMS_DIR, categoryId, `${slug}.webp`);
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  /** @type {{ categoryId: string; item: object }[]} */
  const work = [];

  let repaired = 0;

  for (const [categoryId, group] of Object.entries(catalog.categories)) {
    for (const item of group.items) {
      const before = item.image;
      let next = toFullDodoIcon(before);
      if (useThumbs && next.includes('dodo.ac/np/images/') && !next.includes('/thumb/')) {
        next = toDodoThumb(next, 64);
      }
      if (next !== before) repaired++;
      item.image = next;
      work.push({ categoryId, item });
    }
  }

  console.log(`Repaired/updated ${repaired} item image URLs.`);

  if (!mirrorLocal) {
    catalog.imageCredit = useThumbs
      ? 'Nookipedia / dodo.ac (64px thumbs)'
      : 'Nookipedia / dodo.ac';
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog));
    console.log('Catalog saved. Default uses full dodo.ac icons (reliable).');
    console.log('Optional: --thumbs (64px) or --local (WebP mirror).');
    return;
  }

  let done = 0;
  let skipped = 0;
  let failed = 0;

  await mapPool(work, CONCURRENCY, async ({ categoryId, item }) => {
    const dest = diskPath(categoryId, item.slug);
    const local = publicPath(categoryId, item.slug);

    if (!force && fs.existsSync(dest)) {
      item.image = local;
      skipped++;
      return;
    }

    const source = toFullDodoIcon(item.image);
    if (!source?.startsWith('http')) {
      skipped++;
      return;
    }

    try {
      const buf = await fetchImageBuffer(source);
      await writeSquareWebp(buf, dest, SIZE);
      item.image = local;
      done++;
      if ((done + skipped + failed) % 200 === 0) {
        console.log(`  … ${done + skipped + failed}/${work.length}`);
      }
    } catch (err) {
      failed++;
      if (failed <= 5) console.warn(`  skip ${item.slug}: ${err.message}`);
    }
  });

  catalog.imageCredit = 'Nookipedia / local WebP cache';
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog));

  console.log(`\nMirrored ${done}, skipped ${skipped}, failed ${failed} → ${path.relative(ROOT, ITEMS_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

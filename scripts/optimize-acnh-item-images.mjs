/**
 * Normalize ACNH item icons: 128px dodo thumbs (fast) or local WebP mirror (--local).
 * Run: npm run items:optimize-images
 *      npm run items:optimize-images -- --local
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchImageBuffer, mapPool, writeSquareWebp } from './lib/image-optimize.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG_PATH = path.join(ROOT, 'src', 'data', 'items-acnh-catalog.json');
const ITEMS_DIR = path.join(ROOT, 'public', 'images', 'games', 'animal-crossing-new-horizons', 'items');
const SIZE = 128;
const CONCURRENCY = 10;
const mirrorLocal = process.argv.includes('--local');
const force = process.argv.includes('--force');

function toDodoThumb(fullUrl, px = 128) {
  if (!fullUrl?.includes('dodo.ac/np/images/') || fullUrl.includes('/thumb/')) return fullUrl;
  const m = fullUrl.match(/dodo\.ac\/np\/images\/(.+)\/([^/]+\.png)$/i);
  if (!m) return fullUrl;
  return `https://dodo.ac/np/images/thumb/${m[1]}/${px}px-${m[2]}`;
}

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

  let thumbsRewritten = 0;

  for (const [categoryId, group] of Object.entries(catalog.categories)) {
    for (const item of group.items) {
      if (item.image?.includes('dodo.ac/np/images/') && !item.image.includes('/thumb/')) {
        item.image = toDodoThumb(item.image, 128);
        thumbsRewritten++;
      }
      work.push({ categoryId, item });
    }
  }

  console.log(`Thumb URLs: ${thumbsRewritten} items now use 128px dodo.ac icons.`);

  if (!mirrorLocal) {
    catalog.imageCredit = 'Nookipedia / dodo.ac (128px thumbs)';
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog));
    console.log('Catalog updated. Run with --local to mirror WebP under public/.');
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

    const source = item.image;
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

/**
 * Generate 128px and 256px WebP portraits from existing villager PNGs.
 * Run: npm run villagers:optimize-images
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeSquareWebp } from './lib/image-optimize.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const VILLAGERS = path.join(ROOT, 'public', 'images', 'games', 'animal-crossing-new-horizons', 'villagers');

async function main() {
  const pngs = fs.readdirSync(VILLAGERS).filter((f) => f.endsWith('.png'));
  let done = 0;

  for (const file of pngs) {
    const slug = file.replace(/\.png$/, '');
    const buf = fs.readFileSync(path.join(VILLAGERS, file));
    for (const size of [128, 256]) {
      const dest = path.join(VILLAGERS, `${slug}-${size}.webp`);
      await writeSquareWebp(buf, dest, size);
    }
    done++;
    console.log(`  ${slug} → 128 + 256 webp`);
  }

  console.log(`\nOptimized ${done} villager portraits.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Copy a profile photo into public/images/creators/{slug}.jpg for Cozy Creators cards.
 *
 * Usage: node scripts/sync-creator-avatar.mjs giggiland path/to/photo.jpg
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [, , slug, sourcePath] = process.argv;

if (!slug || !sourcePath) {
  console.error('Usage: node scripts/sync-creator-avatar.mjs <slug> <source-image>');
  process.exit(1);
}

const resolved = path.resolve(sourcePath);
if (!fs.existsSync(resolved)) {
  console.error(`Source not found: ${resolved}`);
  process.exit(1);
}

const outDir = path.join(process.cwd(), 'public', 'images', 'creators');
fs.mkdirSync(outDir, { recursive: true });

const outJpg = path.join(outDir, `${slug}.jpg`);
const outWebp = path.join(outDir, `${slug}.webp`);

const image = sharp(resolved).rotate();

await image.clone().resize(512, 512, { fit: 'cover', position: 'centre' }).jpeg({ quality: 88 }).toFile(outJpg);
await image.clone().resize(512, 512, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(outWebp);

console.log(`Wrote ${outJpg}`);
console.log(`Wrote ${outWebp}`);

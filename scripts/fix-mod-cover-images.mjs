/**
 * Download + normalize Stardew mod cover images from Nexus CDN previews.
 * Run: node scripts/fix-mod-cover-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'images', 'games', 'stardew-valley', 'mods');

/** @type {{ id: number; file: string; url: string }[]} */
const COVERS = [
  {
    id: 13752,
    file: '13752.jpg',
    url: 'https://staticdelivery.nexusmods.com/mods/1303/images/thumbnails/13752/13752-1665815047-1842292892.png',
  },
  {
    id: 26340,
    file: '26340.jpg',
    url: 'https://staticdelivery.nexusmods.com/mods/1303/images/thumbnails/26340/26340-1722987501-380541643.png',
  },
  {
    id: 22966,
    file: '22966.jpg',
    url: 'https://staticdelivery.nexusmods.com/mods/1303/images/thumbnails/22966/22966-1714304662-1696729932.png',
  },
  {
    id: 40483,
    file: '40483.jpg',
    url: 'https://staticdelivery.nexusmods.com/mods/1303/images/thumbnails/40483/40483-1766431559-1603908778.png',
  },
  {
    id: 40635,
    file: '40635.jpg',
    url: 'https://staticdelivery.nexusmods.com/mods/1303/images/thumbnails/40635/40635-1767032408-551277235.png',
  },
];

async function download(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mochileaf/1.0', Accept: 'image/*,*/*' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error(`too small (${buf.length}b)`);
  return buf;
}

async function saveJpeg(buf, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(buf).jpeg({ quality: 85, mozjpeg: true }).toFile(dest);
}

for (const { id, file, url } of COVERS) {
  const dest = path.join(OUT, file);
  try {
    const buf = await download(url);
    await saveJpeg(buf, dest);
    const stat = fs.statSync(dest);
    console.log(`OK ${id} -> ${file} (${stat.size}b)`);
  } catch (err) {
    console.warn(`FAIL ${id} ${url} — ${err.message}`);
  }
}

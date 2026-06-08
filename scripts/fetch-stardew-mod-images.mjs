/**
 * Fetch Nexus preview URLs for Stardew mod cards (via Microlink Open Graph).
 * Run: node scripts/fetch-stardew-mod-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'images', 'games', 'stardew-valley', 'mods');

const MOD_IDS = [13752, 26340, 22966, 40483, 40635];

async function resolvePreview(modId) {
  const page = `https://www.nexusmods.com/stardewvalley/mods/${modId}`;
  const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(page)}`, {
    headers: { 'User-Agent': 'Mochileaf/1.0' },
  });
  if (!res.ok) throw new Error(`Microlink HTTP ${res.status}`);
  const json = await res.json();
  const imageUrl = json?.data?.image?.url;
  if (!imageUrl?.includes('staticdelivery.nexusmods.com')) {
    throw new Error('no Nexus preview in Open Graph');
  }
  return imageUrl;
}

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

for (const id of MOD_IDS) {
  console.log(`\nMod ${id}…`);
  try {
    const previewUrl = await resolvePreview(id);
    console.log(`  ${previewUrl}`);
    const buf = await download(previewUrl);
    const dest = path.join(OUT, `${id}.jpg`);
    fs.mkdirSync(OUT, { recursive: true });
    await sharp(buf).jpeg({ quality: 85, mozjpeg: true }).toFile(dest);
    const stat = fs.statSync(dest);
    console.log(`  saved ${id}.jpg (${stat.size}b)`);
  } catch (err) {
    console.log(`  error: ${err.message}`);
  }
}

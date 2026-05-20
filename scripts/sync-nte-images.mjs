/**
 * Downloads NTE assets into public/images/games/neverness-to-everness/.
 * Portraits: nteguide.com public character paths.
 * Hub art: Neverness.gg key art (not Steam — NTE is not on Steam at launch).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = path.join(ROOT, 'public', 'images', 'games', 'neverness-to-everness');
const CHARS = path.join(BASE, 'characters');
const USER_AGENT = 'Mochileaf/1.0 (fan site; local asset sync)';

const PORTRAITS = [
  'nanally',
  'sakiri',
  'fadia',
  'baicang',
  'zero-male',
  'zero-female',
  'hotori',
  'daffodil',
  'jiuyuan',
  'haniel',
  'adler',
  'skia',
  'edgar',
  'mint',
  'hathor',
  'chiz',
  'aurelia',
  'xun',
];

/** Official fan-site key art (neverness.gg). */
const HUB_ART = {
  cover: 'https://neverness.gg/wp-content/uploads/sites/88/2025/12/Neverness-to-Everness-Key-Art.jpg',
  header:
    'https://neverness.gg/wp-content/uploads/sites/88/2025/12/Neverness-to-Everness-Key-Art-1024x572.jpg',
  card: 'https://neverness.gg/wp-content/uploads/sites/88/2025/12/Neverness-to-Everness-Icon-300x300.jpg',
  /** Fallback if neverness.gg is unreachable */
  coverFallback: 'https://nteguide.com/og-image.png',
};

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

async function tryDownload(url, dest) {
  try {
    const n = await download(url, dest);
    console.log(`  OK ${path.basename(dest)} (${n} bytes)`);
    return true;
  } catch (e) {
    console.log(`  skip ${url} — ${e.message}`);
    return false;
  }
}

export async function syncNevernessToEverness() {
  console.log('Neverness to Everness — portraits (nteguide.com paths)…');
  for (const slug of PORTRAITS) {
    const remote = `https://nteguide.com/images/characters/${slug}.webp`;
    await tryDownload(remote, path.join(CHARS, `${slug}.webp`));
  }

  console.log('NTE — hub key art (neverness.gg)…');
  const coverOk = await tryDownload(HUB_ART.cover, path.join(BASE, 'cover.jpg'));
  if (!coverOk) {
    await tryDownload(HUB_ART.coverFallback, path.join(BASE, 'cover.jpg'));
  }
  await tryDownload(HUB_ART.header, path.join(BASE, 'header.jpg'));
  await tryDownload(HUB_ART.card, path.join(BASE, 'card.jpg'));

  const attribution = `Neverness to Everness — Mochileaf fan site cache

Character portraits (characters/*.webp)
  Public paths on nteguide.com — unofficial fan reference.

Hub images (cover.jpg, header.jpg, card.jpg)
  Key art / icon from neverness.gg (DotGG fan wiki), or nteguide.com og fallback.
  Game © Hotta Studio / Level Infinite. This hub is unofficial.

Replace or remove assets if requested by rights holders.
`;
  fs.writeFileSync(path.join(BASE, 'ATTRIBUTION.txt'), attribution, 'utf8');
}

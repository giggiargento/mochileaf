/**
 * Build src/data/nte-arcs.json and download arc icons from neverness.gg.
 * Source: https://neverness.gg/neverness-to-everness-arcs/
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  NTE_ARCS_IMAGE_BASE,
  NTE_ARCS_SOURCE,
  slugifyArcName,
} from './nte-arcs-source.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_JSON = path.join(ROOT, 'src', 'data', 'nte-arcs.json');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'games', 'neverness-to-everness', 'arcs');
const USER_AGENT = 'Mochileaf/1.0 (fan site; arc asset sync)';

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'image/*,*/*' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 200) throw new Error(`too small (${buf.length} bytes)`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function extFromFile(file) {
  const m = file.match(/\.(avif|webp|png|jpe?g)$/i);
  return m ? m[1].toLowerCase() : 'webp';
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const arcs = [];
  let ok = 0;
  let fail = 0;

  for (const row of NTE_ARCS_SOURCE) {
    const slug = slugifyArcName(row.name);
    const ext = extFromFile(row.imageFile);
    const remoteUrl = `${NTE_ARCS_IMAGE_BASE}${row.imageFile}`;
    const localRel = `/images/games/neverness-to-everness/arcs/${slug}.${ext}`;
    const localAbs = path.join(ROOT, 'public', localRel.replace(/^\//, '').replace(/\//g, path.sep));

    try {
      const bytes = await download(remoteUrl, localAbs);
      console.log(`OK ${slug}.${ext} (${bytes} bytes)`);
      ok += 1;
    } catch (e) {
      console.log(`skip ${row.name} — ${e.message}`);
      fail += 1;
    }

    arcs.push({
      slug,
      name: row.name,
      rarity: row.rarity,
      type: row.type,
      atk: row.atk,
      substat: row.substat,
      effect: row.effect,
      image: fs.existsSync(localAbs) ? localRel : undefined,
      sourceUrl: 'https://neverness.gg/neverness-to-everness-arcs/',
    });
  }

  const payload = {
    importedAt: new Date().toISOString(),
    source: 'https://neverness.gg/neverness-to-everness-arcs/',
    total: arcs.length,
    arcs,
  };

  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`\nWrote ${OUT_JSON} (${arcs.length} arcs, ${ok} images, ${fail} failed)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

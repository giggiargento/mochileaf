/**
 * Imports pins from a public Pinterest board RSS feed.
 *
 * Homes board:
 *   npm run inspiration:import -- homes https://ar.pinterest.com/giggiland/animal-crosing-homes/
 *
 * Villager board (slug = character slug, e.g. raymond):
 *   npm run inspiration:import -- character raymond https://ar.pinterest.com/giggiland/...
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const USER_AGENT = 'Mochileaf/1.0 (fan site; pinterest board import)';
const MAX_HOMES_PINS = 24;
const MAX_CHARACTER_PINS = 12;

const PATHS = {
  homes: {
    outDir: path.join(ROOT, 'public', 'images', 'games', 'animal-crossing-new-horizons', 'inspiration'),
    dataFile: path.join(ROOT, 'src', 'data', 'decor-inspiration-acnh.ts'),
    boardsFile: path.join(ROOT, 'src', 'data', 'pinterest-boards-acnh.ts'),
    boardKey: 'homes',
  },
  character: {
    outDir: (slug) =>
      path.join(ROOT, 'public', 'images', 'games', 'animal-crossing-new-horizons', 'decor', slug),
    dataFile: path.join(ROOT, 'src', 'data', 'character-decor-acnh.json'),
    boardsFile: path.join(ROOT, 'src', 'data', 'pinterest-boards-acnh.ts'),
  },
};

function boardToRssUrl(boardUrl) {
  const u = new URL(boardUrl.trim());
  if (!u.hostname.includes('pinterest.')) {
    throw new Error('URL must be a pinterest.com board link');
  }
  const parts = u.pathname.split('/').filter(Boolean);
  if (parts[0]?.length === 2) parts.shift();
  if (parts.length < 2) throw new Error('Expected …/USER/BOARD/');
  const [user, board] = parts;
  const host = u.hostname.replace(/^www\./, '');
  return `https://${host}/${user}/${board}.rss`;
}

function decodeHtml(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function upscalePinimg(url) {
  return url.replace(/i\.pinimg\.com\/\d+x\//, 'i.pinimg.com/736x/');
}

function extractImageUrl(itemXml) {
  const desc = itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1];
  if (desc) {
    const decoded = decodeHtml(desc);
    const img = decoded.match(/src="([^"]+)"/);
    if (img?.[1]) return upscalePinimg(img[1]);
  }
  const media = itemXml.match(/<media:content[^>]+url="([^"]+)"/);
  if (media?.[1]) return upscalePinimg(media[1]);
  const enclosure = itemXml.match(/<enclosure[^>]+url="([^"]+)"/);
  if (enclosure?.[1]) return upscalePinimg(enclosure[1]);
  return null;
}

function parseRss(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  return items.map((block, i) => {
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
      ?? block.match(/<title>([^<]*)<\/title>/)?.[1]?.trim()
      ?? '';
    const link = block.match(/<link>([^<]*)<\/link>/)?.[1]?.trim();
    const imageUrl = extractImageUrl(block);
    const descRaw = block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? '';
    const descText = decodeHtml(descRaw).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const label =
      title.replace(/\s*-\s*Pinterest\s*$/i, '').trim() ||
      descText.slice(0, 80) ||
      `Inspiration ${i + 1}`;
    return { title: label, link, imageUrl };
  });
}

function slugify(text, i) {
  const base = (text || `pin-${i}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return base || `pin-${i}`;
}

function extFromUrl(url) {
  try {
    const p = new URL(url).pathname;
    if (p.endsWith('.png')) return '.png';
    if (p.endsWith('.webp')) return '.webp';
    if (p.endsWith('.gif')) return '.gif';
  } catch {
    /* ignore */
  }
  return '.jpg';
}

async function downloadImage(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'image/*,*/*' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 800) throw new Error('image too small');
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function entryTs(entries) {
  return entries
    .map(
      (e) => `  {
    id: '${e.id}',
    title: ${JSON.stringify(e.title)},
    image: '${e.image}',
    sourceUrl: ${e.sourceUrl ? JSON.stringify(e.sourceUrl) : 'undefined'},
  },`,
    )
    .join('\n');
}

function writeHomesData(boardUrl, entries) {
  const content = `import type { DecorInspiration } from '../types';

/** Imported from Pinterest — ${new Date().toISOString().slice(0, 10)} */
export const acnhPinterestBoardUrl = ${JSON.stringify(boardUrl)};

/** Shown on Homes — full board lives on Pinterest */
export const acnhHomesGalleryLimit = 24;

export const acnhDecorInspiration: DecorInspiration[] = [
${entryTs(entries)}
];

export function getAcnhHomesGallery(): DecorInspiration[] {
  return acnhDecorInspiration.slice(0, acnhHomesGalleryLimit);
}

export function getAcnhDecorPreview(limit = 6): DecorInspiration[] {
  return acnhDecorInspiration.slice(0, limit);
}
`;
  fs.writeFileSync(PATHS.homes.dataFile, content, 'utf8');
  updateBoardRegistry('homes', boardUrl);
}

function writeCharacterData(slug, boardUrl, entries) {
  const file = PATHS.character.dataFile;
  const map = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf8'))
    : {};
  map[slug] = entries.map((e) => ({
    id: e.id,
    title: e.title,
    image: e.image,
    sourceUrl: e.sourceUrl,
  }));
  fs.writeFileSync(file, `${JSON.stringify(map, null, 2)}\n`, 'utf8');
  updateBoardRegistry(slug, boardUrl);
}

function updateBoardRegistry(key, boardUrl) {
  const file = PATHS.homes.boardsFile;
  let text = fs.readFileSync(file, 'utf8');
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const line = `  ${key}: ${JSON.stringify(boardUrl)},`;
  if (new RegExp(`  ${escaped}:`).test(text)) {
    text = text.replace(
      new RegExp(`  ${escaped}: (?:'[^']*'|"[^"]*"),?`),
      line,
    );
  } else {
    text = text.replace(/(\/\/ raymond[^\n]*\n)?(\} as const;)/, `$1  ${key}: ${JSON.stringify(boardUrl)},\n$2`);
    if (!text.includes(`${key}:`)) {
      text = text.replace(
        /export const acnhPinterestBoards = \{/,
        `export const acnhPinterestBoards = {\n${line}`,
      );
    }
  }
  fs.writeFileSync(file, text, 'utf8');
}

function clearOutDir(outDir) {
  if (!fs.existsSync(outDir)) return;
  for (const name of fs.readdirSync(outDir)) {
    const full = path.join(outDir, name);
    if (fs.statSync(full).isFile()) fs.unlinkSync(full);
  }
}

async function importBoard(boardUrl, outDir, publicPrefix, maxPins) {
  const rssUrl = boardToRssUrl(boardUrl);
  console.log('Fetching RSS:', rssUrl);
  const res = await fetch(rssUrl, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`RSS HTTP ${res.status}`);

  const xml = await res.text();
  const pins = parseRss(xml).filter((p) => p.imageUrl);
  if (pins.length === 0) throw new Error('No images in RSS');

  fs.mkdirSync(outDir, { recursive: true });
  const entries = [];

  for (let i = 0; i < pins.length && entries.length < maxPins; i++) {
    const pin = pins[i];
    const id = slugify(pin.title, i + 1);
    const ext = extFromUrl(pin.imageUrl);
    const filename = `${String(i + 1).padStart(2, '0')}-${id}${ext}`;
    const dest = path.join(outDir, filename);
    const publicPath = `${publicPrefix}/${filename}`;

    try {
      const n = await downloadImage(pin.imageUrl, dest);
      console.log(`  OK ${filename} (${n}b)`);
      entries.push({
        id,
        title: pin.title,
        image: publicPath,
        sourceUrl: pin.link,
      });
    } catch (e) {
      console.log(`  skip ${filename} — ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 350));
  }

  if (entries.length === 0) throw new Error('No images downloaded');
  return entries;
}

function parseArgs(argv) {
  if (argv[0] === 'homes') {
    return { mode: 'homes', boardUrl: argv[1], slug: null };
  }
  if (argv[0] === 'character' && argv[1] && argv[2]) {
    return { mode: 'character', slug: argv[1], boardUrl: argv[2] };
  }
  if (argv[0]?.includes('pinterest')) {
    return { mode: 'homes', boardUrl: argv[0], slug: null };
  }
  return null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args?.boardUrl) {
    console.error('Usage:');
    console.error('  npm run inspiration:import -- homes <board-url>');
    console.error('  npm run inspiration:import -- character <slug> <board-url>');
    process.exit(1);
  }

  const boardUrl = args.boardUrl.replace(/\/?$/, '/');

  if (args.mode === 'homes') {
    const entries = await importBoard(
      boardUrl,
      PATHS.homes.outDir,
      '/images/games/animal-crossing-new-horizons/inspiration',
      MAX_HOMES_PINS,
    );
    writeHomesData(boardUrl, entries);
    console.log(`\nHomes: ${entries.length} pins → decor-inspiration-acnh.ts`);
  } else {
    const outDir = PATHS.character.outDir(args.slug);
    clearOutDir(outDir);
    const entries = await importBoard(
      boardUrl,
      outDir,
      `/images/games/animal-crossing-new-horizons/decor/${args.slug}`,
      MAX_CHARACTER_PINS,
    );
    writeCharacterData(args.slug, boardUrl, entries);
    console.log(`\n${args.slug}: ${entries.length} pins → character-decor-acnh.ts`);
  }

  console.log('Run npm run build to refresh the site.');
}

main();

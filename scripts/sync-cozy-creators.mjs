/**
 * Sync Cozy Creators from Instagram (photo + bio + display name).
 * Run: npm run creators:sync
 *
 * Stable sync: set INSTAGRAM_ACCESS_TOKEN + INSTAGRAM_BUSINESS_USER_ID in .env
 * (Meta Business Discovery — see .env.example).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { loadDotEnv } from './lib/load-dotenv.mjs';
import { fetchInstagramProfile } from './lib/instagram-profile.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
loadDotEnv(ROOT);

const LIVE_PATH = path.join(ROOT, 'src', 'data', 'live', 'cozy-creators.json');
const CREATORS_DIR = path.join(ROOT, 'public', 'images', 'creators');

const USER_AGENT = 'Mochileaf/1.0 (cozy creators sync)';

/** Add creators here; sync pulls avatar + bio from Instagram. */
const SOURCES = [
  {
    slug: 'giggiland',
    instagram: 'giggiland',
    nameFallback: 'Giggiland',
    linkLabel: 'Follow on Instagram',
    accent: 'sage',
    featured: true,
  },
  {
    slug: 'cozyquartzz',
    instagram: 'cozyquartzz',
    nameFallback: 'Cozy Quartzz',
    linkLabel: 'Follow on Instagram',
    accent: 'blossom',
  },
];

async function downloadImage(url, slug) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'image/*,*/*' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for image ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) throw new Error(`Image too small (${buf.length} bytes)`);

  fs.mkdirSync(CREATORS_DIR, { recursive: true });
  const jpg = path.join(CREATORS_DIR, `${slug}.jpg`);
  const webp = path.join(CREATORS_DIR, `${slug}.webp`);

  await sharp(buf)
    .rotate()
    .resize(512, 512, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 88 })
    .toFile(jpg);
  await sharp(buf)
    .rotate()
    .resize(512, 512, { fit: 'cover', position: 'centre' })
    .webp({ quality: 82 })
    .toFile(webp);

  return { jpg: `/images/creators/${slug}.jpg`, webp: `/images/creators/${slug}.webp` };
}

async function syncCreator(source) {
  const handle = source.instagram.replace(/^@/, '');
  console.log(`Instagram @${handle}…`);

  const profile = await fetchInstagramProfile(handle);
  console.log(`  Source: ${profile.source}`);

  let imagePath;
  try {
    console.log('  Downloading profile photo…');
    const paths = await downloadImage(profile.profilePicUrl, source.slug);
    imagePath = paths.jpg;
  } catch (err) {
    console.warn(`  Image download failed: ${err.message}`);
  }

  return {
    slug: source.slug,
    handle: profile.username,
    name: profile.name || source.nameFallback,
    bio: profile.biography?.trim() ?? '',
    image: imagePath,
    profilePicUrl: profile.profilePicUrl,
    imageSource: profile.profilePicUrl,
    syncedAt: new Date().toISOString(),
    source: profile.source,
  };
}

function loadPreviousLive() {
  if (!fs.existsSync(LIVE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(LIVE_PATH, 'utf8')).creators ?? {};
  } catch {
    return {};
  }
}

async function main() {
  const creators = {};
  const previous = loadPreviousLive();

  for (const source of SOURCES) {
    try {
      creators[source.slug] = await syncCreator(source);
      console.log(`  ✓ ${source.slug}: ${creators[source.slug].name}`);
    } catch (err) {
      console.warn(`  ✗ ${source.slug}: ${err.message}`);
      const prev = previous[source.slug];
      const keepPrev = prev && !prev.error;
      creators[source.slug] = {
        slug: source.slug,
        handle: prev?.handle ?? source.instagram.replace(/^@/, ''),
        name: keepPrev && prev.name ? prev.name : source.nameFallback,
        ...(keepPrev && prev.bio?.trim() ? { bio: prev.bio.trim() } : {}),
        ...(keepPrev && prev.image ? { image: prev.image } : {}),
        ...(keepPrev && prev.profilePicUrl ? { profilePicUrl: prev.profilePicUrl } : {}),
        error: err.message,
        syncedAt: new Date().toISOString(),
      };
    }

    // Gentle pause between accounts to reduce 429s on web API
    await new Promise((r) => setTimeout(r, 1500));
  }

  const payload = { updatedAt: new Date().toISOString(), creators };
  fs.mkdirSync(path.dirname(LIVE_PATH), { recursive: true });
  fs.writeFileSync(LIVE_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${LIVE_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

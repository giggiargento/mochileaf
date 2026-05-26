/**
 * One-off / fallback: profile photo from Instagram HTML (og:image) when API is 429.
 * Usage: node scripts/download-creator-from-ig-page.mjs <username> [slug]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const username = (process.argv[2] || '').replace(/^@/, '');
const slug = process.argv[3] || username;
if (!username) {
  console.error('Usage: node scripts/download-creator-from-ig-page.mjs <username> [slug]');
  process.exit(1);
}

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGE_URL = `https://www.instagram.com/${username}/`;

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

function decodeJsonString(s) {
  return s.replace(/\\u0026/g, '&').replace(/\\"/g, '"').replace(/\\\//g, '/').replace(/&amp;/g, '&');
}

function extractProfilePicUrl(html) {
  const og =
    html.match(/property="og:image" content="([^"]+)"/i) ||
    html.match(/content="([^"]+)" property="og:image"/i);
  if (og?.[1] && og[1].includes('cdninstagram.com')) return decodeJsonString(og[1]);

  const hd = html.match(/"profile_pic_url_hd":"([^"]+)"/);
  if (hd?.[1]) return decodeJsonString(hd[1]);

  const sd = html.match(/"profile_pic_url":"([^"]+)"/);
  if (sd?.[1]) return decodeJsonString(sd[1]);

  const cdn = html.match(
    /https:\/\/scontent[^"'\s]*cdninstagram\.com[^"'\s]*profile[^"'\s]*/i,
  );
  if (cdn?.[0]) return cdn[0];

  const any = html.match(/https:\/\/scontent[^"'\s]+\.cdninstagram\.com\/v\/[^"'\s]+/);
  if (any?.[0] && !any[0].includes('rsrc.php')) return any[0];

  return null;
}

async function fetchHtml(attempt) {
  const res = await fetch(PAGE_URL, { headers: HEADERS, redirect: 'follow' });
  const html = await res.text();
  const pic = extractProfilePicUrl(html);
  console.log(`  attempt ${attempt}: HTTP ${res.status}, html ${html.length}, pic ${pic ? 'yes' : 'no'}`);
  return pic;
}

let picUrl = null;
for (let i = 1; i <= 5 && !picUrl; i++) {
  picUrl = await fetchHtml(i);
  if (!picUrl && i < 5) await new Promise((r) => setTimeout(r, 2000 * i));
}

if (!picUrl) {
  console.error('Could not find profile image in Instagram page HTML.');
  process.exit(1);
}

console.log('Downloading…');
const imgRes = await fetch(picUrl, {
  headers: { 'User-Agent': HEADERS['User-Agent'], Accept: 'image/*' },
});
if (!imgRes.ok) {
  console.error(`Image HTTP ${imgRes.status}`);
  process.exit(1);
}

const buf = Buffer.from(await imgRes.arrayBuffer());
const outDir = path.join(ROOT, 'public', 'images', 'creators');
fs.mkdirSync(outDir, { recursive: true });
const jpg = path.join(outDir, `${slug}.jpg`);
const webp = path.join(outDir, `${slug}.webp`);

await sharp(buf).rotate().resize(512, 512, { fit: 'cover', position: 'centre' }).jpeg({ quality: 88 }).toFile(jpg);
await sharp(buf).rotate().resize(512, 512, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(webp);

console.log(`Wrote ${jpg}`);
console.log(`Wrote ${webp}`);

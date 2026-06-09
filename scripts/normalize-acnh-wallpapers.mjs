/**
 * Rename ACNH wallpaper exports to Mochileaf timestamp filenames (YY_MM_DD_HH_mm_ss.png).
 * Run: node scripts/normalize-acnh-wallpapers.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public', 'images', 'games', 'animal-crossing-new-horizons', 'wallpapers');

const MONTHS = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

function pad2(n) {
  return String(n).padStart(2, '0');
}

function chatGptToTimestamp(name) {
  const match = name.match(
    /^ChatGPT Image (\w{3}) (\d{1,2}), (\d{4}), (\d{2})_(\d{2})_(\d{2}) (AM|PM)\.(png|jpe?g|webp)$/i,
  );
  if (!match) return null;

  const [, monRaw, dayRaw, yearRaw, hourRaw, minRaw, secRaw, ampm] = match;
  const month = MONTHS[monRaw.toLowerCase()];
  if (!month) return null;

  let hour = Number(hourRaw);
  if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;

  const yy = Number(yearRaw) % 100;
  return `${pad2(yy)}_${pad2(month)}_${pad2(Number(dayRaw))}_${pad2(hour)}_${pad2(Number(minRaw))}_${pad2(Number(secRaw))}.png`;
}

if (!fs.existsSync(DIR)) {
  console.log('No ACNH wallpapers folder found.');
  process.exit(0);
}

let renamed = 0;
for (const file of fs.readdirSync(DIR)) {
  if (!/^ChatGPT Image /i.test(file)) continue;
  const target = chatGptToTimestamp(file);
  if (!target) {
    console.warn(`  skip (unparsed): ${file}`);
    continue;
  }
  const src = path.join(DIR, file);
  let dest = path.join(DIR, target);
  if (fs.existsSync(dest)) {
    const stem = target.replace(/\.png$/, '');
    dest = path.join(DIR, `${stem}_${path.basename(file, path.extname(file)).slice(-4)}.png`);
  }
  fs.renameSync(src, dest);
  console.log(`  ${file} → ${path.basename(dest)}`);
  renamed++;
}

console.log(`\nRenamed ${renamed} wallpaper(s).`);

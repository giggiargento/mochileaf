/**
 * Applies original ACNH appearance/personality from scripts/data/acnh-original-prose.json
 * Sets acnh.proseStatus to "original".
 * Run: node scripts/apply-acnh-original-prose.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'scripts', 'data', 'acnh-original-prose.json');
const CHAR_DIR = path.join(ROOT, 'src/content/characters');

const prose = JSON.parse(fs.readFileSync(DATA, 'utf8'));
let updated = 0;

for (const [slug, fields] of Object.entries(prose)) {
  const file = path.join(CHAR_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) {
    console.warn(`  skip ${slug}: no character file`);
    continue;
  }
  const character = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!character.acnh) character.acnh = {};

  if (fields.appearance) character.acnh.appearance = fields.appearance;
  if (fields.personality) character.acnh.personality = fields.personality;
  character.acnh.proseStatus = 'original';

  fs.writeFileSync(file, `${JSON.stringify(character, null, 2)}\n`, 'utf8');
  updated++;
}

console.log(`Applied original prose to ${updated} character(s).`);

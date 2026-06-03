/**
 * Merge src/data/acnh-villager-details.json into src/content/characters/{slug}.json
 * Run: node scripts/merge-acnh-villager-details.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACNH_VILLAGER_WIKI } from './acnh-villager-roster.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DETAILS = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/acnh-villager-details.json'), 'utf8'),
);
const CHAR_DIR = path.join(ROOT, 'src/content/characters');

let updated = 0;
for (const slug of Object.keys(ACNH_VILLAGER_WIKI)) {
  const acnh = DETAILS.villagers?.[slug];
  const file = path.join(CHAR_DIR, `${slug}.json`);
  if (!acnh || !fs.existsSync(file)) continue;

  const character = JSON.parse(fs.readFileSync(file, 'utf8'));
  const vi = acnh.villagerInfo;
  character.acnh = acnh;
  if (vi?.food) {
    character.favoriteFoods = [vi.food];
  }
  if (vi?.personality && !character.personality) {
    character.personality = vi.personality;
  }
  const tags = new Set([...(character.tags ?? []), character.personality, character.species].filter(Boolean));
  character.tags = [...tags];

  fs.writeFileSync(file, `${JSON.stringify(character, null, 2)}\n`, 'utf8');
  updated++;
}
console.log(`Merged acnh blocks into ${updated} character file(s).`);

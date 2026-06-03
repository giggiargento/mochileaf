/**
 * Write src/content/characters/{slug}.json for ACNH_VILLAGER_STUBS when missing.
 * Run: node scripts/scaffold-acnh-villager-content.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACNH_VILLAGER_STUBS } from './acnh-villager-roster.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHAR_DIR = path.join(ROOT, 'src', 'content', 'characters');
const GAME = 'animal-crossing-new-horizons';

function payload(stub) {
  const { slug, name, role, personality, species, popularRank, description, houseStyle, houseDescription } =
    stub;
  return {
    slug,
    name,
    role,
    personality,
    species,
    popularRank,
    gameSlug: GAME,
    image: `/images/games/${GAME}/villagers/${slug}-128.webp`,
    houseStyle,
    houseDescription,
    description,
    seo: {
      title: `${name} — ${role}`,
      description,
    },
    likes: [],
    dislikes: [],
    favoriteGifts: [],
    favoriteFoods: [],
    routines: [],
    relationships: [],
    trivia: [],
    tags: [personality, species].filter(Boolean),
  };
}

let created = 0;
for (const stub of ACNH_VILLAGER_STUBS) {
  const dest = path.join(CHAR_DIR, `${stub.slug}.json`);
  if (fs.existsSync(dest)) {
    console.log(`  skip ${stub.slug} (exists)`);
    continue;
  }
  fs.writeFileSync(dest, `${JSON.stringify(payload(stub), null, 2)}\n`, 'utf8');
  console.log(`  + ${stub.slug}.json`);
  created++;
}
console.log(`\nCreated ${created} character file(s). Next: npm run sync:images && npm run villagers:import-details && npm run content:migrate`);

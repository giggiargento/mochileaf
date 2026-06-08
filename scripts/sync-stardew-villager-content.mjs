/**
 * Write or update src/content/characters/{slug}.json for all Stardew giftable villagers.
 * Run: node scripts/sync-stardew-villager-content.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STARDEW_VILLAGERS } from './stardew-villager-data.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHAR_DIR = path.join(ROOT, 'src', 'content', 'characters');
const GAME = 'stardew-valley';

function characterPayload(v) {
  return {
    slug: v.slug,
    name: v.name,
    role: v.role,
    gameSlug: GAME,
    image: `/images/games/${GAME}/characters/${v.slug}.png`,
    description: v.description,
    seo: {
      title: `${v.name} — ${v.role}`,
      description: v.description,
    },
    tags: v.tags ?? [],
    stardew: v.stardew,
    routines: v.routines ?? [],
    relationships: v.relationships ?? [],
    trivia: v.trivia ?? [],
    likes: [],
    dislikes: [],
    favoriteGifts: [],
    favoriteFoods: [],
  };
}

let created = 0;
let updated = 0;

for (const villager of STARDEW_VILLAGERS) {
  const dest = path.join(CHAR_DIR, `${villager.slug}.json`);
  const payload = characterPayload(villager);
  const json = `${JSON.stringify(payload, null, 2)}\n`;

  if (fs.existsSync(dest)) {
    fs.writeFileSync(dest, json, 'utf8');
    updated++;
    console.log(`  ~ ${villager.slug}.json`);
  } else {
    fs.writeFileSync(dest, json, 'utf8');
    created++;
    console.log(`  + ${villager.slug}.json`);
  }
}

console.log(`\nStardew villagers: ${created} created, ${updated} updated (${STARDEW_VILLAGERS.length} total).`);
console.log('Next: npm run sync:images && npm run content:lint');

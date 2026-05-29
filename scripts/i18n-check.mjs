/**
 * Lists English source files missing Spanish overlays in src/i18n/generated/es/
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'src/i18n/generated/es');

const sources = [
  { name: 'articles', dir: path.join(ROOT, 'src/content/articles'), ext: '.md' },
  { name: 'characters', dir: path.join(ROOT, 'src/content/characters'), ext: '.json' },
  { name: 'guides', dir: path.join(ROOT, 'src/content/guides'), ext: '.json', skip: (f) => f.startsWith('_') },
  { name: 'games', dir: path.join(ROOT, 'src/content/games'), ext: '.json' },
];

let missing = 0;

for (const { name, dir, ext, skip } of sources) {
  if (!fs.existsSync(dir)) continue;
  const outDir = path.join(OUT, name);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(ext) && !(skip?.(f) ?? false));

  for (const file of files) {
    const slug = file.replace(ext, '');
    const outFile = path.join(outDir, `${slug}.json`);
    if (!fs.existsSync(outFile)) {
      console.log(`  missing  ${name}/${slug}`);
      missing++;
    }
  }
}

if (missing === 0) {
  console.log('i18n:check — all source files have Spanish overlays.');
} else {
  console.log(`\ni18n:check — ${missing} missing. Run: npm run i18n:sync (or i18n:sync:free -- --resume)`);
  process.exitCode = 1;
}

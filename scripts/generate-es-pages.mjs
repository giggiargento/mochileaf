// Mirrors src/pages (all .astro files) into src/pages/es/ for /es/* static routes.
// Astro.currentLocale is "es" under es/; English stays at src/pages/ root.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PAGES = path.join(ROOT, 'src/pages');
const ES_ROOT = path.join(PAGES, 'es');

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === 'es' && dir === PAGES) continue;
      walk(full, files);
    } else if (name.name.endsWith('.astro')) {
      files.push(full);
    }
  }
  return files;
}

function clearEsDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) clearEsDir(full);
    else fs.unlinkSync(full);
  }
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir) || dir === ES_ROOT) return;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) removeEmptyDirs(full);
  }
  if (fs.readdirSync(dir).length === 0 && dir !== ES_ROOT) {
    fs.rmdirSync(dir);
  }
}

clearEsDir(ES_ROOT);
removeEmptyDirs(ES_ROOT);

let count = 0;
for (const srcFile of walk(PAGES)) {
  const rel = path.relative(PAGES, srcFile);
  const destFile = path.join(ES_ROOT, rel);
  fs.mkdirSync(path.dirname(destFile), { recursive: true });

  let content = fs.readFileSync(srcFile, 'utf8');
  const depth = rel.split(path.sep).length - 1;
  const extra = depth > 0 ? '../'.repeat(depth) : '';
  content = content.replaceAll(/from\s+(['"])(\.\.\/)+/g, (match, quote) => {
    const ups = (match.match(/\.\.\//g) ?? []).length;
    return `from ${quote}${'../'.repeat(ups + 1)}`;
  });

  fs.writeFileSync(destFile, content, 'utf8');
  count += 1;
}

console.log(`[i18n] Mirrored ${count} page(s) to src/pages/es/`);

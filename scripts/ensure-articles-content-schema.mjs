/**
 * Astro 6 sometimes fails to generate articles JSON schema from Zod (see sync warnings).
 * Without that file, dev strips coverImage/coverCaption from the content store.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'src/content/articles.collection.schema.json');
const targetDir = path.join(root, '.astro/collections');
const target = path.join(targetDir, 'articles.schema.json');

if (!fs.existsSync(source)) {
  console.warn('[ensure-articles-content-schema] missing', source);
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, target);

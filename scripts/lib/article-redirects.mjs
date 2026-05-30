/**
 * Legacy /articles/{slug} URLs → canonical game hub paths (301).
 * Game-scoped articles live under /{game}/guides|news/{slug}, not /articles/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ARTICLES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../src/content/articles');

function parseFrontmatterField(content, field) {
  const match = content.match(new RegExp(`^${field}:\\s*["']?([^"'\\n]+)["']?`, 'm'));
  return match?.[1]?.trim();
}

/** @returns {Record<string, { status: number; destination: string }>} */
export function buildLegacyArticleRedirects() {
  /** @type {Record<string, { status: number; destination: string }>} */
  const redirects = {};

  if (!fs.existsSync(ARTICLES_DIR)) return redirects;

  for (const file of fs.readdirSync(ARTICLES_DIR)) {
    if (!file.endsWith('.md')) continue;

    const content = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
    const gameSlug = parseFrontmatterField(content, 'gameSlug');
    if (!gameSlug) continue;

    const slug = file.replace(/\.md$/, '');
    const category = parseFrontmatterField(content, 'category');
    const section = category === 'guide' ? 'guides' : 'news';
    const destination = `/${gameSlug}/${section}/${slug}/`;

    for (const prefix of ['', '/es']) {
      redirects[`${prefix}/articles/${slug}`] = { status: 301, destination: `${prefix}${destination}` };
      redirects[`${prefix}/articles/${slug}/`] = { status: 301, destination: `${prefix}${destination}` };
    }
  }

  return redirects;
}

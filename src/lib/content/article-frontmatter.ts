import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

const ARTICLES_DIR = join(process.cwd(), 'src/content/articles');

function slugFromEntryId(id: string): string {
  return id.replace(/^.*[/\\]/, '').replace(/\.mdx?$/i, '');
}

/** Read one frontmatter field from disk — source of truth when Astro content schema drops optional fields. */
export function readArticleFrontmatterField(
  entryId: string,
  field: 'coverImage' | 'coverCaption',
): string | undefined {
  const slug = slugFromEntryId(entryId);
  const filePath = join(ARTICLES_DIR, `${slug}.md`);
  try {
    const raw = readFileSync(filePath, 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return undefined;
    const value = (parseYaml(match[1]) as Record<string, unknown>)[field];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  } catch {
    return undefined;
  }
}

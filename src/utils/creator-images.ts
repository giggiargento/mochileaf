import fs from 'node:fs';
import path from 'node:path';

const CREATORS_DIR = path.join(process.cwd(), 'public', 'images', 'creators');
const EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png'] as const;

/** Banner image for a creator card (explicit path or /images/creators/{slug}.*). */
export function resolveCreatorBanner(slug: string, explicit?: string): string | null {
  if (explicit?.startsWith('http://') || explicit?.startsWith('https://')) {
    return explicit;
  }

  if (explicit) {
    const normalized = explicit.startsWith('/') ? explicit : `/${explicit}`;
    const onDisk = path.join(process.cwd(), 'public', normalized.replace(/^\//, ''));
    if (fs.existsSync(onDisk)) return normalized;
  }

  for (const ext of EXTENSIONS) {
    const rel = `/images/creators/${slug}.${ext}`;
    if (fs.existsSync(path.join(CREATORS_DIR, `${slug}.${ext}`))) return rel;
  }

  return null;
}

import fs from 'node:fs';
import path from 'node:path';
import type { Locale } from '../i18n/config';
import type { Wallpaper } from '../types';

const ROOT = process.cwd();

export const PAYPAL_DONATE_URL = 'https://paypal.me/giggiargento';

const imagePattern = /\.(png|jpe?g|webp|avif)$/i;

const timestampPattern = /^(\d{2})_(\d{2})_(\d{2})_(\d{2})_(\d{2})_(\d{2})/;

function parseWallpaperTimestamp(filename: string): number {
  const match = filename.match(timestampPattern);
  if (!match) return 0;
  const [, yy, mm, dd, hh, min, sec] = match;
  return new Date(
    2000 + Number(yy),
    Number(mm) - 1,
    Number(dd),
    Number(hh),
    Number(min),
    Number(sec),
  ).getTime();
}

function formatWallpaperTitle(filename: string, locale: Locale): string {
  const match = filename.match(timestampPattern);
  if (!match) return filename.replace(/\.[^.]+$/, '');

  const [, yy, mm, dd, hh, min] = match;
  const date = new Date(2000 + Number(yy), Number(mm) - 1, Number(dd), Number(hh), Number(min));
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function downloadFilename(gameSlug: string, file: string): string {
  const base = file.replace(/\.[^.]+$/, '');
  const ext = path.extname(file) || '.png';
  return `mochileaf-${gameSlug}-wallpaper-${base}${ext}`;
}

export function getWallpapersByGame(gameSlug: string, locale: Locale = 'en'): Wallpaper[] {
  const dir = path.join(ROOT, 'public', 'images', 'games', gameSlug, 'wallpapers');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => imagePattern.test(file))
    .sort((a, b) => parseWallpaperTimestamp(b) - parseWallpaperTimestamp(a))
    .map((file) => {
      const publicPath = `/images/games/${gameSlug}/wallpapers/${file}`;
      return {
        slug: file.replace(/\.[^.]+$/, ''),
        title: formatWallpaperTitle(file, locale),
        gameSlug,
        image: publicPath,
        downloadUrl: publicPath,
        downloadFilename: downloadFilename(gameSlug, file),
      };
    });
}

export function gameHasWallpapers(gameSlug: string): boolean {
  return getWallpapersByGame(gameSlug).length > 0;
}

/** i18n keys under page.* for wallpapers copy per game hub. */
export function getWallpaperPageCopyKeys(gameSlug: string): {
  description: string;
  meta: string;
  footer: string;
} {
  if (gameSlug === 'animal-crossing-new-horizons') {
    return {
      description: 'wallpapers.descriptionAcnh',
      meta: 'wallpapers.metaAcnh',
      footer: 'wallpapers.footerAcnh',
    };
  }
  return {
    description: 'wallpapers.description',
    meta: 'wallpapers.meta',
    footer: 'wallpapers.footer',
  };
}

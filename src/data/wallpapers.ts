import fs from 'node:fs';
import path from 'node:path';
import type { Locale } from '../i18n/config';
import type { Wallpaper } from '../types';

const ROOT = process.cwd();

export const PAYPAL_DONATE_URL = 'https://paypal.me/giggiargento';

const gamesWithWallpapers = new Set(['neverness-to-everness']);

const imagePattern = /\.(png|jpe?g|webp|avif)$/i;

function formatWallpaperTitle(filename: string, locale: Locale): string {
  const match = filename.match(/^(\d{2})_(\d{2})_(\d{2})_/);
  if (!match) return filename.replace(/\.[^.]+$/, '');
  const [, yy, mm, dd] = match;
  const date = new Date(2000 + Number(yy), Number(mm) - 1, Number(dd));
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function downloadFilename(gameSlug: string, file: string): string {
  const base = file.replace(/\.[^.]+$/, '');
  const ext = path.extname(file) || '.png';
  return `mochileaf-${gameSlug}-wallpaper-${base}${ext}`;
}

export function getWallpapersByGame(gameSlug: string, locale: Locale = 'en'): Wallpaper[] {
  if (!gamesWithWallpapers.has(gameSlug)) return [];

  const dir = path.join(ROOT, 'public', 'images', 'games', gameSlug, 'wallpapers');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => imagePattern.test(file))
    .sort()
    .reverse()
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

/**
 * Keeps vercel.json redirects in sync with astro.config legacy routes + article canonical URLs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLegacyArticleRedirects } from './lib/article-redirects.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERCEL_JSON = path.join(ROOT, 'vercel.json');

const HEADERS = [
  {
    source: '/ads.txt',
    headers: [
      { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
      { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
    ],
  },
];

const STATIC_REDIRECTS = [
  { source: '/es', destination: '/' },
  { source: '/es/', destination: '/' },
  { source: '/es/:path*', destination: '/:path*' },
  { source: '/stardew-haven', destination: '/stardew-valley' },
  { source: '/stardew-haven/:path*', destination: '/stardew-valley/:path*' },
  { source: '/nte', destination: '/neverness-to-everness' },
  { source: '/nte/:path*', destination: '/neverness-to-everness/:path*' },
  { source: '/neverness-to-everness/tier-list', destination: '/neverness-to-everness' },
  { source: '/neverness-to-everness/tier-list/', destination: '/neverness-to-everness/' },
  { source: '/acnh', destination: '/animal-crossing-new-horizons' },
  { source: '/acnh/:path*', destination: '/animal-crossing-new-horizons/:path*' },
  {
    source: '/neverness-to-everness/news/nte-1-1-is-live-sunward-lacrimosa',
    destination: '/neverness-to-everness/news/nte-bagel-sns-whats-baking/',
  },
  {
    source: '/neverness-to-everness/news/nte-1-1-is-live-sunward-lacrimosa/',
    destination: '/neverness-to-everness/news/nte-bagel-sns-whats-baking/',
  },
  {
    source: '/articles/nte-1-1-is-live-sunward-lacrimosa',
    destination: '/neverness-to-everness/news/nte-bagel-sns-whats-baking/',
  },
  {
    source: '/articles/nte-1-1-is-live-sunward-lacrimosa/',
    destination: '/neverness-to-everness/news/nte-bagel-sns-whats-baking/',
  },
  { source: '/whisperwood', destination: '/games' },
  { source: '/whisperwood/:path*', destination: '/games' },
  { source: '/moonlit-tides', destination: '/games' },
  { source: '/moonlit-tides/:path*', destination: '/games' },
];

function toVercelRedirect(source, destination) {
  return { source, destination, permanent: true };
}

const articleRedirects = Object.entries(buildLegacyArticleRedirects()).map(([source, rule]) =>
  toVercelRedirect(source, rule.destination),
);

const redirects = [
  ...STATIC_REDIRECTS.map((r) => toVercelRedirect(r.source, r.destination)),
  ...articleRedirects,
];

fs.writeFileSync(VERCEL_JSON, `${JSON.stringify({ headers: HEADERS, redirects }, null, 2)}\n`, 'utf8');
console.log(`[redirects] Wrote ${redirects.length} rule(s) to vercel.json`);

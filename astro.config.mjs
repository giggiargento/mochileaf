// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

/** Legacy slug → Stardew Valley (explicit paths for static redirect validation). */
const stardewLegacyRedirects = Object.fromEntries(
  [
    '/stardew-haven',
    '/stardew-haven/characters',
    '/stardew-haven/characters/pierre',
    '/stardew-haven/characters/robin',
    '/stardew-haven/characters/abigail',
    '/stardew-haven/characters/sebastian',
    '/stardew-haven/characters/lewis',
    '/stardew-haven/characters/emily',
    '/stardew-haven/characters/linus',
    '/stardew-haven/builds',
    '/stardew-haven/mods',
    '/stardew-haven/guides',
    '/stardew-haven/news',
    '/stardew-haven/search',
    '/stardew-haven/about',
    '/stardew-haven/tier-list',
  ].map((from) => [
    from,
    { status: 301, destination: from.replace('/stardew-haven', '/stardew-valley') },
  ]),
);

const nteShortRedirects = {
  '/nte': { status: 301, destination: '/neverness-to-everness' },
  '/nte/characters': { status: 301, destination: '/neverness-to-everness/characters' },
  '/nte/teams': { status: 301, destination: '/neverness-to-everness/teams' },
  '/nte/tier-list': { status: 301, destination: '/neverness-to-everness/tier-list' },
  '/nte/guides': { status: 301, destination: '/neverness-to-everness/guides' },
  '/nte/news': { status: 301, destination: '/neverness-to-everness/news' },
  '/nte/about': { status: 301, destination: '/neverness-to-everness/about' },
  '/nte/search': { status: 301, destination: '/neverness-to-everness/search' },
};

const acnhShortRedirects = {
  '/acnh': { status: 301, destination: '/animal-crossing-new-horizons' },
  '/acnh/characters': { status: 301, destination: '/animal-crossing-new-horizons/characters' },
  '/acnh/houses': { status: 301, destination: '/animal-crossing-new-horizons/houses' },
  '/acnh/items': { status: 301, destination: '/animal-crossing-new-horizons/items' },
  '/acnh/island-tours': { status: 301, destination: '/animal-crossing-new-horizons/island-tours' },
  '/acnh/guides': { status: 301, destination: '/animal-crossing-new-horizons/guides' },
  '/acnh/about': { status: 301, destination: '/animal-crossing-new-horizons/about' },
};

const removedGameRedirects = {
  '/whisperwood': { status: 301, destination: '/games' },
  '/moonlit-tides': { status: 301, destination: '/games' },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://mochileaf.com',
  redirects: {
    ...stardewLegacyRedirects,
    ...nteShortRedirects,
    ...acnhShortRedirects,
    ...removedGameRedirects,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

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

// https://astro.build/config
export default defineConfig({
  site: 'https://mochileaf.com',
  redirects: stardewLegacyRedirects,
  vite: {
    plugins: [tailwindcss()],
  },
});

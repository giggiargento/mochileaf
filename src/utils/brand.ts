import fs from 'node:fs';
import path from 'node:path';

const BRAND_DIR = path.join(process.cwd(), 'public', 'brand');

function brandFile(...names: string[]): string | null {
  for (const name of names) {
    const base = path.join(BRAND_DIR, name);
    for (const ext of ['.svg', '.png', '.webp']) {
      if (fs.existsSync(`${base}${ext}`)) return `/brand/${name}${ext}`;
    }
  }
  return null;
}

/** Icon + wordmark lockup (sidebar, footer) */
export const brandIsologo = brandFile('isologo');

/** Text-only or horizontal wordmark */
export const brandLogotipo = brandFile('logotipo', 'logo');

/** Full wordmark — legacy alias */
export const brandLogo = brandLogotipo ?? brandIsologo;
export const brandLogoDark = brandFile('logo-dark', 'logotipo-dark', 'isologo-dark');

/** Square mark (mobile header) */
export const brandIcon = brandFile('logo-icon-small', 'logo-icon');
export const brandIconDark = brandFile('logo-icon-dark', 'logo-icon-small-dark');

export const hasBrandIsologo = Boolean(brandIsologo);
export const hasBrandLogotipo = Boolean(brandLogotipo);
export const hasBrandLogo = Boolean(brandLogo);
export const hasBrandIcon = Boolean(brandIcon);

export const brandFavicon = brandFile('favicon');

/** Accessible / SEO label for brand images */
export const brandAlt = 'Mochileaf — cozy gaming guides and walkthroughs';

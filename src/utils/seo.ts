import type { AstroGlobal } from 'astro';
import { brandAlt, brandOgImage } from './brand';

export interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
}

export const SITE_NAME = 'Mochileaf';
export const SITE_URL = 'https://mochileaf.com';

export const DEFAULT_DESCRIPTION =
  'A warm, elegant cozy gaming platform — guides, builds, and stories inspired by soft fantasy and peaceful play.';

export function formatTitle(title: string): string {
  return title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`;
}

export function getDescription(description?: string): string {
  return description ?? DEFAULT_DESCRIPTION;
}

/** Absolute URL for canonical, Open Graph, and JSON-LD. */
export function resolveSiteUrl(
  site: URL | string | undefined,
  pathname: string = '/',
): string {
  const base = site ? new URL(site) : new URL(SITE_URL);
  return new URL(pathname, base).href;
}

export function resolveCanonicalUrl(
  astro: Pick<AstroGlobal, 'url' | 'site'>,
  override?: string,
): string {
  if (override) {
    return override.startsWith('http') ? override : resolveSiteUrl(astro.site, override);
  }
  return resolveSiteUrl(astro.site, astro.url.pathname);
}

export function resolveOgImageUrl(
  astro: Pick<AstroGlobal, 'site'>,
  imagePath?: string,
): string {
  const path = imagePath ?? brandOgImage;
  if (path.startsWith('http')) return path;
  return resolveSiteUrl(astro.site, path);
}

export function buildWebsiteJsonLd(astro: Pick<AstroGlobal, 'site'>) {
  const url = resolveSiteUrl(astro.site, '/');
  const logo = resolveOgImageUrl(astro);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': `${url}#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${url}#organization`,
        name: SITE_NAME,
        url,
        logo: {
          '@type': 'ImageObject',
          url: logo,
        },
      },
    ],
  };
}

export { brandAlt, brandOgImage };

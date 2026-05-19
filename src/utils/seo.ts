export interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
}

const SITE_NAME = 'Mochileaf';
const DEFAULT_DESCRIPTION =
  'A warm, elegant cozy gaming platform — guides, builds, and stories inspired by soft fantasy and peaceful play.';

export function formatTitle(title: string): string {
  return title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`;
}

export function getDescription(description?: string): string {
  return description ?? DEFAULT_DESCRIPTION;
}

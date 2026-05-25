/**
 * AdSense units from Google AdSense → Ads → By ad unit.
 * Env vars override these defaults (see src/utils/ads.ts).
 */
export const ADSENSE_CLIENT = 'ca-pub-5260522875952685';

/** Wide units — home / hub body, footer. */
export const ADSENSE_SLOT_HORIZONTAL = '4007135134';

/**
 * Sidebar slot — must differ from horizontal or sidebar stays a placeholder.
 * Create a second unit in AdSense, then set PUBLIC_ADSENSE_SLOT_SIDEBAR.
 */
export const ADSENSE_SLOT_SQUARE = '4007135134';

import {
  ADSENSE_CLIENT as DEFAULT_CLIENT,
  ADSENSE_SLOT_HORIZONTAL,
  ADSENSE_SLOT_SQUARE,
} from '../data/adsense';

export type AdPlacement = 'banner' | 'sidebar' | 'inline' | 'footer';

const envClient = import.meta.env.PUBLIC_ADSENSE_CLIENT?.trim();

const slotByPlacement: Record<AdPlacement, string | undefined> = {
  banner: import.meta.env.PUBLIC_ADSENSE_SLOT_BANNER?.trim() || ADSENSE_SLOT_HORIZONTAL,
  inline: import.meta.env.PUBLIC_ADSENSE_SLOT_INLINE?.trim() || ADSENSE_SLOT_HORIZONTAL,
  footer: import.meta.env.PUBLIC_ADSENSE_SLOT_FOOTER?.trim() || ADSENSE_SLOT_HORIZONTAL,
  sidebar: import.meta.env.PUBLIC_ADSENSE_SLOT_SIDEBAR?.trim() || ADSENSE_SLOT_SQUARE,
};

/** Google AdSense publisher ID (ca-pub-…). */
export function getAdSenseClient(): string | undefined {
  return envClient || DEFAULT_CLIENT;
}

export function getAdSlot(placement: AdPlacement): string | undefined {
  return (
    slotByPlacement[placement] ||
    import.meta.env.PUBLIC_ADSENSE_SLOT_DEFAULT?.trim() ||
    undefined
  );
}

export function isAdSenseConfigured(): boolean {
  return Boolean(getAdSenseClient() && getAdSlot('inline'));
}

/** Same numeric slot as inline — do not request as a rectangle (causes 400s). */
function sidebarUsesDedicatedSlot(): boolean {
  const sidebar = getAdSlot('sidebar');
  const inline = getAdSlot('inline');
  return Boolean(sidebar && inline && sidebar !== inline);
}

export function hasManualAdUnit(placement: AdPlacement): boolean {
  if (!isAdSenseConfigured() || !getAdSlot(placement)) return false;
  if (placement === 'sidebar' && !sidebarUsesDedicatedSlot()) return false;
  return true;
}

/** Allowed production hostnames (comma-separated in PUBLIC_ADSENSE_ALLOWED_HOSTS). */
export function getAdSenseAllowedHosts(): string[] {
  const raw =
    import.meta.env.PUBLIC_ADSENSE_ALLOWED_HOSTS?.trim() ||
    'mochileaf.com,www.mochileaf.com';
  return raw.split(',').map((h) => h.trim()).filter(Boolean);
}

export function allowAdSenseOnLocalhost(): boolean {
  return import.meta.env.PUBLIC_ADSENSE_ALLOW_LOCALHOST === 'true';
}

/** Render real units in build; skip in `astro dev` and on disallowed hosts (client). */
export function shouldRenderAdUnits(): boolean {
  return isAdSenseConfigured() && !import.meta.env.DEV;
}

/** ins attributes per layout — horizontal body vs square sidebar. */
export function getAdUnitAttrs(placement: AdPlacement): {
  format: string;
  fullWidthResponsive: boolean;
} {
  return { format: 'auto', fullWidthResponsive: true };
}

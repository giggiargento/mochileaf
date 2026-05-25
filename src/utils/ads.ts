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

export function hasManualAdUnit(placement: AdPlacement): boolean {
  return isAdSenseConfigured() && Boolean(getAdSlot(placement));
}

/** ins attributes per layout — horizontal body vs square sidebar. */
export function getAdUnitAttrs(placement: AdPlacement): {
  format: string;
  fullWidthResponsive: boolean;
} {
  if (placement === 'sidebar') {
    return { format: 'rectangle', fullWidthResponsive: false };
  }
  return { format: 'auto', fullWidthResponsive: true };
}

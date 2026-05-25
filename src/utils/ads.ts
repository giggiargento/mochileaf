export type AdPlacement = 'banner' | 'sidebar' | 'inline' | 'footer';

const client = import.meta.env.PUBLIC_ADSENSE_CLIENT?.trim();

const slotByPlacement: Record<AdPlacement, string | undefined> = {
  banner: import.meta.env.PUBLIC_ADSENSE_SLOT_BANNER?.trim(),
  sidebar: import.meta.env.PUBLIC_ADSENSE_SLOT_SIDEBAR?.trim(),
  inline: import.meta.env.PUBLIC_ADSENSE_SLOT_INLINE?.trim(),
  footer: import.meta.env.PUBLIC_ADSENSE_SLOT_FOOTER?.trim(),
};

/** Google AdSense publisher ID (ca-pub-…). */
export function getAdSenseClient(): string | undefined {
  return client || undefined;
}

export function getAdSlot(placement: AdPlacement): string | undefined {
  return slotByPlacement[placement] || import.meta.env.PUBLIC_ADSENSE_SLOT_DEFAULT?.trim() || undefined;
}

export function isAdSenseConfigured(): boolean {
  return Boolean(getAdSenseClient());
}

export function hasManualAdUnit(placement: AdPlacement): boolean {
  return isAdSenseConfigured() && Boolean(getAdSlot(placement));
}

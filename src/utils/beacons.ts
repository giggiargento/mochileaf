/** Creator link-in-bio + email list (Beacons). */
export const BEACONS_PROFILE = 'https://beacons.ai/giggiland';

export type BeaconsSubscribeOptions = {
  /** Optional hash, e.g. block id from Beacons editor (inspect live page). */
  hash?: string;
  utmSource?: string;
  utmMedium?: string;
};

/** Newsletter / subscribe links from Mochileaf → Beacons audience form. */
export function beaconsSubscribeUrl(options: BeaconsSubscribeOptions = {}): string {
  const {
    hash,
    utmSource = 'mochileaf',
    utmMedium = 'newsletter',
  } = options;
  const url = new URL(BEACONS_PROFILE);
  url.searchParams.set('utm_source', utmSource);
  url.searchParams.set('utm_medium', utmMedium);
  if (hash) url.hash = hash.replace(/^#/, '');
  return url.toString();
}

/** Default outbound subscribe URL (UTM only; scroll is handled on /subscribe). */
export const BEACONS_SUBSCRIBE_URL = beaconsSubscribeUrl();

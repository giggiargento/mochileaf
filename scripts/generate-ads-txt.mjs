/**
 * Writes public/ads.txt from src/data/adsense.ts (single source of truth).
 * Required at https://mochileaf.com/ads.txt for Google AdSense authorization.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ADSENSE_TS = path.join(ROOT, 'src', 'data', 'adsense.ts');
const OUT = path.join(ROOT, 'public', 'ads.txt');

/** Google’s standard certification authority ID for AdSense publishers. */
const GOOGLE_ADS_CERT = 'f08c47fec0942fa0';

const source = fs.readFileSync(ADSENSE_TS, 'utf8');
const match = source.match(/ADSENSE_CLIENT\s*=\s*['"]([^'"]+)['"]/);
if (!match) {
  console.error('generate-ads-txt: ADSENSE_CLIENT not found in src/data/adsense.ts');
  process.exit(1);
}

const client = match[1].trim();
const publisherId = client.startsWith('ca-pub-') ? client.replace(/^ca-pub-/, 'pub-') : client;

const contents = `google.com, ${publisherId}, DIRECT, ${GOOGLE_ADS_CERT}\n`;
fs.writeFileSync(OUT, contents, 'utf8');
console.log(`generate-ads-txt: wrote ${path.relative(ROOT, OUT)} (${publisherId})`);

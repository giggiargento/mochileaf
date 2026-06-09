/**
 * Checks that production serves ads.txt with the expected publisher line.
 * Usage: npm run ads:verify
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = (process.env.SITE_URL || 'https://mochileaf.com').replace(/\/$/, '');
const expected = fs.readFileSync(path.join(process.cwd(), 'public', 'ads.txt'), 'utf8').trim();

const res = await fetch(`${SITE}/ads.txt`, {
  headers: { 'User-Agent': 'Mochileaf-ads-txt-verify/1.0' },
});

if (!res.ok) {
  console.error(`ads:verify — ${SITE}/ads.txt returned ${res.status}`);
  process.exit(1);
}

const body = (await res.text()).trim();
const type = res.headers.get('content-type') || '';

if (body !== expected) {
  console.error('ads:verify — content mismatch');
  console.error('  expected:', expected);
  console.error('  got:     ', body);
  process.exit(1);
}

if (!type.includes('text/plain')) {
  console.warn(`ads:verify — warning: Content-Type is "${type}" (expected text/plain)`);
}

console.log(`ads:verify — OK ${SITE}/ads.txt`);

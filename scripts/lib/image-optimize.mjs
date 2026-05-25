import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Resize to square WebP (contain, transparent background for icons).
 * @param {Buffer} input
 * @param {string} dest
 * @param {number} size
 */
export async function writeSquareWebp(input, dest, size) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(input)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 82, effort: 4 })
    .toFile(dest);
}

/**
 * @param {string} url
 * @param {Record<string, string>} [headers]
 */
export async function fetchImageBuffer(url, headers = {}) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mochileaf/1.0 (fan site; image optimize)', ...headers },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 100) throw new Error('empty image');
  return buf;
}

/**
 * @template T
 * @param {T[]} items
 * @param {number} concurrency
 * @param {(item: T, index: number) => Promise<void>} worker
 */
export async function mapPool(items, concurrency, worker) {
  let index = 0;
  async function run() {
    while (index < items.length) {
      const i = index++;
      await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
}

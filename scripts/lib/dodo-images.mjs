/** dodo.ac / Nookipedia icon URL helpers (MediaWiki thumb layout). */

/**
 * Full-size icon, e.g. https://dodo.ac/np/images/5/59/Foo_NH_Icon.png
 * @param {string} url
 */
export function toFullDodoIcon(url) {
  if (!url?.includes('dodo.ac/np/images/')) return url;
  if (url.startsWith('/images/')) return url;

  // Broken rewrite: .../thumb/5/59/128px-Foo.png
  const broken = url.match(
    /dodo\.ac\/np\/images\/thumb\/([0-9a-f]\/[0-9a-f]+)\/\d+px-(.+\.png)$/i,
  );
  if (broken) {
    return `https://dodo.ac/np/images/${broken[1]}/${broken[2]}`;
  }

  if (!url.includes('/thumb/')) return url;

  // Valid thumb: .../thumb/5/59/Foo.png/64px-Foo.png → full icon
  const valid = url.match(
    /dodo\.ac\/np\/images\/thumb\/(.+\.png)\/\d+px-.+\.png$/i,
  );
  if (valid) {
    return `https://dodo.ac/np/images/${valid[1]}`;
  }

  return url;
}

/**
 * 64px thumb (MediaWiki path). Falls back to full icon if path cannot be built.
 * @param {string} fullUrl
 * @param {number} [px]
 */
export function toDodoThumb(fullUrl, px = 64) {
  const full = toFullDodoIcon(fullUrl);
  if (!full?.includes('dodo.ac/np/images/') || full.includes('/thumb/')) return full;
  const m = full.match(/dodo\.ac\/np\/images\/(.+\.png)$/i);
  if (!m) return full;
  const rel = m[1];
  const filename = rel.split('/').pop();
  return `https://dodo.ac/np/images/thumb/${rel}/${px}px-${filename}`;
}

/**
 * Best URL for 64px cards: srcset 64px thumb, else full icon (never guess wrong thumb path).
 * @param {string} imageCellHtml
 */
export function pickImageUrlFromWikiCell(imageCellHtml) {
  const srcset = imageCellHtml.match(/srcset="([^"]+)"/)?.[1];
  if (srcset) {
    const candidates = srcset.split(',').map((part) => part.trim().split(/\s+/)[0]);
    const thumb64 = candidates.find((url) => /\/64px-/.test(url));
    if (thumb64) return thumb64;
    const full = candidates.find((url) => url && !url.includes('/thumb/'));
    if (full) return full;
  }
  const direct = imageCellHtml.match(
    /https:\/\/dodo\.ac\/np\/images\/[0-9a-f]\/[0-9a-f]+\/[^"'\s]+\.png/g,
  );
  if (direct?.[0]) return direct[0];
  const src = imageCellHtml.match(/src="(https:\/\/dodo\.ac\/[^"]+)"/)?.[1];
  return src ? toFullDodoIcon(src) : '';
}

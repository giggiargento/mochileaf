/** Decode Nookipedia HTML entities and tidy catalog price/source strings. */

const ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

export function decodeCatalogHtml(value: string | undefined | null): string {
  if (!value) return '';
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/&[a-z]+;/gi, (entity) => ENTITY_MAP[entity.toLowerCase()] ?? entity)
    .replace(/\s+/g, ' ')
    .trim();
}

/** "&#160;3,750 Bells" → "3,750 Bells" · "150 Hotel Tickets" → "150 Hotel Tickets" */
export function formatCatalogPrice(value: string | undefined | null): string | undefined {
  const text = decodeCatalogHtml(value);
  if (!text || text === '—') return undefined;
  const withoutNotForSale = text.replace(/^not for sale\s*[-–—]?\s*/i, '').trim();
  return withoutNotForSale || undefined;
}

export function formatCatalogSource(value: string | undefined | null): string | undefined {
  const text = decodeCatalogHtml(value);
  if (!text || text === '—') return undefined;
  return text.replace(/^,\s*|,\s*$/g, '').trim() || undefined;
}

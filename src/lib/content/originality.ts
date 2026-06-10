/** Detect wiki-import boilerplate that must not ship as public prose. */

const WIKI_PROSE_PATTERNS: RegExp[] = [
  /\bAs an? (lazy|peppy|jock|smug|cranky|snooty|normal|big sister) villager\b/i,
  /\bfirst appeared in\b/i,
  /\bIn,\s+\w+ goes to sleep at\b/i,
  /\bDuring conversations with other villagers\b/i,
  /\bwill appear uptown, classy, and chic\b/i,
  /\bself-proclaimed bookworm\b/i,
  /\bChrissy in\.\s*\n/i,
  /\bArtwork of\b/i,
  /\bthumb\|/i,
  /\b''\s*''/,
];

export function hasWikiBoilerplate(text: string | undefined): boolean {
  if (!text?.trim()) return false;
  return WIKI_PROSE_PATTERNS.some((re) => re.test(text));
}

export function lintAcnhProse(character: {
  slug: string;
  gameSlug: string;
  acnh?: {
    appearance?: string;
    personality?: string;
    proseStatus?: string;
    sourceUrl?: string;
  };
  draft?: boolean;
  publishable?: boolean;
}): string[] {
  const issues: string[] = [];
  const acnh = character.acnh;
  if (!acnh || character.gameSlug !== 'animal-crossing-new-horizons') return issues;

  const hasProse = Boolean(acnh.appearance?.trim() || acnh.personality?.trim());
  if (!hasProse) return issues;

  if (character.draft === true || character.publishable === false) return issues;

  if (acnh.proseStatus !== 'original') {
    issues.push(
      `[characters] ${character.slug}: acnh.appearance/personality require acnh.proseStatus "original"`,
    );
  }

  for (const field of ['appearance', 'personality'] as const) {
    const value = acnh[field];
    if (value && hasWikiBoilerplate(value)) {
      issues.push(
        `[characters] ${character.slug}: acnh.${field} still contains wiki boilerplate — rewrite in original voice`,
      );
    }
  }

  return issues;
}

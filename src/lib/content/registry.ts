import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import {
  characterSchema,
  getRoutableCharacters,
  type CharacterContent,
} from '../../content/schemas/character';
import { gameSchema, isPublishableGame, type GameContent } from '../../content/schemas/game';
import {
  guideDefaultsSchema,
  guideSchema,
  isPublishableGuide,
  type GuideContent,
  type GuideDefaultsContent,
} from '../../content/schemas/guide';
import { collectTodoStrings } from './todo-report';

export class ContentValidationError extends Error {
  constructor(
    readonly collection: string,
    readonly file: string,
    readonly cause: ZodError,
  ) {
    super(`[${collection}] ${file}\n${cause.message}`);
    this.name = 'ContentValidationError';
  }
}

function fileId(path: string): string {
  return path.split('/').pop()!.replace(/\.json$/, '');
}

function parseJsonModules<T>(
  collection: string,
  modules: Record<string, { default: unknown }>,
  schema: ZodSchema<T>,
  assertId?: (data: T, id: string) => void,
): T[] {
  const items: T[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    const id = fileId(path);
    const result = schema.safeParse(mod.default);
    if (!result.success) {
      throw new ContentValidationError(collection, id, result.error);
    }
    if (assertId) assertId(result.data, id);
    items.push(result.data);
  }
  return items;
}

const gameModules = import.meta.glob<{ default: unknown }>(
  '../../content/games/*.json',
  { eager: true },
);
const characterModules = import.meta.glob<{ default: unknown }>(
  '../../content/characters/*.json',
  { eager: true },
);
const guideModules = import.meta.glob<{ default: unknown }>(
  '../../content/guides/*.json',
  { eager: true },
);
const guideDefaultModules = import.meta.glob<{ default: unknown }>(
  '../../content/guides/_defaults/*.json',
  { eager: true },
);

export const allGames = parseJsonModules('games', gameModules, gameSchema, (game, id) => {
  if (game.slug !== id) {
    throw new Error(`[games] ${id}.json: slug "${game.slug}" must match filename`);
  }
});

export const allCharacters = parseJsonModules(
  'characters',
  characterModules,
  characterSchema,
  (character, id) => {
    if (character.slug !== id) {
      throw new Error(`[characters] ${id}.json: slug "${character.slug}" must match filename`);
    }
  },
);

export const allGuides = parseJsonModules('guides', guideModules, guideSchema, (guide, id) => {
  if (guide.characterSlug !== id) {
    throw new Error(
      `[guides] ${id}.json: characterSlug "${guide.characterSlug}" must match filename`,
    );
  }
});

export const guideDefaults: GuideDefaultsContent[] = parseJsonModules(
  'guideDefaults',
  guideDefaultModules,
  guideDefaultsSchema,
);

const activeGameSlugs = new Set(
  allGames.filter((g) => g.status === 'active').map((g) => g.slug),
);

export const routableGames = allGames.filter(
  (g) => g.status === 'active' && isPublishableGame(g),
);

export const routableCharacters = getRoutableCharacters(allCharacters, allGames);

const routableCharacterSlugs = new Set(routableCharacters.map((c) => c.slug));

export const routableGuides = allGuides.filter((g) =>
  isPublishableGuide(g, routableCharacterSlugs),
);

export function getGame(slug: string): GameContent | undefined {
  return allGames.find((g) => g.slug === slug);
}

export function getCharacter(gameSlug: string, slug: string): CharacterContent | undefined {
  return allCharacters.find((c) => c.gameSlug === gameSlug && c.slug === slug);
}

export function getCharacterBySlug(slug: string): CharacterContent | undefined {
  return allCharacters.find((c) => c.slug === slug);
}

export function getCharactersByGame(gameSlug: string): CharacterContent[] {
  return routableCharacters.filter((c) => c.gameSlug === gameSlug);
}

export function getFeaturedGames(): GameContent[] {
  return routableGames.filter((g) => g.featured);
}

export function getGuideByCharacterSlug(slug: string): GuideContent | undefined {
  return routableGuides.find((g) => g.characterSlug === slug);
}

export function getGuideDefaultsForRole(role: string): GuideDefaultsContent | undefined {
  const file = roleToDefaultFile(role);
  const key = Object.keys(guideDefaultModules).find((k) => fileId(k) === file);
  if (!key) return undefined;
  const result = guideDefaultsSchema.safeParse(guideDefaultModules[key].default);
  return result.success ? result.data : undefined;
}

function roleToDefaultFile(role: string): string {
  const map: Record<string, string> = {
    Attack: 'attack',
    Support: 'support',
    Defense: 'defense',
    Assist: 'assist',
  };
  return map[role] ?? 'assist';
}

/** Non-fatal scan used by content:lint */
export function scanContentTodos(): { collection: string; id: string; field: string; value: string }[] {
  const findings: { collection: string; id: string; field: string; value: string }[] = [];

  for (const game of allGames) {
    findings.push(...collectTodoStrings('games', game.slug, game as Record<string, unknown>));
  }
  for (const character of allCharacters) {
    findings.push(
      ...collectTodoStrings('characters', character.slug, character as Record<string, unknown>),
    );
  }
  for (const guide of allGuides) {
    findings.push(
      ...collectTodoStrings('guides', guide.characterSlug, guide as Record<string, unknown>),
    );
  }

  return findings;
}

export function getUnpublishableSummary(): string[] {
  const lines: string[] = [];
  for (const game of allGames) {
    if (game.status === 'active' && !isPublishableGame(game)) {
      lines.push(`games/${game.slug}.json is active but not publishable`);
    }
  }
  for (const character of allCharacters) {
    if (activeGameSlugs.has(character.gameSlug) && !routableCharacterSlugs.has(character.slug)) {
      lines.push(`characters/${character.slug}.json is not routable`);
    }
  }
  for (const guide of allGuides) {
    if (!routableGuides.some((g) => g.characterSlug === guide.characterSlug)) {
      lines.push(`guides/${guide.characterSlug}.json is not routable`);
    }
  }
  return lines;
}

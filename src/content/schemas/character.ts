import { z } from 'zod';
import {
  displayText,
  isTodoText,
  optionalText,
  relationshipSchema,
  routineSchema,
  seoSchema,
  slugSchema,
  stringListSchema,
} from './shared';

const acnhVillagerInfoSchema = z
  .object({
    birthday: optionalText,
    starSign: optionalText,
    personality: optionalText,
    subPersonality: optionalText,
    catchphrase: optionalText,
    quote: optionalText,
    gender: optionalText,
    defaultClothing: optionalText,
    umbrella: optionalText,
    hobby: optionalText,
    favoriteStyles: z.array(z.string()).optional(),
    favoriteColors: z.array(z.string()).optional(),
    bag: optionalText,
    food: optionalText,
    drink: optionalText,
  })
  .passthrough();

const acnhHouseSchema = z
  .object({
    roof: optionalText,
    siding: optionalText,
    door: optionalText,
    wallpaper: optionalText,
    flooring: optionalText,
    music: optionalText,
    musicNote: optionalText,
    furniture: z.array(z.string()).optional(),
    exteriorImage: optionalText,
    interiorImage: optionalText,
  })
  .passthrough();

export const acnhDetailsSchema = z
  .object({
    intro: optionalText,
    appearance: optionalText,
    personality: optionalText,
    villagerInfo: acnhVillagerInfoSchema.optional(),
    house: acnhHouseSchema.optional(),
    languages: z
      .array(
        z.object({
          language: z.string(),
          name: z.string(),
          romanization: optionalText,
        }),
      )
      .optional(),
    amiibo: z.record(z.unknown()).optional(),
    sourceUrl: optionalText,
  })
  .passthrough()
  .optional();

export const characterSchema = z
  .object({
    slug: slugSchema,
    gameSlug: slugSchema,
    name: z.string().min(1),
    role: z.string().min(1),
    description: z.string().min(1),
    element: z.string().optional(),
    image: z.string().optional(),
    tier: z.enum(['S', 'A', 'B', 'C']).optional(),
    rarity: z.enum(['S', 'A']).optional(),
    popularRank: z.number().int().positive().optional(),
    personality: optionalText,
    species: optionalText,
    houseStyle: optionalText,
    houseDescription: optionalText,
    seo: seoSchema,
    likes: stringListSchema,
    dislikes: stringListSchema,
    favoriteGifts: stringListSchema,
    favoriteFoods: stringListSchema,
    routines: z.array(routineSchema).optional().default([]),
    relationships: z.array(relationshipSchema).optional().default([]),
    trivia: stringListSchema,
    tags: stringListSchema,
    acnh: acnhDetailsSchema,
    draft: z.boolean().optional(),
    publishable: z.boolean().optional(),
  })
  .superRefine((character, ctx) => {
    if (isTodoText(character.description)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'description cannot be a TODO placeholder for publishable characters',
        path: ['description'],
      });
    }
  });

export type CharacterContent = z.infer<typeof characterSchema>;

export function isPublishableCharacter(
  character: CharacterContent,
  knownGameSlugs: ReadonlySet<string>,
): boolean {
  if (character.draft === true) return false;
  if (character.publishable === false) return false;
  if (character.publishable === true) {
    return knownGameSlugs.has(character.gameSlug);
  }
  if (!knownGameSlugs.has(character.gameSlug)) return false;
  if (isTodoText(character.description)) return false;
  return Boolean(displayText(character.seo.title) && displayText(character.seo.description));
}

export function getRoutableCharacters(
  characters: CharacterContent[],
  games: { slug: string; status: string }[],
): CharacterContent[] {
  const activeSlugs = new Set(
    games.filter((g) => g.status === 'active').map((g) => g.slug),
  );
  return characters.filter((c) => isPublishableCharacter(c, activeSlugs));
}

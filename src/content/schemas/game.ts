import { z } from 'zod';
import { displayText, isTodoText, seoSchema, slugSchema, stringListSchema } from './shared';

export const gameSchema = z
  .object({
    slug: slugSchema,
    name: z.string().min(1),
    shortName: z.string().optional(),
    tagline: z.string().min(1),
    description: z.string().min(1),
    accent: z.enum(['sage', 'blossom', 'mist', 'lavender', 'honey']),
    coverGradient: z.string().min(1),
    coverImage: z.string().optional(),
    cardImage: z.string().optional(),
    featured: z.boolean().optional(),
    status: z.enum(['active', 'coming-soon']),
    seo: seoSchema,
    genres: stringListSchema,
    platforms: stringListSchema,
    cozyMechanics: stringListSchema,
    similarGames: stringListSchema,
    beginnerTips: stringListSchema,
    tags: stringListSchema,
    about: z.string().optional(),
    /** Force exclude from static routes even when valid. */
    draft: z.boolean().optional(),
    /** Override auto publishability checks. */
    publishable: z.boolean().optional(),
  })
  .superRefine((game, ctx) => {
    if (isTodoText(game.description)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'description cannot be a TODO placeholder for publishable games',
        path: ['description'],
      });
    }
  });

export type GameContent = z.infer<typeof gameSchema>;

export function isPublishableGame(game: GameContent): boolean {
  if (game.draft === true) return false;
  if (game.publishable === false) return false;
  if (game.publishable === true) return true;
  if (isTodoText(game.description)) return false;
  return Boolean(displayText(game.seo.title) && displayText(game.seo.description));
}

export function getRoutableGames(games: GameContent[]): GameContent[] {
  return games.filter((g) => g.status === 'active' && isPublishableGame(g));
}

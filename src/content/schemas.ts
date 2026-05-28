/**
 * Re-export validated content types and helpers.
 * Zod schemas live in ./schemas/*.ts (shared with Astro collections).
 */
export type { ContentSeo } from './schemas/shared';
export type { GameContent } from './schemas/game';
export type { CharacterContent } from './schemas/character';
export type { GuideContent, GuideDefaultsContent } from './schemas/guide';
export type { ArticleFrontmatter } from './schemas/article';

export {
  displayText,
  displayStringList,
  isTodoText,
  seoSchema,
} from './schemas/shared';

export { gameSchema, isPublishableGame, getRoutableGames } from './schemas/game';
export {
  characterSchema,
  isPublishableCharacter,
  getRoutableCharacters,
} from './schemas/character';
export { guideSchema, guideDefaultsSchema, isPublishableGuide } from './schemas/guide';
export { articleSchema, isPublishableArticle } from './schemas/article';

export type { Article, Character, Game, NteCharacterGuide } from '../types';

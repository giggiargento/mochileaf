import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { articleSchema } from './content/schemas/article';
import { characterSchema } from './content/schemas/character';
import { gameSchema } from './content/schemas/game';
import { guideDefaultsSchema, guideSchema } from './content/schemas/guide';

const games = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/games' }),
  schema: gameSchema,
});

const characters = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/characters' }),
  schema: characterSchema,
});

const guides = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/guides' }),
  schema: guideSchema,
});

const guideDefaults = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/guides/_defaults' }),
  schema: guideDefaultsSchema,
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: articleSchema,
});

export const collections = {
  games,
  characters,
  guides,
  guideDefaults,
  articles,
};

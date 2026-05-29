import { z } from 'zod';
import { displayText, isTodoText, seoSchema, slugSchema } from './shared';

const articleBaseSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: z.enum(['news', 'guide', 'editorial', 'update']),
  gameSlug: slugSchema.optional(),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'publishedAt must be YYYY-MM-DD'),
  readTime: z.string().min(1),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  /** Hero image above the body, e.g. /images/games/{slug}/cover.jpg */
  coverImage: z.string().optional(),
  /** Optional credit line under the hero image */
  coverCaption: z.string().optional(),
  seo: seoSchema,
  draft: z.boolean().optional(),
  publishable: z.boolean().optional(),
});

/** Used by Astro content (JSON schema generation breaks on .superRefine). */
export const articleSchema = articleBaseSchema;

/** Stricter validation for lint scripts. */
export const articleSchemaStrict = articleBaseSchema.superRefine((article, ctx) => {
  if (isTodoText(article.excerpt)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'excerpt cannot be a TODO placeholder',
      path: ['excerpt'],
    });
  }
});

export type ArticleFrontmatter = z.infer<typeof articleSchema>;

export function isPublishableArticle(article: ArticleFrontmatter): boolean {
  if (article.draft === true) return false;
  if (article.publishable === false) return false;
  if (article.publishable === true) return true;
  if (isTodoText(article.excerpt)) return false;
  return Boolean(displayText(article.seo.title) && displayText(article.seo.description));
}

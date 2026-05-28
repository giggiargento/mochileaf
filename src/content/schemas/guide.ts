import { z } from 'zod';
import { displayText, isTodoText, seoSchema, slugSchema } from './shared';

const buildItemSchema = z.object({
  name: z.string().min(1),
  note: z.string().optional(),
  image: z.string().optional(),
});

const skillPrioritySchema = z.object({
  skill: z.string().min(1),
  scales: z.string().min(1),
});

const farmingItemSchema = z.object({
  name: z.string().min(1),
  purpose: z.string().min(1),
  location: z.string().min(1),
  tip: z.string().optional(),
  image: z.string().optional(),
});

const guideBodySchema = z.object({
  buildSummary: z.string().min(1),
  diskSets: z.array(buildItemSchema).min(1),
  modules: z.array(buildItemSchema).min(1),
  skillPriority: z.array(skillPrioritySchema).min(1),
  farming: z.array(farmingItemSchema).min(1),
});

/** Per-character NTE build file (content/guides/{slug}.json). */
export const guideSchema = guideBodySchema.extend({
  characterSlug: slugSchema,
  gameSlug: z.literal('neverness-to-everness'),
  seo: seoSchema,
  draft: z.boolean().optional(),
  publishable: z.boolean().optional(),
});

/** Role defaults (content/guides/_defaults/{role}.json). */
export const guideDefaultsSchema = guideBodySchema;

export type GuideContent = z.infer<typeof guideSchema>;
export type GuideDefaultsContent = z.infer<typeof guideDefaultsSchema>;

export function isPublishableGuide(
  guide: GuideContent,
  knownCharacterSlugs: ReadonlySet<string>,
): boolean {
  if (guide.draft === true) return false;
  if (guide.publishable === false) return false;
  if (!knownCharacterSlugs.has(guide.characterSlug)) return false;
  if (isTodoText(guide.buildSummary)) return false;
  return Boolean(displayText(guide.seo.title) && displayText(guide.seo.description));
}

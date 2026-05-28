import { z } from 'zod';

/** Matches editorial placeholders — excluded from routes and public copy. */
export const TODO_PREFIX = /^TODO:\s*/i;

export function isTodoText(value: string | undefined | null): boolean {
  if (value == null) return false;
  const trimmed = value.trim();
  return trimmed.length === 0 || TODO_PREFIX.test(trimmed);
}

/** Safe string for UI: hides TODO placeholders and empty values. */
export function displayText(
  value: string | undefined | null,
  fallback = '',
): string {
  if (!value || isTodoText(value)) return fallback;
  return value.trim();
}

/** Filter list items that are empty or TODO placeholders. */
export function displayStringList(
  values: string[] | undefined | null,
): string[] {
  return (values ?? []).map((v) => displayText(v)).filter((v) => v.length > 0);
}

export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case');

export const seoSchema = z.object({
  title: z.string().min(1, 'SEO title is required'),
  description: z.string().min(1, 'SEO description is required'),
  image: z.string().optional(),
  keywords: z.array(z.string().min(1)).optional(),
});

export type ContentSeo = z.infer<typeof seoSchema>;

export const optionalText = z.string().optional();

export const stringListSchema = z.array(z.string()).optional().default([]);

export const routineSchema = z.object({
  label: z.string().min(1),
  location: z.string().min(1),
  time: z.string().optional(),
});

export const relationshipSchema = z.object({
  name: z.string().min(1),
  note: z.string().min(1),
});

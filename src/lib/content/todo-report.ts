import { isTodoText } from '../../content/schemas/shared';

const SKIP_KEYS = new Set(['seo', 'acnh', 'slug', 'gameSlug', 'characterSlug']);

export function collectTodoStrings(
  collection: string,
  id: string,
  value: unknown,
  fieldPath = '',
): { collection: string; id: string; field: string; value: string }[] {
  const findings: { collection: string; id: string; field: string; value: string }[] = [];

  if (typeof value === 'string') {
    const key = fieldPath.split('.').pop() ?? fieldPath;
    if (!SKIP_KEYS.has(key) && isTodoText(value)) {
      findings.push({ collection, id, field: fieldPath || key, value });
    }
    return findings;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      findings.push(
        ...collectTodoStrings(collection, id, item, `${fieldPath}[${index}]`),
      );
    });
    return findings;
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (SKIP_KEYS.has(key)) continue;
      const path = fieldPath ? `${fieldPath}.${key}` : key;
      findings.push(...collectTodoStrings(collection, id, nested, path));
    }
  }

  return findings;
}

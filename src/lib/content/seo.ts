import type { ContentSeo } from '../../content/schemas/shared';
import { displayText } from '../../content/schemas/shared';

export function resolveContentSeo(
  seo: ContentSeo | undefined,
  fallback: { title: string; description: string; image?: string },
): { title: string; description: string; image?: string } {
  return {
    title: displayText(seo?.title, fallback.title),
    description: displayText(seo?.description, fallback.description),
    image: seo?.image ?? fallback.image,
  };
}

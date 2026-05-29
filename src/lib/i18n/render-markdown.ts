import { createMarkdownProcessor } from '@astrojs/markdown-remark';

let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null;

/** Render markdown string to HTML (matches Astro article prose). */
export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  processor ??= await createMarkdownProcessor();
  const { code } = await processor.render(markdown);
  return code;
}

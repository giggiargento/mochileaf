# Editorial review exports

Generated Markdown bundles for copy-paste into ChatGPT or shared review.

**Do not edit these files as source of truth** — update `src/content/` and re-run export.

```bash
npm run export:all          # everything
npm run export:characters   # characters-all.md
npm run export:acnh         # acnh-review.md (single file)
npm run export:stardew      # stardew-review.md
npm run export:nte          # nte-review.md
```

Split into separate files (characters, guides, news, …):

```bash
npm run export:game -- nte split
```

Custom game export:

```bash
npm run export:game -- acnh
```

Output includes slug, SEO, tags, body text, and a **TODO fields** section for placeholders.

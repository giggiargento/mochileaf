/**
 * Generates src/i18n/generated/es/** from English content.
 * - DEEPL_API_KEY in .env (preferred)
 * - Or npm run i18n:sync:free — Google Translate web client (no API key, no cost)
 * - MyMemory is only a fallback if Google fails
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'src/content/articles');
const CHARACTERS_DIR = path.join(ROOT, 'src/content/characters');
const GUIDES_DIR = path.join(ROOT, 'src/content/guides');
const GAMES_DIR = path.join(ROOT, 'src/content/games');
const OUT_ES = path.join(ROOT, 'src/i18n/generated/es');
const deeplKey = process.env.DEEPL_API_KEY?.trim();
const useFreeTranslate =
  process.argv.includes('--mymemory') ||
  process.argv.includes('--free') ||
  process.env.I18N_USE_MYMEMORY === '1' ||
  process.env.I18N_USE_MYMEMORY === 'true';
const myMemoryEmail = process.env.MYMEMORY_EMAIL?.trim();
const BATCH_DELAY_MS = useFreeTranslate ? 650 : 350;
const resume = process.argv.includes('--resume');
const only = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function splitMarkdown(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  return { frontmatter: parseYaml(match[1]), body: match[2].trim() };
}

async function translateDeepL(text, apiKey) {
  const params = new URLSearchParams({
    text,
    target_lang: 'ES',
    source_lang: 'EN',
  });
  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.translations[0].text;
}

async function translateGoogleGtx(text) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', 'es');
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text.slice(0, 4500));
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mochileaf-i18n-sync/1.0' },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Google translate ${res.status}`);
  const data = await res.json();
  const parts = data?.[0];
  if (!Array.isArray(parts)) throw new Error('Google translate: unexpected response');
  return parts.map((row) => row?.[0] ?? '').join('');
}

async function translateMyMemory(text) {
  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text.slice(0, 450));
  url.searchParams.set('langpair', 'en|es');
  if (myMemoryEmail) url.searchParams.set('de', myMemoryEmail);
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`MyMemory ${res.status}`);
  const json = await res.json();
  if (json.responseStatus !== 200 || !json.responseData?.translatedText) {
    throw new Error(json.responseDetails || 'MyMemory translation failed');
  }
  return json.responseData.translatedText;
}

async function translateText(text, attempt = 0) {
  if (!text?.trim()) return text;
  try {
    if (deeplKey) return await translateDeepL(text, deeplKey);
    if (useFreeTranslate) {
      try {
        return await translateGoogleGtx(text);
      } catch (googleErr) {
        if (attempt === 0) {
          console.log('    … Google failed, trying MyMemory');
        }
        return await translateMyMemory(text);
      }
    }
    return null;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (attempt < 8 && /429|quota|rate|limit|MYMEMORY|Google/i.test(message)) {
      const wait = Math.min(60_000, 3000 * 2 ** attempt);
      console.log(`    … waiting ${Math.round(wait / 1000)}s (${message.slice(0, 40)})`);
      await sleep(wait);
      return translateText(text, attempt + 1);
    }
    throw err;
  }
}

const CHUNK_SIZE = useFreeTranslate ? 3500 : 420;

async function translateLongString(text) {
  if (!text?.trim()) return text;
  if (text.length <= CHUNK_SIZE) {
    const out = await translateText(text);
    await sleep(BATCH_DELAY_MS);
    return out ?? text;
  }

  const parts = text.split(/(\n\n+)/);
  const out = [];
  for (const part of parts) {
    if (/^\n\n+$/.test(part)) {
      out.push(part);
      continue;
    }
    if (part.length <= CHUNK_SIZE) {
      const tr = await translateText(part);
      await sleep(BATCH_DELAY_MS);
      out.push(tr ?? part);
      continue;
    }
    let buffer = '';
    for (const sentence of part.split(/(?<=[.!?])\s+/)) {
      if (`${buffer}${sentence}`.length > CHUNK_SIZE && buffer) {
        const tr = await translateText(buffer.trim());
        await sleep(BATCH_DELAY_MS);
        out.push(tr ?? buffer.trim());
        buffer = sentence;
      } else {
        buffer = buffer ? `${buffer} ${sentence}` : sentence;
      }
    }
    if (buffer) {
      const tr = await translateText(buffer.trim());
      await sleep(BATCH_DELAY_MS);
      out.push(tr ?? buffer.trim());
    }
  }
  return out.join('');
}

async function translateField(value) {
  if (typeof value === 'string') {
    return translateLongString(value);
  }
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) {
      out.push(typeof item === 'string' ? await translateField(item) : await translateObject(item));
    }
    return out;
  }
  if (value && typeof value === 'object') return translateObject(value);
  return value;
}

async function translateObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (['slug', 'name', 'image', 'gameSlug', 'element', 'popularRank', 'tier', 'rarity'].includes(key)) {
      out[key] = value;
      continue;
    }
    if (
      key.endsWith('Image') ||
      key === 'exteriorImage' ||
      key === 'interiorImage' ||
      key === 'furniture' ||
      key === 'tags' ||
      key === 'likes' ||
      key === 'dislikes' ||
      key === 'catchphrase'
    ) {
      out[key] = value;
      continue;
    }
    out[key] = await translateField(value);
  }
  return out;
}

async function writeJson(dir, slug, data) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${slug}.json`), `${JSON.stringify(data, null, 2)}\n`);
}

function skipExisting(dir, slug) {
  return resume && fs.existsSync(path.join(dir, `${slug}.json`));
}

async function syncArticles() {
  const outDir = path.join(OUT_ES, 'articles');
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'));
  console.log(`Articles: ${files.length}`);

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    if (skipExisting(outDir, slug)) {
      console.log(`  · skip article ${slug}`);
      continue;
    }
    const parsed = splitMarkdown(path.join(ARTICLES_DIR, file));
    if (!parsed) continue;

    const { frontmatter: fm, body } = parsed;
    const out = {};

    if (fm.title) out.title = await translateField(fm.title);
    if (fm.excerpt) out.excerpt = await translateField(fm.excerpt);
    if (fm.coverCaption) out.coverCaption = await translateField(fm.coverCaption);
    if (fm.seo?.title) out.seoTitle = await translateField(fm.seo.title);
    if (fm.seo?.description) out.seoDescription = await translateField(fm.seo.description);
    if (body) out.body = await translateField(body);

    await writeJson(outDir, slug, out);
    console.log(`  ✓ article ${slug}`);
  }
}

/** Fewer API calls for MyMemory — covers what readers see on detail pages. */
async function translateAcnhForFree(acnh) {
  const out = {};
  if (acnh.appearance) out.appearance = await translateField(acnh.appearance);
  if (acnh.personality) out.personality = await translateField(acnh.personality);

  if (acnh.house) {
    out.house = {};
    for (const key of ['roof', 'siding', 'door', 'wallpaper', 'flooring', 'music']) {
      if (acnh.house[key]) out.house[key] = await translateField(acnh.house[key]);
    }
  }

  if (acnh.villagerInfo) {
    const info = acnh.villagerInfo;
    out.villagerInfo = {};
    for (const key of ['gender', 'hobby', 'defaultClothing', 'umbrella', 'bag', 'food', 'drink']) {
      if (info[key]) out.villagerInfo[key] = await translateField(info[key]);
    }
    if (info.favoriteStyles?.length) {
      out.villagerInfo.favoriteStyles = [];
      for (const style of info.favoriteStyles) {
        out.villagerInfo.favoriteStyles.push(await translateField(style));
      }
    }
    if (info.favoriteColors?.length) {
      out.villagerInfo.favoriteColors = [];
      for (const color of info.favoriteColors) {
        out.villagerInfo.favoriteColors.push(await translateField(color));
      }
    }
  }

  return out;
}

async function syncCharacters() {
  const outDir = path.join(OUT_ES, 'characters');
  const files = fs.readdirSync(CHARACTERS_DIR).filter((f) => f.endsWith('.json'));
  console.log(`Characters: ${files.length}${useFreeTranslate ? ' (lite ACNH)' : ''}`);

  for (const file of files) {
    const slug = file.replace(/\.json$/, '');
    if (skipExisting(outDir, slug)) {
      console.log(`  · skip character ${slug}`);
      continue;
    }
    const raw = JSON.parse(fs.readFileSync(path.join(CHARACTERS_DIR, file), 'utf8'));
    const out = {};

    console.log(`  … character ${slug}`);
    if (raw.role) out.role = await translateField(raw.role);
    if (raw.description) out.description = await translateField(raw.description);
    if (raw.houseStyle) out.houseStyle = await translateField(raw.houseStyle);
    if (raw.houseDescription) out.houseDescription = await translateField(raw.houseDescription);
    if (raw.seo?.title) out.seoTitle = await translateField(raw.seo.title);
    if (raw.seo?.description) out.seoDescription = await translateField(raw.seo.description);
    if (raw.acnh) {
      out.acnh = useFreeTranslate ? await translateAcnhForFree(raw.acnh) : await translateObject(raw.acnh);
    }

    await writeJson(outDir, slug, out);
    console.log(`  ✓ character ${slug}`);
  }
}

async function syncGuides() {
  const outDir = path.join(OUT_ES, 'guides');
  const files = fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'));
  console.log(`Guides: ${files.length}`);

  for (const file of files) {
    const slug = file.replace(/\.json$/, '');
    if (skipExisting(outDir, slug)) {
      console.log(`  · skip guide ${slug}`);
      continue;
    }
    const raw = JSON.parse(fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8'));
    const out = await translateObject({
      buildSummary: raw.buildSummary,
      diskSets: raw.diskSets,
      modules: raw.modules,
      skillPriority: raw.skillPriority,
      farming: raw.farming,
    });
    await writeJson(outDir, slug, out);
    console.log(`  ✓ guide ${slug}`);
  }
}

async function syncGames() {
  const outDir = path.join(OUT_ES, 'games');
  const files = fs.readdirSync(GAMES_DIR).filter((f) => f.endsWith('.json'));
  console.log(`Games: ${files.length}`);

  for (const file of files) {
    const slug = file.replace(/\.json$/, '');
    if (skipExisting(outDir, slug)) {
      console.log(`  · skip game ${slug}`);
      continue;
    }
    const raw = JSON.parse(fs.readFileSync(path.join(GAMES_DIR, file), 'utf8'));
    const out = {};
    if (raw.tagline) out.tagline = await translateField(raw.tagline);
    if (raw.description) out.description = await translateField(raw.description);
    if (raw.about) out.about = await translateField(raw.about);
    if (raw.seo?.title) out.seoTitle = await translateField(raw.seo.title);
    if (raw.seo?.description) out.seoDescription = await translateField(raw.seo.description);
    await writeJson(outDir, slug, out);
    console.log(`  ✓ game ${slug}`);
  }
}

async function main() {
  if (!deeplKey && !useFreeTranslate) {
    console.log(
      'i18n:sync — skip (set DEEPL_API_KEY in .env, or npm run i18n:sync:free)',
    );
    process.exit(0);
  }

  const via = deeplKey ? 'DeepL' : 'Google Translate (free, no API key)';
  console.log(`Translating to Spanish via ${via}…`);
  fs.mkdirSync(OUT_ES, { recursive: true });

  if (!only || only === 'games') await syncGames();
  if (!only || only === 'articles') await syncArticles();
  if (!only || only === 'characters') await syncCharacters();
  if (!only || only === 'guides') await syncGuides();

  console.log('Done — overlays in src/i18n/generated/es/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

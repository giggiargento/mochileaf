/**
 * Fetches fresh snippets from the web via Tavily and writes src/data/live/cache.json.
 * Run before build or on a schedule: npm run content:refresh
 *
 * Requires TAVILY_API_KEY in .env (copy from .env.example).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE_PATH = path.join(ROOT, 'src', 'data', 'live', 'cache.json');
const ENV_PATH = path.join(ROOT, '.env');

const QUERIES = [
  {
    gameSlug: 'neverness-to-everness',
    id: 'nte-codes',
    query: 'Neverness to Everness NTE active redeem codes 2026 how to redeem',
    label: 'NTE redeem codes',
  },
  {
    gameSlug: 'neverness-to-everness',
    id: 'nte-meta',
    query: 'Neverness to Everness tier list meta team comps May 2026',
    label: 'NTE meta snapshot',
  },
  {
    gameSlug: 'animal-crossing-new-horizons',
    id: 'acnh-tips',
    query: 'Animal Crossing New Horizons popular villagers May 2026',
    label: 'ACNH community pulse',
  },
];

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return;
  const text = fs.readFileSync(ENV_PATH, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

async function tavilySearch(query, apiKey) {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'basic',
      max_results: 5,
      include_answer: true,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Tavily HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

function normalizeFeed(result, label) {
  const sources = (result.results ?? []).slice(0, 5).map((r) => ({
    title: r.title ?? 'Source',
    url: r.url,
    snippet: (r.content ?? '').slice(0, 280),
  }));
  return {
    label,
    summary: (result.answer ?? sources[0]?.snippet ?? 'No summary returned.').trim(),
    sources,
  };
}

async function main() {
  loadEnv();
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.error('Missing TAVILY_API_KEY. Copy .env.example to .env and add your key from https://tavily.com');
    process.exit(1);
  }

  const feeds = {};

  for (const item of QUERIES) {
    console.log(`Searching: ${item.label}…`);
    try {
      const result = await tavilySearch(item.query, apiKey);
      if (!feeds[item.gameSlug]) feeds[item.gameSlug] = {};
      feeds[item.gameSlug][item.id] = normalizeFeed(result, item.label);
      console.log(`  OK ${item.id}`);
    } catch (err) {
      console.error(`  Failed ${item.id}:`, err.message);
    }
    await new Promise((r) => setTimeout(r, 800));
  }

  const cache = {
    updatedAt: new Date().toISOString(),
    feeds,
  };

  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
  console.log(`\nWrote ${CACHE_PATH}`);
  console.log('Commit the file or run build — hubs will show the Live intel section.');
}

main();

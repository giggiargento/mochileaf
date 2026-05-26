/**
 * Fetch public Instagram profile fields (avatar, bio, display name).
 *
 * Reliable path: Meta Graph API Business Discovery (needs INSTAGRAM_ACCESS_TOKEN +
 * INSTAGRAM_BUSINESS_USER_ID in .env — your Creator/Business account).
 *
 * Fallback: instagram.com web_profile_info (often rate-limited from CI/datacenters).
 */

const IG_APP_ID = '936619743392459';
const GRAPH_VERSION = 'v21.0';

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept: '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
};

/**
 * @param {string} username
 * @returns {Promise<{ username: string, name: string, biography: string, profilePicUrl: string, source: string }>}
 */
export async function fetchInstagramProfile(username) {
  const handle = username.replace(/^@/, '').trim().toLowerCase();
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const businessUserId = process.env.INSTAGRAM_BUSINESS_USER_ID?.trim();

  if (token && businessUserId) {
    try {
      return await fetchViaBusinessDiscovery(handle, token, businessUserId);
    } catch (err) {
      console.warn(`  Graph API (${handle}): ${err.message} — trying web API…`);
    }
  } else if (token || businessUserId) {
    console.warn(
      '  Set both INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_USER_ID for stable sync (see .env.example).',
    );
  }

  try {
    return await fetchViaWebProfile(handle);
  } catch (err) {
    if (!String(err.message).includes('429')) throw err;
    console.warn(`  Web API (${handle}): ${err.message} — trying profile page…`);
    return fetchViaProfilePage(handle);
  }
}

/**
 * @param {string} username
 */
async function fetchViaBusinessDiscovery(username, accessToken, igUserId) {
  const discoveryFields = [
    'username',
    'name',
    'biography',
    'profile_picture_url',
    'followers_count',
    'media_count',
  ].join(',');
  const fields = `business_discovery.username(${username}){${discoveryFields}}`;
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}`);
  url.searchParams.set('fields', fields);
  url.searchParams.set('access_token', accessToken);

  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json?.error?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const user = json?.business_discovery;
  if (!user?.username) {
    throw new Error('business_discovery returned no user (account may be personal-only)');
  }

  const profilePicUrl = user.profile_picture_url;
  if (!profilePicUrl) throw new Error('No profile_picture_url in business_discovery');

  return {
    username: user.username,
    name: user.name?.trim() || user.username,
    biography: (user.biography ?? '').trim(),
    profilePicUrl,
    source: 'instagram-graph',
  };
}

/**
 * @param {string} username
 */
async function fetchViaWebProfile(username) {
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`;
  const res = await fetch(url, {
    headers: {
      ...BROWSER_HEADERS,
      'X-IG-App-ID': IG_APP_ID,
      'X-Requested-With': 'XMLHttpRequest',
      Referer: `https://www.instagram.com/${username}/`,
    },
  });

  if (res.status === 429) {
    throw new Error(
      'Instagram rate limit (429). Wait and retry, or configure INSTAGRAM_ACCESS_TOKEN + INSTAGRAM_BUSINESS_USER_ID.',
    );
  }

  if (!res.ok) {
    throw new Error(`Instagram web API HTTP ${res.status}`);
  }

  const json = await res.json();
  const user = json?.data?.user;
  if (!user) throw new Error('Instagram web API returned no user');

  const profilePicUrl = user.profile_pic_url_hd || user.profile_pic_url;
  if (!profilePicUrl) throw new Error('No profile picture URL from Instagram');

  return {
    username: user.username ?? username,
    name: (user.full_name ?? user.username ?? username).trim(),
    biography: (user.biography ?? '').trim(),
    profilePicUrl,
    source: 'instagram-web',
  };
}

function decodeJsonString(s) {
  return s.replace(/\\u0026/g, '&').replace(/\\"/g, '"').replace(/\\\//g, '/').replace(/&amp;/g, '&');
}

function extractFromPageHtml(html) {
  const og =
    html.match(/property="og:image" content="([^"]+)"/i) ||
    html.match(/content="([^"]+)" property="og:image"/i);
  const profilePicUrl = og?.[1]?.includes('cdninstagram.com')
    ? decodeJsonString(og[1])
    : decodeJsonString(
        html.match(/"profile_pic_url_hd":"([^"]+)"/)?.[1] ||
          html.match(/"profile_pic_url":"([^"]+)"/)?.[1] ||
          '',
      ) || null;

  const title =
    html.match(/property="og:title" content="([^"]+)"/i)?.[1] ||
    html.match(/content="([^"]+)" property="og:title"/i)?.[1];
  let name = '';
  if (title) {
    const m = decodeJsonString(title).match(/^(.+?)\s*\(@/);
    name = (m?.[1] ?? title.split('|')[0]).trim();
  }

  return { profilePicUrl, name };
}

/**
 * @param {string} username
 */
async function fetchViaProfilePage(username) {
  const res = await fetch(`https://www.instagram.com/${username}/`, {
    headers: {
      ...BROWSER_HEADERS,
      Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Upgrade-Insecure-Requests': '1',
    },
    redirect: 'follow',
  });

  if (!res.ok) throw new Error(`Instagram profile page HTTP ${res.status}`);

  const { profilePicUrl, name } = extractFromPageHtml(await res.text());
  if (!profilePicUrl) {
    throw new Error('No profile picture on Instagram profile page (try again later)');
  }

  return {
    username,
    name: name || username,
    biography: '',
    profilePicUrl,
    source: 'instagram-page',
  };
}

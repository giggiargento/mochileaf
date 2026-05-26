/** Parse Nookipedia villager wikitext (NH-focused). */

export function parseTemplateBlock(wikitext, templateName) {
  const re = new RegExp(`\\{\\{${templateName}([\\s\\S]*?)\\n\\}\\}`, 'i');
  const m = wikitext.match(re);
  if (!m) return {};
  const params = {};
  for (const line of m[1].split('\n')) {
    const pm = line.match(/^\|([^=]+?)\s*=\s*(.*)$/);
    if (!pm) continue;
    params[pm[1].trim()] = pm[2].trim();
  }
  return params;
}

export function cleanWikiText(raw) {
  if (!raw) return '';
  return (
    raw
      .replace(/\{\{[\s\S]*?\}\}/g, ' ')
      .replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1')
      .replace(/thumb\|[^|]*\|[^|]*\|/gi, ' ')
      .replace(/Artwork of [^.]+\.\s*/gi, ' ')
      .replace(/'''+/g, '')
      .replace(/<ref[\s\S]*?<\/ref>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+,/g, ',')
      .replace(/\s+\./g, '.')
      .replace(/\s{2,}/g, ' ')
      .trim()
  );
}

export function extractSection(wikitext, heading) {
  const re = new RegExp(
    `===${heading}===\\s*([\\s\\S]*?)(?=\\n===[^=]|\\n==[^=]|$)`,
    'i',
  );
  const m = wikitext.match(re);
  return m ? cleanWikiText(m[1]) : '';
}

export function nookipediaFileUrl(filename) {
  return `https://nookipedia.com/wiki/Special:Redirect/file/${encodeURIComponent(filename.replace(/ /g, '_'))}`;
}

/**
 * @param {string} wikitext
 * @param {string} wikiName
 */
export function parseVillagerWikitext(wikitext, wikiName) {
  const nh = parseTemplateBlock(wikitext, 'NHVillagerInfo');
  const house = parseTemplateBlock(wikitext, 'NHHouse');
  const card = parseTemplateBlock(wikitext, 'A-card');
  const infobox = parseTemplateBlock(wikitext, 'Infobox Villager');

  const appearance = extractSection(wikitext, 'Appearance');
  let personality = extractSection(wikitext, 'Personality');
  if (personality.startsWith('Smug') || personality.length < 20) {
    personality = extractSection(wikitext, 'Personality').replace(/^\w+\s*/i, '');
  }
  personality = cleanWikiText(personality);

  const introMatch = wikitext.match(
    new RegExp(`'''${wikiName}''' is ([\\s\\S]*?)(?=\\n\\n|__TOC__|==)`, 'i'),
  );
  let intro = introMatch ? cleanWikiText(`${wikiName} is ${introMatch[1]}`) : '';
  if (intro.length < 40 || intro.includes('first appeared in and')) intro = undefined;

  const birthdayMonth = nh['birthday-month'] || infobox.birthdaymonth;
  const birthdayDay = nh.birthday || infobox.birthday;
  const birthday =
    birthdayMonth && birthdayDay ? `${birthdayMonth} ${birthdayDay}` : undefined;

  const furniture = [];
  for (let i = 1; i <= 20; i++) {
    const key = `furn${i}`;
    if (house[key]) furniture.push(house[key].replace(/-/g, ' '));
  }

  const languages = [
    { language: 'Japanese', name: nh['ja-name'], romanization: nh['ja-name-r'] },
    { language: 'Korean', name: nh['ko-name'], romanization: nh['ko-name-r'] },
    { language: 'Chinese (Simplified)', name: nh['zh-name'], romanization: nh['zh-name-r'] },
    { language: 'Chinese (Traditional)', name: nh['zht-name'] },
    { language: 'French', name: nh['fr-name'] },
    { language: 'Spanish', name: nh['es-name'] || nh['esl-name'] },
    { language: 'Italian', name: nh['it-name'] },
    { language: 'German', name: nh['de-name'] },
    { language: 'Dutch', name: nh['nl-name'] },
    { language: 'Russian', name: nh['ru-name'], romanization: nh['ru-name-r'] },
  ].filter((row) => row.name);

  const clothing = nh.clothing
    ? [nh.clothing, nh['clothing-var']].filter(Boolean).join(' (') +
      (nh['clothing-var'] ? ')' : '')
    : infobox['clothes2'] || undefined;

  return {
    intro: intro || undefined,
    appearance: appearance || undefined,
    personality: personality || undefined,
    villagerInfo: {
      birthday,
      starSign: nh.sign || infobox.sign,
      personality: nh.personality || infobox.personality,
      subPersonality: nh['sub-personality'],
      catchphrase: nh.catchphrase || infobox.phrase,
      quote: nh.quote || infobox.quote,
      gender: nh.gender || infobox.gender,
      defaultClothing: clothing,
      umbrella: nh.umbrella || infobox.umbrella3,
      hobby: nh.hobby,
      favoriteStyles: [nh.favstyle1, nh.favstyle2].filter(Boolean),
      favoriteColors: [nh.favcolor1, nh.favcolor2].filter(Boolean),
      bag: nh.bag,
      food: nh.food,
      drink: nh.drink,
    },
    house: {
      roof: house['house-roof'],
      siding: house['house-siding'],
      door: house['house-door'],
      wallpaper: house.wallpaper,
      flooring: house.floor,
      music: house.music,
      musicNote: house['music-note'] ? cleanWikiText(house['music-note']) : undefined,
      furniture: furniture.length ? furniture : undefined,
      exteriorImage: house.ext ? nookipediaFileUrl(house.ext) : undefined,
      interiorImage: house.int ? nookipediaFileUrl(house.int) : undefined,
    },
    languages,
    amiibo: card.number
      ? {
          number: card.number,
          series: inferAmiiboSeries(card.number),
          starSign: card.sign,
          birthday: card.bday,
          image: card.front ? nookipediaFileUrl(card.front) : undefined,
        }
      : undefined,
    sourceUrl: `https://nookipedia.com/wiki/${encodeURIComponent(wikiName.replace(/ /g, '_'))}`,
  };
}

function inferAmiiboSeries(num) {
  const n = Number(num);
  if (n >= 1 && n <= 96) return 'Series 1–4';
  if (n >= 197 && n <= 263) return 'Series 5';
  if (n >= 264 && n <= 431) return 'Series 1–5 (New Horizons)';
  return 'Animal Crossing amiibo';
}

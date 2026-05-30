/** Convert in-game gift name to a stable slug (for future icon sync). */
export function giftSlug(name: string): string {
  return name
    .replace(/\s*\([^)]*\)\s*/g, '')
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export type GiftVisualTone = 'sage' | 'blossom' | 'lavender' | 'mist' | 'accent';

/** Category icon when a unique item sprite is unavailable. */
export function giftVisual(gift: { name: string; source: string }): {
  icon: string;
  tone: GiftVisualTone;
} {
  const text = `${gift.name} ${gift.source}`.toLowerCase();
  if (/handwritten letter/i.test(gift.name)) return { icon: 'envelope-simple', tone: 'sage' };
  if (/fluffy cloud|boom boom/i.test(text)) return { icon: 'cloud', tone: 'mist' };
  if (/florist|blooms|fable|fantasia|waltz|crimson|spring|heart|sonata|worship|dawn|ice/i.test(text)) {
    return { icon: 'flower-lotus', tone: 'blossom' };
  }
  if (/ramen|bakery|baozi|bread|meal|restaurant|izakaya|salad|refresher|burger|chips|snack|gubicrisp|marshmallow|matcha|pudding|tea shop|tonkotsu/i.test(text)) {
    return { icon: 'bowl-food', tone: 'lavender' };
  }
  if (/cinema|ticket/i.test(text)) return { icon: 'film-slate', tone: 'mist' };
  if (/bookstore|book|approval|agreement|gladiator|unrecorded|secrets of/i.test(text)) {
    return { icon: 'book-open', tone: 'accent' };
  }
  if (/pharmacy|lozenges|defender/i.test(text)) return { icon: 'first-aid', tone: 'sage' };
  if (/electronics|lamp|track|night light|bunny box/i.test(text)) return { icon: 'device-mobile', tone: 'mist' };
  if (/warp exchange|bounty|gacha|dsd pop/i.test(text)) return { icon: 'package', tone: 'accent' };
  if (/puka|candy|chocoa|vending|convenience/i.test(text)) return { icon: 'coffee', tone: 'blossom' };
  if (/bar\b|banjo/i.test(text)) return { icon: 'music-notes', tone: 'lavender' };
  if (/story acquisition|ebisu/i.test(text)) return { icon: 'crown', tone: 'accent' };
  return { icon: 'gift', tone: 'lavender' };
}

export function nteGiftImagePath(slug: string): string {
  return `/images/games/neverness-to-everness/gifts/${slug}.webp`;
}

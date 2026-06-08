import type { BondGiftTone } from '../bond-gift';

/** Category icon when a unique item sprite is unavailable. */
export function stardewGiftVisual(name: string): { icon: string; categoryKey: string } {
  const text = name.toLowerCase();

  if (/stardrop tea|magic rock candy/i.test(text)) {
    return { icon: 'sparkle', categoryKey: 'character.gifts.category.special' };
  }
  if (/amethyst|quartz|emerald|ruby|diamond|topaz|jade|aquamarine|fire opal|frozen tear|earth crystal|prismatic|geode|mineral|gem\b/i.test(text)) {
    return { icon: 'diamond', categoryKey: 'character.gifts.category.gem' };
  }
  if (/fish|pufferfish|eel|sardine|salmon|sturgeon|squid|octopus|clownfish|tilapia|lobster|crab|shrimp|mussel|oyster/i.test(text)) {
    return { icon: 'fish', categoryKey: 'character.gifts.category.fish' };
  }
  if (/cake|pudding|cobbler|pie|soup|salad|chocolate|bread|coffee|wine|beer|juice|preserves|jelly|pickle|fries|hash|breakfast|lunch|dinner|meal|dish|tea\b/i.test(text)) {
    return { icon: 'bowl-food', categoryKey: 'character.gifts.category.cook' };
  }
  if (/book|compendium|quarterly|magazine|scroll/i.test(text)) {
    return { icon: 'book-open', categoryKey: 'character.gifts.category.book' };
  }
  if (/sword|dagger|blade|flute|paw|artifact|relic|statue|fossil|bone|ancient/i.test(text)) {
    return { icon: 'sword', categoryKey: 'character.gifts.category.artifact' };
  }
  if (/flower|holly|poppy|tulip|sunflower|forage|mushroom|leek|horseradish|dandelion|salmonberry|spice berry|wild/i.test(text)) {
    return { icon: 'plant', categoryKey: 'character.gifts.category.foraged' };
  }
  if (/pumpkin|melon|fruit|apple|apricot|cherry|orange|peach|plum|banana|mango|coconut|corn|vegetable|potato|tomato|carrot|crop/i.test(text)) {
    return { icon: 'carrot', categoryKey: 'character.gifts.category.crop' };
  }
  if (/clay|stone|ore|coal|wood|fiber|sap|battery|trash|junk|refined|sugar/i.test(text)) {
    return { icon: 'cube', categoryKey: 'character.gifts.category.material' };
  }

  return { icon: 'gift', categoryKey: 'character.gifts.category.gift' };
}

export type StardewGiftTier = 'love' | 'like' | 'dislike' | 'hate';

export const stardewGiftTierTone: Record<StardewGiftTier, BondGiftTone> = {
  love: 'blossom',
  like: 'sage',
  dislike: 'mist',
  hate: 'accent',
};

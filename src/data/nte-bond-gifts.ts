import { giftSlug } from '../lib/nte/gift-slug';

export interface NteBondGift {
  slug: string;
  name: string;
  source: string;
  /** Affinity points when the character treats this as a favorite. */
  affinity: number;
}

export interface NteCharacterBondProfile {
  characterSlug: string;
  /** Short note shown above the list (e.g. best Fons value). */
  tip?: string;
  gifts: NteBondGift[];
}

function g(name: string, source: string, affinity: number): NteBondGift {
  return { slug: giftSlug(name), name, source, affinity };
}

/** Works on every romanceable character; not counted toward the daily 10-gift cap. */
export const nteUniversalBondGifts: NteBondGift[] = [
  g('A Handwritten Letter', 'Warp Exchange · Circle Bounty', 2000),
  g('Fluffy Cloud', 'Compressed Boom Boom Cloud (Wiener / Eden / Fenglin apartment)', 400),
];

const profiles: NteCharacterBondProfile[] = [
  {
    characterSlug: 'nanally',
    tip: 'Blazing Crimson is the most cost-effective daily favorite after Letters.',
    gifts: [
      g('Blazing Crimson', 'Hillside Blooms Florist (Illusion Town)', 200),
      g('Nekomaru Oni Ramen', 'Nekomaru Ramen (Bridge Crossings, Illusion Town, Miguel District, New Herland)', 100),
      g('Floe Cinema Ticket', 'Floe Cinema kiosk', 400),
      g('Cool-lala Spicy Snack', '2-Four Convenience Store vending (New Herland District)', 100),
      g('Gubichi Original Flavor Chips', 'Gubichi vending · 2-Four Convenience Store', 100),
    ],
  },
  {
    characterSlug: 'mint',
    tip: 'Waltz is Mint’s best-value favorite; pair with Asahi Inori for +400 slots.',
    gifts: [
      g('Waltz', 'Hillside Blooms Florist (Bridge Crossings, Illusion Town, Miguel District, New Herland)', 200),
      g('Asahi Inori - Moonsilver', 'DSD POP (Illusion Town, New Herland District)', 400),
      g('Floe Cinema Ticket', 'Floe Cinema kiosk', 400),
      g('Super Tonkotsu Ramen', 'Budoriya Izakaya (Bridge Crossings) · Senjo Brewhouse (Miguel / New Herland)', 100),
      g('Gubicrisp', 'Gubichi vending · 2-Four Convenience Store (Miguel District)', 100),
    ],
  },
  {
    characterSlug: 'chiz',
    tip: 'Fantasia and Floe Cinema Tickets are reliable daily favorites for Chiz.',
    gifts: [
      g('Fantasia', 'Hillside Blooms Florist (Bridge Crossings, Illusion Town, Miguel District, New Herland)', 200),
      g('Floe Cinema Ticket', 'Floe Cinema kiosk', 400),
      g('Bunny Box', 'Brown Electronics Store (Bridge Crossings)', 400),
      g('Rose Lychee Cake', "Alice's Bakery (Bridge Crossings, New Herland District)", 100),
      g('Nyanko Punch Taro Pudding Milktea', 'Crazy Cat Milk Tea Shop (city-wide)', 100),
    ],
  },
  {
    characterSlug: 'sakiri',
    tip: 'Fever Dream and Bunny Box are Sakiri’s highest-yield shop favorites.',
    gifts: [
      g('Fever Dream', 'Oops! Chest Gift Shop (Bridge Crossings, Miguel District)', 200),
      g('Bunny Box', 'Brown Electronics Store (Bridge Crossings)', 400),
      g('Blue Fable', 'Hillside Blooms Florist (Bridge Crossings)', 200),
      g('Floe Cinema Ticket', 'Floe Cinema kiosk', 400),
      g('Kids Energy Meal', 'Food First Family Restaurant (city-wide)', 100),
    ],
  },
  {
    characterSlug: 'fadia',
    gifts: [
      g('Glimmering Ice', 'Hillside Blooms Florist', 200),
      g('Deep in the Heart', 'Hillside Blooms Florist', 200),
      g('Golden Spring', 'Hillside Blooms Florist', 200),
      g('Classic Trio', 'Hillside Blooms Florist', 100),
    ],
  },
  {
    characterSlug: 'jiuyuan',
    gifts: [
      g('Sakai Melon Bread', "Alice's Bakery (city-wide)", 100),
      g('Ebisu Royal Tower', 'Story acquisition · Ebisu Auction event', 200),
      g("Nightingale's Sonata", 'Hillside Blooms Florist (Bridge Crossings)', 200),
      g('On Track', 'Brown Electronics Store (Miguel District, New Herland District)', 200),
      g('Magi-Puff Whole Wheat Bread', 'Gubichi vending · convenience stores', 100),
    ],
  },
  {
    characterSlug: 'haniel',
    gifts: [
      g('Puka Chocoa Ellie Tour Special', 'Puka Candy Shop · Puka vending machines', 400),
      g('Asahi Inori - Moonsilver', 'DSD POP (Illusion Town, New Herland District)', 400),
      g('Fantasia', 'Hillside Blooms Florist (city-wide)', 200),
      g('Cool-lala Spicy Snack', '2-Four Convenience Store vending (New Herland District)', 100),
    ],
  },
  {
    characterSlug: 'hathor',
    gifts: [
      g('Fever Dream', 'Oops! Chest Gift Shop (Bridge Crossings, Miguel District)', 200),
      g('Colorful Light Salad', 'Food First Family Restaurant (city-wide)', 200),
      g('Cooly Cool Refresher', 'Bamboo Pharmacy (city-wide)', 200),
      g("Nightingale's Sonata", 'Hillside Blooms Florist (Bridge Crossings)', 200),
    ],
  },
  {
    characterSlug: 'daffodil',
    gifts: [
      g('Floe Cinema Ticket', 'Floe Cinema kiosk', 400),
      g('Cooly Cool Refresher', 'Bamboo Pharmacy (city-wide)', 200),
      g('Nyanko Cozy Uji Matcha', 'Crazy Cat Milk Tea Shop (city-wide)', 100),
      g('Puka Sweet Dreams Marshmallow', 'Puka vending · Puka Candy Shop', 100),
    ],
  },
  {
    characterSlug: 'edgar',
    gifts: [
      g("Boss' Approval", 'Warp Exchange', 400),
      g('Blue Fable', 'Oops! Chest Gift Shop · Hillside Blooms Florist', 200),
      g('Snowy Tofu Pudding', 'Bigmouth Baozi (city-wide)', 200),
      g('Unrecorded Sound', 'Moby-Dick Bookstore', 200),
    ],
  },
  {
    characterSlug: 'baicang',
    gifts: [
      g('Refulgent Agreement', 'Warp Exchange', 400),
      g('Floe Cinema Ticket', 'Floe Cinema kiosk', 400),
      g('Kids Energy Meal', 'Food First Family Restaurant (city-wide)', 100),
      g('Nekomaru Vegan Ramen', 'Nekomaru Ramen (city-wide)', 100),
      g('Gigafluff - Reign of Darkness', 'Gubichi vending · convenience stores', 100),
    ],
  },
  {
    characterSlug: 'skia',
    gifts: [
      g('White Jade Lamp', 'Brown Electronics Store (Miguel District)', 400),
      g('Song of the Gladiator', 'Moby-Dick Bookstore', 200),
      g('Clicky Lavaburger', 'Gubichi vending · convenience stores', 100),
      g('Floe Cinema Ticket', 'Floe Cinema kiosk', 400),
    ],
  },
  {
    characterSlug: 'aurelia',
    tip: 'Aurelia’s bond cap was limited at launch — still worth stocking Blue Fable early.',
    gifts: [
      g('Blue Fable', 'Oops! Chest Gift Shop (Bridge Crossings)', 200),
      g('Ambient Night Light', 'Brown Electronics Store (Miguel District)', 200),
      g('Bigmouth Custard Baozi', 'Bigmouth Baozi (city-wide)', 200),
      g('Fantasia', 'Hillside Blooms Florist (city-wide)', 200),
    ],
  },
  {
    characterSlug: 'adler',
    gifts: [
      g('Great Defender', 'Bamboo Pharmacy (city-wide)', 200),
      g("Wanderer's Banjo", 'A.R.P.T.S Bar (Miguel District, New Herland District)', 200),
      g('Holy Worship Month', 'Hillside Blooms Florist (Bridge Crossings)', 200),
      g('Purification Guard Lozenges', 'Bamboo Pharmacy (city-wide)', 200),
      g('Floe Cinema Ticket', 'Floe Cinema kiosk', 400),
    ],
  },
];

const bySlug = new Map(profiles.map((p) => [p.characterSlug, p]));

/** All unique gift slugs referenced by bond profiles (for image sync). */
export function getAllNteBondGiftSlugs(): string[] {
  const slugs = new Set<string>();
  for (const gift of nteUniversalBondGifts) slugs.add(gift.slug);
  for (const profile of profiles) {
    for (const gift of profile.gifts) slugs.add(gift.slug);
  }
  return [...slugs].sort();
}

export function getNteBondGiftsForCharacter(characterSlug: string): NteCharacterBondProfile | undefined {
  return bySlug.get(characterSlug);
}

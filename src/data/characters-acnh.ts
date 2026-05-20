import type { Character } from '../types';

const gameSlug = 'animal-crossing-new-horizons';
const img = (slug: string) =>
  `/images/games/animal-crossing-new-horizons/villagers/${slug}.png`;

/** Popular + fan-favorite villagers for the ACNH hub. */
export const acnhVillagers: Character[] = [
  {
    slug: 'raymond',
    name: 'Raymond',
    role: 'Smug cat',
    personality: 'Smug',
    species: 'Cat',
    popularRank: 1,
    gameSlug,
    image: img('raymond'),
    houseStyle: 'Office loft',
    houseDescription:
      'Dark wood paneling, a desk setup, and ironwood pieces — reads like a tiny studio apartment with serious catalog taste.',
    description:
      'The villager who sparked endless campsite hunts. Calm, formal, and endlessly photogenic in minimalist room shots.',
  },
  {
    slug: 'marshal',
    name: 'Marshal',
    role: 'Smug squirrel',
    personality: 'Smug',
    species: 'Squirrel',
    popularRank: 2,
    gameSlug,
    image: img('marshal'),
    houseStyle: 'Campsite cozy',
    houseDescription:
      'Teepee centerpiece with log furniture and a fire pit vibe — warm, compact, and very catalog-friendly.',
    description:
      'Soft teal cheeks and a tiny frown that reads as charm. A perennial favorite for peaceful island cores.',
  },
  {
    slug: 'judy',
    name: 'Judy',
    role: 'Snooty bear cub',
    personality: 'Snooty',
    species: 'Bear cub',
    popularRank: 3,
    gameSlug,
    image: img('judy'),
    houseStyle: 'Pastel living room',
    houseDescription:
      'Pink and cream cute set pieces with soft lighting — built for dreamy screenshot tours.',
    description:
      'Sparkly eyes and a gentle snooty attitude. Often hunted for elegant, feminine room themes.',
  },
  {
    slug: 'ankha',
    name: 'Ankha',
    role: 'Snooty cat',
    personality: 'Snooty',
    species: 'Cat',
    popularRank: 4,
    gameSlug,
    image: img('ankha'),
    houseStyle: 'Egyptian gold',
    houseDescription:
      'Pyramid roof exterior with golden sarcophagus and royal antiques inside — dramatic and unmistakable.',
    description:
      'Regal, mysterious, and iconic. Her house is a set piece players love to rebuild on Harv’s Island.',
  },
  {
    slug: 'sherb',
    name: 'Sherb',
    role: 'Lazy goat',
    personality: 'Lazy',
    species: 'Goat',
    popularRank: 5,
    gameSlug,
    image: img('sherb'),
    houseStyle: 'Ice cream parlor',
    houseDescription:
      'Pastel dessert-shop furniture with a soft strawberry palette — gentle, round, and very cozy.',
    description:
      'Blueberry pie jokes and nap energy. One of the most relaxed villagers for quiet island moods.',
  },
  {
    slug: 'diana',
    name: 'Diana',
    role: 'Snooty deer',
    personality: 'Snooty',
    species: 'Deer',
    popularRank: 6,
    gameSlug,
    image: img('diana'),
    houseStyle: 'Cabin chic',
    houseDescription:
      'Classic elegant pieces with a cool silver-and-white palette — polished without feeling cold.',
    description:
      'Graceful and a little reserved. Great anchor villager for sophisticated forest or spa islands.',
  },
  {
    slug: 'bob',
    name: 'Bob',
    role: 'Lazy cat',
    personality: 'Lazy',
    species: 'Cat',
    popularRank: 7,
    gameSlug,
    image: img('bob'),
    houseStyle: 'Playful retro',
    houseDescription:
      'Kiddie and pastel items with a loose, cluttered charm — feels lived-in and silly.',
    description:
      'pUhYoNgMiSt fan favorite since forever. Lazy energy and meme status keep him in the most-wanted lists.',
  },
  {
    slug: 'molly',
    name: 'Molly',
    role: 'Normal duck',
    personality: 'Normal',
    species: 'Duck',
    popularRank: 8,
    gameSlug,
    image: img('molly'),
    houseStyle: 'Rustic kitchen',
    houseDescription:
      'Bread oven, wooden counters, and warm lighting — cottagecore before the hashtag.',
    description:
      'Soft yellow bill and gentle dialogue. A comfort villager for players who want calm mornings.',
  },
  {
    slug: 'marina',
    name: 'Marina',
    role: 'Normal octopus',
    personality: 'Normal',
    species: 'Octopus',
    popularRank: 9,
    gameSlug,
    image: img('marina'),
    houseStyle: 'Ocean candy',
    houseDescription:
      'Cute set in pink and teal with music-player energy — bubbly, round, and camera-ready.',
    description:
      'One of only a few octopus villagers. Sweet voice lines and a house that pops in tours.',
  },
  {
    slug: 'zucker',
    name: 'Zucker',
    role: 'Lazy octopus',
    personality: 'Lazy',
    species: 'Octopus',
    popularRank: 10,
    gameSlug,
    image: img('zucker'),
    houseStyle: 'Beach takoyaki',
    houseDescription:
      'Sand floor, beach tables, and food stalls — literal seaside snack bar energy indoors.',
    description:
      'Takoyaki face and lazy jokes. Fan-favorite for tropical and food-themed islands.',
  },
  {
    slug: 'beau',
    name: 'Beau',
    role: 'Lazy deer',
    personality: 'Lazy',
    species: 'Deer',
    popularRank: 11,
    gameSlug,
    image: img('beau'),
    houseStyle: 'Natural cabin',
    houseDescription:
      'Log and mushroom lamps with earthy tones — forest picnic mood year-round.',
    description:
      'Sleepy cinnamon-roll energy. Pairs well with mossy paths and outdoor picnic spots.',
  },
  {
    slug: 'audie',
    name: 'Audie',
    role: 'Peppy wolf',
    personality: 'Peppy',
    species: 'Wolf',
    popularRank: 12,
    gameSlug,
    image: img('audie'),
    houseStyle: 'Retro tiki lounge',
    houseDescription:
      'Bright rattan and palm with vintage flair — vacation home that never quite left the seventies.',
    description:
      'Named after a long-time fan and full of pep. Great for colorful, music-forward islands.',
  },
  {
    slug: 'stitches',
    name: 'Stitches',
    role: 'Lazy bear cub',
    personality: 'Lazy',
    species: 'Bear cub',
    gameSlug,
    image: img('stitches'),
    houseStyle: 'Toy box',
    houseDescription:
      'Mix-and-match colorful furniture with a child’s-bedroom feel — patchwork cute.',
    description:
      'Patchwork cub with a permanent smile. Beloved on kidcore and candy-colored islands.',
  },
  {
    slug: 'maple',
    name: 'Maple',
    role: 'Normal cub',
    personality: 'Normal',
    species: 'Cub',
    gameSlug,
    image: img('maple'),
    houseStyle: 'Warm woodland',
    houseDescription:
      'Wooden block furniture and a quilted calm — simple, soft, and very autumn.',
    description:
      'Gentle normal cub who fits cottage and pumpkin-patch seasons without trying.',
  },
  {
    slug: 'coco',
    name: 'Coco',
    role: 'Normal rabbit',
    personality: 'Normal',
    species: 'Rabbit',
    gameSlug,
    image: img('coco'),
    houseStyle: 'Haunted cute',
    houseDescription:
      'Gyroid choir and hollow-eyed charm — spooky, but still oddly cozy.',
    description:
      'Empty-eyed icon of the game. Players love her for weird, liminal, and horror-cute builds.',
  },
  {
    slug: 'chrissy',
    name: 'Chrissy',
    role: 'Peppy rabbit',
    personality: 'Peppy',
    species: 'Rabbit',
    gameSlug,
    image: img('chrissy'),
    houseStyle: 'Balloon pop',
    houseDescription:
      'Bright cute set with a festive, bouncy layout — birthday party that never ended.',
    description:
      'Hyper peppy energy and starry eyes. Often paired with Francine on sister-island themes.',
  },
  {
    slug: 'tangy',
    name: 'Tangy',
    role: 'Peppy cat',
    personality: 'Peppy',
    species: 'Cat',
    gameSlug,
    image: img('tangy'),
    houseStyle: 'Citrus lounge',
    houseDescription:
      'Orange and green retro pieces — reads like a sunny sixties sitting room.',
    description:
      'Orange slice energy in dialogue and design. Fun anchor for fruit and diner islands.',
  },
  {
    slug: 'merengue',
    name: 'Merengue',
    role: 'Normal rhino',
    personality: 'Normal',
    species: 'Rhino',
    gameSlug,
    image: img('merengue'),
    houseStyle: 'Bakery sweet',
    houseDescription:
      'Cakes, pastry tables, and soft pink — dessert shop disguised as a home.',
    description:
      'Strawberry-shortcake rhino. One of the sweetest normals for food-themed builds.',
  },
  {
    slug: 'lolly',
    name: 'Lolly',
    role: 'Normal dog',
    personality: 'Normal',
    species: 'Dog',
    gameSlug,
    image: img('lolly'),
    houseStyle: 'Book nook',
    houseDescription:
      'Wooden bookcase stacks and a warm reading corner — library cafe at home.',
    description:
      'Warm cookies-and-books vibe. A steady favorite for calm, hygge neighborhoods.',
  },
  {
    slug: 'poppy',
    name: 'Poppy',
    role: 'Normal squirrel',
    personality: 'Normal',
    species: 'Squirrel',
    gameSlug,
    image: img('poppy'),
    houseStyle: 'Soft retro',
    houseDescription:
      'Classic cute furniture in muted reds — compact and cheerful without loud colors.',
    description:
      'Tiny red squirrel with a gentle normal personality — easy to love, easy to place.',
  },
];

export function getPopularAcnhVillagers(): Character[] {
  return [...acnhVillagers]
    .filter((v) => v.popularRank != null)
    .sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99));
}

export function getOtherAcnhVillagers(): Character[] {
  return acnhVillagers.filter((v) => v.popularRank == null);
}

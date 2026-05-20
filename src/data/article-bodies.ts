export interface ArticleBodySection {
  heading?: string;
  paragraphs: string[];
}

export const articleBodies: Record<string, ArticleBodySection[]> = {
  'stardew-valley-year-one-guide': [
    {
      paragraphs: [
        'Your first year in Stardew Valley is about rhythm, not perfection. Wake up, water crops, check the town, and leave energy for one “main” goal — mines, fishing, or friendship — before sundown.',
        'This guide assumes you are playing at a cozy pace: no strict min-max, just a route that avoids common bottlenecks.',
      ],
    },
    {
      heading: 'Spring priorities',
      paragraphs: [
        'Plant mixed crops early (potatoes and cauliflower are safe). Save gold for Strawberry Seeds at the Egg Festival on the 13th — plant them the same day for strong mid-season income.',
        'Visit the Community Center as soon as it unlocks and read bundle requirements. Stash one of each forage item you find instead of selling everything on day one.',
      ],
    },
    {
      heading: 'Mining and tools',
      paragraphs: [
        'Upgrade your watering can on a rainy day in Spring or early Summer so you do not miss crop days. Push to floor 40–80 in the mines before Summer if you want better combat drops.',
        'Eat foraged food or cheap salads from the saloon instead of buying stacks of energy items.',
      ],
    },
    {
      heading: 'Relationships without burnout',
      paragraphs: [
        'Talk to everyone you pass. Gift twice per week once you know tastes — loved gifts matter more than expensive ones.',
        'Check birthdays on the calendar in your farmhouse; one loved gift on a birthday equals several normal gifts.',
      ],
    },
  ],
  'stardew-community-center-bundles': [
    {
      paragraphs: [
        'Completing the Community Center is the heart of a non-Joja playthrough. Bundles are grouped by room; finishing every bundle in a room unlocks a reward and moves the town story forward.',
      ],
    },
    {
      heading: 'What to prepare early',
      paragraphs: [
        'Keep a chest labeled “bundles” near your farm. Drop in seasonal forages, one quality crop when asked, and fish when you catch a required species.',
        'The Bulletin Board bundle needs help from other villagers — start friendship early if you want to finish it before late game.',
      ],
    },
    {
      heading: 'Room order many players prefer',
      paragraphs: [
        'Crafts Room and Pantry are friendly for year one. Boiler Room needs mining access; Vault needs cash — save 25,000g when you are comfortable. Fish Tank and Bulletin Board are long-term projects across seasons.',
      ],
    },
  ],
  'stardew-spring-crops-profit': [
    {
      paragraphs: [
        'Spring profit is about timing. Crops that grow fast fund your second planting; slow growers like cauliflower pay off if you plant early and protect them with scarecrows.',
      ],
    },
    {
      heading: 'Crop snapshot',
      paragraphs: [
        'Potatoes: cheap seeds, chance of extra harvest — great for day 5–12 income. Cauliflower: one big payout if planted by day 5. Strawberries: best if bought at the festival and planted immediately.',
        'Green beans keep producing after the first harvest — good if you hate replanting every few days.',
      ],
    },
    {
      heading: 'Layout tip',
      paragraphs: [
        'Group sprinklers later; for spring, a simple grid with paths every four tiles is enough. Leave room to add quality sprinklers in summer without bulldozing your whole farm.',
      ],
    },
  ],
};

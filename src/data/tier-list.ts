import type { TierEntry } from '../types';

export const whisperwoodTierList: TierEntry[] = [
  { tier: 'S', characters: ['Elara'] },
  { tier: 'A', characters: ['Finn', 'Mira'] },
  { tier: 'B', characters: ['Rowan', 'Sage', 'Lumi'] },
  { tier: 'C', characters: ['Pip', 'Coral'] },
  { tier: 'D', characters: ['—'] },
];

export function getTierListForGame(gameSlug: string): TierEntry[] {
  if (gameSlug === 'whisperwood') return whisperwoodTierList;
  return [
    { tier: 'S', characters: ['Coming soon'] },
    { tier: 'A', characters: ['—'] },
    { tier: 'B', characters: ['—'] },
    { tier: 'C', characters: ['—'] },
    { tier: 'D', characters: ['—'] },
  ];
}

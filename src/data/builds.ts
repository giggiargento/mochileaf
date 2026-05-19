import type { Build } from '../types';

export const builds: Build[] = [
  {
    slug: 'elara-support-bloom',
    name: 'Bloom Support',
    characterSlug: 'elara',
    gameSlug: 'whisperwood',
    difficulty: 'easy',
    summary: 'Gentle healing aura with forest buffs for relaxed exploration parties.',
    tags: ['Support', 'Exploration', 'Beginner'],
  },
  {
    slug: 'finn-lantern-dps',
    name: 'Memory Lantern DPS',
    characterSlug: 'finn',
    gameSlug: 'whisperwood',
    difficulty: 'medium',
    summary: 'Stack lantern charges for warm burst damage without frantic rotations.',
    tags: ['DPS', 'Burst', 'Intermediate'],
  },
  {
    slug: 'mira-mist-control',
    name: 'Mist Control',
    characterSlug: 'mira',
    gameSlug: 'whisperwood',
    difficulty: 'medium',
    summary: 'Zone control through soft slows and vision — perfect for cozy strategists.',
    tags: ['Control', 'Utility'],
  },
];

export function getBuildsByGame(gameSlug: string): Build[] {
  return builds.filter((b) => b.gameSlug === gameSlug);
}

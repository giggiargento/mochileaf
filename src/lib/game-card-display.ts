import type { ImageMetadata } from 'astro';
import nteCardHero from '../assets/games/neverness-to-everness/card-hero.png';

export type GameCardDisplay =
  | {
      mode: 'single';
      src: string | ImageMetadata;
      objectFit?: 'cover' | 'contain';
      objectPosition?: string;
      containBackground?: boolean;
    }
  | {
      mode: 'layered';
      background: string;
      logo: string;
      logoAlt?: string;
    };

const gameCardDisplay: Record<string, GameCardDisplay> = {
  'animal-crossing-new-horizons': {
    mode: 'single',
    src: '/images/games/animal-crossing-new-horizons/card.jpg',
    objectFit: 'cover',
    objectPosition: 'center 38%',
  },
  'stardew-valley': {
    mode: 'single',
    src: '/images/games/stardew-valley/Card.webp',
    objectFit: 'cover',
    objectPosition: 'center center',
  },
  'neverness-to-everness': {
    mode: 'single',
    src: nteCardHero,
    objectFit: 'cover',
    objectPosition: 'center center',
  },
};

export function getGameCardDisplay(slug: string): GameCardDisplay | undefined {
  return gameCardDisplay[slug];
}

/** Hub hero mark — circular crop tuned per game. */
export type GameHubLogo = {
  src: string;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
};

const gameHubLogos: Record<string, GameHubLogo> = {
  'stardew-valley': {
    src: '/images/games/stardew-valley/Card.webp',
    objectFit: 'cover',
    objectPosition: 'center 14%',
  },
  'animal-crossing-new-horizons': {
    src: '/images/games/animal-crossing-new-horizons/card.jpg',
    objectFit: 'cover',
    objectPosition: 'center 38%',
  },
};

export function getGameHubLogo(slug: string): GameHubLogo | undefined {
  return gameHubLogos[slug];
}

import {
  allCharacters,
  getCharacter,
  getCharacterBySlug,
  getCharactersByGame,
  routableCharacters,
} from './registry';

export {
  allCharacters,
  routableCharacters,
  getCharacter,
  getCharacterBySlug,
  getCharactersByGame,
};

/** Validated characters with routes — safe for listings and `getStaticPaths`. */
export const characters = routableCharacters;

export function getAllCharacters() {
  return allCharacters;
}

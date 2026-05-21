import type { DecorInspiration } from '../types';
import raw from './character-decor-acnh.json';

export const acnhCharacterDecor = raw as Record<string, DecorInspiration[]>;

export function getAcnhDecorForCharacter(slug: string): DecorInspiration[] {
  return acnhCharacterDecor[slug] ?? [];
}

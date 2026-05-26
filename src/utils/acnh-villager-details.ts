import detailsData from '../data/acnh-villager-details.json';
import type { AcnhVillagerDetails } from '../types';

export function getAcnhVillagerDetails(slug: string): AcnhVillagerDetails | undefined {
  return (detailsData.villagers as Record<string, AcnhVillagerDetails>)[slug];
}

export const acnhVillagerDetailsUpdatedAt = detailsData.updatedAt;
export const acnhVillagerDetailsSource = detailsData.source;

import catalog from '../data/nte-arcs.json';
import type { NteBuildItem } from '../types';

export type NteArcRarity = 'S' | 'A' | 'B';
export type NteArcType = 'Gas' | 'Liquid' | 'Plasma' | 'Solid' | 'Synthesis';

export interface NteArc {
  slug: string;
  name: string;
  rarity: NteArcRarity;
  type: NteArcType;
  atk: number;
  substat: string;
  effect: string;
  image?: string;
  sourceUrl: string;
}

export const nteArcCatalogMeta = {
  importedAt: catalog.importedAt,
  source: catalog.source,
  total: catalog.total,
};

export const nteArcs: NteArc[] = catalog.arcs as NteArc[];

const bySlug = new Map(nteArcs.map((a) => [a.slug, a]));
const byName = new Map(nteArcs.map((a) => [normalizeArcLookupKey(a.name), a]));

function normalizeArcLookupKey(name: string): string {
  return name
    .replace(/\s*\([SABC]\)\s*$/i, '')
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Strip guide suffix like "(S)" and resolve to catalog entry. */
export function findArcByDiskName(diskName: string): NteArc | undefined {
  const key = normalizeArcLookupKey(diskName);
  return byName.get(key);
}

export function getNteArcBySlug(slug: string): NteArc | undefined {
  return bySlug.get(slug);
}

export function getNteArcsByRarity(rarity: NteArcRarity): NteArc[] {
  return nteArcs.filter((a) => a.rarity === rarity);
}

export function enrichGuideDiskSets(diskSets: NteBuildItem[]): NteBuildItem[] {
  return diskSets.map((disk) => {
    const arc = findArcByDiskName(disk.name);
    if (!arc?.image) return disk;
    return { ...disk, image: disk.image ?? arc.image };
  });
}

export function hasNteArcs(gameSlug: string): boolean {
  return gameSlug === 'neverness-to-everness' && nteArcs.length > 0;
}

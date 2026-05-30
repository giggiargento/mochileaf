import catalog from './items-acnh-catalog.json';
import namesEsData from './items-acnh-names-es.json';

export type AcnhItemTabId =
  | 'housewares'
  | 'miscellaneous'
  | 'wall-mounted'
  | 'ceiling-decor'
  | 'wallpaper'
  | 'rugs'
  | 'flooring';

export interface AcnhCatalogItem {
  slug: string;
  name: string;
  image: string;
  buy?: string;
  sell?: string;
  source: string;
}

export interface AcnhItemTab {
  id: AcnhItemTabId;
  label: string;
}

const gameSlug = 'animal-crossing-new-horizons';

export const acnhItemTabs: AcnhItemTab[] = catalog.tabs as AcnhItemTab[];

export const acnhItemCatalogMeta = {
  importedAt: catalog.importedAt,
  source: catalog.source,
  imageCredit: catalog.imageCredit,
  total: catalog.total,
};

export function getAcnhItemsByTab(tabId: AcnhItemTabId): AcnhCatalogItem[] {
  const group = catalog.categories[tabId];
  return group?.items ?? [];
}

export function getAcnhItemTabsWithCounts(): (AcnhItemTab & { count: number })[] {
  return acnhItemTabs.map((tab) => ({
    ...tab,
    count: getAcnhItemsByTab(tab.id).length,
  }));
}

/** Serialized catalog for client-side tab rendering (avoids 2800+ nodes in static HTML). */
export function getAcnhItemCatalogForClient(): string {
  return JSON.stringify(catalog.categories);
}

/** Spanish display names keyed by `{categoryId}:{slug}`. */
export function getAcnhItemNamesEsForClient(): string {
  return JSON.stringify(namesEsData.names ?? {});
}

export function hasAcnhItems(gameSlugParam: string): boolean {
  return gameSlugParam === gameSlug && catalog.total > 0;
}

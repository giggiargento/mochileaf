import {
  formatCatalogPrice,
  formatCatalogSource,
} from '../lib/acnh-item-text';

type AcnhCatalogItem = {
  slug: string;
  name: string;
  image: string;
  buy?: string;
  sell?: string;
  source: string;
};

type CatalogCategories = Record<
  string,
  {
    label: string;
    items: AcnhCatalogItem[];
  }
>;

type ItemsI18n = {
  loading: string;
  noMatch: string;
  showingAll: string;
  loadMore: string;
  countOf: string;
  matchCount: string;
  buy: string;
  sell: string;
  source: string;
};

const PAGE_SIZE = 72;
const ITEM_IMG_FALLBACK = '/favicon.png';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTemplate(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}

function itemKey(categoryId: string, item: AcnhCatalogItem): string {
  return `${categoryId}:${item.slug}`;
}

function itemNameEs(
  categoryId: string,
  item: AcnhCatalogItem,
  namesEs: Record<string, string>,
): string | undefined {
  return namesEs[itemKey(categoryId, item)];
}

function itemTooltipLines(
  categoryId: string,
  item: AcnhCatalogItem,
  i18n: ItemsI18n,
  namesEs: Record<string, string>,
): string[] {
  const lines: string[] = [item.name];
  const es = itemNameEs(categoryId, item, namesEs);
  if (es && es !== item.name) lines.push(es);

  const buy = formatCatalogPrice(item.buy);
  const sell = formatCatalogPrice(item.sell);
  const source = formatCatalogSource(item.source);

  if (buy) lines.push(`${i18n.buy}: ${buy}`);
  if (sell) lines.push(`${i18n.sell}: ${sell}`);
  if (source) lines.push(`${i18n.source}: ${source}`);

  return lines;
}

function createItemCard(
  categoryId: string,
  item: AcnhCatalogItem,
  i18n: ItemsI18n,
  namesEs: Record<string, string>,
  showTooltip: (anchor: HTMLElement, lines: string[]) => void,
  hideTooltip: () => void,
): HTMLElement {
  const article = document.createElement('article');
  article.className = 'item-card item-card--compact cozy-card';
  article.tabIndex = 0;

  const media = document.createElement('div');
  media.className = 'item-card__media';

  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.name;
  img.width = 96;
  img.height = 96;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.referrerPolicy = 'no-referrer';
  img.className = 'item-card__img';
  img.setAttribute('data-image-component', 'true');
  img.addEventListener('error', () => {
    if (img.src.endsWith(ITEM_IMG_FALLBACK)) return;
    img.src = ITEM_IMG_FALLBACK;
    img.classList.add('item-card__img--fallback');
  });

  media.appendChild(img);

  const body = document.createElement('div');
  body.className = 'item-card__body';

  const name = document.createElement('h3');
  name.className = 'item-card__name';
  name.textContent = item.name;

  body.appendChild(name);

  const nameEs = itemNameEs(categoryId, item, namesEs);
  if (nameEs && nameEs !== item.name) {
    const es = document.createElement('p');
    es.className = 'item-card__name-es';
    es.textContent = nameEs;
    body.appendChild(es);
  }

  article.append(media, body);

  const lines = itemTooltipLines(categoryId, item, i18n, namesEs);
  const reveal = () => showTooltip(article, lines);
  const conceal = () => hideTooltip();

  article.addEventListener('mouseenter', reveal);
  article.addEventListener('mouseleave', conceal);
  article.addEventListener('focusin', reveal);
  article.addEventListener('focusout', (event) => {
    if (!article.contains(event.relatedTarget as Node | null)) conceal();
  });

  return article;
}

function readItemsI18n(): ItemsI18n {
  const el = document.getElementById('acnh-items-i18n');
  if (!el?.textContent) {
    return {
      loading: 'Loading items…',
      noMatch: 'No items match your search.',
      showingAll: 'Showing all {total} items',
      loadMore: 'Load more',
      countOf: '{shown} of {total} {label}',
      matchCount: '{match} match · {total} in tab',
      buy: 'Buy',
      sell: 'Sell',
      source: 'From',
    };
  }
  return JSON.parse(el.textContent) as ItemsI18n;
}

function readNamesEs(): Record<string, string> {
  const el = document.getElementById('acnh-items-names-es');
  if (!el?.textContent) return {};
  return JSON.parse(el.textContent) as Record<string, string>;
}

function initDirectory(root: HTMLElement) {
  const catalogEl = document.getElementById('acnh-items-catalog');
  if (!catalogEl?.textContent) return;

  const catalog = JSON.parse(catalogEl.textContent) as CatalogCategories;
  const i18n = readItemsI18n();
  const namesEs = readNamesEs();
  const defaultTab = root.dataset.defaultTab ?? 'housewares';
  let activeTab = defaultTab;
  let query = '';
  let visibleCount = PAGE_SIZE;

  const searchInput = root.querySelector<HTMLInputElement>('.acnh-item-directory__search');
  const countEl = root.querySelector('[data-item-count]');
  const paginationEl = root.querySelector('[data-item-pagination]');
  const tabButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-tab-panel]')];

  const tooltip = document.createElement('div');
  tooltip.className = 'item-card-tooltip';
  tooltip.hidden = true;
  tooltip.setAttribute('role', 'tooltip');
  root.appendChild(tooltip);

  let tooltipAnchor: HTMLElement | null = null;

  function hideTooltip() {
    tooltip.hidden = true;
    tooltipAnchor = null;
  }

  function showTooltip(anchor: HTMLElement, lines: string[]) {
    tooltipAnchor = anchor;
    tooltip.replaceChildren();
    lines.forEach((line, index) => {
      const p = document.createElement('p');
      if (index === 0) p.className = 'item-card-tooltip__title';
      else if (index === 1 && line !== lines[0]) p.className = 'item-card-tooltip__es';
      else p.className = 'item-card-tooltip__line';
      p.textContent = line;
      tooltip.append(p);
    });
    tooltip.hidden = false;
    positionTooltip(anchor);
  }

  function positionTooltip(anchor: HTMLElement) {
    const rect = anchor.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();
    const margin = 8;
    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    let top = rect.top - tipRect.height - margin;

    if (top < margin) top = rect.bottom + margin;
    left = Math.max(margin, Math.min(left, window.innerWidth - tipRect.width - margin));

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (tooltipAnchor && !tooltip.hidden) positionTooltip(tooltipAnchor);
    },
    true,
  );

  function itemsForTab(tabId: string): AcnhCatalogItem[] {
    return catalog[tabId]?.items ?? [];
  }

  function filteredItems(): AcnhCatalogItem[] {
    const items = itemsForTab(activeTab);
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const haystack = [item.name, itemNameEs(activeTab, item, namesEs), formatCatalogSource(item.source)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function renderPagination(total: number, shown: number) {
    if (!paginationEl) return;

    if (total === 0) {
      paginationEl.innerHTML = '';
      paginationEl.hidden = true;
      return;
    }

    if (shown >= total) {
      paginationEl.innerHTML =
        total <= PAGE_SIZE
          ? ''
          : `<p class="acnh-item-pagination__done text-sm text-muted">${formatTemplate(i18n.showingAll, {
              total: total.toLocaleString(),
            })}</p>`;
      paginationEl.hidden = shown >= total && total <= PAGE_SIZE;
      return;
    }

    paginationEl.hidden = false;
    paginationEl.innerHTML = `<button type="button" class="acnh-item-pagination__more" data-load-more>
      ${escapeHtml(i18n.loadMore)} <span class="text-muted">(${shown.toLocaleString()} of ${total.toLocaleString()})</span>
    </button>`;

    paginationEl.querySelector('[data-load-more]')?.addEventListener('click', () => {
      visibleCount += PAGE_SIZE;
      renderGrid();
    });
  }

  function renderGrid() {
    hideTooltip();
    const panel = panels.find((p) => p.dataset.tabPanel === activeTab);
    const grid = panel?.querySelector('[data-item-grid]');
    if (!grid) return;

    const items = filteredItems();
    const total = items.length;
    const slice = items.slice(0, visibleCount);
    grid.replaceChildren();
    if (slice.length > 0) {
      for (const item of slice) {
        grid.append(
          createItemCard(activeTab, item, i18n, namesEs, showTooltip, hideTooltip),
        );
      }
    } else {
      const empty = document.createElement('p');
      empty.className = 'col-span-full text-sm text-muted';
      empty.textContent = i18n.noMatch;
      grid.append(empty);
    }

    if (countEl) {
      const label = catalog[activeTab]?.label ?? activeTab;
      const tabTotal = itemsForTab(activeTab).length;
      countEl.textContent =
        query.trim() === ''
          ? formatTemplate(i18n.countOf, {
              shown: Math.min(visibleCount, total).toLocaleString(),
              total: tabTotal.toLocaleString(),
              label: label.toLowerCase(),
            })
          : formatTemplate(i18n.matchCount, {
              match: total.toLocaleString(),
              total: tabTotal.toLocaleString(),
            });
    }

    renderPagination(total, slice.length);
  }

  function setActiveTab(tabId: string) {
    activeTab = tabId;
    visibleCount = PAGE_SIZE;
    tabButtons.forEach((btn) => {
      const on = btn.dataset.tab === tabId;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      const on = panel.dataset.tabPanel === tabId;
      panel.classList.toggle('hidden', !on);
      if (on) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });
    renderGrid();
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      if (tabId) setActiveTab(tabId);
    });
  });

  searchInput?.addEventListener('input', () => {
    query = searchInput.value;
    visibleCount = PAGE_SIZE;
    renderGrid();
  });

  setActiveTab(defaultTab);
}

const initializedDirectories = new WeakSet<HTMLElement>();

function bootItemDirectories() {
  document.querySelectorAll<HTMLElement>('[data-acnh-item-directory]').forEach((root) => {
    if (initializedDirectories.has(root)) return;
    initializedDirectories.add(root);
    initDirectory(root);
  });
}

document.addEventListener('astro:page-load', bootItemDirectories);
bootItemDirectories();

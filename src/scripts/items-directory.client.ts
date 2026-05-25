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

const PAGE_SIZE = 72;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function itemCardHtml(item: AcnhCatalogItem): string {
  const bits = [
    item.source && item.source !== '—' ? item.source : '',
    item.buy ? `Buy: ${item.buy}` : '',
    item.sell ? `Sell: ${item.sell}` : '',
  ].filter(Boolean);
  const title = bits.length ? `${item.name} — ${bits.join(' · ')}` : item.name;

  return `<article class="item-card item-card--compact cozy-card" title="${escapeHtml(title)}">
  <div class="item-card__media">
    <img src="${escapeHtml(item.image)}" alt="" width="64" height="64" class="item-card__img" loading="lazy" decoding="async" />
  </div>
  <div class="item-card__body">
    <h3 class="item-card__name">${escapeHtml(item.name)}</h3>
  </div>
</article>`;
}

function initDirectory(root: HTMLElement) {
  const catalogEl = document.getElementById('acnh-items-catalog');
  if (!catalogEl?.textContent) return;

  const catalog = JSON.parse(catalogEl.textContent) as CatalogCategories;
  const defaultTab = root.dataset.defaultTab ?? 'housewares';
  let activeTab = defaultTab;
  let query = '';
  let visibleCount = PAGE_SIZE;

  const searchInput = root.querySelector<HTMLInputElement>('.acnh-item-directory__search');
  const countEl = root.querySelector('[data-item-count]');
  const paginationEl = root.querySelector('[data-item-pagination]');
  const tabButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-tab-panel]')];

  function itemsForTab(tabId: string): AcnhCatalogItem[] {
    return catalog[tabId]?.items ?? [];
  }

  function filteredItems(): AcnhCatalogItem[] {
    const items = itemsForTab(activeTab);
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q));
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
          : `<p class="acnh-item-pagination__done text-sm text-muted">Showing all ${total.toLocaleString()} items</p>`;
      paginationEl.hidden = shown >= total && total <= PAGE_SIZE;
      return;
    }

    paginationEl.hidden = false;
    paginationEl.innerHTML = `<button type="button" class="acnh-item-pagination__more" data-load-more>
      Load more <span class="text-muted">(${shown.toLocaleString()} of ${total.toLocaleString()})</span>
    </button>`;

    paginationEl.querySelector('[data-load-more]')?.addEventListener('click', () => {
      visibleCount += PAGE_SIZE;
      renderGrid();
    });
  }

  function renderGrid() {
    const panel = panels.find((p) => p.dataset.tabPanel === activeTab);
    const grid = panel?.querySelector('[data-item-grid]');
    if (!grid) return;

    const items = filteredItems();
    const total = items.length;
    const slice = items.slice(0, visibleCount);
    grid.innerHTML =
      slice.length > 0
        ? slice.map(itemCardHtml).join('')
        : '<p class="col-span-full text-sm text-muted">No items match your search.</p>';

    if (countEl) {
      const label = catalog[activeTab]?.label ?? activeTab;
      const tabTotal = itemsForTab(activeTab).length;
      countEl.textContent =
        query.trim() === ''
          ? `${Math.min(visibleCount, total).toLocaleString()} of ${tabTotal.toLocaleString()} ${label.toLowerCase()}`
          : `${total.toLocaleString()} match · ${tabTotal.toLocaleString()} in tab`;
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

document.querySelectorAll<HTMLElement>('[data-acnh-item-directory]').forEach(initDirectory);

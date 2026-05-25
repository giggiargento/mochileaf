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

  const searchInput = root.querySelector<HTMLInputElement>('.acnh-item-directory__search');
  const countEl = root.querySelector('[data-item-count]');
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

  function renderGrid() {
    const panel = panels.find((p) => p.dataset.tabPanel === activeTab);
    const grid = panel?.querySelector('[data-item-grid]');
    if (!grid) return;

    const items = filteredItems();
    grid.innerHTML = items.map(itemCardHtml).join('');

    if (countEl) {
      const label = catalog[activeTab]?.label ?? activeTab;
      const total = itemsForTab(activeTab).length;
      countEl.textContent =
        query.trim() === ''
          ? `${items.length.toLocaleString()} ${label.toLowerCase()}`
          : `${items.length.toLocaleString()} of ${total.toLocaleString()} ${label.toLowerCase()}`;
    }
  }

  function setActiveTab(tabId: string) {
    activeTab = tabId;
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
    renderGrid();
  });

  setActiveTab(defaultTab);
}

document.querySelectorAll<HTMLElement>('[data-acnh-item-directory]').forEach(initDirectory);

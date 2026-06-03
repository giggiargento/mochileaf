type VillagerDirI18n = {
  noMatch: string;
  matchCount: string;
  showingAll: string;
  filterSpecies: string;
  filterAll: string;
};

function formatTemplate(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}

function readI18n(root: HTMLElement): VillagerDirI18n {
  const el = root.querySelector('#acnh-villager-dir-i18n');
  if (!el?.textContent) {
    return {
      noMatch: 'No villagers match your filters.',
      matchCount: '{match} of {total}',
      showingAll: 'Showing all {total} villagers',
      filterSpecies: 'Species',
      filterAll: 'All',
    };
  }
  return JSON.parse(el.textContent) as VillagerDirI18n;
}

function initVillagerDirectory(root: HTMLElement): void {
  const cards = [...root.querySelectorAll<HTMLElement>('[data-villager-card]')];
  const searchInput = root.querySelector<HTMLInputElement>('.acnh-villager-directory__search');
  const countEl = root.querySelector<HTMLElement>('[data-villager-count]');
  const emptyEl = root.querySelector<HTMLElement>('[data-villager-empty]');
  const speciesButtons = root.querySelectorAll<HTMLButtonElement>('[data-species-filter]');
  const i18n = readI18n(root);

  if (!searchInput || !countEl || !emptyEl || cards.length === 0) return;

  let activeSpecies = 'all';

  function updateCount(visible: number): void {
    const total = cards.length;
    if (!searchInput.value.trim() && activeSpecies === 'all') {
      countEl.textContent = formatTemplate(i18n.showingAll, { total: String(total) });
    } else {
      countEl.textContent = formatTemplate(i18n.matchCount, {
        match: String(visible),
        total: String(total),
      });
    }
    emptyEl.classList.toggle('hidden', visible > 0);
  }

  function applyFilters(): void {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    for (const card of cards) {
      const searchBlob = card.dataset.search ?? '';
      const species = card.dataset.species ?? '';

      const matchesSearch = !query || searchBlob.includes(query);
      const matchesSpecies = activeSpecies === 'all' || species === activeSpecies;
      const show = matchesSearch && matchesSpecies;

      card.hidden = !show;
      if (show) visible += 1;
    }

    updateCount(visible);
  }

  searchInput.addEventListener('input', applyFilters);

  speciesButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeSpecies = button.dataset.speciesFilter ?? 'all';
      speciesButtons.forEach((btn) => {
        const active = btn === button;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      applyFilters();
    });
  });

  applyFilters();
}

function boot(): void {
  document.querySelectorAll<HTMLElement>('[data-acnh-villager-directory]').forEach(initVillagerDirectory);
}

boot();
document.addEventListener('astro:page-load', boot);

const THEME_KEY = 'mochileaf-theme';

export function resolveDark(): boolean {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark') return true;
  return false;
}

export function applyTheme(doc: Document = document): void {
  doc.documentElement.classList.toggle('dark', resolveDark());
}

function clearPortraitPreviewStyles(doc: Document = document): void {
  doc
    .querySelectorAll('.character-portrait-inner, .character-portrait-img')
    .forEach((el) => {
      el.removeAttribute('style');
    });
}

function settleCharacterDetailLayout(doc: Document = document): void {
  if (!doc.querySelector('.character-detail-grid')) return;
  clearPortraitPreviewStyles(doc);
  const panel = doc.querySelector<HTMLElement>('.character-detail-panel--balanced');
  if (panel) void panel.offsetHeight;
}

function onNavigate(): void {
  applyTheme();
  clearPortraitPreviewStyles();
  requestAnimationFrame(() => {
    settleCharacterDetailLayout();
    document.fonts?.ready.then(() => settleCharacterDetailLayout());
  });
}

applyTheme();

document.addEventListener('click', (event) => {
  const btn = (event.target as Element).closest('[data-theme-toggle]');
  if (!btn) return;

  const nextDark = !document.documentElement.classList.contains('dark');
  localStorage.setItem(THEME_KEY, nextDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', nextDark);
});

document.addEventListener('astro:before-swap', (event) => {
  applyTheme(event.newDocument);
  clearPortraitPreviewStyles(event.newDocument);
});

document.addEventListener('astro:page-load', onNavigate);
document.addEventListener('astro:after-swap', onNavigate);

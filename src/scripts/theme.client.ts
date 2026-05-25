const THEME_KEY = 'mochileaf-theme';

export function resolveDark(): boolean {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark') return true;
  return false;
}

export function applyTheme(doc: Document = document): void {
  doc.documentElement.classList.toggle('dark', resolveDark());
}

/** One Phosphor glyph: moon in light mode, sun in dark mode. */
export function syncThemeIcons(doc: Document = document): void {
  const dark = doc.documentElement.classList.contains('dark');
  doc.querySelectorAll('[data-theme-toggle] i').forEach((el) => {
    el.classList.remove('ph-moon', 'ph-sun');
    el.classList.add(dark ? 'ph-sun' : 'ph-moon');
  });
  doc.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  });
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
  syncThemeIcons();
  clearPortraitPreviewStyles();
  requestAnimationFrame(() => {
    settleCharacterDetailLayout();
    document.fonts?.ready.then(() => settleCharacterDetailLayout());
  });
}

applyTheme();
syncThemeIcons();

document.addEventListener('click', (event) => {
  const btn = (event.target as Element).closest('[data-theme-toggle]');
  if (!btn) return;

  const nextDark = !document.documentElement.classList.contains('dark');
  localStorage.setItem(THEME_KEY, nextDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', nextDark);
  syncThemeIcons();
});

document.addEventListener('astro:before-swap', (event) => {
  applyTheme(event.newDocument);
  syncThemeIcons(event.newDocument);
  clearPortraitPreviewStyles(event.newDocument);
});

document.addEventListener('astro:page-load', onNavigate);
document.addEventListener('astro:after-swap', onNavigate);

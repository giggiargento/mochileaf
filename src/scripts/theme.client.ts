const THEME_KEY = 'mochileaf-theme';

export function resolveDark(): boolean {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyTheme(doc: Document = document): void {
  doc.documentElement.classList.toggle('dark', resolveDark());
}

function clearPortraitPreviewStyles(): void {
  document
    .querySelectorAll('.character-portrait-inner, .character-portrait-img')
    .forEach((el) => {
      el.removeAttribute('style');
    });
}

function onNavigate(): void {
  applyTheme();
  clearPortraitPreviewStyles();
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
});

document.addEventListener('astro:page-load', onNavigate);
document.addEventListener('astro:after-swap', onNavigate);

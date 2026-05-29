/**
 * Locale preference (localStorage) + keep /es/* URLs while preference is Spanish.
 */
const LOCALE_KEY = 'mochileaf-locale';

export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/es' || pathname === '/es/') return '/';
  if (pathname.startsWith('/es/')) return pathname.slice(3) || '/';
  return pathname;
}

export function localeFromPath(pathname: string): 'en' | 'es' {
  return pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en';
}

export function pathForLocale(path: string, locale: 'en' | 'es'): string {
  const normalized = path.replace(/\/$/, '') || '/';
  if (locale === 'en') return normalized;
  if (normalized === '/') return '/es';
  return `/es${normalized}`;
}

/** English is default; Spanish only after an explicit pick in the language menu. */
function getPreferredLocale(): 'en' | 'es' {
  return localStorage.getItem(LOCALE_KEY) === 'es' ? 'es' : 'en';
}

function setPreferredLocale(locale: 'en' | 'es'): void {
  if (locale === 'es') {
    localStorage.setItem(LOCALE_KEY, 'es');
  } else {
    localStorage.removeItem(LOCALE_KEY);
  }
}

function isInternalPath(pathname: string): boolean {
  if (!pathname.startsWith('/')) return false;
  if (pathname.startsWith('/_astro')) return false;
  if (pathname.startsWith('/images')) return false;
  if (pathname.startsWith('/scripts')) return false;
  if (/\.[a-z0-9]{2,5}$/i.test(pathname)) return false;
  return true;
}

function localizedUrl(pathname: string, search: string, hash: string, locale: 'en' | 'es'): string {
  return pathForLocale(stripLocalePrefix(pathname), locale) + search + hash;
}

function ensureLocaleInUrl(): void {
  const preferred = getPreferredLocale();
  const urlLocale = localeFromPath(location.pathname);
  if (!isInternalPath(location.pathname)) return;

  if (preferred === 'es' && urlLocale !== 'es') {
    location.replace(
      localizedUrl(location.pathname, location.search, location.hash, 'es'),
    );
    return;
  }

  if (preferred === 'en' && urlLocale === 'es') {
    location.replace(
      localizedUrl(location.pathname, location.search, location.hash, 'en'),
    );
  }
}

function rewriteHref(href: string, locale: 'en' | 'es'): string | null {
  try {
    const url = new URL(href, location.origin);
    if (url.origin !== location.origin) return null;
    if (!isInternalPath(url.pathname)) return null;

    const target = localizedUrl(url.pathname, url.search, url.hash, locale);
    return target === url.pathname + url.search + url.hash ? null : target;
  } catch {
    return null;
  }
}

function navigateTo(href: string): void {
  if (href === location.pathname + location.search + location.hash) return;
  window.location.assign(href);
}

function onDocumentClick(event: MouseEvent): void {
  const target = event.target as Element | null;
  if (!target) return;

  const pick = target.closest<HTMLAnchorElement>('[data-locale-pick]');
  if (pick) {
    const code = pick.getAttribute('data-locale-pick');
    const href = pick.getAttribute('href');
    if (code === 'en' || code === 'es') {
      setPreferredLocale(code);
      if (href) {
        event.preventDefault();
        event.stopPropagation();
        closeAllLocaleMenus();
        navigateTo(href);
        return;
      }
    }
    closeAllLocaleMenus();
    return;
  }

  if (target.closest('[data-locale-trigger]')) {
    event.preventDefault();
    event.stopPropagation();
    toggleLocaleMenu(target.closest('[data-locale-dropdown]')!);
    return;
  }

  if (!target.closest('[data-locale-dropdown]')) {
    closeAllLocaleMenus();
  }

  const preferred = getPreferredLocale();
  if (preferred !== 'es') return;

  const anchor = target.closest<HTMLAnchorElement>('a[href]');
  if (!anchor || anchor.hasAttribute('data-locale-exempt')) return;

  const raw = anchor.getAttribute('href');
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return;

  const next = rewriteHref(raw, 'es');
  if (!next || next === raw) return;

  event.preventDefault();
  event.stopPropagation();
  navigateTo(next);
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') closeAllLocaleMenus();
}

function closeAllLocaleMenus(): void {
  document.querySelectorAll<HTMLElement>('[data-locale-dropdown]').forEach((root) => {
    const menu = root.querySelector<HTMLElement>('[data-locale-menu]');
    const trigger = root.querySelector<HTMLButtonElement>('[data-locale-trigger]');
    menu?.setAttribute('hidden', '');
    trigger?.setAttribute('aria-expanded', 'false');
    root.classList.remove('locale-dropdown--open');
  });
}

function toggleLocaleMenu(root: Element): void {
  const menu = root.querySelector<HTMLElement>('[data-locale-menu]');
  const trigger = root.querySelector<HTMLButtonElement>('[data-locale-trigger]');
  if (!menu || !trigger) return;

  const willOpen = menu.hasAttribute('hidden');
  closeAllLocaleMenus();

  if (willOpen) {
    menu.removeAttribute('hidden');
    trigger.setAttribute('aria-expanded', 'true');
    root.classList.add('locale-dropdown--open');
  }
}

function bindLocaleDropdownHover(): void {
  document.querySelectorAll<HTMLElement>('[data-locale-dropdown]').forEach((root) => {
    if (root.dataset.localeHoverBound === 'true') return;
    root.dataset.localeHoverBound = 'true';

    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    root.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        clearTimeout(closeTimer);
        closeAllLocaleMenus();
        const menu = root.querySelector<HTMLElement>('[data-locale-menu]');
        const trigger = root.querySelector<HTMLButtonElement>('[data-locale-trigger]');
        menu?.removeAttribute('hidden');
        trigger?.setAttribute('aria-expanded', 'true');
        root.classList.add('locale-dropdown--open');
      }
    });

    root.addEventListener('mouseleave', () => {
      if (!window.matchMedia('(hover: hover)').matches) return;
      closeTimer = setTimeout(() => {
        if (!root.matches(':hover')) closeAllLocaleMenus();
      }, 120);
    });
  });
}

function onBeforePreparation(event: Event): void {
  const preferred = getPreferredLocale();
  if (preferred !== 'es') return;

  const detail = event as CustomEvent & { to?: URL; sourceElement?: Element };
  const to = detail.to;
  if (!to || to.origin !== location.origin) return;
  if (!isInternalPath(to.pathname)) return;
  if (localeFromPath(to.pathname) === 'es') return;

  const fixed = new URL(localizedUrl(to.pathname, to.search, to.hash, 'es'), to.origin);
  if (fixed.href === to.href) return;

  event.preventDefault();
  navigateTo(fixed.href);
}

function initLocale(): void {
  ensureLocaleInUrl();
  bindLocaleDropdownHover();
}

document.addEventListener('click', onDocumentClick, true);
document.addEventListener('keydown', onDocumentKeydown);
document.addEventListener('astro:before-preparation', onBeforePreparation);
document.addEventListener('astro:page-load', initLocale);

initLocale();

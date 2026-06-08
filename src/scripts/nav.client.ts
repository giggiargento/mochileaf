/** Mobile menu + collapsible nav groups (touch-friendly, survives View Transitions). */

function stripLocalePrefix(pathname: string): string {
  if (pathname === '/es' || pathname === '/es/') return '/';
  if (pathname.startsWith('/es/')) return pathname.slice(3) || '/';
  return pathname;
}

function normalizeNavPath(path: string): string {
  const trimmed = stripLocalePrefix(path).replace(/\/$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function findBestNavLink(links: HTMLAnchorElement[], path: string): HTMLAnchorElement | undefined {
  const matches = links.filter((a) => {
    const href = normalizeNavPath(a.getAttribute('href') || '');
    return path === href || (href !== '/' && path.startsWith(`${href}/`));
  });
  if (!matches.length) return undefined;
  return matches.sort(
    (a, b) =>
      normalizeNavPath(b.getAttribute('href') || '').length -
      normalizeNavPath(a.getAttribute('href') || '').length,
  )[0];
}

function isNavParentActiveForPath(
  itemHref: string,
  path: string,
  childHrefs: string[],
): boolean {
  const href = normalizeNavPath(itemHref);
  if (path === href || (href !== '/' && path.startsWith(`${href}/`))) return true;
  return childHrefs.some((childHref) => {
    const ch = normalizeNavPath(childHref);
    return path === ch || path.startsWith(`${ch}/`);
  });
}

/** Strip preview/HMR inline overrides on game hub tabs (same issue as character portraits). */
function clearGameHubTabPreviewStyles(doc: Document = document) {
  doc.querySelectorAll('[data-game-hub-tabs], .game-hub-mobile-tab').forEach((el) => {
    el.removeAttribute('style');
  });
}

/** Persisted tabs keep old markup — sync from incoming page before swap. */
function mergeGameHubTabsFromNewDocument(newDoc: Document) {
  const incoming = newDoc.querySelector('[data-game-hub-tabs]');
  const current = document.querySelector('[data-game-hub-tabs]');
  if (!incoming || !current) return;

  current.innerHTML = incoming.innerHTML;
  const ariaLabel = incoming.getAttribute('aria-label');
  if (ariaLabel) current.setAttribute('aria-label', ariaLabel);
  clearGameHubTabPreviewStyles();
}

/** Re-apply active nav styles after View Transitions (persisted sidebar keeps stale SSR classes). */
function syncNavActiveState() {
  const path = normalizeNavPath(stripLocalePrefix(location.pathname));

  document.querySelectorAll<HTMLElement>('[data-nav-sidebar] nav, #mobile-menu').forEach((navRoot) => {
    const links = Array.from(navRoot.querySelectorAll<HTMLAnchorElement>('a.nav-link[href]'));

    links.forEach((a) => {
      a.classList.remove('nav-link-active');
      a.removeAttribute('aria-current');
    });
    navRoot.querySelectorAll('.nav-group').forEach((group) => {
      group.classList.remove('nav-group-open');
      const toggle = group.querySelector('[data-nav-toggle]');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });

    const best = findBestNavLink(links, path);
    const bestHref = best ? normalizeNavPath(best.getAttribute('href') || '') : null;

    navRoot.querySelectorAll('.nav-group').forEach((group) => {
      const parentLink = group.querySelector<HTMLAnchorElement>('a.nav-link:not(.nav-link-sub)');
      const childLinks = Array.from(
        group.querySelectorAll<HTMLAnchorElement>('a.nav-link-sub'),
      );
      if (!parentLink) return;

      const childHrefs = childLinks.map((a) => a.getAttribute('href') || '');
      const parentHref = parentLink.getAttribute('href') || '';
      const hasChildren = childLinks.length > 0;

      if (hasChildren) {
        const parentActive = isNavParentActiveForPath(parentHref, path, childHrefs);
        if (parentActive) {
          parentLink.classList.add('nav-link-active');
          group.classList.add('nav-group-open');
          const toggle = group.querySelector('[data-nav-toggle]');
          toggle?.setAttribute('aria-expanded', 'true');
        }
        childLinks.forEach((child) => {
          const ch = normalizeNavPath(child.getAttribute('href') || '');
          if (bestHref !== null && ch === bestHref) {
            child.classList.add('nav-link-active');
            child.setAttribute('aria-current', 'page');
          }
        });
      } else {
        const href = normalizeNavPath(parentHref);
        if (bestHref !== null && href === bestHref) {
          parentLink.classList.add('nav-link-active');
          parentLink.setAttribute('aria-current', 'page');
        }
      }
    });
  });

  syncGameHubTabs();
}

function syncGameHubTabs() {
  const row = document.querySelector('[data-game-hub-tabs]');
  if (!row) return;

  clearGameHubTabPreviewStyles();

  const path = normalizeNavPath(stripLocalePrefix(location.pathname));
  const links = Array.from(
    row.querySelectorAll<HTMLAnchorElement>('a.game-hub-mobile-tab[href]'),
  );

  links.forEach((a) => {
    a.classList.remove('is-active', 'nav-link', 'nav-link-active');
    a.removeAttribute('aria-current');
  });

  const best = findBestNavLink(links, path);
  if (!best) return;

  best.classList.add('is-active');
  best.setAttribute('aria-current', 'page');
  best.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' });
}

function syncMenuIcon() {
  const btn = document.querySelector('#mobile-menu-btn');
  const icon = btn?.querySelector('i');
  if (!btn || !icon) return;
  const open = btn.getAttribute('aria-expanded') === 'true';
  icon.classList.remove('ph-list', 'ph-x');
  icon.classList.add(open ? 'ph-x' : 'ph-list');
}

function closeMobileMenu() {
  const menu = document.querySelector('#mobile-menu');
  const btn = document.querySelector('#mobile-menu-btn');
  if (!menu || !btn) return;

  menu.classList.add('hidden');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Open menu');
  syncMenuIcon();
}

function toggleMobileMenu() {
  const menu = document.querySelector('#mobile-menu');
  const btn = document.querySelector('#mobile-menu-btn');
  if (!menu || !btn) return;

  const isOpen = menu.classList.toggle('hidden') === false;
  btn.setAttribute('aria-expanded', String(isOpen));
  btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  syncMenuIcon();
}

function onNavClick(event: Event) {
  const target = event.target as Element | null;
  if (!target) return;

  if (target.closest('#mobile-menu-btn')) {
    event.preventDefault();
    toggleMobileMenu();
    return;
  }

  const toggle = target.closest('[data-nav-toggle]');
  if (toggle) {
    event.preventDefault();
    const group = toggle.closest('.nav-group');
    if (!group) return;
    const isOpen = group.classList.toggle('nav-group-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    return;
  }

  if (target.closest('#mobile-menu a[href]') && !target.closest('[data-nav-toggle]')) {
    closeMobileMenu();
  }
}

document.addEventListener('astro:before-swap', (event) => {
  mergeGameHubTabsFromNewDocument(event.newDocument);
  clearGameHubTabPreviewStyles(event.newDocument);
});

document.addEventListener('click', onNavClick);
document.addEventListener('astro:page-load', () => {
  closeMobileMenu();
  clearGameHubTabPreviewStyles();
  syncNavActiveState();
});
document.addEventListener('astro:after-swap', () => {
  clearGameHubTabPreviewStyles();
  syncGameHubTabs();
});

closeMobileMenu();
syncNavActiveState();

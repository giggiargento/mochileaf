/** Mobile menu + collapsible nav groups (touch-friendly, survives View Transitions). */

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

document.addEventListener('click', onNavClick);
document.addEventListener('astro:page-load', closeMobileMenu);
closeMobileMenu();

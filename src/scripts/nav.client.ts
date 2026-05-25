/** Mobile menu + collapsible nav groups (touch-friendly, survives View Transitions). */
function closeMobileMenu() {
  const menu = document.querySelector('#mobile-menu');
  const btn = document.querySelector('#mobile-menu-btn');
  if (!menu || !btn) return;

  menu.classList.add('hidden');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Open menu');
  btn.querySelector('.menu-open')?.classList.remove('hidden');
  btn.querySelector('.menu-close')?.classList.add('hidden');
}

function toggleMobileMenu() {
  const menu = document.querySelector('#mobile-menu');
  const btn = document.querySelector('#mobile-menu-btn');
  if (!menu || !btn) return;

  const isOpen = menu.classList.toggle('hidden') === false;
  btn.setAttribute('aria-expanded', String(isOpen));
  btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  btn.querySelector('.menu-open')?.classList.toggle('hidden', isOpen);
  btn.querySelector('.menu-close')?.classList.toggle('hidden', !isOpen);
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

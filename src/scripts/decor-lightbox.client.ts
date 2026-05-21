const CLOSE_MS = 280;

function initDecorLightbox(root: ParentNode) {
  const dialog = root.querySelector<HTMLDialogElement>('.decor-lightbox');
  if (!dialog) return;

  const shell = dialog.querySelector<HTMLElement>('[data-decor-lightbox-shell]');
  const img = dialog.querySelector<HTMLImageElement>('[data-decor-lightbox-img]');
  const titleEl = dialog.querySelector<HTMLElement>('[data-decor-lightbox-title]');
  const pinterestLink = dialog.querySelector<HTMLAnchorElement>('[data-decor-lightbox-pinterest]');
  const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-decor-lightbox-close]');

  if (!img || !titleEl || !pinterestLink || !shell) return;

  let lastTrigger: HTMLButtonElement | null = null;
  let closing = false;

  const finishClose = () => {
    closing = false;
    shell.classList.remove('is-ready', 'is-closing');
    dialog.classList.remove('is-closing');
    dialog.close();
    document.body.classList.remove('decor-lightbox-open');
    lastTrigger?.focus();
  };

  const close = () => {
    if (!dialog.open || closing) return;
    closing = true;
    shell.classList.remove('is-ready');
    shell.classList.add('is-closing');
    dialog.classList.add('is-closing');
    window.setTimeout(finishClose, CLOSE_MS);
  };

  const reveal = () => {
    document.body.classList.add('decor-lightbox-open');
    dialog.showModal();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => shell.classList.add('is-ready'));
    });
  };

  const open = (trigger: HTMLButtonElement) => {
    const src = trigger.dataset.image;
    const title = trigger.dataset.title ?? 'Decor inspiration';
    const pinUrl = trigger.dataset.sourceUrl?.trim();

    if (!src) return;

    lastTrigger = trigger;
    closing = false;
    shell.classList.remove('is-ready', 'is-closing');
    dialog.classList.remove('is-closing');
    titleEl.textContent = title;

    if (pinUrl) {
      pinterestLink.href = pinUrl;
      pinterestLink.hidden = false;
    } else {
      pinterestLink.href = '#';
      pinterestLink.hidden = true;
    }

    const show = () => {
      img.alt = title;
      reveal();
    };

    img.onload = show;
    img.onerror = show;
    img.src = src;

    if (img.complete) show();
  };

  root.querySelectorAll<HTMLButtonElement>('[data-decor-preview]').forEach((btn) => {
    btn.addEventListener('click', () => open(btn));
  });

  closeBtn?.addEventListener('click', close);

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });

  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.open) close();
  });
}

document.querySelectorAll('[data-decor-gallery]').forEach((gallery) => {
  initDecorLightbox(gallery);
});

document.addEventListener('astro:page-load', () => {
  document.querySelectorAll('[data-decor-gallery]').forEach((gallery) => {
    initDecorLightbox(gallery);
  });
});

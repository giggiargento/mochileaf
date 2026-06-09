type WallpaperData = {
  slug: string;
  title: string;
  image: string;
};

const ROTATE_MS = 5000;
const CROSSFADE_MS = 1200;

function pickNext(pool: WallpaperData[], currentSlug: string, otherSlugs: string[]): WallpaperData {
  const candidates = pool.filter((w) => w.slug !== currentSlug && !otherSlugs.includes(w.slug));
  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  const fallback = pool.filter((w) => w.slug !== currentSlug);
  return fallback[Math.floor(Math.random() * fallback.length)] ?? pool[0];
}

function getLayers(slot: HTMLElement): HTMLImageElement[] {
  return [...slot.querySelectorAll<HTMLImageElement>('[data-wallpaper-layer]')];
}

function getVisibleLayer(layers: HTMLImageElement[]): HTMLImageElement | undefined {
  return layers.find((layer) => layer.classList.contains('is-visible'));
}

function getHiddenLayer(layers: HTMLImageElement[]): HTMLImageElement | undefined {
  return layers.find((layer) => !layer.classList.contains('is-visible'));
}

async function preloadImage(src: string): Promise<void> {
  const img = new Image();
  img.src = src;
  if (img.decode) {
    await img.decode();
    return;
  }
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Image failed to load'));
  });
}

function crossfade(slot: HTMLElement, next: WallpaperData) {
  const layers = getLayers(slot);
  const outgoing = getVisibleLayer(layers);
  const incoming = getHiddenLayer(layers);
  if (!outgoing || !incoming || slot.dataset.swapping === 'true') return;

  slot.dataset.swapping = 'true';

  const finishSwap = () => {
    outgoing.classList.remove('is-visible', 'is-fading-out');
    outgoing.alt = '';
    outgoing.setAttribute('aria-hidden', 'true');

    incoming.classList.remove('is-fading-in');
    incoming.classList.add('is-visible');
    incoming.removeAttribute('aria-hidden');

    slot.classList.remove('is-crossfading');
    slot.dataset.slug = next.slug;
    slot.dataset.swapping = 'false';
  };

  void preloadImage(next.image)
    .then(() => {
      incoming.src = next.image;
      incoming.alt = next.title;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          slot.classList.add('is-crossfading');
          outgoing.classList.add('is-fading-out');
          incoming.classList.add('is-fading-in');

          let finished = false;
          const complete = () => {
            if (finished) return;
            finished = true;
            incoming.removeEventListener('transitionend', onDone);
            finishSwap();
          };

          const onDone = (event: TransitionEvent) => {
            if (event.target !== incoming || event.propertyName !== 'opacity') return;
            complete();
          };

          incoming.addEventListener('transitionend', onDone);
          window.setTimeout(complete, CROSSFADE_MS + 100);
        });
      });
    })
    .catch(() => {
      slot.dataset.swapping = 'false';
    });
}

function initHomeWallpaperPreview(root: HTMLElement) {
  if (root.dataset.initialized === 'true') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const poolEl = root.querySelector<HTMLScriptElement>('[data-wallpaper-pool]');
  const poolText = poolEl?.textContent?.trim();
  if (!poolText) return;

  let pool: WallpaperData[];
  try {
    pool = JSON.parse(poolText) as WallpaperData[];
  } catch {
    return;
  }
  if (pool.length <= 1) return;

  const slots = [...root.querySelectorAll<HTMLElement>('[data-wallpaper-slot]')];
  if (slots.length === 0) return;

  root.dataset.initialized = 'true';
  let slotIndex = 0;

  const tick = () => {
    const slot = slots[slotIndex];
    if (!slot) return;

    const currentSlug = slot.dataset.slug ?? '';
    const otherSlugs = slots
      .filter((_, index) => index !== slotIndex)
      .map((s) => s.dataset.slug ?? '')
      .filter(Boolean);
    const next = pickNext(pool, currentSlug, otherSlugs);

    crossfade(slot, next);
    slotIndex = (slotIndex + 1) % slots.length;
  };

  const intervalId = window.setInterval(tick, ROTATE_MS);
  root.dataset.intervalId = String(intervalId);
}

function teardownHomeWallpaperPreviews() {
  document.querySelectorAll<HTMLElement>('[data-home-wallpaper-preview]').forEach((root) => {
    const intervalId = root.dataset.intervalId;
    if (intervalId) window.clearInterval(Number(intervalId));
    delete root.dataset.initialized;
    delete root.dataset.intervalId;
  });
}

function mountHomeWallpaperPreviews() {
  document.querySelectorAll<HTMLElement>('[data-home-wallpaper-preview]').forEach(initHomeWallpaperPreview);
}

mountHomeWallpaperPreviews();
document.addEventListener('astro:page-load', mountHomeWallpaperPreviews);
document.addEventListener('astro:before-preparation', teardownHomeWallpaperPreviews);

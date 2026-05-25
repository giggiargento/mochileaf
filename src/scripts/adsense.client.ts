/** One push per ad unit (required by AdSense). Safe before the library loads — uses the queue pattern. */
function pushEachAdUnit(root: ParentNode = document) {
  root.querySelectorAll('ins.adsbygoogle').forEach(() => {
    try {
      const w = window as Window & { adsbygoogle?: { push: (x: object) => void } };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      /* already filled */
    }
  });
}

/** Re-fill after Astro client navigations (new ins nodes, inline scripts do not re-run). */
document.addEventListener('astro:page-load', () => pushEachAdUnit());

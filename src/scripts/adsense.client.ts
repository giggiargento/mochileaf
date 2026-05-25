/** Request ad fill after Astro client navigations (View Transitions). */
function pushAdSense() {
  try {
    const w = window as Window & { adsbygoogle?: unknown[] };
    w.adsbygoogle = w.adsbygoogle || [];
    w.adsbygoogle.push({});
  } catch {
    /* AdSense throws if a slot was already filled — safe to ignore. */
  }
}

document.addEventListener('astro:page-load', pushAdSense);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', pushAdSense);
} else {
  pushAdSense();
}

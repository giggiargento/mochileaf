/**
 * After Astro View Transitions, new <ins> nodes need a fill request.
 * Initial page load is handled by the inline push in AdPlaceholder.astro.
 */
(function () {
  var root = document.documentElement;
  if (!root.getAttribute('data-adsense-client')) return;

  var UNIT = 'data-adsense-requested';

  function hostAllowed() {
    if (root.getAttribute('data-adsense-allow-localhost') === 'true') return true;
    var hosts = (root.getAttribute('data-adsense-hosts') || 'mochileaf.com,www.mochileaf.com')
      .split(',')
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
    var h = location.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return false;
    return hosts.indexOf(h) !== -1;
  }

  if (!hostAllowed()) return;

  function pushNewUnits() {
    document.querySelectorAll('ins.adsbygoogle:not([' + UNIT + '])').forEach(function (ins) {
      if (ins.querySelector('iframe')) {
        ins.setAttribute(UNIT, 'true');
        return;
      }
      ins.setAttribute(UNIT, 'true');
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) { /* already filled */ }
    });
  }

  function markFilledSlots() {
    document.querySelectorAll('.ad-slot-frame').forEach(function (slot) {
      if (slot.querySelector('.adsbygoogle iframe')) {
        slot.classList.add('ad-slot--filled');
      }
    });
  }

  /** Hide empty ins height when Google returns no fill (400). */
  function tidyUnfilledSlots() {
    window.setTimeout(function () {
      document.querySelectorAll('.ad-slot .adsbygoogle').forEach(function (ins) {
        var slot = ins.closest('.ad-slot');
        if (!slot) return;
        if (ins.querySelector('iframe')) {
          slot.classList.add('ad-slot--filled');
          return;
        }
        ins.style.height = '0';
        ins.style.minHeight = '0';
      });
    }, 5000);
  }

  function refresh() {
    pushNewUnits();
    markFilledSlots();
    tidyUnfilledSlots();
  }

  document.addEventListener('astro:page-load', refresh);
  refresh();
})();

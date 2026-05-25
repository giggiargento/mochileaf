/**
 * AdSense bootstrap — plain script (no Astro data-astro-exec).
 * Skips localhost and non-allowed hosts to avoid doubleclick 400 noise in dev.
 */
(function () {
  var root = document.documentElement;
  var client = root.getAttribute('data-adsense-client');
  if (!client) return;

  var allowLocal = root.getAttribute('data-adsense-allow-localhost') === 'true';
  var hostsAttr = root.getAttribute('data-adsense-hosts') || 'mochileaf.com,www.mochileaf.com';
  var allowedHosts = hostsAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  var hostname = location.hostname;

  function hostAllowed() {
    if (allowLocal) return true;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') return false;
    return allowedHosts.indexOf(hostname) !== -1;
  }

  if (!hostAllowed()) return;

  var LIB = 'data-mochileaf-adsense-lib';
  var UNIT = 'data-adsense-requested';

  function loadLibrary() {
    return new Promise(function (resolve) {
      var existing = document.querySelector('script[' + LIB + ']');
      if (existing) {
        if (existing.getAttribute('data-loaded') === 'true') resolve();
        else existing.addEventListener('load', function () { resolve(); }, { once: true });
        return;
      }
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(client);
      s.crossOrigin = 'anonymous';
      s.setAttribute(LIB, 'true');
      s.addEventListener('load', function () {
        s.setAttribute('data-loaded', 'true');
        resolve();
      });
      s.addEventListener('error', function () { resolve(); });
      document.head.appendChild(s);
    });
  }

  function pushUnits(scope) {
    var rootNode = scope || document;
    rootNode.querySelectorAll('ins.adsbygoogle:not([' + UNIT + '])').forEach(function (ins) {
      ins.setAttribute(UNIT, 'true');
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) { /* slot already filled */ }
    });
  }

  function refresh() {
    loadLibrary().then(function () { pushUnits(); });
  }

  refresh();
  document.addEventListener('astro:page-load', function () { refresh(); });
})();

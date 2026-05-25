/**
 * AdSense bootstrap — plain script (no Astro data-astro-exec).
 * The adsbygoogle.js tag in <head> must not have any custom data-* attributes.
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

  var UNIT = 'data-adsense-requested';
  var libSrc =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
    encodeURIComponent(client);
  var libPromise = null;

  function findLibraryScript() {
    var scripts = document.head.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      if ((scripts[i].src || '') === libSrc) return scripts[i];
    }
    return null;
  }

  function loadLibrary() {
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve) {
      var existing = findLibraryScript();
      if (existing) {
        if (existing.readyState === 'complete' || existing.readyState === 'loaded') {
          resolve();
          return;
        }
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', resolve, { once: true });
        return;
      }

      var s = document.createElement('script');
      s.async = true;
      s.src = libSrc;
      s.crossOrigin = 'anonymous';
      s.addEventListener('load', resolve, { once: true });
      s.addEventListener('error', resolve, { once: true });
      document.head.appendChild(s);
    });
    return libPromise;
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
    loadLibrary().then(function () {
      pushUnits();
    });
  }

  refresh();
  document.addEventListener('astro:page-load', function () {
    refresh();
  });
})();

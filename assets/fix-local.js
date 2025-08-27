/* Zenfeel local fixer v3 – fixes file:// paths and adds fallbacks */
(() => {
  if (location.protocol !== 'file:') return;

  const fixAttr = (el, attr) => {
    const v = el.getAttribute(attr);
    if (!v) return;
    // /assets/...  -> assets/...
    if (v.startsWith('/assets/')) el.setAttribute(attr, v.replace('/assets/', 'assets/'));
    // URL absolue du site -> relative
    if (v.startsWith('/')) el.setAttribute(attr, v.substring(1));
  };

  // Réécrit src/href/srcset
  document.querySelectorAll('img, source, link, a, script').forEach(el => {
    ['src', 'href', 'srcset'].forEach(a => fixAttr(el, a));
  });

  // Fallback images
  const fallback = 'assets/img/default.jpg';
  document.querySelectorAll('img').forEach(img => {
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      if (!img.src.includes(fallback)) img.src = fallback;
    }, { once: true });
  });

  // Brand fallback
  const brand = document.querySelector('header .brand img');
  if (brand) brand.addEventListener('error', () => {
    const span = document.createElement('span');
    span.textContent = 'Zenfeel';
    span.style.fontWeight = '700';
    brand.replaceWith(span);
  }, { once: true });

  // Favicon/manifest
  document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="manifest"]').forEach(l => fixAttr(l, 'href'));

  // Liens internes commençant par /xxx.html -> xxx.html
  document.querySelectorAll('a[href^="/"]').forEach(a => {
    a.setAttribute('href', a.getAttribute('href').slice(1));
  });
})();
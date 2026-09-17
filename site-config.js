window.siteConfig = window.siteConfig || {
  brand: 'JI - Flight Tools',
  logo: 'assets/logo-jiflighttools.jpeg',
  favicons: [
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'assets/favicons/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'assets/favicons/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '48x48', href: 'assets/favicons/favicon-48x48.png' },
    { rel: 'icon', type: 'image/png', sizes: '256x256', href: 'assets/favicons/favicon-256x256.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: 'assets/favicons/favicon-180x180.png' }
  ],
  titles: {
    inicio: 'JI - Flight Tools — Inicio',
    calendario: 'JI - Flight Tools — Calendario',
    perneras: 'JI - Flight Tools — Perneras',
    comms: 'JI - Flight Tools — Comms',
    brevities: 'JI - Flight Tools — Brevities'
  }
};

(function () {
  var config = window.siteConfig;
  var page = document.body && document.body.dataset && document.body.dataset.page
    ? document.body.dataset.page
    : 'inicio';

  if (config.titles && config.titles[page]) {
    document.title = config.titles[page];
  } else if (config.brand) {
    document.title = config.brand;
  }

  if (config.favicons) {
    config.favicons.forEach(function (favicon) {
      var iconLink = document.createElement('link');
      iconLink.rel = favicon.rel;
      if (favicon.type) iconLink.type = favicon.type;
      if (favicon.sizes) iconLink.sizes = favicon.sizes;
      iconLink.href = favicon.href;
      document.head.appendChild(iconLink);
    });
  }
})();

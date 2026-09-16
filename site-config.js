window.siteConfig = window.siteConfig || {
  brand: 'JI - Flight Tools',
  logo: 'assets/logo-jiflighttools.jpeg',
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

  if (!document.querySelector('link[rel="icon"]')) {
    var iconLink = document.createElement('link');
    iconLink.rel = 'icon';
    iconLink.type = 'image/jpeg';
    iconLink.href = config.logo || 'assets/logo-jiflighttools.jpeg';
    document.head.appendChild(iconLink);
  }
})();

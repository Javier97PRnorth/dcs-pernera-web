(function () {
  function renderSharedNav() {
    var navRoot = document.getElementById('site-nav-root');
    if (!navRoot) return;

    navRoot.innerHTML = [
      '<nav class="top-nav">',
      '  <div class="nav-left"><a class="brand" href="index.html">Pernera Digital DCS</a></div>',
      '  <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="site-menu">',
      '    <span></span><span></span><span></span>',
      '  </button>',
      '  <div class="nav-links" id="site-menu">',
      '    <a href="index.html">Inicio</a>',
      '    <a href="calendario.html">Calendario</a>',
      '    <a href="perneras.html">Perneras</a>',
      '    <a href="comms.html">Comms</a>',
      '    <a href="brevities.html">Brevities</a>',
      '  </div>',
      '</nav>'
    ].join('');

    var current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var links = navRoot.querySelectorAll('.nav-links a');

    links.forEach(function (link) {
      var href = (link.getAttribute('href') || '').toLowerCase();
      if (href === current) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  renderSharedNav();
})();

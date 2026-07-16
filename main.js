/* ===========================
   FILE: main.js
   =========================== */
document.addEventListener('DOMContentLoaded', function () {
  var menuToggle = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    function closeMenu() {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 760) closeMenu();
      });
    });

    document.addEventListener('click', function (e) {
      if (window.innerWidth < 760 && !navLinks.contains(e.target) && e.target !== menuToggle) {
        closeMenu();
      }
    });
  }

  function setChecklistState(btn, done) {
    btn.classList.toggle('is-done', done);
    btn.setAttribute('aria-pressed', done ? 'true' : 'false');
    var key = btn.getAttribute('data-key');
    if (!key) return;
    try {
      localStorage.setItem('dcs-checklist-' + key, done ? 'done' : 'pending');
    } catch (e) {}
  }

  function refreshToggleAllButton(panel) {
    var button = panel.querySelector('.toggle-all-checklist');
    if (!button) return;
    var items = panel.querySelectorAll('.check-item');
    var allDone = items.length > 0 && Array.from(items).every(function (item) {
      return item.classList.contains('is-done');
    });
    button.textContent = allDone ? 'Desmarcar todo' : 'Marcar todo';
  }

  var chuckGuides = {
    tf51: {
      summary: 'Prioriza el arranque limpio, la estabilidad del motor y la preparación de vuelo antes de mover el avión.',
      items: [
        'Verifica que el carburador, la bomba de combustible y las RPM estén en la posición correcta.',
        'Asegura el calentamiento del motor antes de salir del parking.',
        'Revisa trim, oxígeno y radio antes del taxi.'
      ]
    },
    p47: {
      summary: 'Este avión necesita una preparación muy ordenada de combustible, presión y enfriamiento antes del despegue.',
      items: [
        'Comprueba el estado del carburador, el selector de tanques y los flaps de enfriamiento.',
        'Haz un calentamiento estable antes de subir RPM.',
        'No olvides el setup de trim y de radios antes de la salida.'
      ]
    },
    f4u1d: {
      summary: 'La clave está en el cebado correcto, la presión de aceite y el setup de mezcla antes de arrancar.',
      items: [
        'Revisa la posición del selector de combustible y del arrancador.',
        'Confirma el calentamiento y la presión de aceite antes de salir.',
        'Prepara el uso de flaps y de supercargador para el primer tramo.'
      ]
    },
    bf109: {
      summary: 'Este avión exige un arranque preciso y un calentamiento claro para evitar problemas en la salida.',
      items: [
        'Verifica bombas de combustible, magnetos e ignición antes de arrancar.',
        'Asegura el calentamiento del motor y la estabilidad del refrigerante.',
        'Prepara radiadores, oxígeno y radio para el taxi y el despegue.'
      ]
    },
    fw190a8: {
      summary: 'El calentamiento del motor y el control de presión de combustible son lo más importante aquí.',
      items: [
        'Comprueba la presión de combustible antes de dar el arranque.',
        'Mantén el calentamiento progresivo hasta que el aceite y el motor estén estables.',
        'Prepara flaps, cúpula y oxígeno antes de la salida.'
      ]
    },
    fw190d9: {
      summary: 'Necesita un arranque limpio y un calentamiento firme para dejar el motor en buen estado.',
      items: [
        'Revisa la presión de combustible y el estado de los flaps de enfriamiento.',
        'Asegura el calentamiento del aceite y del refrigerante antes de la salida.',
        'No olvides el setup de cúpula, oxígeno y tren antes del taxi.'
      ]
    },
    spitfire: {
      summary: 'La guía breve aquí es: preparar carburador, mezcla y calentamiento antes de cualquier movimiento.',
      items: [
        'Comprueba la posición del filtro del carburador y del selector de combustible.',
        'Asegura el calentamiento del motor antes de salir.',
        'Revisa radio, oxígeno y trim antes de la toma.'
      ]
    },
    mosquito: {
      summary: 'Para este avión, la clave es la preparación de combustible, radiadores y motores antes del movimiento.',
      items: [
        'Revisa válvulas de combustible, presión y transferencia de combustible.',
        'Confirma el cebado de motores y el calentamiento antes de salir.',
        'Prepara trim, oxígeno y radio para el taxi.'
      ]
    },
    i16: {
      summary: 'La preparación eléctrica y el cebado del motor son esenciales en esta aeronave.',
      items: [
        'Comprueba el suministro eléctrico de tierra y los wheel chucks.',
        'Asegura el cebado correcto del motor antes del arranque.',
        'No olvides el calentamiento y el setup de frenado antes del despegue.'
      ]
    },
    la7: {
      summary: 'Aquí la prioridad es el suministro de aire, la presión de combustible y el calentamiento del motor.',
      items: [
        'Revisa el suministro de aire de tierra y la válvula de paso de combustible.',
        'Asegura la presión de combustible antes de arrancar.',
        'Controla el calentamiento de aceite y cabezas de cilindros antes de salir.'
      ]
    }
  };

  function renderChuckGuide(key) {
    var guide = chuckGuides[key] || chuckGuides.tf51;
    var summary = document.getElementById('chuck-guide-summary');
    var list = document.getElementById('chuck-guide-list');
    if (summary) summary.textContent = guide.summary;
    if (list) {
      list.innerHTML = '';
      guide.items.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
    }
  }

  // Checklist interactivo: marcar/desmarcar pasos
  document.querySelectorAll('.check-item').forEach(function (btn) {
    var key = btn.getAttribute('data-key');
    if (!key) return;

    try {
      var saved = localStorage.getItem('dcs-checklist-' + key);
      if (saved === 'done') {
        setChecklistState(btn, true);
      } else {
        setChecklistState(btn, false);
      }
    } catch (e) {
      setChecklistState(btn, false);
    }

    btn.addEventListener('click', function () {
      var done = !btn.classList.contains('is-done');
      setChecklistState(btn, done);
      var panel = btn.closest('.pernera-panel');
      if (panel) refreshToggleAllButton(panel);
    });
  });

  document.querySelectorAll('.toggle-all-checklist').forEach(function (button) {
    var panel = button.closest('.pernera-panel');
    if (!panel) return;
    refreshToggleAllButton(panel);

    button.addEventListener('click', function () {
      var items = panel.querySelectorAll('.check-item');
      var shouldMarkAll = Array.from(items).some(function (item) {
        return !item.classList.contains('is-done');
      });
      items.forEach(function (item) {
        setChecklistState(item, shouldMarkAll);
      });
      refreshToggleAllButton(panel);
    });
  });

  document.querySelectorAll('.video-accordion').forEach(function (accordion) {
    var toggle = accordion.querySelector('.video-accordion-toggle');
    var content = accordion.querySelector('.video-accordion-content');
    if (!toggle || !content) return;

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      content.hidden = isOpen;
    });
  });

  // Perneras: cambiar panel
  var list = document.querySelector('.perneras-list');
  var buttons = list ? list.querySelectorAll('button[data-plane]') : [];
  var panels = document.querySelectorAll('.pernera-panel');

  if (buttons && buttons.length && panels && panels.length) {
    function activatePlane(id) {
      var targetId = 'pernera-' + id;
      var target = document.getElementById(targetId);
      if (!target) return;
      panels.forEach(function (p) { p.classList.remove('active'); });
      target.classList.add('active');
      buttons.forEach(function (b) {
        if (b.getAttribute('data-plane') === id) {
          b.setAttribute('aria-pressed', 'true');
          b.classList.add('active-btn');
        } else {
          b.setAttribute('aria-pressed', 'false');
          b.classList.remove('active-btn');
        }
      });
      if (window.innerWidth < 760) {
        setTimeout(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
      }
      renderChuckGuide(id);
    }

    buttons.forEach(function (btn) {
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      btn.setAttribute('aria-pressed', 'false');

      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-plane');
        activatePlane(id);
      });

      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var id = btn.getAttribute('data-plane');
          activatePlane(id);
        }
      });
    });

    var anyActive = Array.from(panels).some(function (p) { return p.classList.contains('active'); });
    if (!anyActive) {
      var firstId = buttons[0].getAttribute('data-plane');
      activatePlane(firstId);
    } else {
      var activeButton = Array.from(buttons).find(function (b) {
        return b.classList.contains('active-btn');
      });
      if (activeButton) {
        renderChuckGuide(activeButton.getAttribute('data-plane'));
      }
    }
  }

  // Smooth anchor links (works across pages for same-domain anchors)
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href.length > 1) {
        var el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});

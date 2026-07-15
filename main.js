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
    f14: {
      summary: 'Enfócate en el arranque limpio, la correcta configuración de radios y el check de sistemas antes de salir.',
      items: [
        'Asegura que las baterías y los inversores estén estables antes de iniciar el APU.',
        'Revisa el estado hidráulico y de generadores antes del taxi.',
        'Haz un brief rápido de armamento y de salida antes de la primera toma.'
      ]
    },
    f16: {
      summary: 'Prioriza la estabilidad del motor, la alineación básica y el setup de armas.',
      items: [
        'Confirma que el JFS y la energía eléctrica estén en orden antes de empezar.',
        'Mantén la ruta de taxi y las radios simples cuando salgas.',
        'No te olvides del check básico de navegación y de IFF.'
      ]
    },
    f18: {
      summary: 'El arranque debe ser ordenado y el setup de MFDs claro para no perder tiempo.',
      items: [
        'Verifica APU, generadores y navegación antes de entrar en movimiento.',
        'Ten visibles las páginas de armamento y de radios al salir.',
        'Haz el brief de salida en una frase corta y clara.'
      ]
    },
    a10: {
      summary: 'Este avión necesita una lectura rápida de sistemas y de armamento antes de la salida.',
      items: [
        'Comprueba que el APU y los generadores estén estables.',
        'Asegura el alineado de CDU/EGI antes de la toma.',
        'Mantén el setup de TAD y radios simple y consistente.'
      ]
    },
    mig21: {
      summary: 'La clave está en la preparación eléctrica y en no dejar nada suelto antes de arrancar.',
      items: [
        'Revisa bombas de combustible, inversores y sistemas eléctricos.',
        'Confirma el setup de radios y navegación antes del taxi.',
        'Haz un brief muy breve: salida, altitud y contingencia.'
      ]
    },
    p51: {
      summary: 'La guía breve aquí es: preparar el motor y el avión antes de cualquier movimiento.',
      items: [
        'Comprueba mezcla, propeller y sistema de ignición antes de arrancar.',
        'Revisa la presión de aceite y la estabilidad del motor.',
        'No olvides el transponder y la radio básica antes de despegar.'
      ]
    }
  };

  function renderChuckGuide(key) {
    var guide = chuckGuides[key] || chuckGuides.f14;
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

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

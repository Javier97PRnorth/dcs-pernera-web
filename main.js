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

  // Checklist interactivo: marcar/desmarcar pasos
  document.querySelectorAll('.check-item').forEach(function (btn) {
    var key = btn.getAttribute('data-key');
    if (!key) return;

    var saved = localStorage.getItem('dcs-checklist-' + key);
    if (saved === 'done') {
      btn.classList.add('is-done');
    }

    btn.addEventListener('click', function () {
      btn.classList.toggle('is-done');
      var done = btn.classList.contains('is-done');
      localStorage.setItem('dcs-checklist-' + key, done ? 'done' : 'pending');
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

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

  function formatConverted(value) {
    if (!Number.isFinite(value)) return '';
    var rounded = Math.round(value * 1000) / 1000;
    return String(rounded);
  }

  function convertTemperature(value, unit) {
    if (unit === 'c') return { c: value, f: (value * 9 / 5) + 32 };
    return { c: (value - 32) * 5 / 9, f: value };
  }

  function convertPressure(value, unit) {
    var inhg;
    if (unit === 'inhg') inhg = value;
    else if (unit === 'mmhg') inhg = value / 25.4;
    else inhg = value / 33.8638866667;
    return {
      inhg: inhg,
      mmhg: inhg * 25.4,
      hpa: inhg * 33.8638866667
    };
  }

  function convertSpeed(value, unit) {
    var mph;
    if (unit === 'mph') mph = value;
    else if (unit === 'kmh') mph = value / 1.609344;
    else mph = value / 0.868976242;
    return {
      mph: mph,
      kmh: mph * 1.609344,
      kts: mph * 0.868976242
    };
  }

  function convertAltitude(value, unit) {
    if (unit === 'ft') return { ft: value, m: value * 0.3048 };
    return { ft: value / 0.3048, m: value };
  }

  function convertFuel(value, unit) {
    if (unit === 'gal') return { gal: value, l: value * 3.785411784 };
    return { gal: value / 3.785411784, l: value };
  }

  document.querySelectorAll('.converter-item').forEach(function (item) {
    var type = item.getAttribute('data-converter');
    var inputs = item.querySelectorAll('input[data-unit]');
    if (!type || !inputs.length) return;

    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        var unit = input.getAttribute('data-unit');
        var raw = input.value.trim();

        if (raw === '') {
          inputs.forEach(function (other) { if (other !== input) other.value = ''; });
          return;
        }

        var value = Number(raw);
        if (!Number.isFinite(value)) return;

        var converted;
        if (type === 'temperature') converted = convertTemperature(value, unit);
        else if (type === 'pressure') converted = convertPressure(value, unit);
        else if (type === 'speed') converted = convertSpeed(value, unit);
        else if (type === 'altitude') converted = convertAltitude(value, unit);
        else if (type === 'fuel') converted = convertFuel(value, unit);
        else return;

        inputs.forEach(function (other) {
          var otherUnit = other.getAttribute('data-unit');
          if (!converted.hasOwnProperty(otherUnit)) return;
          if (other === input) return;
          other.value = formatConverted(converted[otherUnit]);
        });
      });
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

  // ============================================
  // LOCATION FINDER
  // ============================================
  (function initLocationFinder() {
    var mapSelector = document.getElementById('map-selector');
    var nameSearch = document.getElementById('location-name-search');
    var mgrsSearch = document.getElementById('location-mgrs-search');
    var resultsContainer = document.getElementById('location-results');
    var resultsInfo = document.getElementById('location-results-info');

    if (!mapSelector || !nameSearch || !mgrsSearch || !resultsContainer || !resultsInfo) {
      return;
    }

    var locationsData = null;
    var allLocations = [];

    /**
     * Format MGRS coordinate string for readability
     * @param {string} mgrsString - Compact MGRS string (e.g., "30UYV0553218867")
     * @param {number} precision - Optional precision level (default: full)
     * @returns {string} Formatted MGRS (e.g., "30 UYV 05532 18867")
     */
    function formatMGRS(mgrsString, precision) {
      if (!mgrsString || typeof mgrsString !== 'string') return mgrsString || '';
      
      var clean = mgrsString.trim().replace(/\s+/g, '');
      
      // MGRS structure: ZZ B XX EEEEE NNNNN
      // ZZ = zone (2 digits)
      // B = band (1 letter)
      // XX = 100km square (2 letters)
      // EEEEE NNNNN = easting/northing (variable length, split evenly)
      
      if (clean.length < 5) return mgrsString; // Too short to be valid
      
      // Extract zone (first 2 characters, should be digits)
      var zone = clean.substring(0, 2);
      
      // Extract band (1 letter after zone)
      var band = clean.substring(2, 3);
      
      // Extract 100km square (2 letters)
      var square = clean.substring(3, 5);
      
      // Remaining digits are easting/northing
      var coords = clean.substring(5);
      
      // Coordinates must have even length (half easting, half northing)
      if (coords.length % 2 !== 0) return mgrsString; // Invalid format
      
      var halfLen = coords.length / 2;
      var easting = coords.substring(0, halfLen);
      var northing = coords.substring(halfLen);
      
      // Apply precision reduction if specified
      if (precision && precision < halfLen) {
        easting = easting.substring(0, precision);
        northing = northing.substring(0, precision);
      }
      
      // Format: "ZZ BXX EEEEE NNNNN"
      return zone + ' ' + band + square + ' ' + easting + ' ' + northing;
    }

    // Load JSON data
    fetch('data/dcs_locations.json')
      .then(function (response) {
        if (!response.ok) throw new Error('Failed to load locations data');
        return response.json();
      })
      .then(function (data) {
        locationsData = data;
        populateMapSelector();
        buildLocationsList();
        renderResults();
      })
      .catch(function (error) {
        console.error('Error loading locations:', error);
        resultsInfo.textContent = 'Error al cargar los datos de ubicaciones.';
      });

    function populateMapSelector() {
      if (!locationsData || !locationsData.maps) return;

      var maps = Object.keys(locationsData.maps).sort();
      maps.forEach(function (mapName) {
        var option = document.createElement('option');
        option.value = mapName;
        option.textContent = mapName;
        mapSelector.appendChild(option);
      });
    }

    function buildLocationsList() {
      if (!locationsData || !locationsData.maps) return;

      allLocations = [];
      Object.keys(locationsData.maps).forEach(function (mapName) {
        var mapData = locationsData.maps[mapName];
        if (!mapData.locations) return;

        Object.keys(mapData.locations).forEach(function (locKey) {
          allLocations.push(mapData.locations[locKey]);
        });
      });
    }

    function filterLocations() {
      var selectedMap = mapSelector.value.trim();
      var nameQuery = nameSearch.value.trim().toLowerCase();
      var mgrsQuery = mgrsSearch.value.trim().toUpperCase();

      var filtered = allLocations.filter(function (loc) {
        // Filter by map
        if (selectedMap && loc.map !== selectedMap) return false;

        // Filter by name
        if (nameQuery) {
          var name = (loc.name || '').toLowerCase();
          var displayName = (loc.display_name || '').toLowerCase();
          if (!name.includes(nameQuery) && !displayName.includes(nameQuery)) {
            return false;
          }
        }

        // Filter by MGRS
        if (mgrsQuery) {
          var mgrs = (loc.mgrs || '').toUpperCase();
          if (!mgrs.includes(mgrsQuery)) return false;
        }

        return true;
      });

      return filtered;
    }

    function renderResults() {
      var filtered = filterLocations();
      resultsContainer.innerHTML = '';

      if (!locationsData) {
        resultsInfo.textContent = 'Cargando datos...';
        return;
      }

      if (filtered.length === 0) {
        resultsInfo.textContent = 'No se encontraron resultados.';
        return;
      }

      resultsInfo.textContent = 'Mostrando ' + filtered.length + ' ubicación' + (filtered.length !== 1 ? 'es' : '') + ' de ' + allLocations.length + ' totales.';

      // Limit results to prevent performance issues
      var displayLimit = 100;
      var toDisplay = filtered.slice(0, displayLimit);

      toDisplay.forEach(function (loc) {
        var li = document.createElement('li');

        var nameDiv = document.createElement('div');
        nameDiv.className = 'location-name';
        nameDiv.textContent = loc.display_name || loc.name;
        li.appendChild(nameDiv);

        var metaDiv = document.createElement('div');
        metaDiv.className = 'location-meta';

        var mapItem = document.createElement('div');
        mapItem.className = 'location-meta-item';
        mapItem.innerHTML = '<span class="location-meta-label">Mapa:</span> <span class="location-meta-value">' + (loc.map || 'N/A') + '</span>';
        metaDiv.appendChild(mapItem);

        var mgrsItem = document.createElement('div');
        mgrsItem.className = 'location-meta-item';
        var formattedMGRS = loc.mgrs ? formatMGRS(loc.mgrs) : 'N/A';
        mgrsItem.innerHTML = '<span class="location-meta-label">MGRS:</span> <span class="location-meta-value">' + formattedMGRS + '</span>';
        metaDiv.appendChild(mgrsItem);

        var latItem = document.createElement('div');
        latItem.className = 'location-meta-item';
        latItem.innerHTML = '<span class="location-meta-label">Lat:</span> <span class="location-meta-value">' + (loc.latitude != null ? loc.latitude.toFixed(6) : 'N/A') + '</span>';
        metaDiv.appendChild(latItem);

        var lonItem = document.createElement('div');
        lonItem.className = 'location-meta-item';
        lonItem.innerHTML = '<span class="location-meta-label">Lon:</span> <span class="location-meta-value">' + (loc.longitude != null ? loc.longitude.toFixed(6) : 'N/A') + '</span>';
        metaDiv.appendChild(lonItem);

        li.appendChild(metaDiv);
        resultsContainer.appendChild(li);
      });

      if (filtered.length > displayLimit) {
        var infoLi = document.createElement('li');
        infoLi.style.textAlign = 'center';
        infoLi.style.color = 'var(--muted)';
        infoLi.style.fontStyle = 'italic';
        infoLi.style.padding = '12px';
        infoLi.textContent = 'Mostrando primeros ' + displayLimit + ' resultados. Refina tu búsqueda para ver más.';
        resultsContainer.appendChild(infoLi);
      }
    }

    // Event listeners
    mapSelector.addEventListener('change', renderResults);
    nameSearch.addEventListener('input', renderResults);
    mgrsSearch.addEventListener('input', renderResults);
  })();
});

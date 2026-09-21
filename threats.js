document.addEventListener('DOMContentLoaded', function () {
  var database = window.threatDatabase;
  var typeSelect = document.getElementById('threat-type');
  var searchInput = document.getElementById('threat-search');
  var resultsCount = document.getElementById('threat-results-count');
  var tableBody = document.getElementById('threat-rows');

  if (!database || !typeSelect || !searchInput || !resultsCount || !tableBody) return;

  function text(value) {
    return value === undefined || value === null || value === '' ? '—' : String(value);
  }

  function renderTypeOptions() {
    var types = [];
    database.records.forEach(function (record) {
      if (types.indexOf(record.type) === -1) types.push(record.type);
    });
    types.sort().forEach(function (type) {
      var option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      typeSelect.appendChild(option);
    });
  }

  function fieldText(field) {
    return field.label + ': ' + text(field.value);
  }

  function fieldsFor(record, keywords) {
    return record.fields.filter(function (field) {
      return keywords.some(function (keyword) {
        return field.label.toLowerCase().indexOf(keyword) !== -1;
      });
    });
  }

  function cellWithFields(fields) {
    var cell = document.createElement('td');
    if (!fields.length) {
      cell.textContent = '—';
      return cell;
    }
    fields.forEach(function (field) {
      var line = document.createElement('span');
      line.className = 'threat-field';
      line.textContent = fieldText(field);
      cell.appendChild(line);
    });
    return cell;
  }

  function nameCell(fields) {
    var cell = document.createElement('td');
    cell.className = 'threat-name-cell';
    cell.textContent = fields.length ? text(fields[0].value) : '—';
    return cell;
  }

  function render() {
    var selectedType = typeSelect.value;
    var query = searchInput.value.trim().toLowerCase();
    tableBody.replaceChildren();
    var visibleRows = database.records.filter(function (record) {
      var searchable = [record.type, record.sourceCategory].concat(record.fields.map(fieldText)).join(' ').toLowerCase();
      return (selectedType === 'all' || record.type === selectedType) && (!query || searchable.indexOf(query) !== -1);
    });

    visibleRows.forEach(function (record) {
      var tr = document.createElement('tr');
      var nameFields = record.fields.filter(function (field) {
        return !/^threat type$/i.test(field.label) && /^(threat|radar|russian designation|nato designation)$/i.test(field.label);
      }).slice(0, 1);
      if (!nameFields.length) {
        nameFields = record.fields.filter(function (field) { return !/^threat type$/i.test(field.label); }).slice(0, 1);
      }
      var designationFields = fieldsFor(record, ['nato', 'platform', 'sam systems', 'ground based']);
      var rwrFields = fieldsFor(record, ['rwr', 'harm code']);
      var rangeFields = fieldsFor(record, ['range', 'detection range']);
      var altitudeFields = fieldsFor(record, ['altitude']);
      var guidanceFields = fieldsFor(record, ['guidance', 'role', 'type', 'speed', 'flexibility']);
      var equipmentFields = fieldsFor(record, ['ammunition', 'armament', 'ciws', 'missile amount', 'gun ammo']);
      var used = nameFields.concat(designationFields, rwrFields, rangeFields, altitudeFields, guidanceFields, equipmentFields);
      var otherFields = record.fields.filter(function (field) { return used.indexOf(field) === -1; });

      tr.appendChild(nameCell(nameFields));
      var typeCell = document.createElement('td');
      typeCell.textContent = record.type;
      typeCell.className = 'threat-type-cell';
      tr.appendChild(typeCell);
      tr.appendChild(cellWithFields(designationFields));
      tr.appendChild(cellWithFields(rwrFields));
      tr.appendChild(cellWithFields(rangeFields));
      tr.appendChild(cellWithFields(altitudeFields));
      tr.appendChild(cellWithFields(guidanceFields));
      tr.appendChild(cellWithFields(equipmentFields));
      tr.appendChild(cellWithFields(otherFields));
      tableBody.appendChild(tr);
    });

    resultsCount.textContent = visibleRows.length + (visibleRows.length === 1 ? ' entry' : ' entries') + ' shown';
  }

  renderTypeOptions();
  typeSelect.addEventListener('change', render);
  searchInput.addEventListener('input', render);
  render();
});

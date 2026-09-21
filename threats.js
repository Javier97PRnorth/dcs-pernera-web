document.addEventListener('DOMContentLoaded', function () {
  var database = window.threatDatabase;
  var searchInput = document.getElementById('threat-search');
  var resultsCount = document.getElementById('threat-results-count');
  var notesRoot = document.getElementById('threat-notes');
  var tableBody = document.getElementById('threat-rows');
  var columnFilters = Array.from(document.querySelectorAll('.threat-column-filter'));

  if (!database || !searchInput || !resultsCount || !notesRoot || !tableBody || columnFilters.length !== 9) return;

  function text(value) {
    return value === undefined || value === null || value === '' ? '—' : String(value);
  }

  function renderTypeOptions() {
    var types = [];
    database.records.forEach(function (record) {
      if (types.indexOf(record.type) === -1) types.push(record.type);
    });
    var typeFilter = columnFilters[1];
    types.sort().forEach(function (type) {
      var option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      typeFilter.appendChild(option);
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

  function displayFields(record) {
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
    return [
      nameFields.map(fieldText).join(' '),
      record.type,
      designationFields.map(fieldText).join(' '),
      rwrFields.map(fieldText).join(' '),
      rangeFields.map(fieldText).join(' '),
      altitudeFields.map(fieldText).join(' '),
      guidanceFields.map(fieldText).join(' '),
      equipmentFields.map(fieldText).join(' '),
      otherFields.map(fieldText).join(' ')
    ];
  }

  function render() {
    var query = searchInput.value.trim().toLowerCase();
    var filters = columnFilters.map(function (filter) { return filter.value.trim().toLowerCase(); });
    tableBody.replaceChildren();
    var visibleRows = database.records.filter(function (record) {
      var columns = displayFields(record).map(function (value) { return value.toLowerCase(); });
      var searchable = columns.join(' ') + ' ' + record.sourceCategory.toLowerCase();
      return (!query || searchable.indexOf(query) !== -1) && filters.every(function (filter, index) {
        return !filter || columns[index].indexOf(filter) !== -1;
      });
    });

    visibleRows.forEach(function (record) {
      var tr = document.createElement('tr');
      var columns = displayFields(record);
      var nameFields = record.fields.filter(function (field) { return columns[0].indexOf(field.value) !== -1; }).slice(0, 1);
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

  if (database.notes && database.notes.length) {
    var notesTitle = document.createElement('strong');
    notesTitle.textContent = 'Reference notes';
    notesRoot.appendChild(notesTitle);
    var notesList = document.createElement('ul');
    database.notes.forEach(function (note) {
      var item = document.createElement('li');
      item.textContent = note;
      notesList.appendChild(item);
    });
    notesRoot.appendChild(notesList);
    notesRoot.hidden = false;
  }

  renderTypeOptions();
  searchInput.addEventListener('input', render);
  columnFilters.forEach(function (filter) { filter.addEventListener('input', render); });
  render();
});

document.addEventListener('DOMContentLoaded', function () {
  var database = window.rwrThreatDatabase;
  var searchInput = document.getElementById('threat-search');
  var resultsCount = document.getElementById('threat-results-count');
  var tableBody = document.getElementById('threat-rows');
  var columnFilters = Array.from(document.querySelectorAll('.threat-column-filter'));

  if (!database || !searchInput || !resultsCount || !tableBody || columnFilters.length !== 5) return;

  function renderTypeOptions() {
    var types = [];
    database.records.forEach(function (record) {
      if (types.indexOf(record.type) === -1) types.push(record.type);
    });
    types.sort().forEach(function (type) {
      var option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      columnFilters[2].appendChild(option);
    });
  }

  function columns(record) {
    return [record.code, record.system, record.type, record.range, record.vertical];
  }

  function render() {
    var query = searchInput.value.trim().toLowerCase();
    var filters = columnFilters.map(function (filter) { return filter.value.trim().toLowerCase(); });
    tableBody.replaceChildren();

    var visibleRows = database.records.filter(function (record) {
      var row = columns(record).map(function (item) { return item.toLowerCase(); });
      return (!query || row.join(' ').indexOf(query) !== -1) && filters.every(function (filter, index) {
        return !filter || row[index].indexOf(filter) !== -1;
      });
    });

    visibleRows.forEach(function (record) {
      var tr = document.createElement('tr');
      columns(record).forEach(function (item, index) {
        var td = document.createElement('td');
        td.textContent = item || '—';
        if (index === 0) td.className = 'threat-code-cell';
        if (index === 1) td.className = 'threat-name-cell';
        if (index === 2) td.className = 'threat-type-cell';
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });

    resultsCount.textContent = visibleRows.length + (visibleRows.length === 1 ? ' entry' : ' entries') + ' shown';
  }

  renderTypeOptions();
  searchInput.addEventListener('input', render);
  columnFilters.forEach(function (filter) { filter.addEventListener('input', render); });
  render();
});

const { formatMGRS } = require('./formatMgrs');

function buildLocationsObject(towns) {
  const maps = {};

  for (const town of towns) {
    if (!maps[town.map]) {
      maps[town.map] = {
        map: town.map,
        locations: {}
      };
    }

    maps[town.map].locations[town.name] = {
      name: town.name,
      display_name: town.display_name,
      latitude: town.latitude,
      longitude: town.longitude,
      mgrs: town.mgrs,
      mgrs_formatted: formatMGRS(town.mgrs),
      map: town.map
    };
  }

  return {
    generated_at: new Date().toISOString(),
    total_maps: Object.keys(maps).length,
    total_locations: towns.length,
    maps
  };
}

module.exports = {
  buildLocationsObject
};

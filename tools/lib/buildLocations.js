const { formatMGRS } = require('./formatMgrs');
const { toDMS } = require('./convertToDms');

function buildLocationsObject(towns) {
  const maps = {};

  for (const town of towns) {
    if (!maps[town.map]) {
      maps[town.map] = {
        map: town.map,
        locations: {}
      };
    }

    // Convert to DMS format
    const dms = toDMS(town.latitude, town.longitude);

    maps[town.map].locations[town.name] = {
      name: town.name,
      display_name: town.display_name,
      latitude: town.latitude,
      longitude: town.longitude,
      lat_dms: dms.lat_dms,
      lon_dms: dms.lon_dms,
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

# DCS Locations Data Generator

Tool for processing DCS World `towns.lua` files and generating structured JSON with formatted MGRS coordinates for the location finder feature.

## Quick Start

```bash
npm install
node index.js --write
```

This generates `/data/dcs_locations.json` with all locations from all detected maps in `/data/maps/`.

## Installation

```bash
cd tools
npm install
```

## Usage

### Generate JSON
```bash
node index.js --write
```

Outputs to: `/data/dcs_locations.json`

### Preview Output (without writing file)
```bash
node index.js
```

Prints JSON to console for inspection.

## Input Structure

The tool scans for `towns.lua` files in the data directory:

```
data/
  maps/
    Caucasus/
      towns.lua
    Syria/
      towns.lua
    Nevada/
      towns.lua
    ...
```

## Output Structure

Generated JSON contains location data for all maps:

```json
{
  "generated_at": "2026-07-16T22:47:44.854Z",
  "total_maps": 6,
  "total_locations": 4451,
  "maps": {
    "Caucasus": {
      "map": "Caucasus",
      "locations": {
        "KUTAISI": {
          "name": "KUTAISI",
          "display_name": "KUTAISI",
          "latitude": 42.267086,
          "longitude": 42.696849,
          "lat_dms": "42°16'01.51\"N",
          "lon_dms": "42°41'48.66\"E",
          "mgrs": "38TLM1005381999",
          "mgrs_formatted": "38 TLM 10053 81999",
          "map": "Caucasus"
        }
      }
    }
  }
}
```

## Modules

- **index.js** - Main entry point, CLI handler
- **lib/readMapDirectories.js** - Scans map directories
- **lib/parseTownsLua.js** - Parses Lua table format
- **lib/convertToMgrs.js** - Lat/lon → MGRS conversion
- **lib/convertToDms.js** - Lat/lon → DMS (Degrees/Minutes/Seconds) conversion
- **lib/formatMgrs.js** - Formats MGRS for readability
- **lib/buildLocations.js** - Builds final JSON structure

## Dependencies

- **[mgrs](https://www.npmjs.com/package/mgrs)** (^2.1.0) - Coordinate conversion to MGRS

## Technical Details

- **MGRS Precision:** 5 digits (1-meter accuracy)
- **MGRS Format:** `38 TLN 48073 10304` (zone, band, 100km square, easting, northing)
- **DMS Format:** `42°16'01.51"N` (degrees, minutes, seconds with direction)
- **DMS Precision:** 2 decimal places for seconds
- **Auto-detection:** Finds all maps in `/data/maps/` automatically
- **Relative paths:** Uses `__dirname` for portability

### Coordinate Formats

Each location includes three coordinate representations:

1. **Decimal Degrees** - `latitude: 42.267086, longitude: 42.696849`
2. **DMS (Degrees/Minutes/Seconds)** - `lat_dms: "42°16'01.51"N", lon_dms: "42°41'48.66"E"`
3. **MGRS (Military Grid)** - `mgrs: "38TLM1005381999"` and `mgrs_formatted: "38 TLM 10053 81999"`

## When to Regenerate

Run the tool when:
- Adding new map data to `data/maps/`
- DCS updates change location coordinates
- Location names are modified in source files

## Output Size

Expect ~1.5MB JSON file for all 6 maps with ~4,500 locations including decimal, DMS, and MGRS coordinates.


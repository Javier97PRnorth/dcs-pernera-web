# DCS Pernera Web

A comprehensive digital kneeboard and reference toolkit for DCS World (Digital Combat Simulator). This web application provides quick-access checklists, procedures, unit converters, and a location finder for various aircraft and maps.

## Features

### Aircraft Checklists (Perneras)
- **17 Aircraft** with detailed cold start procedures and essential operations
- Step-by-step interactive checklists with progress tracking
- Technical notes and engine management procedures
- Video references for complex procedures
- Alphabetically organized for quick access

**Supported Aircraft:**
- BF-109 K4 Kurfürst
- F-100D Super Sabre
- F-14 Tomcat
- F-4E Phantom II
- F4U-1D Corsair
- F-86F Sabre
- F/A-18C Hornet
- FW-190 A8 Anton & D9 Dora
- I-16 Ishak
- Lavochkin LA-7
- MiG-15bis Fagot
- MiG-29 Fulcrum
- Mosquito FB Mk VI
- P-47D Thunderbolt
- Spitfire Mk IX
- TF-51D / P-51D Mustang

### Radio Brevities
- Searchable table with 100+ aviation communication terms
- Phonetic alphabet reference
- Standard radio procedures and phrases
- Real-time search filtering

### Global Toolbox

#### Unit Converter
Convert between common aviation units:
- **Temperature:** Celsius ↔ Fahrenheit
- **Pressure:** inHg ↔ mmHg ↔ hPa
- **Speed:** mph ↔ km/h ↔ knots
- **Altitude:** feet ↔ meters
- **Fuel:** gallons ↔ liters

#### Location Finder
- Search 4,702+ locations across 6 DCS maps
- **Cities:** Town and city names from DCS map files
- **Airfields:** Complete airbase directory with parking positions
- Filter by map, name, or MGRS coordinates
- Display formatted MGRS coordinates for easy reading
- Lat/Lon coordinates in decimal degrees (6-decimal precision)
- Lat/Lon coordinates in DMS format (Degrees/Minutes/Seconds)
- Altitude data for airfields
- Multiple coordinate formats for maximum compatibility

**Supported Maps:**
- Caucasus
- Mariana Islands (Current & WWII)
- Nevada
- Normandy
- Syria

## Project Structure

```
dcs-pernera-web/
├── index.html              # Landing page
├── perneras.html           # Aircraft checklists
├── brevities.html          # Radio communications reference
├── styles.css              # Global styles
├── main.js                 # Frontend logic
├── shared-nav.js           # Navigation component
├── data/
│   ├── dcs_locations.json       # Generated locations database (1.8MB)
│   └── maps/
│       ├── Airfields/
│       │   └── TheatersAirbases.json    # Source from Briefing Room project
│       ├── Caucasus/
│       ├── MarianaIslands/
│       ├── MarianasWWII/
│       ├── Nevada/
│       ├── Normandy/
│       └── Syria/
└── tools/                               # Data generation utilities
    ├── README.md
    ├── index.js
    ├── package.json
    └── lib/
        ├── buildLocations.js
        ├── convertToMgrs.js
        ├── convertToDms.js
        ├── formatMgrs.js
        ├── parseTownsLua.js
        ├── processAirbases.js          # NEW: Process airfield data
        └── readMapDirectories.js
```

## Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, grid layouts, responsive design
- **Vanilla JavaScript** - No frameworks, pure DOM manipulation
- **LocalStorage** - Persist checklist progress

### Data Processing
- **Node.js** - Backend tooling
- **mgrs** (npm) - Coordinate conversion library

### Hosting
- **GitHub Pages** - Static site hosting with Jekyll

## Design Philosophy

**Minimalist Technical Theme:**
- Dark background (#0D0D0F) for reduced eye strain
- Red accent color (#B33939) for important elements
- Clean typography with system fonts
- Responsive grid layouts
- No external dependencies (CSS frameworks, etc.)
- Performance-first approach

## Getting Started

### View the Website

Simply open `index.html` in any modern web browser. No build process required.

For development with live reload:
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000
```

Then navigate to `http://localhost:8000`

### Data Sources

#### Cities
- Extracted from DCS World game files (`towns.lua` from each map)
- Located in `data/maps/<MapName>/towns.lua`
- Automatically detected and processed by the tool

#### Airfields
- Source: [Briefing Room for DCS](https://github.com/DCS-BR-Tools/briefing-room-for-dcs)
- File: `TheatersAirbases.json` - Complete airbase directory for all DCS theatres
- Location: `data/maps/Airfields/TheatersAirbases.json`
- Contains 799 airbases with parking positions and coordinates
- Only airbases for maps in the current project are included (Caucasus, MarianaIslands, MarianasWWII, Nevada, Normandy, Syria)

### Updating Airfield Data

To update with newer Briefing Room data:

1. Download the latest `TheatersAirbases.json` from [Briefing Room GitHub](https://github.com/DCS-BR-Tools/briefing-room-for-dcs/blob/main/DatabaseJSON/TheatersAirbases.json)
2. Replace `data/maps/Airfields/TheatersAirbases.json`
3. Regenerate: `cd tools && node index.js --write`

The script automatically:
- Filters airbases by supported maps
- Extracts first parking position as representative location
- Converts coordinates to MGRS and DMS formats
- Merges with cities into unified database
- Adds `type: "airfield"` field to distinguish from cities

### Regenerate Location Data

If you need to update the locations database from new DCS map data:

```bash
cd tools
npm install          # First time only
node index.js --write
```

This will:
1. Read all `towns.lua` files from `data/maps/<Map>/`
2. Parse city names and coordinates
3. Read `data/maps/Airfields/TheatersAirbases.json`
4. Parse airfield names, coordinates, and altitude
5. Convert all coordinates to MGRS format
6. Convert all coordinates to DMS format (Degrees/Minutes/Seconds)
7. Add `type` field: `"city"` or `"airfield"`
8. Generate formatted `data/dcs_locations.json`

See [tools/README.md](tools/README.md) for detailed documentation.

## Features Deep Dive

### Interactive Checklists
- Click items to mark as complete
- Progress persists across sessions
- "Mark/unmark all" toggle for quick reset
- Mobile-friendly accordion layout

### Smart Search
- Real-time filtering without page reload
- Case-insensitive matching
- Search across multiple fields (name, display name, MGRS)
- Performance optimized (limits to 100 results)

### Coordinate Formats

Location coordinates are provided in multiple formats for maximum compatibility:

#### MGRS (Military Grid Reference System)
- **Raw:** `38TLN4807310304`
- **Formatted:** `38 TLN 48073 10304`
- Format: `<Zone> <Band><100km Square> <Easting> <Northing>`

#### DMS (Degrees/Minutes/Seconds)
- **Example:** `42°16'01.51"N` and `42°41'48.66"E`
- Format: `DD°MM'SS.SS"D` (degrees, minutes, seconds, direction)
- Precision: 2 decimal places for seconds

#### Decimal Degrees
- **Example:** `42.267086`, `42.696849`
- Precision: 6 decimal places (~0.1 meter accuracy)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Areas for improvement:

- [ ] Add more aircraft checklists
- [ ] Include airfield diagrams
- [ ] Add weapon employment data
- [ ] Expand brevities table
- [ ] Add kneeboard export feature
- [ ] Support for custom user notes

## Data Sources

- Aircraft procedures: Based on official DCS documentation and Chuck's Guides
- Location data: Extracted from DCS World game files (`towns.lua`)
- MGRS conversion: Using the [mgrs](https://www.npmjs.com/package/mgrs) npm package

## License

This is a community tool for DCS World players. DCS World is a trademark of Eagle Dynamics.

## Acknowledgments

- **Chuck's Guides** - Comprehensive aircraft documentation
- **Eagle Dynamics** - DCS World and map data
- **Briefing Room for DCS** - Complete airbase database
- **DCS Community** - Feedback and procedure validation

---

**Live Demo:** [https://javier97prnorth.github.io/dcs-pernera-web/](https://javier97prnorth.github.io/dcs-pernera-web/)

**Built with ❤️ for the DCS community**

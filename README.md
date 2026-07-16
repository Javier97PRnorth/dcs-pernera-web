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
- Search 4,451+ locations across 6 DCS maps
- Filter by map, name, or MGRS coordinates
- Display formatted MGRS coordinates for easy reading
- Lat/Lon coordinates with 6-decimal precision

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
│   ├── dcs_locations.json  # Generated locations database (1.2MB)
│   └── maps/               # Source Lua files from DCS
│       ├── Caucasus/
│       ├── MarianaIslands/
│       ├── MarianasWWII/
│       ├── Nevada/
│       ├── Normandy/
│       └── Syria/
└── tools/                  # Data generation utilities
    ├── README.md
    ├── index.js
    ├── package.json
    └── lib/
        ├── buildLocations.js
        ├── convertToMgrs.js
        ├── formatMgrs.js
        ├── parseTownsLua.js
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

### Regenerate Location Data

If you need to update the locations database from new DCS map data:

```bash
cd tools
npm install          # First time only
node index.js --write
```

This will:
1. Read all `towns.lua` files from `data/maps/`
2. Parse location names and coordinates
3. Convert lat/lon to MGRS format
4. Generate formatted `data/dcs_locations.json`

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

### MGRS Formatting
Location coordinates are formatted for readability:
- **Raw:** `38TLN4807310304`
- **Formatted:** `38 TLN 48073 10304`

Format: `<Zone> <Band><100km Square> <Easting> <Northing>`

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
- **DCS Community** - Feedback and procedure validation

---

**Live Demo:** [https://javier97prnorth.github.io/dcs-pernera-web/](https://javier97prnorth.github.io/dcs-pernera-web/)

**Built with ❤️ for the DCS community**

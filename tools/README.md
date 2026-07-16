# DCS Locations Data Generator

Herramienta para procesar archivos `towns.lua` de DCS World y generar JSON estructurado con coordenadas MGRS formateadas.

## Instalación

```bash
cd tools
npm install
```

## Uso

### Generar JSON
```bash
node index.js --write
```

Esto generará `/data/dcs_locations.json` con todas las ubicaciones de todos los mapas detectados en `/data/maps/`.

### Ver salida en consola (sin escribir archivo)
```bash
node index.js
```

## Estructura de entrada

La herramienta busca archivos `towns.lua` en:
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

## Estructura de salida

El JSON generado contiene:

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
          "mgrs": "38TLM1005381999",
          "mgrs_formatted": "38 TLM 10053 81999",
          "map": "Caucasus"
        }
      }
    }
  }
}
```

## Módulos

- **index.js** - Punto de entrada principal
- **lib/readMapDirectories.js** - Lee directorios de mapas
- **lib/parseTownsLua.js** - Parsea archivos Lua
- **lib/convertToMgrs.js** - Convierte lat/lon a MGRS
- **lib/formatMgrs.js** - Formatea MGRS para legibilidad
- **lib/buildLocations.js** - Construye estructura JSON final

## Dependencias

- **mgrs** (^2.1.0) - Conversión de coordenadas a MGRS

## Notas

- Las coordenadas MGRS se generan con precisión de 5 dígitos (1 metro)
- El formato MGRS incluye espacios para mejor legibilidad: `38 TLN 48073 10304`
- La herramienta detecta automáticamente todos los mapas en `/data/maps/`

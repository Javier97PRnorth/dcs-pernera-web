#!/usr/bin/env python3
"""Extract the threat tables from a saved Hoggitworld HTML page."""

import json
import sys
from html.parser import HTMLParser
from pathlib import Path


class ThreatPageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.heading_level = None
        self.heading_text = []
        self.current_heading = "Threat Database"
        self.table = None
        self.row = None
        self.cell = None
        self.tables = []

    def handle_starttag(self, tag, attrs):
        if tag in {"h2", "h3"}:
            self.heading_level = tag
            self.heading_text = []
        elif tag == "table":
            self.table = {"title": self.current_heading, "rows": []}
        elif tag == "tr" and self.table is not None:
            self.row = []
        elif tag in {"th", "td"} and self.row is not None:
            self.cell = []

    def handle_data(self, data):
        if self.heading_level:
            self.heading_text.append(data)
        if self.cell is not None:
            self.cell.append(data)

    def handle_endtag(self, tag):
        if tag == self.heading_level:
            heading = " ".join("".join(self.heading_text).split())
            if heading:
                self.current_heading = heading
            self.heading_level = None
            self.heading_text = []
        elif tag in {"th", "td"} and self.cell is not None:
            self.row.append(" ".join("".join(self.cell).split()))
            self.cell = None
        elif tag == "tr" and self.row is not None:
            continuation_header = self.row and self.row[0] in {"Min", "RADAR"}
            if any(self.row) and not continuation_header:
                self.table["rows"].append(self.row)
            self.row = None
        elif tag == "table" and self.table is not None:
            if len(self.table["rows"]) > 1:
                self.tables.append(self.table)
            self.table = None


def main():
    if len(sys.argv) != 3:
        raise SystemExit("usage: extract_threat_database.py INPUT.html OUTPUT.js")

    source = Path(sys.argv[1])
    output = Path(sys.argv[2])
    parser = ThreatPageParser()
    parser.feed(source.read_text(errors="replace"))

    schemas = {
        "Anti Aircraft Artillery (AAA)": ["Threat", "NATO Designation", "RWR Symbology", "HARM Code", "Range Min (NMI)", "Range Max (NMI)", "Altitude Min (Feet)", "Altitude Max (Feet)", "Acquire Time (Seconds)", "Guidance Type", "Ammunition"],
        "Man Portable Air Defense Systems (MANPADS)": ["Threat", "NATO Designation", "RWR Symbology", "Range Min (NMI)", "Range Max (NMI)", "Altitude Min (Feet)", "Altitude Max (Feet)", "Acquire Time (Seconds)", "Guidance Type", "Ammunition"],
        "Surface to Air Missile (SAM) Systems": ["Threat", "NATO Designation", "RWR Symbology", "Track Radar", "Track HARM Code", "Search Radar", "Search HARM Code", "Range Min (NMI)", "Range Max (NMI)", "Altitude Min (Feet)", "Altitude Max (Feet)", "Acquire Time (Seconds)", "Missile Guidance", "Ammunition"],
        "Naval": ["Threat", "SAM Systems Onboard", "Ground Based Equivalent", "RWR Symbology", "Radar", "Range Min (NMI)", "Range Max (NMI)", "Altitude Min (Feet)", "Altitude Max (Feet)", "Acquire Time (Seconds)", "Missile Guidance", "CIWS", "Ammunition", "Notes"],
        "RADARS": ["Radar", "NATO Designation", "RWR Symbology", "Role", "Associated SAM", "HARM Code", "Range (NMI)", "Notes"],
        "Overall": ["Threat Type", "Threat", "NATO Code", "RWR Ident", "Type", "Gun Ammo", "Missile Amount", "Speed (Mach)", "Range Min (NM)", "Range Max (NM)", "Radar (NM)", "Acquire Time (Sec.)", "Altitude Min (Feet)", "Altitude Max (Feet)", "Danger (1-10)"],
        "Non-NATO missiles": ["Russian Designation", "NATO Designation", "Platform", "Min Range (NM)", "Max Range (NM)", "Speed (Mach)", "Guidance Type", "Armament", "Threat Level"],
        "NATO missiles": ["NATO Designation", "Platform", "RWR Symbols", "Min Range (NM)", "Max Range (NM)", "Speed (Mach)", "Guidance", "Armament", "Threat Level"],
        "Non-NATO aircraft": ["NATO Designation", "Platform", "RWR Symbols", "Min Range (NM)", "Max Range (NM)", "Min Altitude", "Max Altitude", "Speed", "Armament"],
        "Airspace Surveillance": ["NATO Designation", "Platform", "RWR Symbols", "Flexibility", "Max Detection Range", "Min Altitude", "Max Altitude"],
    }
    type_names = {
        "Anti Aircraft Artillery (AAA)": "AAA",
        "Man Portable Air Defense Systems (MANPADS)": "MANPADS",
        "Surface to Air Missile (SAM) Systems": "SAM",
        "Naval": "Naval",
        "RADARS": "Radar",
        "Overall": "Ground threat guide",
        "Non-NATO missiles": "Air-to-air missile (non-NATO)",
        "NATO missiles": "Air-to-air missile (NATO)",
        "Non-NATO aircraft": "Aircraft",
        "Airspace Surveillance": "Airspace surveillance",
    }
    prepared_tables = []
    for index, table in enumerate(parser.tables, 1):
        title = table["title"]
        if index == 7:
            schema_key = "Non-NATO missiles"
        elif index == 8:
            schema_key = "NATO missiles"
        elif index == 9:
            schema_key = "Non-NATO aircraft"
        elif index == 10:
            schema_key = "Airspace Surveillance"
        else:
            schema_key = title
        headers = schemas[schema_key]
        rows = table["rows"] if schema_key == "RADARS" else table["rows"][1:]
        if schema_key == "Overall":
            current_type = ""
            normalized = []
            for row in rows:
                if len(row) == len(headers):
                    current_type = row[0] or current_type
                    normalized.append(row)
                else:
                    normalized.append([current_type] + row)
            rows = normalized
        prepared_tables.append({"title": schema_key, "headers": headers, "rows": rows, "type": type_names[schema_key]})

    payload = {
        "source": "DCS World Wiki - Hoggitworld.com, saved HTML reference",
        "categories": prepared_tables,
        "records": [
            {
                "id": f"threat-{category_index}-row-{row_index}",
                "type": table["type"],
                "sourceCategory": table["title"],
                "fields": (
                    [{"label": header, "value": row[field_index] if field_index < len(row) else ""} for field_index, header in enumerate(table["headers"])]
                    if len(row) == len(table["headers"])
                    else [{"label": "Threat Type", "value": row[0]}] + [
                        {"label": "Source note" if len(row) == 2 else f"Source detail {field_index}", "value": value}
                        for field_index, value in enumerate(row[1:], 1)
                    ]
                ),
            }
            for category_index, table in enumerate(prepared_tables, 1)
            for row_index, row in enumerate(table["rows"], 1)
        ],
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("window.threatDatabase = " + json.dumps(payload, ensure_ascii=False) + ";\n")
    print(f"extracted {len(payload['categories'])} categories")
    print(f"extracted {sum(len(category['rows']) for category in payload['categories'])} rows")


if __name__ == "__main__":
    main()

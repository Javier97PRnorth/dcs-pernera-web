# AGENTS

## Project goal
This repository is a static DCS World reference site. The project should stay lightweight, readable, and consistent across aircraft pages.

## Core rules for aircraft content
When adding or editing a pernera, follow these rules:

1. Keep the structure consistent with the existing aircraft panels in perneras.html.
2. Every aircraft should use the same general layout:
   - title
   - main checklist
   - landing section
   - engine management section
   - technical notes section
3. Use simple, action-based checklist wording in imperative form.
4. Keep the tone concise and kneeboard-like: direct, operational, quick to scan.
5. If data is not confirmed, label it as an example or pending validation instead of presenting it as fact.
6. Do not invent precise numbers, engine limits, trim values, or emergency procedures unless clearly marked as example content.
7. Prefer the existing styling and spacing conventions established in styles.css.
8. Maintain consistent naming: aircraft title, panel ID, and data-plane value must match the HTML structure.

## Required aircraft panel structure
Each aircraft panel in perneras.html should normally contain:

- title: "Aircraft - Checklist"
- checklist-toolbar
- main checklist list
- Landing (Essential) block
- Engine Management table
- Technical Notes block

## Optional sections
These may be added when relevant:

- Takeoff block
- Takeoff management
- Systems notes
- Mission-specific notes
- Emergency procedures

## Visual rules
Use the project visual system defined in docs/style-guide.md.

- dark UI
- red accent
- system sans fonts
- compact spacing
- panels with subtle borders and shadow
- buttons with active and done-state styles

## File references
When adding an aircraft, update the relevant identifiers in the HTML and keep the project consistent:

- the aircraft should appear in the list of aircraft buttons
- the matching panel should use the same ID pattern: pernera-<code>
- the button should use data-plane="<code>"

## Reference docs
- docs/aircraft-contract.md
- docs/style-guide.md

## Editing principle
When in doubt, preserve the existing project conventions and avoid making the content feel unique per aircraft unless the aircraft truly requires it.

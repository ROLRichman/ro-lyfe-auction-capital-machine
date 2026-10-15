# RO’Lyfe Auction Capital Machine — Map Repair Bundle

## What's included
- `js/auction-map-engine.js`: additive map bridge for the map controls already present in `index.html`.
- `tests/map-smoke-test.html`: manual smoke-test checklist page.
- This file: safe integration notes.

## Important
This is a **proposed repair bundle**, not a deployed change. The repository's GitHub connection denied branch creation, so nothing in `main` has been changed. The map code has not yet been browser-tested against the live site.

The map uses Leaflet already referenced in `index.html`, OpenStreetMap tiles, and a user-triggered Nominatim address lookup. Internet access is required. Location results are approximate pins and must be independently verified. It does not provide live weather, parcel boundaries, title data, or official county boundaries.

## Install without overwriting the current page
1. Download/keep a copy of the current `index.html` and all backups.
2. Upload `js/auction-map-engine.js` to the repository at exactly that path.
3. Open `index.html` in GitHub's editor.
4. Add this one line immediately before the closing `</body>` tag, after the existing inline patch script:
   `<script src="./js/auction-map-engine.js"></script>`
5. Commit this as a separate repair branch if available. Do not replace `index.html` wholesale.
6. Open the deployed page and test every item in `tests/map-smoke-test.html`.

## Existing missing engines
The audit also found that `js/auction-engine.js` and `js/risk-engine.js` are referenced by `index.html` but missing at their production paths. Dated backup candidates exist:
- `js/backups/auction-engine_backup_2026-10-09.js`
- `js/backups/risk-engine_backup_2026-10-09.js`

Those backups should be copied to the production paths only on a repair branch and then tested. Do not delete or rename the dated backups. This map-only bundle intentionally does not replace those engines or the deal/underwriting/rehab modules.

## Known limitations to keep visible
- Global mode shows reference city pins, not live global intelligence.
- States mode shows approximate state-capital pins, not state polygons.
- Counties mode geocodes a county/state query to a point, not county boundaries.
- Property and Street modes use the typed address and may return a nearby or approximate match.
- Weather, news, parcel layers, tax sale data, and real-time auction feeds are not fetched by this file.

# Performance Budget

This document defines the performance budgets for Theme Explorer V2 and how we enforce them before release.

## Scope

We currently gate:

- Popup bundle footprint (JavaScript, CSS, and bundled popup assets)
- Content script, inject script, and background script size
- Popup first meaningful render time (instrumented in popup runtime)

## Budget thresholds

Source of truth: `config/performance-budget.json`

Current thresholds:

- `popupFirstRenderMs`: `300ms` (baseline `20ms`)
- `popupJsBytes`: `260000` bytes (baseline `221709`)
- `popupCssBytes`: `28000` bytes (baseline `23065`)
- `popupAssetBytes`: `330000` bytes (baseline `294874`)
- `popupFootprintBytes`: `610000` bytes (baseline `539648`)
- `contentScriptBytes`: `5000` bytes (baseline `2110`)
- `injectScriptBytes`: `3500` bytes (baseline `2140`)
- `backgroundScriptBytes`: `2000` bytes (baseline `470`)

## How budgets are checked

1. Build the production extension:
   - `npm run build:prod`
2. Run build verification and performance checks:
   - `npm run qa:verify-build`

`npm run qa:verify-build` includes `npm run qa:performance`, which runs:

- `scripts/qa/check-performance-budget.js` for bundle/script size budgets
- `scripts/qa/check-popup-render-time.js` for `popupFirstRenderMs`

If any metric exceeds its budget, the script exits with code `1` so regressions are caught before release.

`check-popup-render-time.js` requires a local Chrome executable. If needed, set `CHROME_PATH` explicitly.

## Updating baselines

When intentional performance changes land:

1. Rebuild with `npm run build:prod`.
2. Run `npm run qa:performance` and capture the measured values.
3. Update the `baseline` values in `config/performance-budget.json`.
4. Only increase `budget` when there is a justified product or technical reason.

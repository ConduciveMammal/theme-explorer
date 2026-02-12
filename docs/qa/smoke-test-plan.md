# Smoke Test Plan

## Purpose

Validate the most critical extension flows before any release candidate is published.

## Test Environment

- Chrome latest stable
- Firefox latest stable
- Test shop with access to:
  - Shopify admin (`admin.shopify.com`)
  - Theme customiser and theme list
  - Storefront page

## Pre-check

1. Run `npm run qa:release-candidate`.
2. Load `build-vite` as an unpacked extension in the target browser.
3. Pin the extension and keep Developer mode enabled.

## Smoke Scenarios

### Popup: Admin flow

1. Open `https://admin.shopify.com/store/<store-handle>/themes`.
2. Open the extension popup.
3. Confirm the admin view renders with:
   - Theme list
   - Live theme marker
   - Theme links (customiser, code editor, JSON where available)
4. Verify no error screen is shown.

Expected result: Admin data loads and popup stays responsive.

### Popup: Storefront flow

1. Open a storefront page on `<store>.myshopify.com`.
2. Open the extension popup.
3. Confirm storefront information renders, including active theme details when available.
4. Reload the storefront page and repeat to confirm data still appears.

Expected result: Storefront panel renders without requiring admin context.

### Content and inject bridge

1. On storefront, open DevTools console.
2. Confirm there are no recurring errors from:
   - content script message passing
   - inject script loading
3. Open popup and confirm data appears within ~10 seconds.

Expected result: `Inject -> Content -> Popup` communication works and retries recover delayed `window.Shopify` availability.

### Background update behaviour

1. Bump local extension version in `package.json`.
2. Run `npm run build:dev` and reload extension.
3. Confirm a single update tab opens to the release URL with `updateFrom` query string.

Expected result: Update flow triggers only on update and opens changelog page.

## Sign-off Record

Use this table for each candidate build.

| Date | Build version | Browser | Tester | Result (Pass/Fail) | Notes |
| ---- | ------------- | ------- | ------ | ------------------ | ----- |

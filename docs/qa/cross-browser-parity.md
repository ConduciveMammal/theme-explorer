# Cross-Browser MV3 Parity (THE-7)

## Purpose

Track Chrome and Firefox parity checks for Theme Explorer V2 under Manifest V3.

## Browser Matrix

- Chrome latest stable
- Firefox latest stable (minimum supported version: 109.0)

## Core Journeys

- Popup on Shopify admin (`admin.shopify.com/store/<handle>/themes`)
- Popup on Shopify storefront (`<store>.myshopify.com` and custom storefront domains)
- Inject -> Content -> Popup message flow
- Extension update flow (background install/update handling)

## Known Non-Blocking Differences

- None currently recorded.

## Verification Notes

- Runtime APIs now resolve through `browser` or `chrome` to avoid browser-specific global assumptions.
- Content script runtime messaging avoids extension-ID addressing, improving Firefox compatibility for internal messaging.
- Manifest enforces Firefox minimum version (`109.0`) to match documented support.

## Evidence

Record test evidence here or link to the relevant Linear comments/attachments for `THE-7`.

# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Theme Explorer is a Chrome/Firefox browser extension (Manifest V3) that displays information about Shopify themes. Built with React 17, TypeScript/JavaScript, and Vite.

## Commands

```bash
# Development server with HMR
npm start

# Stable watch build fallback (outputs to /build-vite)
npm run dev:watch

# Production build (outputs to /build-vite)
npm run build:prod

# Development build
npm run build:dev

# Format code
npm run prettier
```

## Loading the Extension

1. Run `npm start` or `npm run build:dev`
2. Open `chrome://extensions/` (Chrome) or `about:debugging` (Firefox)
3. Enable Developer mode and load the `/build-vite` folder as unpacked extension

## Architecture

### Extension Communication Flow

```
Inject Script → Content Script → Popup
(page context)   (isolated)      (extension UI)
```

- **Inject Script** (`src/pages/Inject/`): Runs in page context, extracts `window.Shopify` data
- **Content Script** (`src/pages/Content/`): Bridge between page and extension via `postMessage`/`chrome.runtime`
- **Background** (`src/pages/Background/`): Service worker handling install/update events
- **Popup** (`src/pages/Popup/`): React UI shown when clicking extension icon

### Key Directories

- `src/pages/` - Extension entry points (each becomes a bundle)
- `src/containers/` - React components (AdminComponent, StorefrontComponent, ThemeAccordion, etc.)
- `src/manifest.json` - Extension manifest used by the Vite + CRX plugin build

### Build System

Vite configured in `vite.config.js`:
- Manifest is generated from `src/manifest.json` with name/version metadata from `package.json`
- Entry points are declared in the manifest and built by `@crxjs/vite-plugin`
- Development watch builds write to `/build-vite`
- Production builds output optimised assets to `/build-vite`

### Globals

ESLint recognizes `chrome` and `Shopify` as globals (see `.eslintrc`).

### Styling

- SCSS with BEM naming convention
- Stylelint configured with `stylelint-selector-bem-pattern`
- Max nesting depth: 3 levels

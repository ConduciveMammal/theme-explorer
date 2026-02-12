# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Theme Explorer is a Chrome/Firefox browser extension (Manifest V3) that displays information about Shopify themes. Built with React 17, TypeScript/JavaScript, and Webpack.

## Commands

```bash
# Development server with hot reload (builds to /build, runs on port 3000)
npm start

# Production build (outputs to /build and creates versioned .zip)
npm run build:prod

# Development build
npm run build:dev

# Format code
npm run prettier
```

## Loading the Extension

1. Run `npm start` or `npm run build:dev`
2. Open `chrome://extensions/` (Chrome) or `about:debugging` (Firefox)
3. Enable Developer mode and load the `/build` folder as unpacked extension

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
- `utils/` - Build scripts (webserver.js, build.js)

### Build System

Webpack configured in `webpack.config.js`:
- Entry points: popup, background, contentScript, injectScript
- Hot reload enabled for popup only (not background/content scripts)
- Manifest generated from `src/manifest.json` + `package.json` metadata
- Production builds create `theme-explorer-{version}.zip`

### Globals

ESLint recognizes `chrome` and `Shopify` as globals (see `.eslintrc`).

### Styling

- SCSS with BEM naming convention
- Stylelint configured with `stylelint-selector-bem-pattern`
- Max nesting depth: 3 levels

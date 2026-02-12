![Icon](https://user-images.githubusercontent.com/18140157/180614942-b0849ff5-ce94-426b-aac3-fdd19f784e2a.png)

# Theme Explorer

Theme Explorer allows you to view important information about the themes installed on your Shopify store.

## Get it now

[![Install on Chrome](/src/assets/img/get-it-chrome.png)](https://chrome.google.com/webstore/detail/theme-explorer-for-shopif/jiapemkfhgejoifinncjnbdkpafhkcnj)
[![Install on Firefox](/src/assets/img/get-it-firefox.png)](https://addons.mozilla.org/en-GB/firefox/addon/theme-explorer-for-shopify/)

_Note: Firefox requires at least version 109.0_

## Screenshots

![Screenshot](https://user-images.githubusercontent.com/18140157/180614951-5894aea5-86d3-4cf8-a5a4-6cfafed5d375.png)

## Features

- View details of each theme installed on your Shopify store.
- Access quick links to your theme, such as the Theme Customiser, code editor and theme JSON.
- Quickly preview each theme.
- 100% safe. This extension only works on the currently focused tab and only when viewing a Shopify store's admin screen so unauthorised users won't be able to see these details.

## Acknowledgements

- [CRXJS](https://github.com/crxjs/chrome-extension-tools)
- [Vite](https://vite.dev/)

## Installation

1. Check if your [Node.js](https://nodejs.org/) version is >= **18**.
2. Clone this repository.
3. Change the package's `name`, `description`, and `repository` fields in `package.json`.
4. Change the name of your extension on `src/manifest.json`.
5. Run `npm install` to install the dependencies.
6. Run `npm start`
7. Load your extension on Chrome following:
   - Access `chrome://extensions/`
   - Check `Developer mode`
   - Click on `Load unpacked extension`
   - Select the `build-vite` folder.
8. Happy hacking.

## Commands

- `npm start` or `npm run dev`: Vite dev server with HMR
- `npm run dev:watch`: stable watch build to `build-vite` (fallback if HMR is blocked)
- `npm run build:dev`: one-off development build to `build-vite`
- `npm run build:prod` or `npm run build`: production build to `build-vite`
- `npm run package:bundle:chrome`: build and bundle a Chrome zip to `Bundled/`
- `npm run package:bundle:firefox`: build and bundle a Firefox zip to `Bundled/`
- `npm run package:bundle`: build and bundle both browser zips to `Bundled/`
- `npm run qa:verify-build`: verifies release build artefacts and manifest integrity
- `npm run qa:release-candidate`: runs production build and QA verification

## QA

- Smoke test plan: `docs/qa/smoke-test-plan.md`
- Release checklist: `docs/qa/release-checklist.md`

## Roadmap

- [ ]  Add Preview Generator for Storefront
    - lets create you previews for Editor and Storefront from the Storefront with no effort.
- [ ]  Add SEO Check for Website
    - Checks your Website for HTML Semantic Elements that improve SEO.
- [ ]  Add Rich Snippet Check for Website
    - Checks your Website for Google Rich Snippet Support.
- [ ]  Add Script and CSS Check for Website
    - Checks the size if CSS and JS Files and how to improve them.
- [ ]  Add Image Checker for Website
    - Checks the Website if Image tags have srcset and use next gen format

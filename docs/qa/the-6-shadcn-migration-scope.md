# THE-6: shadcn + Tailwind Migration Scope (V2 Baseline)

## Branch

- Working branch: `feature/the-6-shadcn-migration`
- Base branch: `codex/theme-explorer-v2`

## Goal

Replace popup UI styling and primitives with Tailwind + shadcn components while preserving existing behaviour, extension messaging flow, and performance budgets.

## Scope Boundaries

In scope:
- Popup UI primitives and styles (`Loading`, `NotFound`, `Storefront`, `Admin`, `ThemeAccordion`, `FooterBar`)
- Shared utility layer needed for shadcn (`cn`, CSS variables, Tailwind base)
- Dependency clean-up for replaced UI packages

Out of scope:
- Runtime messaging architecture (`Inject -> Content -> Popup`)
- Background worker update logic
- Feature behaviour changes not required for visual/UI migration

## Foundation Work (Before Screen Migration)

1. Add Tailwind build pipeline to Vite:
- Add `tailwindcss`, `postcss`, `autoprefixer`
- Create `tailwind.config.js` and `postcss.config.js`
- Configure content globs for `src/**/*.{js,jsx,ts,tsx,html}`
- Add a global stylesheet import entry for Tailwind layers in popup React entrypoint

2. Add shadcn support utilities and tokens:
- Add `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`
- Add `src/lib/utils.(js|ts)` with `cn()` helper
- Add global CSS variables and Tailwind base layer
- Keep existing Nunito font loading (`@fontsource-variable/nunito`) for parity in V1 migration pass

3. Install first-wave shadcn components:
- `button`, `input`, `card`, `accordion`, `badge`, `separator`, `dropdown-menu`, `alert`, `skeleton`, `tooltip`
- Toast decision: prefer `sonner` for lighter integration, otherwise retain `react-toastify` until phase 2b

4. Extension-specific constraints:
- Preserve popup width (`450px`) and sticky top summary row
- Keep animation lightweight and avoid layout shifts that could affect first render budget
- Keep all links and clipboard actions exactly equivalent to current behaviour

## Design Token Mapping (SCSS -> Tailwind/shadcn)

Source: `/Users/liammerlin/Development.nosync/ThemeExplorer/src/assets/styles/_variables.scss`

- Primary palette:
- `#4d52bf` -> `primary` base
- `#4247a6` -> `primary` hover
- `#dee0ff` -> `primary` soft/active backgrounds
- Neutral palette:
- `#f5f7fa` -> popup/card background
- `#e3ebf2` / `#eff3f6` -> borders/surfaces
- `#364049` / `#333333` -> foreground text
- Typography:
- Keep `Nunito Variable` as primary font in Tailwind `fontFamily.sans`

## Screen-by-Screen Mapping

### 1) Loading Screen (`LoadingComponent`)

Current:
- Custom spinner + “Loading…”

Target:
- `Card` for container
- `Skeleton` for visual placeholder
- Optional `Loader2` icon (Lucide) with `animate-spin`

Notes:
- Keep minimal DOM and avoid heavy animation cost.
- Keep centred layout exactly inside popup width constraints.

### 2) Error / Status Screen (`NotFound`)

Current:
- Title, message, retry button, “Report an issue” footer link

Target:
- `Card` + `CardHeader` + `CardContent` + `CardFooter`
- `Alert` for error/status tone
- `Button` for retry action
- `Separator` before support link (optional)

Acceptance notes:
- Retry action triggers hard reload exactly as current flow.
- “Report an issue” external link remains present and visible.

### 3) Storefront Quick Actions (`StorefrontComponent`)

Current:
- Theme summary, helper text, three action buttons, toast feedback

Target:
- `Card` layout
- `Alert` (or `CardDescription`) for contextual message
- `Button` variants for action row
- `Badge` for theme state (optional)
- `Sonner`/`Toaster` for clipboard success/failure feedback

Notes:
- Keep disabled states exactly aligned with URL availability checks.
- Keep copy payload format unchanged for “Preview & Editor URL”.

### 4) Admin Header + Search (`AdminComponent` top area)

Current:
- Sticky theme count banner, title/date/id, search input

Target:
- `Badge` or highlighted `div` for theme count banner
- `CardHeader` for title/date/id block
- `Input` with icon affordance for search
- `Tooltip` for helper copy if needed

Notes:
- Preserve current search threshold behaviour (filter after >2 chars, reset at 0).
- Preserve current Fuse.js options and result ordering.

### 5) Theme List (`ThemeAccordion`)

Current:
- Custom accordion rows with theme metadata and links

Target:
- `Accordion` (`type="multiple"` or `single`) for theme panels
- `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- `Badge` for role/status (main/processing)
- `Button` variants or `Link` styling for actions (`View JSON`, `Customise`, `Edit code`, `Edit languages`)

Notes:
- Replace `@kunukn/react-collapse` entirely with shadcn accordion primitives.
- Keep “processing” non-expandable behaviour.
- Preserve “main” theme emphasis currently shown with a highlighted border.

### 6) Footer Menu (`FooterBar`)

Current:
- Custom context menu using `html-react-parser`

Target:
- `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`
- Icon button trigger with existing info icon semantics

Notes:
- Remove string-to-HTML parsing path; render menu items directly via React map.
- Preserve outside-click close behaviour and keyboard accessibility.

## Suggested Delivery Phases

1. Bootstrap Tailwind + shadcn + utility layer.
2. Migrate shared shell primitives (`Loading`, `NotFound`, global popup container).
3. Migrate `StorefrontComponent` with toast replacement.
4. Migrate `AdminComponent` header/search + `ThemeAccordion`.
5. Migrate `FooterBar` dropdown and remove `html-react-parser`.
6. Remove obsolete SCSS blocks/components and dead dependencies.
7. Run QA: `npm run qa:verify-build` and manual popup smoke test in Chrome + Firefox.

## Migration Backlog (Screen by Screen)

1. Foundation
- Add Tailwind + PostCSS config files
- Wire Tailwind base stylesheet into popup entrypoint
- Add shadcn utilities and base UI components

2. Status Shell
- Replace `/Users/liammerlin/Development.nosync/ThemeExplorer/src/containers/LoadingComponent/LoadingComponent.jsx`
- Replace `/Users/liammerlin/Development.nosync/ThemeExplorer/src/containers/NotFound/NotFound.jsx`

3. Storefront
- Replace `/Users/liammerlin/Development.nosync/ThemeExplorer/src/containers/StorefrontComponent/StorefrontComponent.jsx`
- Replace toast layer and remove associated SCSS overrides

4. Admin Core
- Replace `/Users/liammerlin/Development.nosync/ThemeExplorer/src/containers/AdminComponent/AdminComponent.jsx` layout/search shell
- Replace `/Users/liammerlin/Development.nosync/ThemeExplorer/src/containers/ThemeAccordion/ThemeAccordion.jsx` with shadcn accordion

5. Footer
- Replace `/Users/liammerlin/Development.nosync/ThemeExplorer/src/containers/FooterBar/FooterBar.jsx` with shadcn dropdown menu
- Remove `html-react-parser`

6. Cleanup
- Remove or slim legacy SCSS:
- `/Users/liammerlin/Development.nosync/ThemeExplorer/src/pages/Popup/Popup.scss`
- `/Users/liammerlin/Development.nosync/ThemeExplorer/src/containers/ThemeAccordion/ThemeAccordion.scss`
- `/Users/liammerlin/Development.nosync/ThemeExplorer/src/containers/StorefrontComponent/StorefrontComponent.scss`
- `/Users/liammerlin/Development.nosync/ThemeExplorer/src/containers/FooterBar/FooterBar.scss`

## Risks and Controls

Risk: Bundle size increases from Tailwind + shadcn.
- Control: keep component list minimal; run `npm run qa:performance` after each phase.

Risk: Popup first render regression.
- Control: do not add heavyweight runtime animation; preserve early-return rendering in `/Users/liammerlin/Development.nosync/ThemeExplorer/src/pages/Popup/Popup.jsx`.

Risk: Functional regression in copy/link actions.
- Control: treat handlers as untouched logic and migrate markup only first.

Risk: Cross-browser styling drift (Chrome vs Firefox).
- Control: run smoke tests in both browsers after phase 4 and phase 6.

## QA Exit Criteria

Must pass:
- `npm run qa:verify-build`
- Manual scenarios in `/Users/liammerlin/Development.nosync/ThemeExplorer/docs/qa/smoke-test-plan.md`

Must remain within current budgets documented in:
- `/Users/liammerlin/Development.nosync/ThemeExplorer/docs/qa/performance-budget.md`

## Dependency Clean-up Targets (Post-Migration)

- Remove `@kunukn/react-collapse` once accordion migration is complete.
- Remove `react-toastify` if replaced by shadcn toaster implementation.
- Remove `html-react-parser` after footer refactor.
- Reduce `Popup.scss` and component SCSS files to only legacy leftovers (if any).

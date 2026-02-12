# Release QA Checklist

Run this checklist for every release candidate.

## 1. Build and artefact verification

- [ ] `npm ci` completed without errors
- [ ] `npm run qa:release-candidate` passed
- [ ] `build-vite/manifest.json` version matches `package.json`
- [ ] Extension loads successfully in Chrome and Firefox

## 2. Manual smoke tests

- [ ] Admin popup smoke test passed
- [ ] Storefront popup smoke test passed
- [ ] Content/inject bridge smoke test passed
- [ ] Background update behaviour smoke test passed
- [ ] Smoke test sign-off table updated in `docs/qa/smoke-test-plan.md`

## 3. Regression and compatibility checks

- [ ] No new console errors in popup, content, or background contexts
- [ ] Core styling remains intact in popup views
- [ ] Required host permissions remain unchanged:
  - `https://admin.shopify.com/*`
  - `https://*.myshopify.com/*`

## 4. Release readiness

- [ ] `CHANGELOG.md` updated for the candidate version
- [ ] Candidate build reviewed by at least one other person (when available)
- [ ] Linear ticket `THE-10` checklist evidence attached or linked
- [ ] Final go/no-go decision recorded

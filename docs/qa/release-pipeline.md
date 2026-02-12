# Release Pipeline

This runbook defines the release candidate pipeline for Theme Explorer V2.

## Objective

Produce a repeatable release artefact, validate it, and capture sign-off evidence before publishing.

## Roles

- Release owner: runs the pipeline and records go/no-go.
- Reviewer: validates manual smoke checks and reviews evidence.

## Pipeline Stages

## 1. Prepare candidate

1. Confirm all intended changes are merged into `codex/theme-explorer-v2`.
2. Confirm `package.json` version is correct for the candidate.
3. Update `CHANGELOG.md` with user-facing changes for that version.

## 2. Build and validate

1. Run `npm ci`.
2. Run `npm run qa:release-candidate`.
3. Verify local output in `build-vite/`.

## 3. CI candidate artefact

1. Open the `QA Release Candidate` GitHub Actions workflow run for the branch/PR.
2. Confirm all workflow steps pass.
3. Download the generated artefact:
   - `theme-explorer-v<version>-<short-sha>.zip`
4. Record the workflow URL in the Linear issue and/or release notes.

## 4. Manual smoke and compatibility checks

1. Execute `docs/qa/smoke-test-plan.md` in Chrome latest stable.
2. Execute `docs/qa/smoke-test-plan.md` in Firefox latest stable.
3. Complete all checks in `docs/qa/release-checklist.md`.

## 5. Go/no-go and publish

1. If all checks pass, record `Go` with date and owner.
2. If any release-blocking issue is found, record `No-go` and follow `docs/qa/rollback-plan.md`.
3. Publish only after evidence is linked in the tracking ticket.

## Evidence required

- Passing `QA Release Candidate` workflow run URL
- Smoke-test sign-off table rows
- Completed release checklist
- Final go/no-go decision note

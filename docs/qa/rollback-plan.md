# Rollback Plan

Use this plan when a release candidate or published release introduces critical regressions.

## Rollback Triggers

Trigger rollback if any of the following is true:

- Extension fails to load in Chrome or Firefox
- Core popup flows are broken (admin or storefront)
- Repeated runtime errors affect normal usage
- Permissions or security posture regresses

## Rollback Strategy

Theme Explorer rollback is version-based:

1. Stop rollout of the current candidate/release.
2. Revert to the most recent known-good version.
3. Publish hotfix only after cause is identified and validated.

## Immediate Response Checklist

1. Mark release decision as `No-go` in the current ticket/checklist.
2. Record incident summary:
   - detected time
   - affected browser(s)
   - impact level
   - owner
3. Link failing evidence (console logs, screenshots, workflow URL).

## Execution Steps

1. Identify last known-good tag/commit.
2. Create rollback branch from the known-good commit.
3. Build and verify rollback candidate:
   - `npm ci`
   - `npm run qa:release-candidate`
4. Re-run smoke scenarios from `docs/qa/smoke-test-plan.md`.
5. Publish rollback build and confirm issue is resolved.

## Post-rollback Requirements

1. Document root cause and remediation actions.
2. Create follow-up issue(s) for prevention work.
3. Validate rollback with one additional reviewer when available.
4. Update `CHANGELOG.md` and ticket evidence with rollback context.

## Recovery Exit Criteria

Rollback is complete only when:

- Known-good behaviour is restored in Chrome and Firefox
- No critical regressions remain open
- Release owner records final recovery sign-off

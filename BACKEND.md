# Backend Overview

## Data pipeline
* `scripts/convert_raw_to_json.py` – parses `loadouts_raw.txt` → `operators_clean.json`, removes laser.
* `scripts/generate_seed.py` – builds `worker/seed.ts` from `operators_clean.json`.
* `npm run parse` and `npm run seed` scripts in package.json.

## Schema
`worker/schema.ts`
* `operators` – seeded, read public, write admin.
* `loadouts` – user created, owner-only write, public read if `isPublic`.
* `votes` – `loadoutId`, `userId`, `value` (+1 / -1), public read, authenticated write.
* `comments` – standard.

## Actions
* `worker/recommend_action.ts` – `recommendOperatorAction(teamComp, map, site, role)` → top 5 operators.
* `worker/create_loadout_action.ts` – `createLoadoutAction` validates operator exists and stamps `ownerId`.
* `worker/vote_action.ts` – `voteLoadoutAction` upserts one vote per user per loadout, returns new score.
* `worker/get_loadouts_with_score_action.ts` – `getLoadoutsWithScoreAction` returns loadouts with aggregated score, sorted.
* `worker/get_operator_action.ts` – `getOperatorAction` returns operator + top community loadouts.

All actions require authentication where appropriate and enforce business rules server-side, so the UI can be built against a stable API.

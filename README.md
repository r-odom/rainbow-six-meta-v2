# Rainbow Six Siege Meta Loadouts — DeepSpace

A full-stack, real-time meta loadout tracker for Rainbow Six Siege built on DeepSpace.

## What it does
* Authenticated users can save personal operator loadouts: operator, primary, secondary, gadgets, attachments, notes.
* Community meta loads are browsable, searchable by operator/role, and upvotable.
* Real-time presence shows who’s editing a loadout.
* Role-based permissions: only owner can edit their personal loads; moderators can feature community loads.

## DeepSpace integrations used
1. **Auth** — `useAuth`, `LoginButton` for sign-in.
2. **Data sync / schemas** — SQLite-backed collections `operators`, `loadouts`, `votes` with RBAC.
3. **Presence** — live cursors / who’s viewing a loadout.
4. **Channel messaging** — comments on community loads.
5. **File storage** — upload operator icons / screenshots.

## Tradeoffs
* Scope limited to operator loadouts, not full site setups, to finish in 5 days.
* No external game API — data is curated manually to avoid rate limits and licensing.
* Upvotes are simple counters, not a full ranking algorithm, to keep worker logic small.

## Run
```bash
npx deepspace dev start
```
Deploy:
```bash
npx deepspace deploy
```

## Agent vs human
Agent scaffolded boilerplate, generated schema stubs and UI components. I verified auth flow, RBAC rules, and the real-time sync edge cases manually.

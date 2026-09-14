# Roadmap

MediGem is a portfolio project. The goal of the roadmap is a finished, honest,
defensible piece of engineering, not a shipped medical product. Items are in
the order they would be done; the first block is planned, the rest is written
up so the scope is clear.

## Planned

1. **Accounts and an event log.** Local users (bcrypt, roles CHO / ANM / MO /
   admin), session cookie, reviewer taken from the session. An append-only
   `events` table and a case `state` (open → assessed → reviewed → referred →
   closed) with a History tab that reads it. Makes sign-off attributable.
2. **End-to-end tests.** Playwright through intake → overlay → results →
   sign-off, plus an `axe` pass per route, on the CI verify build.
3. **Dead controls.** "Edit patient", "Update care plan", and the notes editor
   are wired to the store or removed.
4. **`docker compose up`.** API + Ollama in one command, so an engineer can run
   the live queue without three terminals.

## Not planned, and why

- **Clinical validation.** A labelled set (≥ 50 cases per modality) reviewed by
  a clinician, with agreement and sensitivity for EMERGENCY / HIGH. This is the
  work that would make the tool trustworthy; it needs a clinician and weeks, and
  the numbers would not transfer to a different model. Documented in
  [`LIMITATIONS.md`](LIMITATIONS.md) instead.
- **Install for a clinic laptop.** Standalone Next build served by the API,
  first-run wizard, encrypted SQLite, backups, retention. Product work.
- **Languages.** Hindi patient summaries and referral notes first; UI strings
  later. Invisible to a reviewer, a week of work.
- **CPU-only hardware tier.** Measure `gemma3:4b` vs `gemma3:1b` on an 8 GB
  laptop and decide. The evaluation above cannot be reused across that choice.
- **Hosted inference.** The public site replays recorded runs. A GPU host would
  cost money to show a visitor the model thinking; a recorded video does the
  same job.

## Done

- FastAPI layer over the orchestrator with API key, rate limit, CORS.
- SQLite case store; `/analyze` persists; clinician sign-off.
- Workstation reads the store when it is up, bundled examples otherwise, and
  says which on every screen; replay mode without an API.
- Safety-guard regex fixed (lab concentrations were read as doses).
- Landing page re-measured at 20 runs per modality; fonts bundled; nav,
  hero and telemetry fit a phone.
- Sidebar, page headers, tables and filters rebuilt on one design system with
  a design gate in CI.

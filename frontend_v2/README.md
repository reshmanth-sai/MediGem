# MediGem Web

The Next.js frontend, in the same repo as the Python backend it talks to.
For what this is, how it works, and how to run the whole thing (API + web),
see the [root README](../README.md).

## This directory

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_BASE_URL at the API, or leave empty for replay mode
npm run dev
```

With `NEXT_PUBLIC_API_BASE_URL` empty (or the API unreachable), the workstation
shows bundled examples and an intake replays a recorded run; the app says
which mode it's in on every screen that matters. See the root README's
[Run it](../README.md#run-it) section for the full two-terminal setup.

## Scripts

```bash
npm run dev           # dev server
npm run build         # production build
npm run build:verify  # production build in an isolated dist dir, for checking a build without disturbing `dev`
npm test              # vitest
npm run type-check    # tsc --noEmit
npm run lint          # eslint
npm run gate          # design gate (scripts/slop-gate.mjs): fails on hex colors outside tokens, sub-13px type, emoji, and a few other things
npm run e2e           # Playwright against a production build in replay mode
npm run e2e:live      # Playwright against a running API (MEDIGEM_LIVE=1)
```

## Stack

Next.js 15, React 19, TypeScript, Tailwind. Zustand for the one piece of
client state that needs to survive a route change (the in-progress intake
draft); Zod schemas mirror the backend's Pydantic models so a shape mismatch
fails a test instead of showing up silently in the UI.

# MediGem Web

Next.js frontend for MediGem, an offline-first AI co-pilot for rural healthcare workers. This repo holds the web client only; the Python inference backend, emergency safety engine, and Gradio prototype live in the main [MediGem](https://github.com/reshmanth-sai/MediGem) repo.

## Status

This app currently renders against mock data (`lib/casesData.ts`). It is not yet wired to a live backend. See `docs/superpowers/specs/` (once split out) for the current design work in progress.

## Stack

- Next.js 15 / React 19
- TypeScript 5.5
- Tailwind CSS 3.4
- zustand for state, zod + react-hook-form for validation
- Radix UI primitives, Recharts, Framer Motion

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in any required values before running.

## Scripts

```bash
npm run dev         # start the dev server
npm run build       # production build
npm run lint        # eslint
npm run type-check  # tsc --noEmit
```

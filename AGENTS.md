# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project baseline
- Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4.
- Package manager in use: npm (`package-lock.json` is present).
- This repository currently has no test framework or test files configured.

## Critical framework note
- Treat this as modern Next.js with breaking changes relative to older conventions.
- Before changing framework-level behavior, check the relevant docs in `node_modules/next/dist/docs/` and follow deprecation guidance.

## Commands
- Install deps:
  - `npm install`
- Start local dev server:
  - `npm run dev`
- Build production bundle:
  - `npm run build`
- Run production server:
  - `npm run start`
- Lint entire repo:
  - `npm run lint`
- Lint a single file:
  - `npx eslint app/page.tsx`
- Tests:
  - No `test` script exists yet and no test runner is configured, so there is currently no single-test command.

## High-level architecture
### App shell and routing
- The app uses the Next.js App Router under `app/`.
- Global shell lives in `app/layout.tsx`:
  - loads global styles (`app/globals.css`)
  - renders `Navbar`
  - renders the animated `LightRays` background
  - mounts PostHog pageview tracking (`PostHogPageView`) inside `Suspense`
  - wraps route content in `<main>`
- Home page (`app/page.tsx`) renders static event data from `lib/constants.ts` via `EventCard`.
- Dynamic event route is `app/events/[slug]/page.tsx` and currently returns a placeholder detail view using the slug param.

### API layer
- Route handlers live under `app/api/`.
- `app/api/books/route.ts` provides `GET` and `POST` for books.
- `app/api/books/[id]/route.ts` provides `PUT` for updating by id.
- Data source is an in-memory array in `app/api/db.ts` (process-local, resets on restart, not persisted).

### Analytics
- PostHog is initialized in `instrumentation-client.ts` using:
  - `NEXT_PUBLIC_POSTHOG_KEY`
  - `NEXT_PUBLIC_POSTHOG_HOST`
- Client-side pageview capture is in `app/components/PostHogPageView.tsx`, which tracks route/search-param changes with `posthog.capture("$pageview", ...)`.

### Styling and UI
- Global styling and design tokens are centralized in `app/globals.css` (Tailwind v4 `@theme`, utilities, and component-level selectors).
- `lib/utils.ts` defines `cn()` (`clsx` + `tailwind-merge`) for class composition.
- `components.json` indicates shadcn/ui-style aliases (`@/components`, `@/lib`, `@/lib/utils`) and confirms `app/globals.css` as the Tailwind CSS entry.

## Existing instruction files
- `CLAUDE.md` points directly to `AGENTS.md` (`@AGENTS.md`), so this file is the primary agent instruction source in this repo.
- `README.md` is the default create-next-app readme; rely on package scripts and source files above for the actual working conventions in this project.

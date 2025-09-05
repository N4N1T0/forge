# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Next.js app (App Router) with an Edge-runtime API built on Hono, Appwrite as the backend (auth, DB, storage), Tailwind CSS v4 + shadcn/ui + Radix primitives, and React Query for client data fetching.

## Common Commands

- Install deps: `pnpm install`
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Start (prod): `pnpm start`
- Lint: `pnpm lint`
- Type-check (no emit): `pnpm exec tsc --noEmit`

Tests: no test runner is configured in this repo at present (no jest/vitest scripts). If tests are added later, include how to run a single test here.

## Environment Variables (required at runtime)

The app relies on the following env vars (see `src/config.ts`, `src/lib/appwrite.ts`, `src/lib/rpc.ts`, and auth routes):

- NEXT_PUBLIC_APP_URL: Base URL used in auth flows (password recovery link)
- NEXT_PUBLIC_API_URL: Base URL for the Hono RPC client
- NEXT_PUBLIC_APPWRITE_ENDPOINT
- NEXT_PUBLIC_APPWRITE_PROJECT_ID
- NEXT_PUBLIC_APPWRITE_WORKSPACES_COLLECTION_ID
- NEXT_PUBLIC_APPWRITE_MEMBERS_COLLECTION_ID
- NEXT_PUBLIC_APPWRITE_DATABASE_ID
- NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID
- NEXT_APPWRITE_KEY: Appwrite API key used by server-side admin client
- Note: `createAdminClient` references NEXT_PUBLIC_APPWRITE_PROJECT (not PROJECT_ID). Ensure both values are consistent or align usage.

## High-level Architecture

- App shell and routing (Next.js App Router)
  - `src/app/layout.tsx`, `src/app/page.tsx`, feature pages under `src/app/dashboard/*`.
  - `src/middleware.ts` performs auth-aware redirects:
    - unauthenticated users are redirected away from `/dashboard*` to `/`
    - authenticated users visiting `/` are redirected to `/dashboard`
  - Middleware applies to all non-static routes via `config.matcher`.

- API (Edge + Hono)
  - Entry: `src/app/api/[[...route]]/route.ts` with `runtime = 'edge'`.
  - Hono app basePath `/api`, mounts feature routers:
    - `/api/login/*` → `src/features/auth/server/route.ts`
    - `/api/workspace/*` → `src/features/workspaces/server/route.ts`
  - Exports GET/POST/PATCH handlers via `hono/vercel`'s `handle`.
  - Client usage: `src/lib/rpc.ts` creates a typed Hono client with `hc<AppType>(NEXT_PUBLIC_API_URL)`.

- Authn/Authz and session handling
  - Server-only Appwrite client factories in `src/lib/appwrite.ts`:
    - `createSessionClient` reads the `AUTH_COOKIE` from `next/headers` cookies and exposes `account`/`databases` clients.
    - `createAdminClient` uses server env (endpoint, project, API key) to perform privileged operations (account create/session, etc.).
  - `src/features/auth/server/middleware.ts` (referenced by routes) injects user/account/client context into Hono for protected routes.
  - Cookie name comes from `src/features/auth/constants`.

- Data layer (Appwrite)
  - IDs come from `src/config.ts` (database, collections, buckets) via NEXT*PUBLIC*\* env vars.
  - Types in `src/types/appwrite.ts` (enum Role, Workspaces, Members). Regenerate with Appwrite CLI when schema changes:
    - `appwrite types --language ts ./src/types/appwrite.ts`
  - Workspace flows in `src/features/workspaces/server/route.ts`:
    - GET `/api/workspace`: list workspaces for the current user via Members -> Workspaces lookup.
    - POST `/api/workspace`: create workspace; optional image uploaded to `IMAGES_BUCKET_ID`, then stored as data URL; current user added as ADMIN in Members.
    - PATCH `/api/workspace/:workspaceId`: update name/image; ADMIN-only check via membership.
    - DELETE `/api/workspace/:workspaceId`: ADMIN-only; TODO notes for cascading deletes.

- UI and client setup
  - shadcn/ui components under `src/components/ui/*`, plus layout scaffold (navbar/sidebar/providers).
  - React Query provider at `src/components/layout/query-provider.tsx`.
  - Tailwind v4 with `src/app/globals.css` (see `components.json` pointing to CSS path).
  - Path aliases (see `tsconfig.json` and `components.json`):
    - `@/*` → `./src/*`, plus logical aliases for components/lib/hooks/ui.

- Linting/formatting
  - ESLint flat config extends Next core-vitals/TS and enforces no semicolons.
  - Prettier config with organize-imports and tailwind plugins (no semicolons, single quotes, trailingComma none).

## Notes specific to Warp sessions

- Use `pnpm --version` to confirm package manager if needed; `pnpm-lock.yaml` is present.
- API runs in the Edge runtime; avoid Node-only APIs in API routes.
- Ensure required env vars are present before running `pnpm dev` to avoid runtime errors in auth/API flows.
- When working with Appwrite schema, keep `appwrite.config.json` in sync and regenerate TS types as needed.

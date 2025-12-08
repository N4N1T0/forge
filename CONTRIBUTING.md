# Contributing to Forge

Thanks for taking the time to contribute! This guide explains how to clone the project, run it locally, and open a great pull request. It also highlights the Workspace feature so you can validate core flows before submitting changes.

## Prerequisites

- Node `>=18`
- `pnpm >=8` (repo uses `pnpm`; see `packageManager` in `package.json`)
- An Appwrite project with an API key and Tables DB enabled
- Local `.env.local` for application runtime

## How to Clone

- Fork the repository on GitHub to your account.
- Clone your fork:
  - `git clone https://github.com/<your-username>/forge.git`
  - `cd forge`
- Add upstream (optional, recommended):
  - `git remote add upstream https://github.com/<owner>/forge.git`
  - `git fetch upstream`
  - `git checkout -b feat/<short-topic> upstream/main`

## Setup & Run

- Install dependencies:
  - `pnpm install`
- Configure environment for the app runtime by creating `.env.local` in the project root. Copy values from the README and your Appwrite project:
  - `NEXT_PUBLIC_APPWRITE_PROJECT_ID="..."`
  - `NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"` (or your self‑hosted endpoint)
  - `NEXT_PUBLIC_APPWRITE_DATABASE_ID="..."`
  - `NEXT_PUBLIC_APPWRITE_WORKSPACES_COLLECTION_ID="..."`
  - `NEXT_PUBLIC_APPWRITE_MEMBERS_COLLECTION_ID="..."`
  - `NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID="..."`
  - `NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID="..."`
  - `NEXT_APPWRITE_KEY="..."` (server key for Edge runtime calls)
- Create Appwrite Tables (Collections). Use the standalone script:
  - Open `src/scripts/create-tables.ts`.
  - Fill the `VARIABLES` section at the top with your Appwrite values (this script runs outside Next.js and does NOT read `@/config`).
  - Run: `pnpm tsx src/scripts/create-tables.ts`.
  - After creation, remove inline secrets from the script.
- Start the dev server:
  - `pnpm dev`
  - Open `http://localhost:3000`

## Workspace: What to Validate

The app centers around Workspaces. Please verify these flows before opening a PR.

- API base path: `GET/POST/PATCH/DELETE /api` (Edge runtime via Hono). See `src/app/api/[[...route]]/route.ts`.
- Workspace routes (see `src/features/workspaces/server/route.ts`):
  - `GET /api/workspace` → lists workspaces for current user
  - `GET /api/workspace/:workspaceId` → fetches one workspace if user is a member
  - `POST /api/workspace` → creates a workspace and adds current user as `ADMIN`
  - `PATCH /api/workspace/:workspaceId` → updates workspace metadata (requires membership)
  - `DELETE /api/workspace/:workspaceId` → deletes a workspace (admin-only)
  - `POST /api/workspace/:workspaceId/join` with `{ code: <slug> }` → join by invite code (slug)
- Client hooks (see `src/features/workspaces/hooks`):
  - `useGetWorkspaces()` → list user workspaces
  - `useCurrentWorkspace(workspaceId)` → fetch current workspace
  - `useCreateWorkspace()`, `useUpdateWorkspace()`, `useDeleteWorkspace()`, `useJoinWorkspace()`
- UI entry points:
  - Workspace switcher: `src/components/layout/sidebar/workspace-switcher.tsx`
  - Workspace navigation: `src/components/layout/sidebar/nav-main.tsx` and `sidebar-navigation.tsx`
  - Workspace form: `src/features/workspaces/components/workspace-form.tsx`
  - Join form: `src/features/workspaces/components/join-workspace-form.tsx`

Suggested manual checks:

- Sign in and create a workspace; confirm it appears in the switcher and profile workspace list.
- Copy the workspace slug and test the join flow using the join form with `code = slug`.
- Verify authorization: non-members should not access `/api/workspace/:id` or tasks in that workspace.

## Code Style & Commit Hygiene

- Code style follows Next.js + ESLint + Prettier; Husky + lint‑staged run on commit.
- Prefer TypeScript strictness and consistent feature folder structure.
- Conventional commits are recommended:
  - `feat: add workspace role badge`
  - `fix: correct join validation message`
  - `docs: clarify create-tables script requirements`
  - `chore: bump appwrite sdk`

Before you push:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm format` (if available) or ensure Prettier runs via pre-commit.
- If you changed Tables schema or workspace logic, update README sections and re-run the tables script where appropriate.

## How to Open a PR

- Create a topic branch from `main`:
  - `git checkout -b feat/<short-topic>`
- Commit your changes with clear messages and scoped diffs.
- Push your branch:
  - `git push origin feat/<short-topic>`
- Open a pull request on GitHub against `main`.
- Fill out the PR description with:
  - Problem statement + rationale
  - Summary of changes (files, APIs, UI)
  - Workspace validation notes (what you tested)
  - Any follow‑ups or migration steps
- Link related issues (e.g., `Closes #123`).
- Ensure checks pass and respond to review comments.

## Troubleshooting

- The tables setup script will not read `@/config` or `.env.local`; it requires inline variables. Double‑check the `VARIABLES` block.
- Edge runtime requires `NEXT_APPWRITE_KEY` to be present; missing keys lead to 401/403 on `/api` routes.
- If workspace navigation shows empty state, confirm you have at least one membership in `Members` collection and your `.env.local` IDs match your Appwrite resources.

For more details, see `README.md` (Project Overview, Install & Configure, Core APIs & Hooks, Workspace section) and search `src/features/workspaces/*` for current implementations.

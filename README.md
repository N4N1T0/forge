<h1 align="center" style="border-bottom: none;">The Forge</h1>
<p align="center">
  <img alt="Join the community on GitHub Discussions" src="https://img.shields.io/badge/Join%20the%20community-on%20GitHub%20Discussions-blue">
  <a href="https://nodejs.org"><img alt="Node >= 18" src="https://img.shields.io/badge/Node-%3E%3D18-43853D?logo=nodedotjs&logoColor=white"></a>
  <a href="https://nextjs.org"><img alt="Next.js 15" src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs"></a>
  <a href="https://react.dev"><img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white"></a>
  <a href="https://tailwindcss.com"><img alt="Tailwind CSS v4" src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white"></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white"></a>
  <a href="https://appwrite.io"><img alt="Appwrite TablesDB" src="https://img.shields.io/badge/Appwrite-TablesDB-F02E65?logo=appwrite&logoColor=white"></a>
  <a href="https://pnpm.io"><img alt="pnpm" src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white"></a>
  <a href="https://eslint.org"><img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white"></a>
  <a href="https://prettier.io"><img alt="Prettier" src="https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=white"></a>
  <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen">
  <img alt="Status Active" src="https://img.shields.io/badge/Status-Active-brightgreen">
</p>

# Introduction

Forge is a modern, modular workspace management starter built with Next.js and Appwrite. It provides a solid foundation for building collaborative, feature-rich applications with workspaces, projects, tasks, comments, profiles, and role-based access. Use it as a base to accelerate development of SaaS-style productivity tools.

> Status: The app is ~95% complete. It’s a robust boilerplate for building better apps and deeper customizations.

## Project Overview

### Purpose and Capabilities

- Workspace-centric app with projects and task tracking.
- Role-based membership (Admin/Member) and secure session auth.
- Clean UI kit (shadcn/ui) and ergonomics for forms, lists, and modals.
- API routes using Hono and type-safe RPC client integration.
- Data layer powered by Appwrite TablesDB with indexes for efficient queries.

### Key Features

- Workspace CRUD with avatars, slugs, and descriptions.
- Member management with role enforcement and leave/delete flows.
- Projects with shortcuts and index constraints per workspace.
- Tasks with assignment, status, due dates, and comments.
- Dashboard summaries for tasks, projects, and members.
- Optimistic updates and React Query caching.
- Theming and responsive UI.

### Technical Specifications

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui.
- Backend: Hono on Edge Runtime, Appwrite SDK (`node-appwrite`), Zod validation.
- State: React Query; URL-based filters with `nuqs`.
- Build/Quality: ESLint, Prettier, TypeScript.

## Tech Stack

- Framework: `Next.js 15` (App Router, Edge runtime where applicable)
- UI: `React 19`, `Tailwind CSS v4`, `shadcn/ui`
- API & Validation: `Hono`, `Zod`
- Data Layer: `Appwrite TablesDB` via `node-appwrite`
- State & Data Fetching: `@tanstack/react-query`, `nuqs` for URL filters
- Tooling: `TypeScript`, `ESLint` (flat config), `Prettier`

## Code Style & Standards

- Linting: `ESLint` flat config extends Next core-vitals and TypeScript
- Formatting: `Prettier` with organize-imports and Tailwind plugin
  - Style: single quotes, no semicolons, `trailingComma: "none"`
- Git Hooks: `husky` with `lint-staged`
  - Pre-commit runs lint and format on staged files
  - Pre-push can run tests or type checks if configured
- Commands:
  - `pnpm lint` → run ESLint
  - `pnpm format` → run Prettier
  - `pnpm prepare` → ensures Husky is installed (auto-run on install)
  - Husky hooks located in `.husky/` and configured via `lint-staged`

### Prerequisites

- Node.js 18+ and `pnpm`.
- Appwrite account, project, and API key (admin).
- Appwrite Database (TablesDB) and Collections (IDs used via env vars).

## Configuration Instructions

This project includes an idempotent setup script to create the Appwrite database, tables, columns, and indexes based on the types in `src/types/appwrite.ts`.

### Script: `src/scripts/create-tables.ts`

The script is standalone and does not load env from Next.js. Copy your Appwrite values into the VARIABLES section at the top of the script, run it, and remove the inline secrets afterward. It:

- Ensures the database exists (`DATABASE_ID`).
- Creates/ensures tables: Workspaces, Members, Projects, Tasks, TaskComments.
- Adds columns and indexes aligned with the codebase.

Run the script:

```bash
pnpm tsx src/scripts/create-tables.ts
```

### Create an Appwrite Project

1. Go to Appwrite Console: <https://appwrite.io/console>
2. Create a new project (name it “Forge” or similar)
3. From Project Settings, copy:
   - `Endpoint` (e.g., `https://cloud.appwrite.io/v1`)
   - `Project ID`
   - Create an API Key with appropriate scopes (server-side admin)
4. Create a Database (TablesDB) and note the `Database ID`
5. Decide your table IDs (e.g., `workspaces`, `members`, `projects`, `tasks`, `task_comments`) — the setup script will ensure their existence

### Required Environment Variables

Add these to `.env.local` (or your deployment environment):

```env
# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Appwrite (Public)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://<your-appwrite-endpoint>/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=<your_project_id>
NEXT_PUBLIC_APPWRITE_DATABASE_ID=<your_database_id>
NEXT_PUBLIC_APPWRITE_WORKSPACES_COLLECTION_ID=<workspaces_table_id>
NEXT_PUBLIC_APPWRITE_MEMBERS_COLLECTION_ID=<members_table_id>
NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID=<projects_table_id>
NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID=<tasks_table_id>
NEXT_PUBLIC_APPWRITE_TASK_COMMENTS_COLLECTION_ID=<task_comments_table_id>

# Appwrite (Server/Admin)
NEXT_APPWRITE_KEY=<your_appwrite_api_key>
```

These map to `@/config` exports used by the app runtime (not by the setup script). The setup script uses inline variables you manually provide.

### Configuration Options (Tables Setup)

| Option                        | Scope    | Description                                      | Default                |
| ----------------------------- | -------- | ------------------------------------------------ | ---------------------- |
| `DATABASE_ID`                 | Database | Appwrite database ID to manage                   | none (required)        |
| `WORKSPACES_COLLECTION_ID`    | Table    | ID for the workspaces table                      | none (required)        |
| `MEMBERS_COLLECTION_ID`       | Table    | ID for the members table                         | none (required)        |
| `PROJECTS_COLLECTION_ID`      | Table    | ID for the projects table                        | none (required)        |
| `TASKS_COLLECTION_ID`         | Table    | ID for the tasks table                           | none (required)        |
| `TASK_COMMENTS_COLLECTION_ID` | Table    | ID for the task comments table                   | none (required)        |
| Table Permissions             | Table    | Defaults to `read/create/update/delete("users")` | configurable in script |
| Row Security                  | Table    | Row-level security enforcement                   | `true`                 |
| Indexes                       | Table    | Helpful keys and unique constraints              | created if missing     |

Note: The script is idempotent. It only creates resources if they do not exist.

## Implementation Guide

### 1) Install and Configure

```bash
pnpm install
```

Create `.env.local` with the variables listed above for the app runtime. For the setup script, open `src/scripts/create-tables.ts`, fill the VARIABLES section with your Appwrite values, then bootstrap the database:

```bash
pnpm tsx src/scripts/create-tables.ts
```

Start the dev server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

### 2) Core APIs and Hooks

- Workspace

  Common flows include list, get current, create, update, delete, join, and leave. Hooks and server routes enforce role/membership checks.
  - List workspaces for current user

    ```ts
    import { useGetWorkspaces } from '@/features/workspaces/hooks/use-current-workspace'

    const { data: workspaces, isLoading } = useGetWorkspaces()
    ```

  - Get current workspace by URL param

    ```ts
    import { useGetCurrentWorkspace } from '@/features/workspaces/hooks/use-current-workspace'

    const { workspace, isLoading } = useGetCurrentWorkspace(workspaceId)
    ```

  - Create workspace (adds current user as `ADMIN`)

    ```ts
    import { useCreateWorkspace } from '@/features/workspaces'

    const { mutate: createWorkspace } = useCreateWorkspace()
    createWorkspace({
      form: { name: 'Forge', description: 'Demo', icon: 'anvil', slug: '' }
    })
    ```

  - Update workspace (ADMIN-only)

    ```ts
    import { useUpdateWorkspace } from '@/features/workspaces'

    const { mutate: updateWorkspace } = useUpdateWorkspace()
    updateWorkspace({
      form: { name: 'Forge v2', description: 'Refined' },
      param: { workspaceId }
    })
    ```

  - Delete workspace (ADMIN-only)

    ```ts
    import { useDeleteWorkspace } from '@/features/workspaces'

    const { mutate: deleteWorkspace } = useDeleteWorkspace()
    deleteWorkspace({ param: { workspaceId } })
    ```

  - Join workspace (invite via `slug` code)

    ```ts
    import { useJoinWorkspace } from '@/features/workspaces/hooks/use-join-workspace'

    const { mutate: joinWorkspace } = useJoinWorkspace()
    joinWorkspace({ json: { code: inviteCode }, param: { workspaceId } })
    ```

  - Leave workspace

    ```ts
    import { useLeaveWorkspace } from '@/features/profile/hooks/use-leave-workspace'

    const { mutate: leaveWorkspace } = useLeaveWorkspace()
    leaveWorkspace({ param: { workspaceId } })
    ```

- Projects

  ```ts
  import { client } from '@/lib/rpc'
  // Example: create a project via Hono route
  await client.api.projects.$post({ json: { name: 'Forge', workspaceId } })
  ```

- Tasks

  ```ts
  import {
    useCreateTask,
    useDeleteTask,
    useChangeTaskStatus
  } from '@/features/tasks'
  const { mutate: createTask } = useCreateTask()
  createTask({ name: 'Implement docs', projectId, workspaceId, assigneeId })
  ```

### 3) UI Components

- Workspace Forms

  ```tsx
  import {
    CreateWorkspacesForm,
    EditWorkspacesForm,
    ModalWorkspaceForm
  } from '@/features/workspaces/components'
  ```

- Task Views

  ```tsx
  import { ModalTaskEditForm, ModalTaskInfo } from '@/features/tasks'
  ```

### 3.1) Screenshot

- AUTH SCREEN

---

![Auth Screen](https://github.com/N4N1T0/hosted-assets/raw/a424637d7150eb6ea76cdc5043e8b44e800822fe/Captura%20de%20pantalla%202025-11-24%20153536.png)

- DASHBOARD VIEW

---

![Dashboard Overview](https://github.com/N4N1T0/hosted-assets/raw/a424637d7150eb6ea76cdc5043e8b44e800822fe/Captura%20de%20pantalla%202025-11-24%20153656.png)

- PROJECT VIEW

---

![Project Overview](https://github.com/N4N1T0/hosted-assets/raw/a424637d7150eb6ea76cdc5043e8b44e800822fe/Captura%20de%20pantalla%202025-11-24%20153730.png)

- TASK BOARD VIEW

---

![Task Board with Filters](https://github.com/N4N1T0/hosted-assets/raw/a424637d7150eb6ea76cdc5043e8b44e800822fe/Captura%20de%20pantalla%202025-11-24%20153759.png)

### 4) Common Use Cases and Patterns

- Workspace bootstrap: create workspace → invite members → create projects → add tasks.
- Task filtering: use `useTaskFilters` with `nuqs` for URL-driven filters.
- Role checks: validate membership before CRUD using server routes and middleware.
- Optimistic UI: React Query mutations with `onSuccess` cache updates.

## Architecture & Design

- Feature-first organization under `src/features/*` (auth, dashboard, members, profile, projects, tasks, workspaces)
- API routes with Hono under `src/app/api/*` and server handlers inside each feature’s `server` directory
- Shared types under `src/types/*` (`appwrite.ts` mirrors Appwrite schema)
- Shared libs under `src/lib/*` (`appwrite.ts` client factories, `middleware.ts` auth/session, `rpc.ts` typed client)
- UI primitives under `src/components/ui/*` plus layout scaffolding under `src/components/layout/*`
- Scripts under `src/scripts/*` (e.g., `create-tables.ts`)
- Path alias `@/*` → `./src/*` defined in `tsconfig.json`

Example directories:

```mermaid
src/
  features/
    workspaces/
      components/
      server/
      hooks/
      schema.ts
    tasks/
      components/
      server/
      hooks/
      schema.ts
  lib/
    appwrite.ts
    middleware.ts
    rpc.ts
```

---

<div align="center">
  <p>Made with ❤️ by Adrian "Nano" Alvarez</p>
  <p>⭐ Star this repo if you found it helpful!</p>
  <p>☕ <a href="https://buymeacoffee.com/n4n1t0">Buy me a coffee</a></p>
</div>

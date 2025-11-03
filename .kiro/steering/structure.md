# Project Structure & Organization

## Root Directory

```
├── .env.local              # Environment variables
├── .kiro/                  # Kiro AI assistant configuration
├── components.json         # shadcn/ui configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── src/                    # Source code
```

## Source Directory (`src/`)

### Core Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (Hono)
│   ├── dashboard/         # Dashboard pages
│   ├── (standalone)/      # Standalone pages (auth)
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── tiptap/           # Rich text editor components
├── features/             # Feature modules
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript definitions
├── assets/               # Static assets
├── data/                 # Static data
├── config.ts             # App configuration
└── middleware.ts         # Next.js middleware
```

## Feature-Based Organization

Each feature in `src/features/` follows this pattern:

```
features/
├── auth/                 # Authentication
├── workspaces/          # Workspace management
├── members/             # Member management
├── projects/            # Project management
└── tasks/               # Task management
```

## Component Organization

### UI Components (`src/components/ui/`)

- shadcn/ui components with consistent styling
- Follow New York style variant
- Use Radix UI primitives

### Layout Components (`src/components/layout/`)

- Reusable layout patterns
- Navigation, headers, sidebars

## File Naming Conventions

- **Components**: PascalCase (e.g., `WorkspaceCard.tsx`)
- **Hooks**: camelCase with `use-` prefix (e.g., `use-confirm.tsx`)
- **Utilities**: kebab-case (e.g., `tiptap-utils.ts`)
- **Types**: camelCase (e.g., `appwrite.ts`)
- **API routes**: kebab-case folders and files

## Import Aliases

Configured in `tsconfig.json`:

- `@/*` → `./src/*`
- `@/components` → `./src/components`
- `@/lib` → `./src/lib`
- `@/hooks` → `./src/hooks`
- `@/ui` → `./src/components/ui`

## Key Directories

- **`src/lib/`**: Core utilities (Appwrite client, RPC, utils)
- **`src/hooks/`**: Reusable React hooks
- **`src/types/`**: TypeScript type definitions
- **`src/data/`**: Static data and constants
- **`public/`**: Static assets (images, icons)

## API Structure

API routes in `src/app/api/` using Hono:

- Organized by feature/resource
- Type-safe RPC client in `src/lib/rpc.ts`
- Edge Runtime for performance

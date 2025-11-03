# Tech Stack & Development

## Core Technologies

### Frontend

- **Next.js 15** with App Router and React 19
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** components (New York style) built on Radix UI
- **Framer Motion** for animations
- **React Query** for server state management
- **React Hook Form** with Zod validation

### Backend

- **Hono** web framework running on Edge Runtime
- **Appwrite** BaaS for auth, database, and storage
- **Zod** for schema validation

### Development Tools

- **pnpm** as package manager
- **ESLint** with Next.js config
- **Prettier** with import organization and Tailwind sorting
- **TypeScript** strict mode enabled

## Code Style & Conventions

### Prettier Configuration

- No semicolons
- Single quotes (including JSX)
- 2-space indentation
- No trailing commas
- Preserve quote props

### ESLint Rules

- Next.js core web vitals
- TypeScript support
- No semicolons enforced

## Common Commands

```bash
# Development
pnpm dev          # Start dev server
pnpm turbo        # Start dev server with Turbopack

# Build & Deploy
pnpm build        # Production build
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript type checking (tsc --noEmit)
```

## Environment Setup

Required environment variables in `.env.local`:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- Appwrite configuration (endpoint, project ID, database/collection IDs)
- Server-side Appwrite API key

## Architecture Patterns

- **Feature-based organization** in `src/features/`
- **API routes** using Hono with type-safe RPC
- **Edge Runtime** for optimal performance
- **Optimistic updates** with React Query
- **Server-side validation** with Zod schemas

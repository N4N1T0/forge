# Forge

A modern workspace management application built with Next.js, featuring collaborative workspaces, member management, and secure authentication.

## 🚀 Features

- **Workspace Management**: Create, edit, and delete workspaces with custom names and images
- **Member Management**: Invite and manage workspace members with role-based access (Admin/Member)
- **Authentication**: Secure sign-in/sign-up with email/password and OAuth providers (Google, GitHub)
- **Responsive Design**: Modern UI built with shadcn/ui components and Tailwind CSS
- **Real-time Updates**: Optimistic updates with React Query for smooth user experience
- **Image Upload**: Workspace avatars with secure file storage
- **Dark/Light Theme**: Built-in theme switching support

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library built on Radix UI
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Server state management and caching
- **React Hook Form** - Form handling with Zod validation

### Backend

- **Hono** - Fast web framework running on Edge Runtime
- **Appwrite** - Backend-as-a-Service for auth, database, and storage
- **Zod** - Schema validation and type inference

### Development

- **ESLint** - Code linting with Next.js configuration
- **Prettier** - Code formatting with import organization
- **TypeScript** - Static type checking

## 📋 Prerequisites

- Node.js 18+
- pnpm (recommended package manager)
- Appwrite account and project setup

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd forge
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_WORKSPACES_COLLECTION_ID=your_workspaces_collection_id
NEXT_PUBLIC_APPWRITE_MEMBERS_COLLECTION_ID=your_members_collection_id
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=your_images_bucket_id

# Server-side Appwrite (Admin)
NEXT_APPWRITE_KEY=your_appwrite_api_key
```

### 4. Appwrite Setup

1. Create an Appwrite project
2. Set up the database with collections:
   - **Workspaces**: `name` (string), `userId` (string), `imageUrl` (string, optional)
   - **Members**: `userId` (string), `workspaceId` (string), `role` (enum: ADMIN/MEMBER)
3. Create an images bucket for workspace avatars
4. Configure authentication methods (email/password, OAuth providers)

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (Hono)
│   ├── dashboard/         # Dashboard pages
│   └── page.tsx          # Landing/auth page
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # shadcn/ui components
├── features/             # Feature-based modules
│   ├── auth/             # Authentication
│   ├── members/          # Member management
│   └── workspaces/       # Workspace management
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── config.ts            # App configuration
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm exec tsc --noEmit  # Type checking
```

## 🏗️ Architecture

### API Layer

- **Edge Runtime**: API routes run on Vercel Edge Runtime for optimal performance
- **Hono Framework**: Lightweight web framework with type-safe RPC client
- **Route Structure**:
  - `/api/login/*` - Authentication endpoints
  - `/api/workspace/*` - Workspace CRUD operations

### Authentication

- **Session-based**: Secure cookie-based sessions with Appwrite
- **Middleware**: Route protection and automatic redirects
- **Role-based Access**: Admin/Member permissions for workspace operations

### State Management

- **React Query**: Server state caching and synchronization
- **Optimistic Updates**: Immediate UI feedback with rollback on errors
- **Real-time**: Automatic refetching and cache invalidation

## 🔒 Security Features

- **CSRF Protection**: Secure cookie handling
- **Input Validation**: Zod schemas for all API endpoints
- **File Upload Security**: Restricted file types and sizes
- **Role-based Authorization**: Workspace-level permissions
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed on any platform supporting Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please refer to the project documentation or contact the development team.

## TODO

- [ ] use Empty from shadcn/ui

---

<div align="center">
  <p>Made with ❤️ by Adrian "Nano" Alvarez</p>
  <p>⭐ Star this repo if you found it helpful!</p>
  <p>☕ <a href="https://buymeacoffee.com/n4n1t0">Buy me a coffee</a></p>
</div>

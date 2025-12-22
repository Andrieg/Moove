# Moove - Fitness Platform

A modern fitness platform that connects coaches with members, enabling personalized workout experiences, challenges, and progress tracking.

## 🏗️ Architecture

This is a **Turborepo monorepo** containing multiple applications and shared packages.

```
moove/
├── apps/
│   ├── api/              # Fastify REST API backend
│   ├── client/           # Next.js 16 frontend (Coach + Member apps)
│   ├── dashboard/        # (Reserved for future admin dashboard)
│   └── landing/          # (Reserved for marketing landing page)
├── packages/
│   ├── api-client/       # Shared API client with fetch utilities
│   └── types/            # Shared TypeScript types
├── package.json          # Root workspace configuration
└── turbo.json            # Turborepo build configuration
```

## 🚀 Tech Stack

### Frontend (`apps/client`)
- **Framework**: Next.js 16 (App Router)
- **React**: 19.x
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Payments**: Stripe.js

### Backend (`apps/api`)
- **Framework**: Fastify 3.x
- **Language**: TypeScript
- **Authentication**: JWT (fastify-jwt)
- **File Uploads**: fastify-file-upload
- **Video Processing**: ffmpeg-static
- **Payments**: Stripe

### Shared Packages
- **@moove/api-client**: HTTP utilities and API methods with localStorage fallbacks
- **@moove/types**: TypeScript interfaces for User, Video, Challenge, Member, etc.

## 📱 Application Features

### For Members (Client App)
- **Home Feed**: Personalized workout recommendations
- **Explore**: Browse workouts by category (HIIT, Yoga, Strength, Cardio)
- **Challenges**: Join multi-day fitness challenges with progress tracking
- **Video Player**: Stream workout videos with detailed instructions
- **Profile**: Manage account settings and preferences
- **Search**: Find workouts, challenges with filters

### For Coaches (Coach Dashboard)
- **Dashboard**: Overview of members, revenue, and content stats
- **Members**: View and manage subscribed members
- **Videos**: Upload and manage workout content
- **Challenges**: Create and manage fitness challenges
- **Landing Page Editor**: Customize public coach profile page
- **Profile Settings**: Brand customization (colors, logo)

### Public Pages
- **Coach Landing Page** (`/coach/[brandSlug]`): Public marketing page for each coach
- **Authentication**: Magic link email-based auth for both coaches and members

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Start development servers (API + Frontend)
npm run dev:all
```

This starts:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3005

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Start both API and frontend in development mode |
| `npm run dev` | Start all workspaces via Turborepo |
| `npm run build` | Build all workspaces |
| `npm run lint` | Lint all workspaces |

## 🔗 Key Routes

### Client App Routes
| Route | Description |
|-------|-------------|
| `/` | Home feed with personalized content |
| `/explore` | Browse all workouts by category |
| `/search` | Search workouts and challenges |
| `/videos/[id]` | Video detail and player |
| `/challenges` | List of available challenges |
| `/challenges/[id]` | Challenge detail with workouts |
| `/profile` | User profile and stats |
| `/profile/settings` | Account settings |
| `/client/register` | Member registration |
| `/client/login` | Member login |
| `/client/onboarding` | New member onboarding flow |

### Coach Routes
| Route | Description |
|-------|-------------|
| `/coach/[brandSlug]` | Public coach landing page |
| `/coach/register` | Coach registration |
| `/coach/login` | Coach login |
| `/coach/onboarding` | Coach onboarding flow |
| `/coach/dashboard` | Coach dashboard home |
| `/coach/dashboard/members` | Member management |
| `/coach/dashboard/videos` | Video content management |
| `/coach/dashboard/videos/new` | Upload new video |
| `/coach/dashboard/challenges` | Challenge management |
| `/coach/dashboard/profile` | Coach profile settings |
| `/coach/dashboard/profile/landing-page` | Landing page editor |

## 📦 Package Structure

### @moove/api-client
Provides typed API methods with automatic localStorage fallbacks for development:

```typescript
import { getVideos, getChallenges, getMembers } from '@moove/api-client';

// Fetches from API, falls back to localStorage mock data
const videos = await getVideos();
```

### @moove/types
Shared TypeScript interfaces:

```typescript
import type { User, Video, Challenge, Member } from '@moove/types';
```

## 🎨 Design System

The application uses a consistent design system defined in:
- `apps/client/app/globals.css` - CSS variables and global styles
- `apps/client/app/coach/dashboard/_components/ui/design-system.ts` - Design tokens

### Key Design Tokens
- **Primary Color**: `#308FAB` (Teal)
- **Border Radius**: `rounded-lg` (8px) for inputs, `rounded-xl` (12px) for cards
- **Font**: Poppins
- **Color Palette**: Slate neutrals

## 🔐 Authentication

The app uses magic link authentication:
1. User enters email
2. System sends login link to email
3. User clicks link to authenticate
4. JWT token stored for session

**Development Mode**: Any email works, tokens are generated client-side for testing.

## 💳 Payments

Stripe integration for subscriptions:
- Test mode enabled by default
- Coaches set subscription pricing
- Members subscribe via coach landing pages

## 📁 Environment Variables

### Frontend (`apps/client/.env`)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### API (`apps/api/.env`)
```env
PORT=3005
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=your-jwt-secret
```

## 🧪 Development Notes

- **Hot Reload**: Both frontend and API support hot reload
- **Mock Data**: API client has localStorage fallbacks for offline development
- **Auth Persistence**: In dev mode, auth state may not persist across page reloads

## 📄 License

Private - All rights reserved.

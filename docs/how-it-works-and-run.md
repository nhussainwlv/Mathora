# Mathora: How It Works and How To Run It

## What this app is

Mathora is a full-stack EdTech platform for UK maths learning (KS1-KS4) with:
- role-based accounts (`STUDENT`, `TEACHER`, `ADMIN`, `PARENT`)
- curriculum pathways and topic progression
- flashcards, quizzes, and gamified progress tracking
- teacher/admin/parent dashboards
- static HTML/CSS/JS PWA frontend and Express + Prisma backend

## High-level architecture

- Frontend: `apps/web/public` (HTML, CSS, vanilla JS, service worker + manifest)
- Backend: `apps/api` (Express + TypeScript + Prisma)
- Database: PostgreSQL
- Shared packages:
  - `packages/types` for shared TypeScript contracts
  - `packages/ui` for reusable UI primitives
- Infra:
  - `infra/docker-compose.yml` for local containers

## Core runtime flow

1. User authenticates via API (`/api/auth/...`).
2. API issues JWT access + refresh tokens.
3. Frontend calls protected routes for dashboard, learning, and role portals.
4. Learning attempts update:
   - progress mastery
   - XP/coins/level metrics
   - analytics events
5. Dashboard aggregates return streaks, accuracy, recommendations, and leaderboard data.

## Main backend modules

- `auth`: signup/signin/signout/refresh/verify/reset
- `dashboard`: XP, level, streak, achievements, recommendations, leaderboard
- `learning`: key stages, topics, questions, flashcards, attempts
- `teacher`: classrooms, assignments, analytics
- `admin`: user/content management and platform analytics
- `parent`: child progress visibility
- `ai`: hint + practice generation abstraction

## Main frontend sections

- `/` marketing/landing (`index.html`)
- `/auth/signin.html`, `/auth/signup.html`, `/auth/verify.html`, `/auth/reset.html`
- `/student/`, `/student/learn.html`, `/student/flashcards.html`, `/student/games.html`
- `/teacher/`, `/admin/`, `/parent/`
- `/parent`
- `/offline` (PWA fallback)

## Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional but recommended for PostgreSQL)

## Environment setup

Copy env templates:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Update secrets in `.env` and `apps/api/.env`:
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

## Run with Docker (recommended for database)

Start PostgreSQL:

```bash
docker compose -f infra/docker-compose.yml up -d postgres
```

## Install dependencies

From repo root:

```bash
npm install
```

## Database setup

Generate Prisma client:

```bash
npm run prisma:generate --workspace api
```

Create/apply migrations:

```bash
npm run prisma:migrate --workspace api
```

Seed sample data:

```bash
npm run prisma:seed --workspace api
```

## Start the app (development)

Run backend:

```bash
npm run dev:api
```

Run frontend (new terminal):

```bash
npm run dev:web
```

Open:
- frontend: `http://localhost:3000`
- API health: `http://localhost:4000/health`

## Easy run mode (no database/backend required)

If you only want to preview the product UI/PWA quickly:

```bash
npm install
npm run dev:web
```

Then open `http://localhost:3000`.

Notes:
- In this mode, frontend auth uses demo fallback responses when API is unavailable.
- Most product screens are UI-first and will still work for presentation.
- A plain static HTML demo is also available at `http://localhost:3000/demo.html`.

## Demo accounts

- Admin: `admin@mathora.academy` / `Mathora123!`
- Teacher: `teacher@mathora.academy` / `Mathora123!`
- Student: `student@mathora.academy` / `Mathora123!`

## Useful scripts

- `npm run dev` - run workspace dev scripts
- `npm run build` - build all packages/apps
- `npm run test` - run tests
- `npm run lint` - run linting
- `npm run typecheck` - TypeScript checks

## Production build/deploy notes

- Frontend target: Vercel
- Backend target: Render/Fly/Railway
- DB target: managed PostgreSQL

Before deploying:
1. set production env vars
2. run `npm run build`
3. run `npm run test`
4. run DB migrations in target environment

## Troubleshooting

- If Prisma errors on DB connection:
  - verify `DATABASE_URL`
  - ensure Postgres is running and reachable
- If auth fails:
  - verify JWT secrets are set and long enough
- If frontend cannot call API:
  - verify `NEXT_PUBLIC_API_URL`
  - verify CORS origin in API env

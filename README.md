# Mathora

Mathora is a production-oriented educational web platform for UK KS1-KS4 maths learners with gamification, adaptive revision, and role-based portals for students, teachers, admins, and parents.

## Tech Stack
- **Frontend:** Static HTML, CSS, and JavaScript (installable PWA)
- **Backend:** Node.js, Express, Prisma
- **Database:** SQLite (local `apps/api/prisma/dev.db`)
- **Auth:** JWT access + refresh sessions, Argon2 password hashing

## Monorepo Structure
- `apps/web` - learner/product UI
- `apps/api` - API server and business logic
- `packages/types` - shared TypeScript contracts
- `packages/ui` - shared UI components
- `docs` - architecture docs
- `infra` - Docker compose stack

## Getting Started
1. Copy env templates:
   - `cp .env.example .env`
   - `cp apps/api/.env.example apps/api/.env`
   - Optional: copy `apps/web/.env.example` if you customize API URL in `public/js/config.js`
2. Configure API env:
   - `cp apps/api/.env.example apps/api/.env`
3. Install dependencies:
   - `npm install`
4. Create SQLite database:
   - `cd apps/api && npx prisma db push && npx prisma db seed`
5. Run the apps:
   - `npm run dev:api` (API on port 4000)
   - `npm run dev:web` (UI on port 3000)
6. Sign in as student: `student@mathora.academy` / `Mathora123!` (or create an account)

## Student games

- Each game has **Level 1 (easy)**, **Level 2 (medium)**, **Level 3 (hard)**.
- Questions are **unlimited** (generated + large banks).
- **Sign in** required to save solved questions to SQLite via the API.
- **Sign out** from the header on any student page.

## Quick UI-only run (no saved progress)

```bash
npm install
npm run dev:web
```

Open `http://localhost:3000` — sign-in needs the API running for real accounts.

Also available: static demo HTML at `http://localhost:3000/demo.html`.

## Demo Accounts
- Admin: `admin@mathora.academy` / `Mathora123!`
- Teacher: `teacher@mathora.academy` / `Mathora123!`
- Student: `student@mathora.academy` / `Mathora123!`

## Core Features Included
- Secure signup/signin/signout, password reset, email verification, refresh token rotation.
- Student dashboard with XP, levels, streaks, achievements, and recommendations.
- KS1-KS4 topic pathways with foundation/higher track modeling.
- Flashcards with adaptive revision cues and gameplay route scaffolding.
- Teacher/admin/parent role-specific APIs and dashboard pages.
- PWA baseline with manifest, service worker, and offline page.
- Docker and CI workflow for production readiness.

## Deployment
- Frontend: Vercel
- Backend: Render/Fly/Railway
- Database: Managed PostgreSQL

Set production environment variables from `.env.example`, run `npm run build`, and deploy `apps/web` + `apps/api` as separate services.

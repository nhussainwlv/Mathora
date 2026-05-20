# Mathora Architecture

## Overview
- `apps/web`: Next.js App Router frontend with mobile-first responsive design, dark mode, glassmorphism cards, and animated learning UX.
- `apps/api`: Express + Prisma backend with JWT auth, RBAC, learning engines, and admin/teacher/parent APIs.
- `packages/types`: Shared DTO contracts for API and frontend.
- `packages/ui`: Shared UI primitives for reusable product components.
- `infra`: Docker and local infrastructure setup.

## Key Flows
1. **Auth flow**: signup -> email verification -> signin -> access/refresh tokens -> role-guarded APIs.
2. **Learning flow**: student fetches KS path -> attempts questions -> progress and XP update -> dashboard recommendations.
3. **Teacher flow**: create classroom -> publish assignments -> review submissions and analytics.
4. **Admin flow**: manage users/content -> monitor platform metrics.
5. **Parent flow**: link children -> monitor accuracy, progress, and streaks.

## Security Controls
- Argon2 password hashing.
- Short-lived access JWT and rotated refresh sessions.
- Zod input validation.
- Helmet headers and API rate limiting.
- Role-based route guards.
- CSRF middleware support for cookie flows.

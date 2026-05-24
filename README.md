# Mathora

Mathora is a gamified UK maths learning platform for KS1–KS4 students — games, flashcards, Learn topics, built-in maths tutor, and progress tracking.

**Repository:** [github.com/nhussainwlv/Mathora](https://github.com/nhussainwlv/Mathora)

---

## Live app (Render)

| | Link |
|---|------|
| **Open the app** | **[https://mathora-web.onrender.com](https://mathora-web.onrender.com)** |
| API health check | [https://mathora-api.onrender.com/health](https://mathora-api.onrender.com/health) |

Click **mathora-web** to use Mathora in your browser (sign in, games, tutor, flashcards).

**Demo sign-in**

- Email: `student@mathora.academy`
- Password: `Mathora123!`

> Free Render services may sleep when idle — the first load can take 30–60 seconds.

---

## Tech stack

- **Frontend:** Static HTML, CSS, JavaScript (installable PWA)
- **Backend:** Node.js, Express, Prisma
- **Database:** SQLite (`apps/api/prisma/dev.db`)
- **Auth:** JWT access + refresh, Argon2 password hashing
- **Maths tutor:** Built-in step-by-step solver (no external AI API required)

## Monorepo structure

| Path | Purpose |
|------|---------|
| `apps/web` | Student UI (PWA) |
| `apps/api` | REST API |
| `packages/types` | Shared TypeScript types |
| `packages/ui` | Shared UI components |
| `docs/` | Architecture & deploy guides |
| `infra/` | Docker Compose |

---

## Run locally

1. Copy env files:
   ```bash
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   ```
2. Install and set up the database:
   ```bash
   npm install
   cd apps/api && npx prisma db push && npx prisma db seed && cd ../..
   ```
3. Start everything:
   ```bash
   npm run dev:all
   ```
4. Open **http://localhost:3000** and sign in with the demo account above.

**UI only (no API / no saved progress):**

```bash
npm install
npm run dev:web
```

---

## Student features

- **Games** — 12 modes, 4 levels, 30 questions per round, points & timer
- **Flashcards** — 50 cards per level, favourites, animations
- **Learn** — KS1–KS4 topics, quizzes, diagrams
- **Maths tutor** — type questions (e.g. `x2+5x+6=0`, `(2x-2)(3x-2)=100`)
- **Dashboard** — XP, level, accuracy, coins (when signed in)
- **PWA** — install to home screen, offline-friendly shell

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Student | `student@mathora.academy` | `Mathora123!` |
| Teacher | `teacher@mathora.academy` | `Mathora123!` |
| Admin | `admin@mathora.academy` | `Mathora123!` |

---

## Deploy on Render

Full step-by-step guide: **[docs/DEPLOY-RENDER.md](docs/DEPLOY-RENDER.md)**

Summary:

1. Push this repo to GitHub
2. [Render Dashboard](https://dashboard.render.com) → **New +** → **Blueprint** → select **Mathora**
3. Set on **mathora-api** → **Environment**:
   - `CORS_ORIGIN` = `https://mathora-web.onrender.com`
   - `APP_BASE_URL` = `https://mathora-web.onrender.com`
4. Open **[https://mathora-web.onrender.com](https://mathora-web.onrender.com)**

Config files: `render.yaml` (API + static site), `apps/web/public/js/config.js` (API URL on Render).

---

## Built by

**Built with love by [@Adrian](https://www.instagram.com/adrianjamesash/)**

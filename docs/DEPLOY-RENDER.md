# Deploy full Mathora on Render

Repo: https://github.com/nhussainwlv/Mathora

## Step 0 — Push latest code to GitHub

```bash
git -C "/Users/adrian/Documents/Own Projects/Mathora" add -A
git -C "/Users/adrian/Documents/Own Projects/Mathora" reset -- apps/api/prisma/prisma/
git -C "/Users/adrian/Documents/Own Projects/Mathora" commit -m "Render full-stack deploy config"
git -C "/Users/adrian/Documents/Own Projects/Mathora" push origin main
```

---

## Step 1 — Create Render account

1. Open https://render.com
2. Click **Get Started** → sign in with **GitHub**
3. Allow Render to access your repositories

---

## Step 2 — Deploy with Blueprint (API + website together)

1. Click **New +** → **Blueprint**
2. Connect repository **`nhussainwlv/Mathora`**
3. Render reads `render.yaml` and shows **two services**:
   - **mathora-api** (Node API)
   - **mathora-web** (static site)
4. Click **Apply**

Wait until both show **Live** (first deploy can take 5–10 minutes).

---

## Step 3 — Copy your URLs

In the Render dashboard:

| Service | Example URL |
|---------|-------------|
| **mathora-web** | `https://mathora-web.onrender.com` ← share this with users |
| **mathora-api** | `https://mathora-api.onrender.com` |

Test API: open `https://mathora-api.onrender.com/health` → should show `{"status":"ok",...}`

---

## Step 4 — Connect API to website (CORS)

1. Open service **mathora-api** → **Environment**
2. Set:

   - **CORS_ORIGIN** = `https://mathora-web.onrender.com`  
     (your **mathora-web** URL — `https`, no slash at the end)
   - **APP_BASE_URL** = same value as **CORS_ORIGIN**

3. Click **Save Changes** (API redeploys automatically)

---

## Step 5 — Test the full app

1. Open **mathora-web** URL in the browser
2. Click **Sign up** or **Sign in**
3. Demo account: `student@mathora.academy` / `Mathora123!`
4. Try **Games**, **Flashcards**, **Maths tutor**, **Learn**

---

## If Blueprint is not available — manual setup

### API (Web Service)

**New +** → **Web Service** → repo **nhussainwlv/Mathora**

| Setting | Value |
|---------|--------|
| Name | `mathora-api` |
| Root Directory | *(empty)* |
| Build Command | `npm install && npm run build --workspace api && cd apps/api && npx prisma generate && npx prisma db push && npx prisma db seed` |
| Start Command | `npm run start --workspace api` |
| Health Check Path | `/health` |

Add environment variables from Step 4 plus `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL=file:./prisma/dev.db`, `NODE_ENV=production`, `PORT=4000`.

### Website (Static Site)

**New +** → **Static Site** → same repo

| Setting | Value |
|---------|--------|
| Name | `mathora-web` |
| Root Directory | `apps/web` |
| Build Command | *(empty)* |
| Publish Directory | `public` |

Then complete Step 4 (CORS).

---

## Auto-deploy

Every `git push` to `main` redeploys both services on Render.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| First load very slow | Free tier sleeps after ~15 min idle; wait 30–60s |
| Sign-in fails | **CORS_ORIGIN** must exactly match **mathora-web** URL |
| API build failed | Open **mathora-api** → **Logs** |
| Wrong API hostname | If API is not `mathora-api`, edit `apps/web/public/js/config.js` Render URL and push |

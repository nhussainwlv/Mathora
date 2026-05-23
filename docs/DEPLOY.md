# Deploy Mathora from GitHub

Repo: https://github.com/nhussainwlv/Mathora

## 1. Push code

```bash
git -C "/Users/adrian/Documents/Own Projects/Mathora" add -A
git -C "/Users/adrian/Documents/Own Projects/Mathora" reset -- apps/api/prisma/prisma/
git -C "/Users/adrian/Documents/Own Projects/Mathora" commit -m "Add production deploy config for Vercel and Render"
git -C "/Users/adrian/Documents/Own Projects/Mathora" push origin main
```

## 2. Deploy API (Render)

1. Go to https://render.com → **New** → **Blueprint** (or **Web Service**).
2. Connect GitHub → **nhussainwlv/Mathora**.
3. If using Blueprint, Render reads `render.yaml` at the repo root.
4. Set environment variables (if not using Blueprint):
   - `CORS_ORIGIN` = your Vercel URL, e.g. `https://mathora.vercel.app`
   - `APP_BASE_URL` = same as `CORS_ORIGIN`
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` = long random strings
5. After deploy, note your API URL, e.g. `https://mathora-api.onrender.com`.

## 3. Deploy frontend (Vercel)

1. Go to https://vercel.com → **Add New** → **Project** → import **nhussainwlv/Mathora**.
2. Settings:
   - **Root Directory:** `apps/web`
   - **Output Directory:** `public`
   - **Framework:** Other (no build required, or `npm run build`)
3. Deploy.

## 4. Connect frontend ↔ API

1. Open `apps/web/vercel.json` and replace `mathora-api.onrender.com` with your real Render hostname if different.
2. On Render, set `CORS_ORIGIN` and `APP_BASE_URL` to your Vercel URL.
3. Commit and push again (commands in step 1).

Production `config.js` uses `https://your-site.vercel.app/api` (same origin); Vercel proxies `/api` to Render.

## 5. Verify

- `https://YOUR-RENDER-URL/health` → `{"status":"ok",...}`
- Open Vercel URL → sign in → games / tutor work

## Auto-deploy

Every `git push` to `main` redeploys Vercel and Render (if GitHub integration is enabled).

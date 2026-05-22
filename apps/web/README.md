# Mathora Web (static PWA)

The frontend is a static **HTML / CSS / JavaScript** progressive web app in `public/`.

## Run locally

From the monorepo root:

```bash
npm install
npm run dev:web
```

Or from this folder:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `public/` — pages, styles, scripts, service worker, manifest
- `public/js/curriculum.js` — generated from `lib/ks-curriculum.ts`
- `lib/ks-curriculum.ts` — curriculum source data

Regenerate curriculum after editing topics:

```bash
npm run generate:curriculum
```

## API

Auth pages call `http://localhost:4000/api` (see `public/js/config.js`). Demo mode returns fallback auth responses when the API is offline.

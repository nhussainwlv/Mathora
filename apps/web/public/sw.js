const CACHE_NAME = "mathora-static-v16";
const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/index.html",
  "/css/main.css",
  "/js/config.js",
  "/js/api.js",
  "/js/session.js",
  "/js/theme.js",
  "/js/shell.js",
  "/js/pwa.js",
  "/js/student-dashboard.js",
  "/js/learn.js",
  "/js/curriculum.js",
  "/js/math-generator.js",
  "/js/flashcards.js",
  "/js/game-banks.js",
  "/js/game-session.js",
  "/js/game-questions.js",
  "/js/games.js",
  "/js/teacher.js",
  "/js/admin.js",
  "/js/parent.js",
  "/js/auth.js",
  "/js/math-chat.js",
  "/js/app-init.js",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/student/",
  "/student/index.html",
  "/student/learn.html",
  "/student/flashcards.html",
  "/student/games.html",
  "/teacher/",
  "/teacher/index.html",
  "/admin/",
  "/admin/index.html",
  "/parent/",
  "/parent/index.html",
  "/auth/signin.html",
  "/auth/signup.html",
  "/auth/verify.html",
  "/auth/reset.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") {
          return (await caches.match("/offline.html")) || (await caches.match("/"));
        }
        return caches.match("/offline.html");
      }),
  );
});

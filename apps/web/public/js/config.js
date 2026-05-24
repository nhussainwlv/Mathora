/**
 * API URL for Mathora.
 * - Local: http://localhost:4000/api
 * - Production (Vercel): same origin /api → proxied to Render (see apps/web/vercel.json)
 * - Override: <meta name="mathora-api-url" content="https://your-api.example.com/api" />
 */
(function initConfig() {
  const host = window.location.hostname || "localhost";
  const isLocal = host === "localhost" || host === "127.0.0.1";

  const metaUrl = document.querySelector('meta[name="mathora-api-url"]')?.getAttribute("content")?.trim();

  let apiUrl;
  if (metaUrl) {
    apiUrl = metaUrl.replace(/\/$/, "");
    if (!apiUrl.endsWith("/api")) apiUrl = `${apiUrl}/api`;
  } else if (isLocal) {
    apiUrl = `http://${host}:4000/api`;
  } else if (host.endsWith(".onrender.com") && !host.startsWith("mathora-api")) {
    // Render: static site (mathora-web) → API service (mathora-api)
    apiUrl = "https://mathora-api.onrender.com/api";
  } else {
    apiUrl = `${window.location.origin}/api`;
  }

  window.MATHORA_CONFIG = {
    API_URL: apiUrl,
    DEMO_MODE: false,
  };
})();

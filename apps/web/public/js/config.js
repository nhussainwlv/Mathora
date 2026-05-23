(function initConfig() {
  const host = window.location.hostname || "localhost";
  const apiPort = 4000;
  window.MATHORA_CONFIG = {
    API_URL: `http://${host}:${apiPort}/api`,
    DEMO_MODE: false,
  };
})();

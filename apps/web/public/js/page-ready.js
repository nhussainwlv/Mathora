/** Run fn after DOM + app shell (if present) have finished mounting. */
function onPageReady(fn) {
  let ran = false;
  const run = () => {
    if (ran) return;
    ran = true;
    fn();
  };

  document.addEventListener("mathora:shell-ready", run);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(run));
  } else {
    requestAnimationFrame(run);
  }
}

window.onPageReady = onPageReady;

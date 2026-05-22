(function initTheme() {
  const stored = localStorage.getItem("mathora-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = stored === "dark" || (!stored && prefersDark);
  document.documentElement.classList.toggle("dark", dark);
})();

function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("mathora-theme", dark ? "dark" : "light");
  document.querySelectorAll("[data-theme-label]").forEach((el) => {
    el.textContent = dark ? "Light mode" : "Dark mode";
  });
}

window.toggleTheme = toggleTheme;

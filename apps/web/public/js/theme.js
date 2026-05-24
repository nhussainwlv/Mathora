function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

/** Force readable text on flashcard buttons (browsers ignore inherited color). */
function paintFlashcardText(element) {
  if (!element) return;
  const color = isDarkMode() ? "#ffffff" : "#0f172a";
  element.style.setProperty("color", color, "important");
  element.style.setProperty("-webkit-text-fill-color", color, "important");
}

function paintAllFlashcards() {
  document
    .querySelectorAll(
      "button.flashcard, button.game-flashcard, [data-card].flashcard, .flashcard-face"
    )
    .forEach(paintFlashcardText);
}

(function initTheme() {
  const stored = localStorage.getItem("mathora-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = stored === "dark" || (!stored && prefersDark);
  document.documentElement.classList.toggle("dark", dark);
  document.querySelectorAll("[data-theme-label]").forEach((el) => {
    el.textContent = dark ? "Light mode" : "Dark mode";
  });
  requestAnimationFrame(paintAllFlashcards);
})();

function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("mathora-theme", dark ? "dark" : "light");
  document.querySelectorAll("[data-theme-label]").forEach((el) => {
    el.textContent = dark ? "Light mode" : "Dark mode";
  });
  paintAllFlashcards();
}

window.toggleTheme = toggleTheme;
window.paintFlashcardText = paintFlashcardText;
window.paintAllFlashcards = paintAllFlashcards;
window.isDarkMode = isDarkMode;

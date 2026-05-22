const modes = [
  "Flashcards",
  "Timed quizzes",
  "Drag-and-drop equations",
  "Puzzle solving",
  "Multiplayer battles",
  "Speed maths",
  "Memory games",
  "Match-the-answer games",
  "AI challenge mode",
  "Boss levels",
  "Daily challenges",
  "Survival mode",
];

function initGames() {
  const root = document.getElementById("games-page");
  if (!root) return;

  const grid = root.querySelector("[data-grid]");
  const messageEl = root.querySelector("[data-message]");

  grid.innerHTML = modes
    .map(
      (mode) => `
      <div class="card card-hover">
        <h3>${mode}</h3>
        <p class="message">Play this mode to earn XP, coins, and unlock advanced mastery routes.</p>
        <button type="button" class="btn btn-primary btn-sm" data-mode="${mode}">Play now</button>
      </div>`,
    )
    .join("");

  grid.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      messageEl.textContent = `Started ${btn.dataset.mode}. Good luck!`;
    });
  });
}

document.addEventListener("DOMContentLoaded", initGames);

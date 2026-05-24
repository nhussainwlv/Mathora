const weeklyData = [
  { day: "Mon", score: 64 },
  { day: "Tue", score: 71 },
  { day: "Wed", score: 75 },
  { day: "Thu", score: 81 },
  { day: "Fri", score: 88 },
];

function renderBarChart(container, data) {
  if (!container) return;
  const max = Math.max(...data.map((d) => d.score));
  container.innerHTML = data
    .map((item) => {
      const height = Math.round((item.score / max) * 180);
      return `<div class="bar-col"><div class="bar" style="height:${height}px"></div><span class="bar-label">${item.day}</span></div>`;
    })
    .join("");
}

function displayName() {
  return (
    window.MathoraSession?.user?.profile?.displayName ||
    window.MathoraSession?.user?.email?.split("@")[0] ||
    "there"
  );
}

function isSignedIn() {
  return Boolean(window.MathoraSession?.accessToken);
}

function updateSignedInUi(root) {
  const signedIn = isSignedIn();
  const welcomeEl = root.querySelector("[data-welcome]");
  const statsList = root.querySelector("[data-stats-list]");
  const aiHint = root.querySelector("[data-ai-hint]");

  if (welcomeEl) {
    welcomeEl.textContent = signedIn
      ? `Welcome back, ${displayName()}. Your XP, games, and quizzes are saved to this account.`
      : "Sign in to sync your progress, save game scores, and unlock the AI tutor.";
  }
  if (aiHint) {
    aiHint.textContent = signedIn
      ? "Tap the purple AI tutor button for step-by-step help"
      : "Sign in to use the AI tutor";
  }
  if (statsList && signedIn) {
    statsList.innerHTML = `
      <li class="list-item">Progress synced to your account</li>
      <li class="list-item">Games: 4 levels — unlimited questions</li>
      <li class="list-item">Learn: 20-question quiz on every topic</li>
      <li class="list-item">Flashcards and AI tutor available</li>
    `;
  }
}

function applyProfile(profile) {
  const xpEl = document.querySelector("[data-xp]");
  const coinsEl = document.querySelector("[data-coins]");
  const levelEl = document.querySelector("[data-level]");
  const solvedEl = document.querySelector("[data-solved-total]");
  if (!profile) return;
  if (xpEl) xpEl.textContent = Number(profile.xp ?? 0).toLocaleString();
  if (coinsEl) coinsEl.textContent = String(profile.coins ?? 0);
  if (levelEl) levelEl.textContent = String(profile.level ?? 1);
  if (solvedEl && window.MathoraProgress) {
    solvedEl.textContent = String(window.MathoraProgress.solvedKeys?.size ?? 0);
  }
}

async function loadDashboard(root) {
  updateSignedInUi(root);
  if (!window.MathoraProgress?.isSignedIn?.()) return;
  try {
    await window.MathoraProgress.load();
    applyProfile(window.MathoraProgress.profile);
    const stats = await apiFetch("/games/progress");
    const correct = stats.stats?.correctCount ?? 0;
    const total = stats.stats?.totalAttempts ?? 0;
    const accEl = root.querySelector("[data-accuracy]");
    if (accEl) {
      accEl.textContent = total > 0 ? `${Math.round((correct / total) * 100)}%` : "—";
    }
  } catch {
    /* offline */
  }
}

function initStudentDashboard() {
  const root = document.getElementById("student-dashboard");
  if (!root) return;

  const messageEl = root.querySelector("[data-message]");
  const chartEl = root.querySelector("[data-chart]");

  renderBarChart(chartEl, weeklyData);
  loadDashboard(root);

  document.addEventListener("mathora:progress-updated", () => {
    applyProfile(window.MathoraProgress.profile);
  });

  document.addEventListener("mathora:progress-ready", () => {
    applyProfile(window.MathoraProgress.profile);
    updateSignedInUi(root);
  });

  document.addEventListener("mathora:session-changed", () => {
    loadDashboard(root);
  });

  root.querySelector("[data-refresh]")?.addEventListener("click", async () => {
    await loadDashboard(root);
    if (messageEl) {
      messageEl.textContent = isSignedIn()
        ? "Progress refreshed from your account."
        : "Sign in to load progress from your account.";
    }
  });
}

document.addEventListener("mathora:shell-ready", initStudentDashboard);
document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(initStudentDashboard));

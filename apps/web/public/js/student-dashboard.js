const weeklyData = [
  { day: "Mon", score: 64 },
  { day: "Tue", score: 71 },
  { day: "Wed", score: 75 },
  { day: "Thu", score: 81 },
  { day: "Fri", score: 88 },
];

function renderBarChart(container, data) {
  const max = Math.max(...data.map((d) => d.score));
  container.innerHTML = data
    .map((item) => {
      const height = Math.round((item.score / max) * 180);
      return `<div class="bar-col"><div class="bar" style="height:${height}px" title="${item.score}"></div><span class="bar-label">${item.day}</span></div>`;
    })
    .join("");
}

function initStudentDashboard() {
  const root = document.getElementById("student-dashboard");
  if (!root) return;

  let xp = 2480;
  let coins = 120;
  const messageEl = root.querySelector("[data-message]");
  const xpEl = root.querySelector("[data-xp]");
  const coinsEl = root.querySelector("[data-coins]");
  const chartEl = root.querySelector("[data-chart]");

  renderBarChart(chartEl, weeklyData);

  root.querySelector("[data-daily]")?.addEventListener("click", () => {
    xp += 25;
    coins += 5;
    xpEl.textContent = xp.toLocaleString();
    coinsEl.textContent = String(coins);
    messageEl.textContent = "Daily challenge completed: +25 XP, +5 coins.";
  });

  root.querySelector("[data-refresh]")?.addEventListener("click", () => {
    messageEl.textContent = "Recommendation refreshed for your weakest topics.";
  });

  root.querySelector("[data-reward]")?.addEventListener("click", () => {
    coins += 10;
    coinsEl.textContent = String(coins);
    messageEl.textContent = "Daily login reward claimed: +10 coins.";
  });
}

document.addEventListener("DOMContentLoaded", initStudentDashboard);

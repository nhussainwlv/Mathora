/**
 * Shared game session: points, per-question timer by level, Submit + Next flow.
 */
(function () {
  const QUESTIONS_PER_SESSION = 30;
  const LEVEL_TIMER_SEC = { easy: 45, medium: 35, hard: 28, advanced: 22 };
  const LEVEL_POINTS = { easy: 10, medium: 15, hard: 20, advanced: 25 };

  function timerForLevel(level) {
    return LEVEL_TIMER_SEC[level] ?? 35;
  }

  function pointsForLevel(level) {
    return LEVEL_POINTS[level] ?? 15;
  }

  function createSession(body, level, options = {}) {
    const total = options.total ?? window.MathoraBanks?.QUESTIONS_PER_SESSION ?? QUESTIONS_PER_SESSION;

    const hud = document.createElement("div");
    hud.className = "game-session-hud";
    hud.innerHTML = `
      <div class="game-session-stat">
        <span class="game-session-label">Points</span>
        <strong data-hud-points>0</strong>
      </div>
      <div class="game-session-stat game-session-stat--timer">
        <span class="game-session-label">Time</span>
        <strong data-hud-timer>${timerForLevel(level)}s</strong>
      </div>
      <div class="game-session-stat">
        <span class="game-session-label">Question</span>
        <strong data-hud-q>1 / ${total}</strong>
      </div>
    `;
    body.insertBefore(hud, body.firstChild);

    const state = {
      level,
      total,
      points: 0,
      index: 0,
      timeLeft: timerForLevel(level),
      timerId: null,
      els: {
        points: hud.querySelector("[data-hud-points]"),
        timer: hud.querySelector("[data-hud-timer]"),
        q: hud.querySelector("[data-hud-q]"),
      },
    };

    state.refresh = function refresh() {
      state.els.points.textContent = String(state.points);
      state.els.timer.textContent = `${state.timeLeft}s`;
      state.els.q.textContent = `${Math.min(state.index + 1, state.total)} / ${state.total}`;
      state.els.timer.classList.toggle("game-session-stat--urgent", state.timeLeft <= 10);
    };

    state.stopTimer = function stopTimer() {
      if (state.timerId) clearInterval(state.timerId);
      state.timerId = null;
    };

    state.startTimer = function startTimer(onExpire) {
      state.stopTimer();
      state.timeLeft = timerForLevel(level);
      state.refresh();
      state.timerId = setInterval(() => {
        state.timeLeft -= 1;
        state.refresh();
        if (state.timeLeft <= 0) {
          state.stopTimer();
          onExpire?.();
        }
      }, 1000);
    };

    state.addCorrectPoints = function addCorrectPoints() {
      const pts = pointsForLevel(level);
      state.points += pts;
      state.refresh();
      return pts;
    };

    state.destroy = function destroy() {
      state.stopTimer();
      hud.remove();
    };

    state.refresh();
    return state;
  }

  function mountSubmitNext(actionsEl, labels = {}) {
    const submitLabel = labels.submit ?? "Submit";
    const nextLabel = labels.next ?? "Next question →";
    actionsEl.innerHTML = `
      <button type="button" class="btn btn-primary btn-sm" data-game-submit>${submitLabel}</button>
      <button type="button" class="btn btn-dark btn-sm" data-game-next disabled>${nextLabel}</button>
    `;
    const submitBtn = actionsEl.querySelector("[data-game-submit]");
    const nextBtn = actionsEl.querySelector("[data-game-next]");
    return {
      submitBtn,
      nextBtn,
      enableNext() {
        if (nextBtn) nextBtn.disabled = false;
      },
      disableNext() {
        if (nextBtn) nextBtn.disabled = true;
      },
    };
  }

  function appendPointsToFeedback(feedbackEl, pts) {
    if (!feedbackEl || pts <= 0) return;
    const el = document.createElement("p");
    el.className = "game-points-earned";
    el.textContent = `+${pts} points`;
    feedbackEl.appendChild(el);
  }

  window.MathoraGameSession = {
    QUESTIONS_PER_SESSION,
    timerForLevel,
    pointsForLevel,
    createSession,
    mountSubmitNext,
    appendPointsToFeedback,
  };
})();

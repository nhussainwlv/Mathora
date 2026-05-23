const UI = () => window.MathoraGameUI;
const Banks = () => window.MathoraBanks;
const Progress = () => window.MathoraProgress;
const GS = () => window.MathoraGameSession;
const Q_COUNT = () => Banks()?.QUESTIONS_PER_SESSION ?? GS()?.QUESTIONS_PER_SESSION ?? 30;

const GAME_MODES = [
  { id: "flashcards", title: "Flashcards", description: "30 questions · points & timer · Next to continue." },
  { id: "timed-quizzes", title: "Timed quizzes", description: "30 timed questions per round." },
  { id: "drag-drop", title: "Equation builder", description: "30 equations — Check, then Next." },
  { id: "puzzle", title: "Puzzle solving", description: "30 puzzles — Submit, then Next." },
  { id: "multiplayer", title: "Multiplayer battles", description: "30 rounds vs a rival." },
  { id: "speed", title: "Speed maths", description: "30 quick-fire questions." },
  { id: "memory", title: "Memory games", description: "30 questions — type your answer, then Next." },
  { id: "match", title: "Match the answer", description: "30 multiple-choice questions." },
  { id: "ai", title: "Challenge mode", description: "30 multi-step problems." },
  { id: "boss", title: "Boss levels", description: "30 boss questions." },
  { id: "daily", title: "Daily challenges", description: "30 questions for today." },
  { id: "survival", title: "Survival mode", description: "30 questions — score as high as you can." },
];

function gamesDepsReady() {
  return Boolean(window.MathoraGameUI && window.MathoraBanks && window.MathoraGameSession && window.MathoraGenerator);
}

function gamesDepsError() {
  return "Game scripts did not load. Hard-refresh the page (Cmd+Shift+R) or restart with npm run dev:all.";
}

let modalEl = null;
let modalBody = null;
let modalTitle = null;
let activeCleanup = null;

function setStatus(messageEl, text, type = "info") {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.className = `game-status game-status--${type}`;
  messageEl.hidden = !text;
}

function openModal(title, render) {
  ensureModal();
  modalTitle.textContent = title;
  modalBody.innerHTML = "";
  if (activeCleanup) activeCleanup();
  try {
    activeCleanup = render(modalBody) || null;
  } catch (err) {
    console.error(err);
    modalBody.innerHTML = `<p class="game-feedback game-feedback--bad">${err.message || "Could not start this game."}</p>`;
    activeCleanup = null;
  }
  modalEl.classList.add("open");
  modalEl.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => window.paintAllFlashcards?.());
}

function closeModal() {
  if (!modalEl) return;
  if (activeCleanup) activeCleanup();
  activeCleanup = null;
  modalEl.classList.remove("open");
  modalEl.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalBody.innerHTML = "";
}

function award(messageEl, points, coins) {
  const p = Progress().profile;
  setStatus(
    messageEl,
    `Round complete! ${points} points · +${coins} coins · Profile: ${p?.xp ?? 0} XP, Level ${p?.level ?? 1}`,
    "success",
  );
}

async function saveAttempt(gameMode, level, q, userAnswer, ok) {
  return Progress().recordAttempt({
    gameMode,
    level,
    questionKey: q.questionKey,
    prompt: q.prompt ?? q.label,
    userAnswer: userAnswer ?? "",
    correctAnswer: String(q.answer ?? q.options?.[q.answer] ?? q.tiles?.join?.(" ") ?? ""),
    isCorrect: ok,
    xpEarned: Banks().xpForLevel(level, ok),
    coinsEarned: Banks().coinsForLevel(level, ok),
  });
}

function checkAnswer(q, value) {
  if (q.options) return Number(value) === q.answer;
  if (typeof q.answer === "number" || !Number.isNaN(Number(q.answer))) {
    return UI().checkNumeric(value, q.answer);
  }
  return UI().checkText(value, String(q.answer), q.alt || []);
}

function mountInput(ui, type = "text") {
  ui.inputArea.innerHTML = `<input class="input" data-answer type="${type}" placeholder="Your answer" />`;
  return ui.inputArea.querySelector("[data-answer]");
}

function correctDisplay(q) {
  if (q.options) return q.options[q.answer];
  return q.answer;
}

function runQuestionSession(body, messageEl, level, mode, drawFn, opts = {}) {
  const session = GS().createSession(body, level, { total: Q_COUNT() });
  const sessionKeys = opts.sessionKeys ?? new Set(Progress().solvedKeys ?? []);
  const ui = opts.dualBox ? UI().mountDualBoxShell(body, opts.extraHtml ?? "") : UI().mountShell(body, opts.extraHtml ?? "");
  if (ui.progress) ui.progress.hidden = true;
  const input = mountInput(ui);
  const actions = GS().mountSubmitNext(ui.actions, opts.actionLabels);
  let currentQ = null;
  let canAdvance = false;
  let busy = false;

  function lockInput(lock) {
    if (input) input.disabled = lock;
  }

  function loadQuestion() {
    canAdvance = false;
    busy = false;
    actions.disableNext();
    lockInput(false);
    UI().clearFeedback(ui);
    try {
      currentQ = drawFn(level, sessionKeys);
    } catch (err) {
      ui.prompt.textContent = "Could not load question. Click Next to try again.";
      actions.enableNext();
      canAdvance = true;
      return;
    }
    if (currentQ?.questionKey) sessionKeys.add(currentQ.questionKey);
    ui.prompt.textContent = currentQ.prompt;
    UI().bindHint(ui, currentQ.hint);
    opts.onQuestion?.(currentQ, session, ui);
    session.refresh();
    session.startTimer(() => handleSubmit(true));
  }

  async function handleSubmit(timedOut = false) {
    if (busy || !currentQ) return;
    busy = true;
    session.stopTimer();
    const q = currentQ;
    const userAnswer = timedOut ? "" : input.value;
    const ok = timedOut ? false : checkAnswer(q, userAnswer);
    const pts = ok ? session.addCorrectPoints() : 0;
    UI().showFeedback(ui, {
      correct: ok,
      userAnswer: timedOut ? "(time's up)" : userAnswer,
      correctAnswer: correctDisplay(q),
      explanation: q.explanation,
      showCorrectWhenWrongOnly: opts.showCorrectWhenWrongOnly,
    });
    GS().appendPointsToFeedback(ui.feedback, pts);
    await saveAttempt(mode, level, q, userAnswer, ok);
    lockInput(true);
    actions.enableNext();
    canAdvance = true;
    busy = false;
    opts.onAnswered?.({ ok, pts, session, q, ui });
  }

  function handleNext() {
    if (!canAdvance || busy) return;
    actions.disableNext();
    session.index += 1;
    if (session.index >= session.total) {
      session.destroy();
      award(messageEl, session.points, Math.max(1, Math.floor(session.points / 5)));
      closeModal();
      return;
    }
    loadQuestion();
  }

  if (actions.submitBtn) actions.submitBtn.onclick = () => handleSubmit(false);
  if (actions.nextBtn) actions.nextBtn.onclick = handleNext;
  loadQuestion();
  return () => session.destroy();
}

function runFlashcards(body, messageEl, level) {
  const session = GS().createSession(body, level, { total: Q_COUNT() });
  const sessionKeys = new Set(Progress().solvedKeys);
  let current = Banks().drawFlashcard(level, sessionKeys);
  sessionKeys.add(current.questionKey);
  let flipped = false;
  let canAdvance = false;
  let busy = false;

  const inner = document.createElement("div");
  body.appendChild(inner);
  inner.innerHTML = `
    <button type="button" class="flashcard game-flashcard" data-card></button>
    <button type="button" class="btn btn-outline btn-sm" data-hint-btn>Show hint</button>
    <p class="game-hint" data-hint-text hidden></p>
    <input class="input" data-answer type="text" placeholder="Your answer" />
    <div class="game-feedback" data-feedback hidden></div>
    <div class="btn-row" data-actions></div>
  `;
  const card = inner.querySelector("[data-card]");
  const hintBtn = inner.querySelector("[data-hint-btn]");
  const hintText = inner.querySelector("[data-hint-text]");
  const input = inner.querySelector("[data-answer]");
  const feedback = inner.querySelector("[data-feedback]");
  const actions = GS().mountSubmitNext(inner.querySelector("[data-actions]"), {
    submit: "Check answer",
    next: "Next question →",
  });

  function renderCard() {
    flipped = false;
    canAdvance = false;
    actions.disableNext();
    input.disabled = false;
    input.value = "";
    feedback.hidden = true;
    card.textContent = current.prompt;
    card.classList.remove("flipped");
    window.paintFlashcardText?.(card);
    hintText.hidden = true;
    hintText.textContent = current.hint;
    session.refresh();
    session.stopTimer();
    session.startTimer(() => actions.submitBtn.click());
  }

  hintBtn.onclick = () => { hintText.hidden = false; };
  card.onclick = () => {
    flipped = !flipped;
    card.textContent = flipped ? current.answer : current.prompt;
    card.classList.toggle("flipped", flipped);
    window.paintFlashcardText?.(card);
  };

  actions.submitBtn.onclick = async () => {
    if (busy) return;
    busy = true;
    session.stopTimer();
    const ok = checkAnswer(current, input.value);
    const pts = ok ? session.addCorrectPoints() : 0;
    feedback.hidden = false;
    feedback.className = `game-feedback ${ok ? "game-feedback--ok" : "game-feedback--bad"}`;
    feedback.innerHTML = UI().feedbackHtml({
      correct: ok,
      userAnswer: input.value,
      correctAnswer: current.answer,
      explanation: current.explanation,
      hintShown: hintText.hidden ? "" : current.hint,
    });
    GS().appendPointsToFeedback(feedback, pts);
    await saveAttempt("flashcards", level, current, input.value, ok);
    card.textContent = current.answer;
    card.classList.add("flipped");
    window.paintFlashcardText?.(card);
    input.disabled = true;
    actions.enableNext();
    canAdvance = true;
    busy = false;
  };

  actions.nextBtn.onclick = () => {
    if (!canAdvance || busy) return;
    session.index += 1;
    if (session.index >= session.total) {
      session.destroy();
      award(messageEl, session.points, Math.max(1, Math.floor(session.points / 5)));
      closeModal();
      return;
    }
    sessionKeys.add(current.questionKey);
    current = Banks().drawFlashcard(level, sessionKeys);
    renderCard();
  };

  renderCard();
  return () => session.destroy();
}

function runTimedQuiz(body, messageEl, level) {
  return runQuestionSession(body, messageEl, level, "timed-quizzes", (lv, keys) =>
    Banks().drawNumeric(lv, keys, "timed-quizzes"),
  );
}

function runDragDrop(body, messageEl, level) {
  const session = GS().createSession(body, level, { total: Q_COUNT() });
  let picked = [];
  const used = new Set();
  let currentPuzzle = Banks().drawDrag(level);
  let canAdvance = false;
  let busy = false;

  const inner = document.createElement("div");
  body.appendChild(inner);
  inner.innerHTML = `
    <p class="game-hint" data-label></p>
    <button type="button" class="btn btn-outline btn-sm" data-hint-btn>Show hint</button>
    <p class="game-hint" data-hint-text hidden></p>
    <div class="game-slots" data-slots></div>
    <div class="game-tiles" data-tiles></div>
    <div class="game-feedback" data-feedback hidden></div>
    <div class="btn-row" data-actions></div>
  `;
  const label = inner.querySelector("[data-label]");
  const hintText = inner.querySelector("[data-hint-text]");
  const slotsEl = inner.querySelector("[data-slots]");
  const tilesEl = inner.querySelector("[data-tiles]");
  const feedback = inner.querySelector("[data-feedback]");
  const actions = GS().mountSubmitNext(inner.querySelector("[data-actions]"), {
    submit: "Check",
    next: "Next question →",
  });
  let shuffled = [];

  function render() {
    const p = currentPuzzle;
    label.textContent = p.label;
    hintText.textContent = p.hint;
    hintText.hidden = true;
    inner.querySelector("[data-hint-btn]").onclick = () => { hintText.hidden = false; };
    shuffled = Banks().shuffle(p.tiles.map((t, i) => ({ t, i })));
    slotsEl.innerHTML = p.tiles.map((_, i) => `<span class="game-slot">${picked[i] ?? "?"}</span>`).join("");
    tilesEl.innerHTML = shuffled
      .map(({ t }, di) => `<button type="button" class="game-tile" data-idx="${di}" ${used.has(di) ? "disabled" : ""}>${t}</button>`)
      .join("");
    tilesEl.querySelectorAll("[data-idx]").forEach((btn) => {
      btn.onclick = () => {
        const di = Number(btn.dataset.idx);
        if (used.has(di) || picked.length >= p.tiles.length) return;
        used.add(di);
        picked.push(shuffled[di].t);
        render();
      };
    });
    session.refresh();
    session.stopTimer();
    session.startTimer(() => actions.submitBtn.click());
    canAdvance = false;
    actions.disableNext();
    feedback.hidden = true;
  }

  actions.submitBtn.onclick = async () => {
    if (busy) return;
    busy = true;
    session.stopTimer();
    const p = currentPuzzle;
    const ok = picked.length === p.tiles.length && picked.every((v, i) => v === p.tiles[i]);
    const pts = ok ? session.addCorrectPoints() : 0;
    feedback.hidden = false;
    feedback.className = `game-feedback ${ok ? "game-feedback--ok" : "game-feedback--bad"}`;
    feedback.innerHTML = UI().feedbackHtml({
      correct: ok,
      userAnswer: picked.join(" "),
      correctAnswer: p.tiles.join(" "),
      explanation: p.explanation,
      hintShown: p.hint,
    });
    GS().appendPointsToFeedback(feedback, pts);
    const key = Progress().questionKey("drag-drop", level, p.label);
    await saveAttempt("drag-drop", level, { questionKey: key, prompt: p.label, answer: p.tiles.join(" ") }, picked.join(" "), ok);
    actions.enableNext();
    canAdvance = true;
    busy = false;
  };

  actions.nextBtn.onclick = () => {
    if (!canAdvance || busy) return;
    session.index += 1;
    if (session.index >= session.total) {
      session.destroy();
      award(messageEl, session.points, Math.max(1, Math.floor(session.points / 5)));
      closeModal();
      return;
    }
    picked = [];
    used.clear();
    currentPuzzle = Banks().drawDrag(level);
    render();
  };

  render();
  return () => session.destroy();
}

function runMatch(body, messageEl, level) {
  const session = GS().createSession(body, level, { total: Q_COUNT() });
  const sessionKeys = new Set(Progress().solvedKeys);
  let currentRound = null;
  let canAdvance = false;
  let busy = false;

  const inner = document.createElement("div");
  body.appendChild(inner);
  inner.innerHTML = `
    <p class="game-question" data-prompt></p>
    <button type="button" class="btn btn-outline btn-sm" data-hint-btn>Show hint</button>
    <p class="game-hint" data-hint-text hidden></p>
    <p class="message">Tap an answer, then <strong>Next question →</strong></p>
    <div class="grid-2" data-options></div>
    <div class="game-feedback" data-feedback hidden></div>
    <div class="btn-row" data-actions></div>
  `;
  const prompt = inner.querySelector("[data-prompt]");
  const hintText = inner.querySelector("[data-hint-text]");
  const options = inner.querySelector("[data-options]");
  const feedback = inner.querySelector("[data-feedback]");
  const actions = GS().mountSubmitNext(inner.querySelector("[data-actions]"), {
    next: "Next question →",
  });
  actions.submitBtn.hidden = true;

  function loadRound() {
    currentRound = Banks().drawMatch(level, sessionKeys);
    sessionKeys.add(currentRound.questionKey);
    prompt.textContent = currentRound.prompt;
    hintText.textContent = currentRound.hint;
    hintText.hidden = true;
    inner.querySelector("[data-hint-btn]").onclick = () => { hintText.hidden = false; };
    feedback.hidden = true;
    options.innerHTML = currentRound.options
      .map((opt, i) => `<button type="button" class="quiz-option" data-opt="${i}">${opt}</button>`)
      .join("");
    canAdvance = false;
    actions.disableNext();
    session.refresh();
    session.stopTimer();
    session.startTimer(() => {
      feedback.hidden = false;
      feedback.className = "game-feedback game-feedback--bad";
      feedback.innerHTML = UI().feedbackHtml({
        correct: false,
        userAnswer: "(time's up)",
        correctAnswer: currentRound.options[currentRound.answer],
        explanation: currentRound.explanation,
      });
      options.querySelectorAll("[data-opt]").forEach((b) => { b.disabled = true; });
      actions.enableNext();
      canAdvance = true;
    });
    options.querySelectorAll("[data-opt]").forEach((btn) => {
      btn.onclick = async () => {
        if (busy) return;
        busy = true;
        session.stopTimer();
        const chosen = Number(btn.dataset.opt);
        const ok = chosen === currentRound.answer;
        const pts = ok ? session.addCorrectPoints() : 0;
        feedback.hidden = false;
        feedback.className = `game-feedback ${ok ? "game-feedback--ok" : "game-feedback--bad"}`;
        feedback.innerHTML = UI().feedbackHtml({
          correct: ok,
          userAnswer: currentRound.options[chosen],
          correctAnswer: currentRound.options[currentRound.answer],
          explanation: currentRound.explanation,
        });
        GS().appendPointsToFeedback(feedback, pts);
        await saveAttempt(
          "match",
          level,
          { ...currentRound, answer: currentRound.options[currentRound.answer] },
          currentRound.options[chosen],
          ok,
        );
        options.querySelectorAll("[data-opt]").forEach((b) => { b.disabled = true; });
        actions.enableNext();
        canAdvance = true;
        busy = false;
      };
    });
  }

  actions.nextBtn.onclick = () => {
    if (!canAdvance || busy) return;
    session.index += 1;
    if (session.index >= session.total) {
      session.destroy();
      award(messageEl, session.points, Math.max(1, Math.floor(session.points / 5)));
      closeModal();
      return;
    }
    loadRound();
  };

  loadRound();
  return () => session.destroy();
}

function runMemory(body, messageEl, level) {
  return runQuestionSession(body, messageEl, level, "memory", (lv, keys) => Banks().drawNumeric(lv, keys, "memory"), {
    dualBox: true,
    showCorrectWhenWrongOnly: true,
    actionLabels: { submit: "Check answer", next: "Next question →" },
  });
}

function runAi(body, messageEl, level) {
  return runQuestionSession(body, messageEl, level, "ai", (lv, keys) => Banks().drawAi(lv, keys));
}

function runBoss(body, messageEl, level) {
  return runQuestionSession(body, messageEl, level, "boss", (lv, keys) => Banks().drawNumeric(lv, keys, "boss"), {
    actionLabels: { submit: "Attack", next: "Next question →" },
  });
}

function runDaily(body, messageEl, level) {
  return runAi(body, messageEl, level);
}

function runSurvival(body, messageEl, level) {
  return runQuestionSession(body, messageEl, level, "survival", (lv, keys) => Banks().drawNumeric(lv, keys, "survival"));
}

function runMultiplayer(body, messageEl, level) {
  let player = 0;
  let bot = 0;
  return runQuestionSession(body, messageEl, level, "multiplayer", (lv, keys) => Banks().drawNumeric(lv, keys, "multiplayer"), {
    extraHtml: `<p class="game-hint" data-rival>You 0 — Rival 0</p>`,
    onAnswered: ({ ok, ui }) => {
      if (ok) player += 1;
      if (Math.random() > 0.35) bot += 1;
      const el = body.querySelector("[data-rival]");
      if (el) el.textContent = `You ${player} — Rival ${bot}`;
    },
    onQuestion: (_q, session, ui) => {
      const el = body.querySelector("[data-rival]");
      if (el) el.textContent = `Round ${session.index + 1} — You ${player} — Rival ${bot}`;
    },
  });
}

function runSpeed(body, messageEl, level) {
  return runQuestionSession(body, messageEl, level, "speed", (lv, keys) => Banks().drawNumeric(lv, keys, "speed"));
}

function runPuzzle(body, messageEl, level) {
  return runQuestionSession(body, messageEl, level, "puzzle", (lv, keys) => Banks().drawNumeric(lv, keys, "puzzle"));
}

const GAME_RUNNERS = {
  flashcards: runFlashcards,
  "timed-quizzes": runTimedQuiz,
  "drag-drop": runDragDrop,
  puzzle: runPuzzle,
  multiplayer: runMultiplayer,
  speed: runSpeed,
  memory: runMemory,
  match: runMatch,
  ai: runAi,
  boss: runBoss,
  daily: runDaily,
  survival: runSurvival,
};

function openLevelPicker(mode, messageEl) {
  if (!gamesDepsReady()) {
    setStatus(messageEl, gamesDepsError(), "error");
    return;
  }
  openModal(`Select level — ${mode.title}`, (body) => {
    body.innerHTML = `
      <p class="game-hint">${Q_COUNT()} questions per round · <strong>Submit</strong> then <strong>Next question →</strong>. Timer: Easy 45s · Medium 35s · Hard 28s · Advanced 22s.</p>
      <div class="level-grid">
        ${Banks().levels
          .map(
            (l) => `
          <button type="button" class="card level-card" data-level="${l.id}">
            <h3>${l.label}</h3>
            <p>${l.desc}</p>
            <p class="message">${GS().pointsForLevel(l.id)} pts per correct · ${GS().timerForLevel(l.id)}s each</p>
          </button>`,
          )
          .join("")}
      </div>
    `;
    body.querySelectorAll("[data-level]").forEach((btn) => {
      btn.onclick = () => {
        const level = btn.dataset.level;
        const run = GAME_RUNNERS[mode.id];
        if (!run) {
          setStatus(messageEl, "This game mode is not available yet.", "error");
          return;
        }
        closeModal();
        openModal(`${mode.title} · ${level}`, (b) => run(b, messageEl, level));
      };
    });
  });
}

function startGame(mode, messageEl) {
  if (!gamesDepsReady()) {
    setStatus(messageEl, gamesDepsError(), "error");
    return;
  }
  if (!Progress().isSignedIn()) {
    setStatus(messageEl, "Sign in with your school email to play and save progress.", "error");
    setTimeout(() => { window.location.href = "/auth/signin.html"; }, 900);
    return;
  }
  setStatus(messageEl, "", "info");
  openLevelPicker(mode, messageEl);
}

function ensureModal() {
  if (modalEl) return;
  modalEl = document.createElement("div");
  modalEl.className = "game-modal";
  modalEl.innerHTML = `
    <div class="game-modal__backdrop" data-close></div>
    <div class="game-modal__panel" role="dialog" aria-modal="true">
      <header class="game-modal__header">
        <h2 id="game-modal-title"></h2>
        <button type="button" class="game-modal__close" data-close>&times;</button>
      </header>
      <div class="game-modal__body" id="game-modal-body"></div>
    </div>
  `;
  document.body.appendChild(modalEl);
  modalTitle = modalEl.querySelector("#game-modal-title");
  modalBody = modalEl.querySelector("#game-modal-body");
  modalEl.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });
}

function initGames() {
  const root = document.getElementById("games-page");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";
  ensureModal();
  const messageEl = root.querySelector("[data-message]");
  if (!gamesDepsReady()) {
    setStatus(messageEl, gamesDepsError(), "error");
    return;
  }
  const grid = root.querySelector("[data-grid]");
  const solved = Progress().solvedKeys?.size ?? 0;
  root.querySelector("[data-solved-count]")?.replaceChildren(document.createTextNode(String(solved)));

  grid.innerHTML = GAME_MODES.map(
    (m) => `
    <div class="card card-hover">
      <h3>${m.title}</h3>
      <p class="message">${m.description}</p>
      <button type="button" class="btn btn-primary btn-sm" data-game-id="${m.id}">Play now</button>
    </div>`,
  ).join("");

  grid.querySelectorAll("[data-game-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = GAME_MODES.find((x) => x.id === btn.dataset.gameId);
      if (mode) startGame(mode, messageEl);
    });
  });

  document.addEventListener("mathora:progress-updated", () => {
    const el = root.querySelector("[data-solved-count]");
    if (el) el.textContent = String(Progress().solvedKeys.size);
  });
}

function bootGames() {
  if (document.getElementById("games-page")) {
    Progress().load().then(initGames);
  }
}

document.addEventListener("mathora:shell-ready", bootGames);
document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(bootGames));

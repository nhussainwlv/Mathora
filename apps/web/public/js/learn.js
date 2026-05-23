import { curriculumSources, topicsByStage } from "./curriculum.js";

const STAGE_ORDER = ["KS1", "KS2", "KS3", "KS4"];

const STAGE_META = {
  KS1: {
    label: "KS1",
    years: "Years 1–2",
    blurb: "Counting, addition, shapes and early number sense.",
    topicCount: topicsByStage.KS1.length,
  },
  KS2: {
    label: "KS2",
    years: "Years 3–6",
    blurb: "Times tables, fractions, decimals and problem solving.",
    topicCount: topicsByStage.KS2.length,
  },
  KS3: {
    label: "KS3",
    years: "Years 7–9",
    blurb: "Algebra, ratios, graphs and statistics foundations.",
    topicCount: topicsByStage.KS3.length,
  },
  KS4: {
    label: "KS4",
    years: "Years 10–11",
    blurb: "GCSE maths — algebra, trigonometry, probability and more.",
    topicCount: topicsByStage.KS4.length,
  },
};

function initLearn() {
  const root = document.getElementById("learn-page");
  if (!root) return;

  /** @type {'stages' | 'topics' | 'topic'} */
  let view = "stages";
  let activeStage = null;
  let selectedTopicId = null;

  const completedRevision = {};
  const answers = {};
  const scores = {};

  const breadcrumb = root.querySelector("[data-breadcrumb]");
  const stepIndicator = root.querySelector("[data-step-indicator]");
  const viewStages = root.querySelector('[data-view="stages"]');
  const viewTopics = root.querySelector('[data-view="topics"]');
  const viewTopic = root.querySelector('[data-view="topic"]');
  const stageGrid = root.querySelector("[data-stages]");
  const topicsHeading = root.querySelector("[data-topics-heading]");
  const topicList = root.querySelector("[data-topics]");
  const topicDetail = root.querySelector("[data-topic-detail]");
  const quizRoot = root.querySelector("[data-quiz]");
  const sourcesList = root.querySelector("[data-sources]");
  const messageEl = root.querySelector("[data-message]");

  sourcesList.innerHTML = curriculumSources
    .map(
      (source) =>
        `<li><a href="${source.url}" target="_blank" rel="noreferrer noopener">${source.label}</a></li>`,
    )
    .join("");

  function setMessage(text) {
    messageEl.textContent = text;
  }

  function getSelectedTopic() {
    if (!activeStage || !selectedTopicId) return null;
    const stageTopics = topicsByStage[activeStage];
    return stageTopics.find((t) => t.id === selectedTopicId) ?? null;
  }

  function clearQuizAnswers(topic) {
    if (!topic) return;
    topic.questions.forEach((q) => delete answers[q.id]);
    delete scores[topic.id];
  }

  function setView(next) {
    view = next;
    viewStages.classList.toggle("learn-panel-hidden", view !== "stages");
    viewTopics.classList.toggle("learn-panel-hidden", view !== "topics");
    viewTopic.classList.toggle("learn-panel-hidden", view !== "topic");
    renderChrome();
    if (view === "stages") renderStages();
    if (view === "topics") renderTopics();
    if (view === "topic") {
      renderTopicDetail();
      renderQuiz();
    }
  }

  function renderChrome() {
    const topic = getSelectedTopic();
    const stepIndex = view === "stages" ? 0 : view === "topics" ? 1 : 2;
    const labels = ["Key stages", activeStage ? `${activeStage} topics` : "Topics", topic?.title ?? "Topic"];

    stepIndicator.innerHTML = [0, 1, 2]
      .map((i) => `<div class="learn-step-dot${i <= stepIndex ? " active" : ""}"></div>`)
      .join("");

    breadcrumb.innerHTML = `
      <button type="button" data-crumb="stages"${view === "stages" ? " disabled" : ""}>Learn</button>
      ${activeStage ? `<span class="sep">›</span><button type="button" data-crumb="topics"${view === "topics" ? " disabled" : ""}>${activeStage}</button>` : ""}
      ${topic && view === "topic" ? `<span class="sep">›</span><button type="button" disabled>${topic.title}</button>` : ""}
    `;

    breadcrumb.querySelector('[data-crumb="stages"]')?.addEventListener("click", () => {
      activeStage = null;
      selectedTopicId = null;
      setView("stages");
      setMessage("Choose a key stage to begin.");
    });

    breadcrumb.querySelector('[data-crumb="topics"]')?.addEventListener("click", () => {
      if (!activeStage) return;
      selectedTopicId = null;
      setView("topics");
      setMessage(`Topics for ${activeStage}.`);
    });
  }

  function renderStages() {
    stageGrid.innerHTML = STAGE_ORDER.map((stage) => {
      const meta = STAGE_META[stage];
      return `<button type="button" class="learn-stage-card" data-stage="${stage}">
        <strong>${meta.label}</strong>
        <span>${meta.years}</span>
        <span>${meta.blurb}</span>
        <span>${meta.topicCount} topics</span>
      </button>`;
    }).join("");

    stageGrid.querySelectorAll("[data-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeStage = btn.dataset.stage;
        selectedTopicId = null;
        setView("topics");
        setMessage(`Select a ${activeStage} topic.`);
      });
    });
  }

  function renderTopics() {
    const stageTopics = topicsByStage[activeStage] ?? [];
    const meta = STAGE_META[activeStage];
    topicsHeading.textContent = `${activeStage} topics — ${meta?.years ?? ""}`;

    topicList.innerHTML = stageTopics
      .map(
        (topic) => `<li>
          <button type="button" class="learn-topic-card" data-topic-id="${topic.id}">
            <strong>${topic.title}</strong>
            <span>${topic.overview}</span>
            <span>10 quiz questions</span>
          </button>
        </li>`,
      )
      .join("");

    topicList.querySelectorAll("[data-topic-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const topic = stageTopics.find((t) => t.id === btn.dataset.topicId);
        selectedTopicId = topic.id;
        clearQuizAnswers(topic);
        setView("topic");
        setMessage(`Studying ${topic.title}.`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function esc(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderParagraphs(text) {
    return text
      .split("\n\n")
      .filter(Boolean)
      .map((p) => `<p>${esc(p)}</p>`)
      .join("");
  }

  function renderFormulas(formulas) {
    if (!formulas?.length) return "";
    const items = formulas
      .map(
        (f) =>
          `<div class="learn-formula"><span class="learn-formula-label">${esc(f.label)}</span><span class="learn-formula-expr">${esc(f.expression)}</span></div>`,
      )
      .join("");
    return `<h4>Key formulas</h4><div class="learn-formula-list">${items}</div>`;
  }

  function renderDiagram(diagram) {
    if (!diagram?.svg) return "";
    return `<figure class="learn-diagram" aria-label="${esc(diagram.alt)}">
      ${diagram.svg}
      <figcaption>${esc(diagram.caption)}</figcaption>
    </figure>`;
  }

  function renderWorkedExamplesForStage(topic, stage) {
    const examples = topic.workedExamplesByStage?.[stage] ?? [];
    if (!examples.length) return "";
    const items = examples.map((ex) => `<li>${esc(ex)}</li>`).join("");
    const meta = STAGE_META[stage];
    return `<h4>Worked examples — ${stage}</h4>
      <p class="message">${meta?.years ?? stage}: five examples for this topic at your level.</p>
      <div class="learn-stage-examples learn-stage-examples-active">
        <ul class="learn-example-list">${items}</ul>
      </div>`;
  }

  function renderTopicLinks(topic, stage) {
    const otherStages = STAGE_ORDER.filter((s) => s !== stage);
    const links = (topic.topicLinks ?? []).filter((link) => {
      const label = link.label.toUpperCase();
      return !otherStages.some((s) => label.includes(s));
    });
    if (!links.length) return "";
    const items = links
      .map(
        (link) =>
          `<li><a href="${esc(link.url)}" target="_blank" rel="noreferrer noopener">${esc(link.label)}</a></li>`,
      )
      .join("");
    return `<h4>Learn more online</h4><ul class="list-stack">${items}</ul>`;
  }

  function renderTopicDetail() {
    const topic = getSelectedTopic();
    if (!topic) return;

    const stage = activeStage || topic.stage;
    const revisionDone = completedRevision[topic.id] ?? [];
    const meta = STAGE_META[stage];
    const explanation = topic.detailedExplanation || topic.information || topic.overview;

    topicDetail.innerHTML = `
      <div class="learn-back-row">
        <button type="button" class="btn btn-dark btn-sm" data-back-topics>← Back to ${stage} topics</button>
      </div>
      <div class="learn-topic-header card">
        <p class="message" style="margin:0 0 0.25rem;">${stage} · ${meta?.years ?? ""}</p>
        <h3>${esc(topic.title)}</h3>
        <p>${esc(topic.overview)}</p>
      </div>
      <div class="card learn-topic-body">
        <h4>${stage} — detailed guide</h4>
        <div class="learn-detail-text">${renderParagraphs(explanation)}</div>
        ${renderDiagram(topic.diagram)}
        ${renderFormulas(topic.formulas)}
        ${renderWorkedExamplesForStage(topic, stage)}
        ${renderTopicLinks(topic, stage)}
        <h4>Revision notes</h4>
        <ul class="list-stack" data-revision></ul>
        <h4>Revision tasks</h4>
        <ul>${topic.revisionTasks.map((task) => `<li>${esc(task)}</li>`).join("")}</ul>
      </div>
    `;

    topicDetail.querySelector("[data-back-topics]")?.addEventListener("click", () => {
      setView("topics");
      setMessage(`Topics for ${activeStage}.`);
    });

    const revisionList = topicDetail.querySelector("[data-revision]");
    revisionList.innerHTML = topic.revisionPoints
      .map((point) => {
        const done = revisionDone.includes(point);
        return `<li class="list-item">
          <span>${point}</span>
          <button type="button" class="btn btn-primary btn-sm ${done ? "badge-emerald" : ""}" data-revision-point="${encodeURIComponent(point)}">${done ? "Completed" : "Mark done"}</button>
        </li>`;
      })
      .join("");

    revisionList.querySelectorAll("[data-revision-point]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const point = decodeURIComponent(btn.dataset.revisionPoint);
        const current = completedRevision[topic.id] ?? [];
        completedRevision[topic.id] = current.includes(point)
          ? current.filter((item) => item !== point)
          : [...current, point];
        renderTopicDetail();
      });
    });
  }

  function renderQuiz() {
    const topic = getSelectedTopic();
    if (!topic) return;

    const total = topic.questions.length;
    const currentScore = scores[topic.id];

    quizRoot.innerHTML = `
      <h3>Topic quiz</h3>
      <p class="learn-quiz-meta">Answer all ${total} questions, then submit to see your score and explanations.</p>
      <div data-questions></div>
      <div class="btn-row">
        <button type="button" class="btn btn-primary btn-sm" data-submit-quiz>Submit quiz</button>
        <button type="button" class="btn btn-dark btn-sm" data-reset-quiz>Reset answers</button>
      </div>
      ${currentScore !== undefined ? `<p class="message"><strong>Score: ${currentScore}/${total}</strong>${currentScore === total ? " — Excellent!" : currentScore >= total * 0.7 ? " — Good work!" : " — Review the examples and try again."}</p>` : ""}
    `;

    const questionsEl = quizRoot.querySelector("[data-questions]");
    questionsEl.innerHTML = topic.questions
      .map((question, qi) => {
        const options = question.options
          .map((option, index) => {
            const selected = answers[question.id] === index;
            return `<button type="button" class="quiz-option${selected ? " selected" : ""}" data-q="${question.id}" data-opt="${index}">${option}</button>`;
          })
          .join("");

        const feedback =
          currentScore !== undefined
            ? `<p class="message">Correct: ${question.options[question.answerIndex]}. ${question.explanation}</p>`
            : "";

        return `<div class="card" style="margin-top:0.75rem;">
          <p style="font-weight:600;">Q${qi + 1}. ${question.prompt}</p>
          <div class="grid-2" style="margin-top:0.5rem;">${options}</div>
          ${feedback}
        </div>`;
      })
      .join("");

    questionsEl.querySelectorAll("[data-q]").forEach((btn) => {
      btn.addEventListener("click", () => {
        answers[btn.dataset.q] = Number(btn.dataset.opt);
        renderQuiz();
      });
    });

    quizRoot.querySelector("[data-submit-quiz]")?.addEventListener("click", () => {
      const answered = topic.questions.filter((q) => answers[q.id] !== undefined).length;
      if (answered < total) {
        setMessage(`Answer all ${total} questions before submitting (${answered}/${total} done).`);
        return;
      }
      const correct = topic.questions.reduce((acc, question) => {
        return answers[question.id] === question.answerIndex ? acc + 1 : acc;
      }, 0);
      scores[topic.id] = correct;
      setMessage(`Quiz submitted: ${correct}/${total} on ${topic.title}.`);
      renderQuiz();
    });

    quizRoot.querySelector("[data-reset-quiz]")?.addEventListener("click", () => {
      clearQuizAnswers(topic);
      setMessage(`Quiz reset for ${topic.title}.`);
      renderQuiz();
    });
  }

  setView("stages");
  setMessage("Step 1: choose KS1, KS2, KS3 or KS4.");
}

document.addEventListener("DOMContentLoaded", initLearn);

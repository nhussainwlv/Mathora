import { curriculumSources, topicsByStage } from "./curriculum.js";

const stages = Object.keys(topicsByStage);

function initLearn() {
  const root = document.getElementById("learn-page");
  if (!root) return;

  let activeStage = "KS1";
  let selectedTopicId = topicsByStage.KS1[0].id;
  const completedRevision = {};
  const answers = {};
  const scores = {};
  const messageEl = root.querySelector("[data-message]");

  const stageRow = root.querySelector("[data-stages]");
  const topicList = root.querySelector("[data-topics]");
  const topicDetail = root.querySelector("[data-topic-detail]");
  const quizRoot = root.querySelector("[data-quiz]");
  const sourcesList = root.querySelector("[data-sources]");

  sourcesList.innerHTML = curriculumSources
    .map(
      (source) =>
        `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a></li>`,
    )
    .join("");

  function getSelectedTopic() {
    const stageTopics = topicsByStage[activeStage];
    return stageTopics.find((t) => t.id === selectedTopicId) ?? stageTopics[0];
  }

  function setMessage(text) {
    messageEl.textContent = text;
  }

  function renderStages() {
    stageRow.innerHTML = stages
      .map(
        (stage) =>
          `<button type="button" class="pill${activeStage === stage ? " active" : ""}" data-stage="${stage}">${stage}</button>`,
      )
      .join("");

    stageRow.querySelectorAll("[data-stage]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeStage = btn.dataset.stage;
        selectedTopicId = topicsByStage[activeStage][0].id;
        Object.keys(answers).forEach((k) => delete answers[k]);
        setMessage(`Opened ${activeStage} learning path.`);
        renderAll();
      });
    });
  }

  function renderTopics() {
    const stageTopics = topicsByStage[activeStage];
    const selected = getSelectedTopic();

    topicList.innerHTML = stageTopics
      .map((topic) => {
        const started = topic.id === selected.id;
        return `<li class="list-item" style="flex-direction:column;align-items:flex-start;">
          <p style="margin:0;font-weight:600;">${topic.title}</p>
          <button type="button" class="btn btn-primary btn-sm" data-topic-id="${topic.id}">${started ? "Continue Topic" : "Start Topic"}</button>
        </li>`;
      })
      .join("");

    topicList.querySelectorAll("[data-topic-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const topic = stageTopics.find((t) => t.id === btn.dataset.topicId);
        selectedTopicId = topic.id;
        Object.keys(answers).forEach((k) => delete answers[k]);
        setMessage(`Started ${topic.title}.`);
        renderAll();
      });
    });
  }

  function renderTopicDetail() {
    const topic = getSelectedTopic();
    const revisionDone = completedRevision[topic.id] ?? [];

    topicDetail.innerHTML = `
      <h3>${topic.title}</h3>
      <p>${topic.overview}</p>
      <h4>Revision notes</h4>
      <ul class="list-stack" data-revision></ul>
      <h4>Revision tasks</h4>
      <ul>${topic.revisionTasks.map((task) => `<li>${task}</li>`).join("")}</ul>
    `;

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
    const currentScore = scores[topic.id];

    quizRoot.innerHTML = `
      <h3>Topic quiz</h3>
      <div data-questions></div>
      <div class="btn-row">
        <button type="button" class="btn btn-primary btn-sm" data-submit-quiz>Submit quiz</button>
        <button type="button" class="btn btn-dark btn-sm" data-reset-quiz>Reset answers</button>
      </div>
      ${currentScore !== undefined ? `<p>Latest score: ${currentScore}/${topic.questions.length}</p>` : ""}
    `;

    const questionsEl = quizRoot.querySelector("[data-questions]");
    questionsEl.innerHTML = topic.questions
      .map((question) => {
        const options = question.options
          .map((option, index) => {
            const selected = answers[question.id] === index;
            return `<button type="button" class="quiz-option${selected ? " selected" : ""}" data-q="${question.id}" data-opt="${index}">${option}</button>`;
          })
          .join("");

        const feedback =
          currentScore !== undefined
            ? `<p class="message">Answer: ${question.options[question.answerIndex]}. ${question.explanation}</p>`
            : "";

        return `<div class="card" style="margin-top:0.75rem;"><p style="font-weight:600;">${question.prompt}</p><div class="grid-2" style="margin-top:0.5rem;">${options}</div>${feedback}</div>`;
      })
      .join("");

    questionsEl.querySelectorAll("[data-q]").forEach((btn) => {
      btn.addEventListener("click", () => {
        answers[btn.dataset.q] = Number(btn.dataset.opt);
        renderQuiz();
      });
    });

    quizRoot.querySelector("[data-submit-quiz]")?.addEventListener("click", () => {
      const total = topic.questions.length;
      const correct = topic.questions.reduce((acc, question) => {
        return answers[question.id] === question.answerIndex ? acc + 1 : acc;
      }, 0);
      scores[topic.id] = correct;
      setMessage(`Quiz submitted: ${correct}/${total} on ${topic.title}.`);
      renderQuiz();
    });

    quizRoot.querySelector("[data-reset-quiz]")?.addEventListener("click", () => {
      topic.questions.forEach((q) => delete answers[q.id]);
      delete scores[topic.id];
      setMessage(`Quiz reset for ${topic.title}.`);
      renderQuiz();
    });
  }

  function renderAll() {
    renderStages();
    renderTopics();
    renderTopicDetail();
    renderQuiz();
  }

  renderAll();
}

document.addEventListener("DOMContentLoaded", initLearn);

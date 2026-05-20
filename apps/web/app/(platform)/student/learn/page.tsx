"use client";

import { useMemo, useState } from "react";
import { curriculumSources, topicsByStage, type QuizQuestion, type TopicContent } from "@/lib/ks-curriculum";

type Stage = keyof typeof topicsByStage;

export default function LearnPage() {
  const [activeStage, setActiveStage] = useState<Stage>("KS1");
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topicsByStage.KS1[0].id);
  const [completedRevision, setCompletedRevision] = useState<Record<string, string[]>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");

  const stageTopics = useMemo(() => topicsByStage[activeStage], [activeStage]);
  const selectedTopic =
    stageTopics.find((item) => item.id === selectedTopicId) ?? stageTopics[0];

  function openStage(stage: Stage) {
    setActiveStage(stage);
    setSelectedTopicId(topicsByStage[stage][0].id);
    setAnswers({});
    setMessage(`Opened ${stage} learning path.`);
  }

  function startTopic(topic: TopicContent) {
    setSelectedTopicId(topic.id);
    setAnswers({});
    setMessage(`Started ${topic.title}.`);
  }

  function toggleRevision(topicId: string, point: string) {
    const current = completedRevision[topicId] ?? [];
    const updated = current.includes(point)
      ? current.filter((item) => item !== point)
      : [...current, point];

    setCompletedRevision((prev) => ({ ...prev, [topicId]: updated }));
  }

  function setAnswer(question: QuizQuestion, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  }

  function submitQuiz() {
    const total = selectedTopic.questions.length;
    const correct = selectedTopic.questions.reduce((acc, question) => {
      return answers[question.id] === question.answerIndex ? acc + 1 : acc;
    }, 0);

    setScores((prev) => ({ ...prev, [selectedTopic.id]: correct }));
    setMessage(`Quiz submitted: ${correct}/${total} on ${selectedTopic.title}.`);
  }

  const revisionDone = completedRevision[selectedTopic.id] ?? [];
  const currentScore = scores[selectedTopic.id];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Key Stage Learning Paths</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Simplified learning flow: choose topic, study revision notes, then complete quiz.
      </p>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(topicsByStage) as Stage[]).map((stage) => (
          <button
            key={stage}
            type="button"
            onClick={() => openStage(stage)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              activeStage === stage
                ? "bg-indigo-600 text-white"
                : "bg-white/70 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/60">
        <h3 className="text-lg font-semibold">{activeStage} Topics</h3>
        <ul className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
          {stageTopics.map((topic) => {
            const started = topic.id === selectedTopic.id;
            return (
              <li key={topic.id} className="rounded-xl bg-white/60 p-3 dark:bg-slate-800/70">
                <p className="font-medium">{topic.title}</p>
                <button
                  type="button"
                  onClick={() => startTopic(topic)}
                  className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {started ? "Continue Topic" : "Start Topic"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-lg dark:border-slate-700/50 dark:bg-slate-900/60">
        <h3 className="text-xl font-bold">{selectedTopic.title}</h3>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{selectedTopic.overview}</p>

        <h4 className="mt-4 font-semibold">Revision notes</h4>
        <ul className="mt-2 space-y-2 text-sm">
          {selectedTopic.revisionPoints.map((point) => {
            const done = revisionDone.includes(point);
            return (
              <li key={point} className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/70">
                <span>{point}</span>
                <button
                  type="button"
                  onClick={() => toggleRevision(selectedTopic.id, point)}
                  className={`rounded-md px-2 py-1 text-xs font-semibold text-white ${done ? "bg-emerald-600" : "bg-indigo-600"}`}
                >
                  {done ? "Completed" : "Mark done"}
                </button>
              </li>
            );
          })}
        </ul>

        <h4 className="mt-4 font-semibold">Revision tasks</h4>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-200">
          {selectedTopic.revisionTasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-lg dark:border-slate-700/50 dark:bg-slate-900/60">
        <h3 className="text-lg font-semibold">Topic quiz</h3>
        <div className="mt-3 space-y-4">
          {selectedTopic.questions.map((question) => (
            <div key={question.id} className="rounded-xl bg-white/70 p-3 dark:bg-slate-800/70">
              <p className="font-medium">{question.prompt}</p>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                {question.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswer(question, index)}
                    className={`rounded-lg px-3 py-2 text-left text-sm ${
                      answers[question.id] === index
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {scores[selectedTopic.id] !== undefined ? (
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  Answer: {question.options[question.answerIndex]}. {question.explanation}
                </p>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={submitQuiz}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Submit quiz
          </button>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setScores((prev) => {
                const next = { ...prev };
                delete next[selectedTopic.id];
                return next;
              });
              setMessage(`Quiz reset for ${selectedTopic.title}.`);
            }}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            Reset answers
          </button>
        </div>
        {currentScore !== undefined ? (
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            Latest score: {currentScore}/{selectedTopic.questions.length}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-sm shadow-lg dark:border-slate-700/50 dark:bg-slate-900/60">
        <h4 className="font-semibold">Content references</h4>
        <ul className="mt-2 space-y-1">
          {curriculumSources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 underline dark:text-indigo-300"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </div>
  );
}

"use client";

import { useState } from "react";

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

export function GameModes() {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modes.map((mode) => (
          <div
            key={mode}
            className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-900/60"
          >
            <h3 className="font-semibold">{mode}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Play this mode to earn XP, coins, and unlock advanced mastery routes.
            </p>
            <button
              type="button"
              onClick={() => setMessage(`Started ${mode}. Good luck!`)}
              className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Play now
            </button>
          </div>
        ))}
      </div>
      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

const children = [
  { id: "c1", name: "Sam", accuracy: 87, streak: 14, weakTopic: "Ratios" },
  { id: "c2", name: "Ava", accuracy: 79, streak: 9, weakTopic: "Algebra" },
];

export default function ParentPage() {
  const [activeChildId, setActiveChildId] = useState(children[0].id);
  const [message, setMessage] = useState("");

  const activeChild = useMemo(
    () => children.find((child) => child.id === activeChildId) ?? children[0],
    [activeChildId],
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Parent Monitoring Hub</h2>
      <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-md dark:border-slate-700/50 dark:bg-slate-900/60">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Monitor child progress, streaks, weak topics, and weekly study goals. Receive reminders and alerts for
          overdue assignments.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {children.map((child) => (
          <button
            key={child.id}
            type="button"
            onClick={() => setActiveChildId(child.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              activeChildId === child.id
                ? "bg-indigo-600 text-white"
                : "bg-white/70 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
            }`}
          >
            {child.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-md dark:border-slate-700/50 dark:bg-slate-900/60">
          <p className="text-sm text-slate-500 dark:text-slate-300">Accuracy</p>
          <p className="text-2xl font-bold">{activeChild.accuracy}%</p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-md dark:border-slate-700/50 dark:bg-slate-900/60">
          <p className="text-sm text-slate-500 dark:text-slate-300">Streak</p>
          <p className="text-2xl font-bold">{activeChild.streak} days</p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-md dark:border-slate-700/50 dark:bg-slate-900/60">
          <p className="text-sm text-slate-500 dark:text-slate-300">Weak Topic</p>
          <p className="text-2xl font-bold">{activeChild.weakTopic}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {["Open study planner", "Sync with calendar", "Generate printable cards"].map((feature) => (
          <button
            key={feature}
            type="button"
            onClick={() => setMessage(`${feature} for ${activeChild.name}.`)}
            className="rounded-2xl border border-white/20 bg-white/60 p-4 text-left shadow-md transition hover:-translate-y-0.5 dark:border-slate-700/50 dark:bg-slate-900/60"
          >
            {feature}
          </button>
        ))}
      </div>

      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </div>
  );
}

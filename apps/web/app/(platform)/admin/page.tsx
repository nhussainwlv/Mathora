"use client";

import { FormEvent, useState } from "react";

type AdminUser = { id: string; name: string; banned: boolean };

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([
    { id: "u1", name: "Student Sam", banned: false },
    { id: "u2", name: "Teacher Taylor", banned: false },
  ]);
  const [questionBank, setQuestionBank] = useState<string[]>(["Fractions: simplify 12/18"]);
  const [message, setMessage] = useState("");

  function addQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const question = String(formData.get("question"));
    if (!question) return;
    setQuestionBank((prev) => [question, ...prev]);
    setMessage("Question added to bank.");
    event.currentTarget.reset();
  }

  function toggleBan(userId: string) {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, banned: !user.banned } : user)),
    );
    const user = users.find((item) => item.id === userId);
    if (user) setMessage(`${user.banned ? "Unbanned" : "Banned"} ${user.name}.`);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Admin Control Center</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-md dark:border-slate-700/50 dark:bg-slate-900/60">
          <h3 className="font-semibold">Manage users</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/70">
                <span>{user.name}</span>
                <button
                  type="button"
                  onClick={() => toggleBan(user.id)}
                  className={`rounded-md px-2 py-1 text-xs text-white ${user.banned ? "bg-emerald-600" : "bg-rose-600"}`}
                >
                  {user.banned ? "Unban" : "Ban"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={addQuestion}
          className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-md dark:border-slate-700/50 dark:bg-slate-900/60"
        >
          <h3 className="font-semibold">Question bank CRUD</h3>
          <input
            name="question"
            placeholder="Add a new maths question"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />
          <button type="submit" className="mt-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
            Add question
          </button>
          <ul className="mt-3 space-y-2 text-sm">
            {questionBank.map((item) => (
              <li key={item} className="rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/70">
                {item}
              </li>
            ))}
          </ul>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {["Subject management", "Content uploads", "Leaderboard config"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMessage(`${item} panel opened.`)}
            className="rounded-2xl border border-white/20 bg-white/60 p-4 text-left shadow-md transition hover:-translate-y-0.5 dark:border-slate-700/50 dark:bg-slate-900/60"
          >
            {item}
          </button>
        ))}
      </div>

      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </div>
  );
}

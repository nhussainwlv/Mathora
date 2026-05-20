"use client";

import { FormEvent, useState } from "react";

export default function TeacherPage() {
  const [classrooms, setClassrooms] = useState<string[]>(["KS2 Maths Wizards"]);
  const [assignments, setAssignments] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  function createClassroom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const classroomName = String(form.get("classroomName"));
    if (!classroomName) return;
    setClassrooms((prev) => [classroomName, ...prev]);
    setMessage(`Classroom "${classroomName}" created.`);
    event.currentTarget.reset();
  }

  function createAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("assignmentTitle"));
    if (!title) return;
    setAssignments((prev) => [title, ...prev]);
    setMessage(`Assignment "${title}" published.`);
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Teacher Workspace</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <form
          onSubmit={createClassroom}
          className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-md dark:border-slate-700/50 dark:bg-slate-900/60"
        >
          <h3 className="font-semibold">Create classroom</h3>
          <input
            name="classroomName"
            placeholder="Classroom name"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />
          <button type="submit" className="mt-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
            Create
          </button>
        </form>

        <form
          onSubmit={createAssignment}
          className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-md dark:border-slate-700/50 dark:bg-slate-900/60"
        >
          <h3 className="font-semibold">Assign homework</h3>
          <input
            name="assignmentTitle"
            placeholder="Assignment title"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
          />
          <button type="submit" className="mt-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
            Publish
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-md dark:border-slate-700/50 dark:bg-slate-900/60">
          <h3 className="font-semibold">Classrooms</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {classrooms.map((classroom) => (
              <li key={classroom} className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/70">
                {classroom}
                <button
                  type="button"
                  onClick={() => setMessage(`Opened analytics for ${classroom}.`)}
                  className="rounded-md bg-slate-900 px-2 py-1 text-xs text-white dark:bg-slate-100 dark:text-slate-900"
                >
                  View analytics
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-md dark:border-slate-700/50 dark:bg-slate-900/60">
          <h3 className="font-semibold">Assignments</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {assignments.length === 0 ? (
              <li className="rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/70">No assignments yet.</li>
            ) : (
              assignments.map((assignment) => (
                <li key={assignment} className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/70">
                  {assignment}
                  <button
                    type="button"
                    onClick={() => setMessage(`Report download started for "${assignment}".`)}
                    className="rounded-md bg-emerald-600 px-2 py-1 text-xs text-white"
                  >
                    Download report
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </div>
  );
}

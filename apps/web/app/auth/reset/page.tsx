"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ResetPage() {
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));

    try {
      const result = await apiFetch<{ message: string }>("/auth/password-reset/request", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Reset request failed");
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold">Reset password</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-700 dark:bg-slate-900"
      >
        <input className="w-full rounded-lg border p-2" type="email" name="email" placeholder="Account email" />
        <button className="w-full rounded-lg bg-indigo-600 p-2 font-semibold text-white" type="submit">
          Send reset link
        </button>
      </form>
      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </main>
  );
}

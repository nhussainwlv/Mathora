"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function VerifyPage() {
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const token = String(formData.get("token"));

    try {
      const result = await apiFetch<{ message: string }>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Verification failed");
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold">Verify email</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-700 dark:bg-slate-900"
      >
        <input className="w-full rounded-lg border p-2" type="text" name="token" placeholder="Verification token" />
        <button className="w-full rounded-lg bg-indigo-600 p-2 font-semibold text-white" type="submit">
          Verify account
        </button>
      </form>
      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </main>
  );
}

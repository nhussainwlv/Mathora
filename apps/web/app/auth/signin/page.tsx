"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useSessionStore } from "@/lib/use-session-store";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const setTokens = useSessionStore((state) => state.setTokens);
  const router = useRouter();
  const [message, setMessage] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      const data = await apiFetch<{ accessToken: string; refreshToken: string }>("/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setTokens(data.accessToken, data.refreshToken);
      setMessage("Signed in successfully. Redirecting to student dashboard...");
      setTimeout(() => router.push("/student"), 400);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign in failed");
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold">Sign in to Mathora</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-700 dark:bg-slate-900"
      >
        <input className="w-full rounded-lg border p-2" type="email" name="email" placeholder="Email" />
        <input className="w-full rounded-lg border p-2" type="password" name="password" placeholder="Password" />
        <button className="w-full rounded-lg bg-indigo-600 p-2 font-semibold text-white" type="submit">
          Sign in
        </button>
      </form>
      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </main>
  );
}

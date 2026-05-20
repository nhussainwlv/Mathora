"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      displayName: String(formData.get("displayName")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      role: String(formData.get("role")),
    };

    try {
      const result = await apiFetch<{ verificationTokenForDev: string }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMessage(`Account created. Dev verification token: ${result.verificationTokenForDev}`);
      setTimeout(() => router.push("/auth/verify"), 500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Signup failed");
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold">Create your Mathora account</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-700 dark:bg-slate-900"
      >
        <input className="w-full rounded-lg border p-2" type="text" name="displayName" placeholder="Display name" />
        <input className="w-full rounded-lg border p-2" type="email" name="email" placeholder="Email" />
        <input className="w-full rounded-lg border p-2" type="password" name="password" placeholder="Password" />
        <select className="w-full rounded-lg border p-2" name="role">
          <option>STUDENT</option>
          <option>TEACHER</option>
          <option>PARENT</option>
        </select>
        <button className="w-full rounded-lg bg-indigo-600 p-2 font-semibold text-white" type="submit">
          Sign up
        </button>
      </form>
      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </main>
  );
}

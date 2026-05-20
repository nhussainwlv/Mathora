import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-violet-100 p-6 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="mx-auto max-w-6xl rounded-3xl border border-white/30 bg-white/50 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/50">
        <h1 className="text-4xl font-bold md:text-6xl">Mathora</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          Premium UK curriculum maths learning for KS1, KS2, KS3, and KS4 with AI guidance, gamified progression,
          flashcards, teacher analytics, and parent monitoring.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/student" className="rounded-full bg-indigo-600 px-5 py-3 font-semibold text-white">
            Enter Student Hub
          </Link>
          <Link href="/teacher" className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
            Teacher Portal
          </Link>
          <Link href="/admin" className="rounded-full border border-slate-300 px-5 py-3 font-semibold dark:border-slate-600">
            Admin Console
          </Link>
        </div>
      </div>
    </main>
  );
}

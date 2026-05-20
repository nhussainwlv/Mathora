export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold">You are offline</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Continue reviewing cached flashcards and sync your progress when connection returns.
        </p>
      </div>
    </main>
  );
}

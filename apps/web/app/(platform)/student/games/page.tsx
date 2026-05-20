import { GameModes } from "@/components/game-modes";

export default function GamesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Game Modes</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Play engaging maths challenges inspired by Duolingo streaks, Kahoot speed rounds, and Quizlet revision.
      </p>
      <GameModes />
    </div>
  );
}

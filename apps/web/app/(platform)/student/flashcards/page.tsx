import { FlashcardTrainer } from "@/components/flashcard-trainer";

export default function FlashcardsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Flashcard Trainer</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Quizlet-style revision with flip animation, swipe controls, bookmarks, and adaptive suggestions.
      </p>
      <FlashcardTrainer />
    </div>
  );
}

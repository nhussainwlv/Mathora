"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const cards = [
  { front: "What is 3/4 of 20?", back: "15", hint: "Find one quarter first, then multiply by 3." },
  { front: "Solve: 2x + 5 = 17", back: "x = 6", hint: "Subtract 5 from both sides first." },
  { front: "What is the area of a triangle with base 10 and height 6?", back: "30", hint: "Use 1/2 × base × height." },
];

export function FlashcardTrainer() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const currentCard = useMemo(() => cards[index], [index]);
  const isFavourite = bookmarked.includes(index);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/20 bg-white/60 p-3 text-sm shadow-md backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/60">
        Timed recall: 20s | Mode: Spaced repetition | Smart suggestion: revisit algebra basics
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setFlipped((prev) => !prev)}
        className="flex h-64 w-full items-center justify-center rounded-3xl border border-white/20 bg-white/60 p-6 text-center text-xl shadow-xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/60"
      >
        {flipped ? currentCard.back : currentCard.front}
      </motion.button>
      <p className="text-sm text-slate-600 dark:text-slate-300">Hint: {currentCard.hint}</p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setFlipped(false);
            setIndex((prev) => (prev + cards.length - 1) % cards.length);
          }}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white dark:bg-slate-100 dark:text-slate-900"
        >
          Swipe Left
        </button>
        <button
          onClick={() => {
            setFlipped(false);
            setIndex((prev) => (prev + 1) % cards.length);
          }}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white"
        >
          Swipe Right
        </button>
        <button
          onClick={() =>
            setBookmarked((prev) => (isFavourite ? prev.filter((i) => i !== index) : [...prev, index]))
          }
          className="rounded-full border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
        >
          {isFavourite ? "Remove favourite" : "Add favourite"}
        </button>
      </div>
    </div>
  );
}

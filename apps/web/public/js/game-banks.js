(function () {
  function G() {
    if (!window.MathoraGenerator) {
      throw new Error("Question engine failed to load. Hard-refresh the page (Cmd+Shift+R).");
    }
    return window.MathoraGenerator;
  }
  const QUESTIONS_PER_SESSION = 30;
  const FLASHCARDS_PER_LEVEL = 50;

  const GENERATOR_MODES = new Set([
    "timed-quizzes",
    "speed",
    "survival",
    "multiplayer",
    "puzzle",
    "boss",
    "daily",
    "flashcards",
    "match",
    "memory",
    "ai",
  ]);

  window.MathoraBanks = {
    levels: [
      { id: "easy", label: "Level 1 — Easy", desc: "Year 7 foundations" },
      { id: "medium", label: "Level 2 — Medium", desc: "Year 8 standard" },
      { id: "hard", label: "Level 3 — Hard", desc: "Year 9 challenge" },
      { id: "advanced", label: "Level 4 — Advanced", desc: "GCSE Year 10/11" },
    ],

    QUESTIONS_PER_SESSION,
    FLASHCARDS_PER_LEVEL,

    getStaticPool() {
      return [];
    },

    drawNumeric(level, excludeKeys, mode) {
      return G().uniquePrompt(level, excludeKeys, mode || "numeric");
    },

    drawFlashcard(level, excludeKeys) {
      return G().toFlashcard(level, excludeKeys);
    },

    drawMatch(level, excludeKeys) {
      return G().toMatch(level, excludeKeys);
    },

    drawDrag(level) {
      return G().toDrag(level);
    },

    memoryPairs(level, pairCount = 8) {
      return G().memoryPairs(level, pairCount);
    },

    drawMemory(level, pairCount = 10) {
      const pairs = this.memoryPairs(level, pairCount);
      return G().shuffle(pairs.flatMap((p) => p.labels.map((label) => ({ pairId: p.id, label }))));
    },

    drawAi(level, excludeKeys) {
      return G().uniquePrompt(level, excludeKeys, "ai");
    },

    usesGenerator(mode) {
      return GENERATOR_MODES.has(mode);
    },

    xpForLevel(level, correct) {
      const base = { easy: 6, medium: 10, hard: 15, advanced: 22 }[level] ?? 8;
      return correct ? base : 0;
    },

    coinsForLevel(level, correct) {
      const base = { easy: 2, medium: 4, hard: 6, advanced: 9 }[level] ?? 3;
      return correct ? base : 0;
    },

    shuffle: (...args) => G().shuffle(...args),
    pick: (...args) => G().pick(...args),
    randInt: (...args) => G().randInt(...args),
  };
})();

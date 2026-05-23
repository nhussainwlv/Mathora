window.MathoraProgress = {
  solvedKeys: new Set(),
  profile: null,
  loaded: false,

  questionKey(gameMode, level, prompt) {
    const raw = `${gameMode}:${level}:${prompt}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i += 1) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `${gameMode}:${level}:${Math.abs(hash).toString(36)}`;
  },

  levelToApi(level) {
    return { easy: "EASY", medium: "MEDIUM", hard: "HARD", advanced: "ADVANCED" }[level] ?? "EASY";
  },

  isSignedIn() {
    return Boolean(window.MathoraSession?.accessToken);
  },

  async load() {
    if (!this.isSignedIn()) {
      this.solvedKeys = new Set();
      this.profile = null;
      this.loaded = true;
      return;
    }
    try {
      const data = await apiFetch("/games/progress");
      this.solvedKeys = new Set(data.solvedKeys ?? []);
      this.profile = data.profile;
      this.loaded = true;
      document.dispatchEvent(new CustomEvent("mathora:progress-ready"));
    } catch {
      this.loaded = true;
    }
  },

  async recordAttempt(payload) {
    if (!this.isSignedIn()) return null;
    try {
      const result = await apiFetch("/games/attempt", {
        method: "POST",
        body: JSON.stringify({
          gameMode: payload.gameMode,
          level: this.levelToApi(payload.level),
          questionKey: payload.questionKey,
          prompt: payload.prompt,
          userAnswer: payload.userAnswer,
          correctAnswer: payload.correctAnswer,
          isCorrect: payload.isCorrect,
          xpEarned: payload.xpEarned ?? 0,
          coinsEarned: payload.coinsEarned ?? 0,
        }),
      });
      this.solvedKeys.add(payload.questionKey);
      if (result.profile) this.profile = result.profile;
      document.dispatchEvent(new CustomEvent("mathora:progress-updated"));
      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
};

type ProgressRow = {
  masteryPct: number;
  attemptsCount: number;
  completed: boolean;
  skill: {
    id: string;
    name: string;
    topic: string;
    difficulty: string;
  };
};

export function getRecommendationsForUser(progressRows: ProgressRow[]) {
  const weakSkills = progressRows
    .filter((row) => row.masteryPct < 65 || row.attemptsCount < 3)
    .sort((a, b) => a.masteryPct - b.masteryPct)
    .slice(0, 5)
    .map((row) => ({
      skillId: row.skill.id,
      skillName: row.skill.name,
      reason: row.masteryPct < 65 ? "Low mastery" : "Needs more practice attempts",
      suggestedMode: row.masteryPct < 40 ? "Flashcards" : "Timed quiz",
    }));

  const nextUnlocks = progressRows
    .filter((row) => !row.completed && row.masteryPct >= 65)
    .slice(0, 3)
    .map((row) => ({
      skillId: row.skill.id,
      skillName: row.skill.name,
      reason: "Ready to unlock advanced content",
    }));

  return {
    weakSkills,
    nextUnlocks,
    revisionPlan: [
      "10 minutes flashcards",
      "15 minutes timed quizzes",
      "5 minutes boss-level challenge",
    ],
  };
}

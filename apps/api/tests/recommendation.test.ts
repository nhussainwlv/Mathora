import test from "node:test";
import assert from "node:assert/strict";
import { getRecommendationsForUser } from "../src/modules/learning/recommendation.service.ts";

test("recommendation service prioritizes weak skills", () => {
  const result = getRecommendationsForUser([
    {
      masteryPct: 30,
      attemptsCount: 2,
      completed: false,
      skill: { id: "1", name: "Fractions", topic: "Fractions", difficulty: "BEGINNER" },
    },
    {
      masteryPct: 90,
      attemptsCount: 10,
      completed: true,
      skill: { id: "2", name: "Algebra", topic: "Algebra", difficulty: "ADVANCED" },
    },
  ]);

  assert.equal(result.weakSkills.length, 1);
  assert.equal(result.weakSkills[0].skillName, "Fractions");
});

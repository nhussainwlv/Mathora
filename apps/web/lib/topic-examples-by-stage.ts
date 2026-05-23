import { topicEnrichment } from "./topic-enrichment.ts";
import { topicDetails } from "./topic-details.ts";
import type { StageKey } from "./topic-details.ts";

const STAGES: StageKey[] = ["KS1", "KS2", "KS3", "KS4"];

/** Curated 4th and 5th examples per stage (adds to 3 in topic-enrichment → 5 total). */
const extraByTopic: Record<string, Partial<Record<StageKey, string[]>>> = {
  "ks4-trigonometry": {
    KS1: ["Compare two ramps: steeper ramp has a larger angle to the ground.", "Quarter turn = 90° — four quarter turns make a full turn."],
    KS2: ["Ladder 5 m long reaches 4 m up a wall — sketch the right triangle.", "From a point 20 m from a tree, the angle of elevation to the top is 35°."],
    KS3: ["Triangle with sides 7 cm, 9 cm and included angle 40° — use area formula ½ab sin C.", "Find length using cosine rule when two sides and angle between are known."],
    KS4: ["Solve 2cos θ = 1 for 0° ≤ θ ≤ 360°.", "Sketch y = sin x for 0° ≤ x ≤ 360° and mark maximum/minimum."],
  },
};

function unique(items: string[]): string[] {
  const seen = new Set<string>();
  return items.filter((x) => {
    const k = x.trim();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function fallbackExtras(stage: StageKey, topicId: string, title: string): string[] {
  const slug = topicId.replace(/^ks[1-4]-/, "").replace(/-/g, " ");
  return [
    `${stage}: apply ${title} to a short word problem — show each step.`,
    `${stage}: create one exam-style question on ${slug} and solve it.`,
  ];
}

function buildForTopic(topicId: string, nativeStage: StageKey, title: string): Record<StageKey, string[]> {
  const fromEnrichment = topicEnrichment[topicId]?.examplesByStage;
  const nativeWorked = topicDetails[topicId]?.workedExamples ?? [];
  const extras = extraByTopic[topicId] ?? {};
  const out = {} as Record<StageKey, string[]>;

  for (const stage of STAGES) {
    const base = [...(fromEnrichment?.[stage] ?? [])];
    if (stage === nativeStage) {
      base.push(...nativeWorked);
    }
    const more = extras[stage] ?? fallbackExtras(stage, topicId, title);
    out[stage] = unique([...base, ...more]).slice(0, 5);
    while (out[stage].length < 5) {
      out[stage].push(`${stage} practice ${out[stage].length + 1}: revise ${title} with new numbers.`);
    }
  }
  return out;
}

/** Five worked examples per key stage for every curriculum topic. */
export function getExamplesByStage(
  topicId: string,
  nativeStage: StageKey,
  title: string,
): Record<StageKey, string[]> {
  return buildForTopic(topicId, nativeStage, title);
}

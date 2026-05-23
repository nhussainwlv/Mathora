import { solveWithBuiltin } from "./builtin-math-solver.js";

export type ChatMessage = { role: "user" | "assistant"; content: string };

function helpReply(): string {
  return `I can solve this step by step — no account or API key needed.

Paste the full question. Examples:
• "x2 + 5x + 6 = 0" (x² works too)
• "(2x - 2)(3x - 2) = 100"
• "Solve 3x + 5 = 20"
• "2x + y = 23, x - y = 1"
• "15% of 80" · "sin 30" · "mean of 4, 8, 10"

Type the equation exactly as in your homework.`;
}

export async function generateMathChatReply(
  _history: ChatMessage[],
  question: string,
): Promise<{ reply: string; provider: "builtin" }> {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      reply: "Type a maths question and I will solve it with full working.",
      provider: "builtin",
    };
  }

  const builtin = solveWithBuiltin(trimmed);
  return { reply: builtin ?? helpReply(), provider: "builtin" };
}

import { z } from "zod";
import { generateMathChatReply } from "../src/modules/ai/math-chat.service.ts";

const schema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      }),
    )
    .max(12)
    .optional()
    .default([]),
});

const body = { message: "solve 3x=20", history: [] };
const parsed = schema.safeParse(body);
console.log("zod ok", parsed.success);

for (const q of ["solve 3x=20", "solve 3x + 5 = 20", "what is 12*8"]) {
  const r = await generateMathChatReply([], q);
  console.log("\n", q);
  console.log(r.reply);
}

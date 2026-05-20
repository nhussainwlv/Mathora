import { Router } from "express";
import { z } from "zod";

const aiRouter = Router();

// This abstraction keeps AI features swappable without leaking provider details.
function generateHint(topic: string, prompt: string) {
  return `Hint for ${topic}: break the problem into smaller steps, then check each operation. Prompt: ${prompt}`;
}

function generatePracticeVariant(prompt: string) {
  return `${prompt} (Try a variant with different numbers and explain your method.)`;
}

aiRouter.post("/hint", (req, res) => {
  const schema = z.object({
    topic: z.string(),
    prompt: z.string(),
  });
  const payload = schema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "Invalid hint request" });
  }
  return res.json({ hint: generateHint(payload.data.topic, payload.data.prompt) });
});

aiRouter.post("/practice", (req, res) => {
  const schema = z.object({
    prompt: z.string(),
  });
  const payload = schema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: "Invalid practice generation request" });
  }
  return res.json({ practiceQuestion: generatePracticeVariant(payload.data.prompt) });
});

export { aiRouter };

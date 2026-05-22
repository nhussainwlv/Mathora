import { curriculumSources, topicsByStage } from "../lib/ks-curriculum.ts";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, "..", "public", "js");
fs.mkdirSync(outDir, { recursive: true });

const content =
  `export const curriculumSources = ${JSON.stringify(curriculumSources, null, 2)};\n\n` +
  `export const topicsByStage = ${JSON.stringify(topicsByStage, null, 2)};\n`;

fs.writeFileSync(path.join(outDir, "curriculum.js"), content);
console.log("Generated public/js/curriculum.js");

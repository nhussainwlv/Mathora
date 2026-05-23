/**
 * Procedural UK maths questions — unique prompts per parameters (no fixed repeats).
 */
(function () {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const HINT_STEPS = {
    easy: (h) => h,
    medium: (h, steps) => (steps.length ? `${h} Steps: ${steps.join(" → ")}.` : h),
    hard: (h, steps) =>
      `Detailed approach: ${h}${steps.length ? ` Work through: ${steps.join(" → ")}.` : ""} Check each step before continuing.`,
    advanced: (h, steps) =>
      `GCSE method: ${h}${steps.length ? ` Full working: ${steps.join(" → ")}.` : ""} Line up your algebra, then substitute your answer back to verify.`,
  };

  function hintFor(level, base, steps = []) {
    const fn = HINT_STEPS[level] ?? HINT_STEPS.medium;
    return fn(base, steps);
  }

  function wrap(level, item) {
    return {
      ...item,
      hint: hintFor(level, item.hint, item.steps || []),
    };
  }

  function genEasy() {
    const type = pick(["add", "sub", "mul", "div", "frac", "order"]);
    if (type === "add") {
      const a = randInt(12, 89);
      const b = randInt(8, 76);
      return wrap("easy", {
        prompt: `${a} + ${b} = ?`,
        answer: String(a + b),
        hint: "Line up ones and tens, add column by column.",
        steps: [`Add ones: ${(a % 10) + (b % 10)}`, `Add tens`, `Combine`],
        explanation: `${a} + ${b} = ${a + b}`,
      });
    }
    if (type === "sub") {
      const a = randInt(40, 99);
      const b = randInt(5, a - 1);
      return wrap("easy", {
        prompt: `${a} − ${b} = ?`,
        answer: String(a - b),
        hint: "Subtract ones then tens; borrow if needed.",
        explanation: `${a} − ${b} = ${a - b}`,
      });
    }
    if (type === "mul") {
      const a = randInt(3, 12);
      const b = randInt(3, 12);
      return wrap("easy", {
        prompt: `${a} × ${b} = ?`,
        answer: String(a * b),
        hint: "Use times tables or partition one number.",
        explanation: `${a} × ${b} = ${a * b}`,
      });
    }
    if (type === "div") {
      const b = randInt(3, 12);
      const ans = randInt(3, 12);
      const a = b * ans;
      return wrap("easy", {
        prompt: `${a} ÷ ${b} = ?`,
        answer: String(ans),
        hint: "Think: what times the divisor gives the dividend?",
        explanation: `${a} ÷ ${b} = ${ans}`,
      });
    }
    if (type === "frac") {
      const n = randInt(1, 5);
      const d = randInt(n + 1, 9);
      const g = gcd(n, d);
      return wrap("easy", {
        prompt: `Write ${n}/${d} in simplest form (e.g. 2/3)`,
        answer: `${n / g}/${d / g}`,
        hint: "Find the HCF of numerator and denominator, then divide both.",
        explanation: `${n}/${d} = ${n / g}/${d / g}`,
      });
    }
    const a = randInt(2, 8);
    const b = randInt(2, 6);
    const c = randInt(1, 5);
    return wrap("easy", {
      prompt: `${a} + ${b} × ${c} = ? (order of operations)`,
      answer: String(a + b * c),
      hint: "Multiply before adding (BIDMAS).",
      steps: [`First ${b} × ${c} = ${b * c}`, `Then add ${a}`],
      explanation: `${a} + ${b * c} = ${a + b * c}`,
    });
  }

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  function genMedium() {
    const type = pick(["linear", "percent", "ratio", "expand", "sequence"]);
    if (type === "linear") {
      const x = randInt(3, 15);
      const a = randInt(2, 7);
      const b = randInt(2, 18);
      const c = a * x + b;
      return wrap("medium", {
        prompt: `Solve: ${a}x + ${b} = ${c}`,
        answer: String(x),
        hint: `Isolate x: subtract ${b}, then divide by ${a}.`,
        steps: [`${a}x = ${c - b}`, `x = ${c - b} ÷ ${a}`],
        explanation: `x = ${x}`,
      });
    }
    if (type === "percent") {
      const p = pick([12, 15, 20, 25, 30, 35]);
      const n = randInt(60, 500);
      const ans = Math.round((n * p) / 100);
      return wrap("medium", {
        prompt: `${p}% of ${n} = ?`,
        answer: String(ans),
        hint: `Find 10% of ${n} (${n / 10}), then build ${p}%.`,
        steps: [`10% = ${n / 10}`, `Scale to ${p}%`],
        explanation: `${p}% of ${n} = ${ans}`,
      });
    }
    if (type === "ratio") {
      const total = randInt(36, 180);
      const r1 = randInt(2, 5);
      const r2 = randInt(2, 7);
      const parts = r1 + r2;
      const larger = Math.round((total / parts) * Math.max(r1, r2));
      return wrap("medium", {
        prompt: `Share ${total} in ratio ${r1}:${r2}. Larger share?`,
        answer: String(larger),
        hint: `Total parts = ${parts}. One part = ${total} ÷ ${parts}.`,
        explanation: `Larger share = ${larger}`,
      });
    }
    if (type === "expand") {
      const a = randInt(2, 5);
      const b = randInt(2, 9);
      return wrap("medium", {
        prompt: `Expand: ${a}(x + ${b})`,
        answer: `${a}x + ${a * b}`,
        hint: "Multiply the outside number by each term in the bracket.",
        explanation: `${a} × x + ${a} × ${b} = ${a}x + ${a * b}`,
      });
    }
    const n = randInt(1, 8);
    const start = randInt(2, 9);
    const diff = randInt(2, 6);
    const term = start + (n - 1) * diff;
    return wrap("medium", {
      prompt: `nth term: start ${start}, +${diff} each time. Term ${n}?`,
      answer: String(term),
      hint: "Use start + (n − 1) × difference.",
      explanation: `Term ${n} = ${term}`,
    });
  }

  function genHard() {
    const type = pick(["linear2", "quadratic", "standard", "simultaneous", "area"]);
    if (type === "linear2") {
      const x = randInt(3, 11);
      const lhsCo = randInt(4, 7);
      const rhsCo = randInt(1, lhsCo - 1);
      const k = randInt(2, 14);
      const m = lhsCo * x - k - rhsCo * x;
      return wrap("hard", {
        prompt: `Solve: ${lhsCo}x − ${k} = ${rhsCo}x + ${m}`,
        answer: String(x),
        hint: "Collect x terms on one side and numbers on the other.",
        steps: ["Subtract smaller x term from both sides", "Add or subtract constants", "Divide by coefficient of x"],
        explanation: `x = ${x}`,
      });
    }
    if (type === "quadratic") {
      const r1 = randInt(2, 5);
      const r2 = r1 + randInt(1, 4);
      const sum = r1 + r2;
      const prod = r1 * r2;
      return wrap("hard", {
        prompt: `Solve x² − ${sum}x + ${prod} = 0 (smaller positive root)`,
        answer: String(Math.min(r1, r2)),
        hint: "Factorise: find two numbers that multiply to the constant and add to the coefficient of x.",
        steps: [`Factors of ${prod} that add to ${sum}`, `Set each bracket to zero`],
        explanation: `x = ${r1} or x = ${r2}; smaller is ${Math.min(r1, r2)}`,
      });
    }
    if (type === "simultaneous") {
      const x = randInt(3, 8);
      const y = randInt(2, 7);
      return wrap("hard", {
        prompt: `x + y = ${x + y}, 2x − y = ${2 * x - y}. Find x`,
        answer: String(x),
        hint: "Add the equations to eliminate y, or substitute x = ... from the first.",
        steps: ["Label equations", "Eliminate one variable", "Back-substitute"],
        explanation: `x = ${x}, y = ${y}`,
      });
    }
    if (type === "area") {
      const b = randInt(8, 16);
      const h = randInt(4, 12);
      return wrap("hard", {
        prompt: `Triangle: base ${b} cm, height ${h} cm. Area (cm²)?`,
        answer: String((b * h) / 2),
        hint: "Area of triangle = ½ × base × height.",
        explanation: `½ × ${b} × ${h} = ${(b * h) / 2} cm²`,
      });
    }
    const n = pick([3200000, 8400, 0.0072, 45000]);
    const exp = Math.floor(Math.log10(n));
    const mantissa = n / 10 ** exp;
    return wrap("hard", {
      prompt: `Write ${n} in standard form (a × 10ⁿ)`,
      answer: `${mantissa} × 10^${exp}`,
      alt: [`${mantissa}e${exp}`],
      hint: "Move the decimal point so there is one digit before it; count how many places you moved.",
      steps: ["Identify a between 1 and 10", "Count power of 10"],
      explanation: `${mantissa} × 10^${exp}`,
    });
  }

  function genAdvanced() {
    const type = pick(["quadratic", "trig", "simultaneous", "algebraic", "probability"]);
    if (type === "quadratic") {
      const r1 = randInt(2, 7);
      const r2 = r1 + randInt(1, 5);
      return wrap("advanced", {
        prompt: `Solve (x−${r1})(x−${r2})=0. Smaller root?`,
        answer: String(Math.min(r1, r2)),
        hint: "Zero product property: if AB = 0 then A = 0 or B = 0. Each factor gives a root.",
        steps: [`x − ${r1} = 0 → x = ${r1}`, `x − ${r2} = 0 → x = ${r2}`, "Pick the smaller value"],
        explanation: `Roots: ${r1} and ${r2}; smaller is ${Math.min(r1, r2)}`,
      });
    }
    if (type === "trig") {
      const qs = [
        {
          prompt: "sin 30° (exact value)",
          answer: "0.5",
          alt: ["1/2", "½"],
          hint: "Learn exact values: sin 30° = ½. On a calculator this is 0.5.",
          steps: ["Draw or recall exact triangle", "Opposite ÷ hypotenuse"],
          explanation: "sin 30° = 1/2",
        },
        {
          prompt: "cos 60° (exact value)",
          answer: "0.5",
          alt: ["1/2"],
          hint: "cos 60° = sin 30° = ½. Adjacent ÷ hypotenuse on a 30-60-90 triangle.",
          explanation: "cos 60° = 1/2",
        },
        {
          prompt: "sin 45° (decimal to 3 d.p.)",
          answer: "0.707",
          alt: ["√2/2"],
          hint: "sin 45° = √2/2. Square root of 2 divided by 2.",
          explanation: "≈ 0.707",
        },
      ];
      return wrap("advanced", pick(qs));
    }
    if (type === "simultaneous") {
      const x = randInt(3, 9);
      const y = randInt(2, 8);
      const a1 = 2;
      const b1 = 1;
      const c1 = a1 * x + b1 * y;
      const a2 = 1;
      const b2 = -1;
      const c2 = a2 * x + b2 * y;
      return wrap("advanced", {
        prompt: `${a1}x + ${b1}y = ${c1}, ${a2}x ${b2 >= 0 ? "+" : "−"} ${Math.abs(b2)}y = ${c2}. Find x`,
        answer: String(x),
        hint: "Match coefficients to eliminate x or y. Add or subtract equations carefully.",
        steps: ["Multiply if needed to align", "Eliminate one variable", "Substitute back"],
        explanation: `x = ${x}, y = ${y}`,
      });
    }
    if (type === "probability") {
      return wrap("advanced", {
        prompt: "P(two hearts in a row) drawing from 52 cards with replacement?",
        answer: "1/16",
        alt: ["0.0625"],
        hint: "With replacement each draw is independent: P(heart) = 13/52 = 1/4.",
        steps: ["P(first heart) = 1/4", "P(second heart) = 1/4", "Multiply: 1/4 × 1/4"],
        explanation: "(1/4)² = 1/16",
      });
    }
    const r1 = randInt(2, 6);
    const r2 = r1 + randInt(1, 4);
    return wrap("advanced", {
      prompt: `Solve x² − ${r1 + r2}x + ${r1 * r2} = 0 (smaller positive root)`,
      answer: String(Math.min(r1, r2)),
      hint: "Factorise into (x − a)(x − b). Use zero product property for each factor.",
      steps: [`(x − ${r1})(x − ${r2}) = 0`, `x = ${r1} or x = ${r2}`],
      explanation: `Smaller root is ${Math.min(r1, r2)}`,
    });
  }

  function generate(level) {
    if (level === "easy") return genEasy();
    if (level === "medium") return genMedium();
    if (level === "hard") return genHard();
    return genAdvanced();
  }

  function uniquePrompt(level, excludeKeys, mode, maxAttempts = 48) {
    for (let i = 0; i < maxAttempts; i += 1) {
      const q = generate(level);
      const key =
        typeof window.MathoraProgress?.questionKey === "function"
          ? window.MathoraProgress.questionKey(mode || "generated", level, q.prompt)
          : `${mode}-${level}-${q.prompt}`;
      if (!excludeKeys.has(key)) {
        return { ...q, questionKey: key };
      }
    }
    const q = generate(level);
    const salt = `${Date.now()}-${randInt(1, 99999)}`;
    const prompt = `${q.prompt} [#${salt.slice(-4)}]`;
    const key =
      typeof window.MathoraProgress?.questionKey === "function"
        ? window.MathoraProgress.questionKey(mode || "generated", level, prompt)
        : prompt;
    return { ...q, prompt, questionKey: key };
  }

  function toFlashcard(level, excludeKeys) {
    const q = uniquePrompt(level, excludeKeys, "flashcards");
    return {
      id: `fc-${level}-${q.questionKey.replace(/[^a-z0-9]/gi, "").slice(0, 24)}`,
      front: q.prompt.replace(/\s\[#\d+\]$/, ""),
      back: String(q.answer),
      hint: q.hint,
      explanation: q.explanation,
      level,
      questionKey: q.questionKey,
    };
  }

  function toMatch(level, excludeKeys) {
    const q = uniquePrompt(level, excludeKeys, "match");
    const wrong = [
      String(Number(q.answer) + randInt(1, 5)),
      String(Number(q.answer) - randInt(2, 6)),
      String(Number(q.answer) + randInt(6, 12)),
    ].filter((w) => w !== String(q.answer) && !Number.isNaN(Number(w)));
    while (wrong.length < 3) wrong.push(String(randInt(1, 99)));
    const options = shuffle([String(q.answer), ...wrong.slice(0, 3)]);
    return {
      prompt: q.prompt.replace(/\s\[#\d+\]$/, ""),
      options,
      answer: options.indexOf(String(q.answer)),
      hint: q.hint,
      explanation: q.explanation,
      questionKey: q.questionKey,
    };
  }

  function toDrag(level) {
    const x = randInt(2, 9);
    const a = level === "easy" ? 1 : randInt(2, 4);
    const b = randInt(2, level === "advanced" ? 12 : 9);
    const c = a === 1 ? x + b : a * x + b;
    const tiles =
      a === 1
        ? ["x", "+", String(b), "=", String(c)]
        : [String(a), "x", "+", String(b), "=", String(c)];
    const label = a === 1 ? `Build: x + ${b} = ${c}` : `Build: ${a}x + ${b} = ${c}`;
    return wrap(level, {
      label,
      tiles,
      hint:
        level === "advanced"
          ? "Place tiles left to right exactly as the equation reads. Include every symbol."
          : "Start with the x term, then +, numbers, =, and the result.",
      explanation: `x = ${x}`,
    });
  }

  function memoryPairs(level, count = 8) {
    const pairs = [];
    const used = new Set();
    while (pairs.length < count) {
      const q = generate(level);
      const id = `mem-${level}-${pairs.length}-${q.prompt.slice(0, 12)}`;
      if (used.has(q.prompt)) continue;
      used.add(q.prompt);
      pairs.push({
        id,
        labels: [q.prompt.slice(0, 28), String(q.answer)],
      });
    }
    return pairs;
  }

  function buildFlashcardDeck(level, count = 50) {
    const deck = [];
    const used = new Set();
    let guard = 0;
    while (deck.length < count && guard < count * 30) {
      guard += 1;
      const card = toFlashcard(level, used);
      if (used.has(card.id)) continue;
      used.add(card.id);
      used.add(card.questionKey);
      deck.push(card);
    }
    return deck;
  }

  window.MathoraGenerator = {
    generate,
    uniquePrompt,
    toFlashcard,
    toMatch,
    toDrag,
    memoryPairs,
    buildFlashcardDeck,
    hintFor,
    shuffle,
    pick,
    randInt,
    QUESTIONS_PER_SESSION: 30,
    FLASHCARDS_PER_LEVEL: 50,
  };
})();

/** Year 8–9 (KS3) maths content for mini-games */
window.MathoraQuestions = {
  flashcards: [
    {
      prompt: "Expand: 3(x + 4)",
      answer: "3x + 12",
      hint: "Multiply 3 by each term inside the bracket.",
      explanation: "3 × x + 3 × 4 = 3x + 12",
    },
    {
      prompt: "Solve: 5x − 11 = 24",
      answer: "7",
      hint: "Add 11 to both sides, then divide by 5.",
      explanation: "5x = 35, so x = 7",
    },
    {
      prompt: "Find 15% of 240",
      answer: "36",
      hint: "Find 10% (24), then half of that for 5%.",
      explanation: "10% = 24, 5% = 12, so 15% = 36",
    },
    {
      prompt: "Simplify: 2x + 5x − 3",
      answer: "7x − 3",
      hint: "Collect like terms with x.",
      explanation: "2x + 5x = 7x, constant is −3",
    },
    {
      prompt: "Ratio 2:3 — total 30. Larger share?",
      answer: "18",
      hint: "2 + 3 = 5 parts. One part = 30 ÷ 5.",
      explanation: "5 parts → 6 each. Larger = 3 × 6 = 18",
    },
    {
      prompt: "Calculate: 4³",
      answer: "64",
      hint: "4 × 4 × 4",
      explanation: "4³ = 64",
    },
    {
      prompt: "Factorise: x² + 7x + 12",
      answer: "(x + 3)(x + 4)",
      hint: "Find two numbers that multiply to 12 and add to 7.",
      explanation: "3 and 4 work: (x + 3)(x + 4)",
    },
    {
      prompt: "Triangles: angles 52° and 71°. Third angle?",
      answer: "57",
      hint: "Angles in a triangle sum to 180°.",
      explanation: "180 − 52 − 71 = 57°",
    },
    {
      prompt: "Rearrange: y = 2x + 1. Find x when y = 15",
      answer: "7",
      hint: "Substitute y = 15 and solve for x.",
      explanation: "15 = 2x + 1 → 2x = 14 → x = 7",
    },
    {
      prompt: "Write 0.0045 in standard form",
      answer: "4.5 × 10⁻³",
      alt: ["4.5e-3", "4.5 x 10^-3", "4.5×10^-3"],
      hint: "Move the decimal so one non-zero digit is before the point.",
      explanation: "0.0045 = 4.5 × 10⁻³",
    },
  ],

  numeric: [
    { prompt: "Solve: 4x + 6 = 34", answer: 7, hint: "Subtract 6, then divide by 4.", explanation: "4x = 28, x = 7" },
    { prompt: "Solve: 7x − 5 = 37", answer: 6, hint: "Add 5, then divide by 7.", explanation: "7x = 42, x = 6" },
    { prompt: "Solve: 3(x − 2) = 18", answer: 8, hint: "Divide by 3 first, or expand brackets.", explanation: "x − 2 = 6, x = 8" },
    { prompt: "What is 12.5% of 80?", answer: 10, hint: "10% is 8; 2.5% is a quarter of that.", explanation: "10% = 8, 2.5% = 2, total 10" },
    { prompt: "Increase 60 by 20%", answer: 72, hint: "20% of 60 is 12.", explanation: "60 + 12 = 72" },
    { prompt: "√144", answer: 12, hint: "Which number squared gives 144?", explanation: "12² = 144" },
    { prompt: "2⁶", answer: 64, hint: "Double repeatedly six times from 1.", explanation: "2⁶ = 64" },
    { prompt: "Find x: 2x + 1 = 5x − 8", answer: 3, hint: "Collect x terms on one side.", explanation: "9 = 3x, x = 3" },
    { prompt: "Gradient: line through (0,2) and (4,10)?", answer: 2, hint: "Change in y ÷ change in x.", explanation: "(10−2)/(4−0) = 2" },
    { prompt: "Area of triangle base 14 cm, height 6 cm", answer: 42, hint: "Use ½ × base × height.", explanation: "½ × 14 × 6 = 42" },
    { prompt: "Solve: x/4 + 3 = 8", answer: 20, hint: "Subtract 3, then multiply by 4.", explanation: "x/4 = 5, x = 20" },
    { prompt: "3.2 × 10⁴", answer: 32000, hint: "Move the decimal four places right.", explanation: "3.2 × 10⁴ = 32 000" },
    { prompt: "Share £84 in ratio 3:4. Larger share (£)", answer: 48, hint: "7 parts total.", explanation: "84 ÷ 7 × 4 = 48" },
    { prompt: "Exterior angle of regular hexagon (°)", answer: 60, hint: "360° ÷ number of sides.", explanation: "360 ÷ 6 = 60°" },
    { prompt: "Solve: 5 − 2x = 17", answer: -6, hint: "Rearrange carefully with negatives.", explanation: "−2x = 12, x = −6" },
    { prompt: "Factor of 48 and 18 (HCF)", answer: 6, hint: "Highest number dividing both.", explanation: "HCF(48, 18) = 6" },
    { prompt: "Term 10 of sequence 3n + 1", answer: 31, hint: "Substitute n = 10.", explanation: "3(10) + 1 = 31" },
    { prompt: "Circle radius 7 cm. Diameter (cm)", answer: 14, hint: "Diameter is twice the radius.", explanation: "d = 2r = 14" },
    { prompt: "Solve: |2x − 1| = 9 (positive solution)", answer: 5, hint: "2x − 1 = 9 or 2x − 1 = −9", explanation: "2x = 10, x = 5" },
    { prompt: "Convert 2⅓ to improper fraction (numerator if denominator 3)", answer: 7, hint: "2 × 3 + 1", explanation: "7/3" },
  ],

  matchChoice: [
    {
      prompt: "Which is equivalent to 3/5?",
      options: ["0.35", "0.6", "0.53", "1.5"],
      answer: 1,
      hint: "Divide 3 by 5.",
      explanation: "3 ÷ 5 = 0.6",
    },
    {
      prompt: "Gradient of y = −2x + 5",
      options: ["5", "−2", "2", "−5"],
      answer: 1,
      hint: "In y = mx + c, m is the gradient.",
      explanation: "m = −2",
    },
    {
      prompt: "Solve: x² = 49 (positive x)",
      options: ["6", "7", "8", "24.5"],
      answer: 1,
      hint: "Which number squared is 49?",
      explanation: "x = 7",
    },
    {
      prompt: "Best factorisation of x² − 9",
      options: ["(x − 3)²", "(x + 3)(x − 3)", "x(x − 9)", "(x − 9)(x + 1)"],
      answer: 1,
      hint: "Difference of two squares.",
      explanation: "x² − 9 = (x + 3)(x − 3)",
    },
    {
      prompt: "Mean of 4, 7, 11, 14",
      options: ["8", "9", "10", "11"],
      answer: 1,
      hint: "Add all values and divide by 4.",
      explanation: "36 ÷ 4 = 9",
    },
    {
      prompt: "Probability: fair die, P(odd number)",
      options: ["1/6", "1/3", "1/2", "2/3"],
      answer: 2,
      hint: "Odd faces: 1, 3, 5",
      explanation: "3/6 = 1/2",
    },
    {
      prompt: "Which line is parallel to y = 4x + 1?",
      options: ["y = −4x + 2", "y = 4x − 3", "y = ¼x + 1", "y = x + 4"],
      answer: 1,
      hint: "Parallel lines have the same gradient.",
      explanation: "Same gradient 4",
    },
    {
      prompt: "Volume of cuboid 5 × 6 × 4 cm³",
      options: ["60", "120", "150", "240"],
      answer: 1,
      hint: "Multiply length × width × height.",
      explanation: "5 × 6 × 4 = 120 cm³",
    },
    {
      prompt: "Solve: 3x + 8 = 29",
      options: ["5", "6", "7", "9"],
      answer: 2,
      hint: "Subtract 8, divide by 3.",
      explanation: "3x = 21, x = 7",
    },
    {
      prompt: "Scientific notation: 7.1 × 10²",
      options: ["71", "710", "7100", "0.71"],
      answer: 1,
      hint: "Move decimal two places right.",
      explanation: "7.1 × 10² = 710",
    },
    {
      prompt: "Alternate angle to 65°",
      options: ["25°", "65°", "115°", "125°"],
      answer: 1,
      hint: "Alternate angles are equal on parallel lines.",
      explanation: "Alternate angles match: 65°",
    },
  ],

  dragEquations: [
    {
      label: "Build: 3x + 4 = 19",
      tiles: ["3", "x", "+", "4", "=", "19"],
      hint: "Start with the variable term, then constant, then equals value.",
      explanation: "3x + 4 = 19 → x = 5",
    },
    {
      label: "Build: 5x − 2 = 18",
      tiles: ["5", "x", "−", "2", "=", "18"],
      hint: "Watch the minus between 5x and 2.",
      explanation: "5x − 2 = 18 → x = 4",
    },
    {
      label: "Build: 2x + 7 = 3x − 1",
      tiles: ["2", "x", "+", "7", "=", "3", "x", "−", "1"],
      hint: "Both sides have x terms.",
      explanation: "Rearrange to solve x = 8",
    },
    {
      label: "Build: 4(x + 1) = 20",
      tiles: ["4", "(", "x", "+", "1", ")", "=", "20"],
      hint: "Bracket shows x + 1 is multiplied by 4.",
      explanation: "x + 1 = 5, x = 4",
    },
  ],

  memoryPairs: [
    { id: "expand", labels: ["3(x+2)", "3x+6"] },
    { id: "square", labels: ["7²", "49"] },
    { id: "root", labels: ["√81", "9"] },
    { id: "percent", labels: ["0.35", "35%"] },
    { id: "ratio", labels: ["2:5", "4:10"] },
    { id: "indices", labels: ["2³×2²", "2⁵"] },
    { id: "factor", labels: ["x²+5x+6", "(x+2)(x+3)"] },
    { id: "gradient", labels: ["y=mx+c", "c is y-intercept"] },
  ],

  aiSequence: [
    {
      prompt: "Rectangle: length (3x − 1) cm, width 5 cm. Area = 40 cm². Find x.",
      answer: "3",
      hint: "Area = length × width. Form equation 5(3x − 1) = 40.",
      explanation: "15x − 5 = 40 → 15x = 45 → x = 3",
    },
    {
      prompt: "Solve simultaneously: y = 2x and x + y = 12",
      answer: "4",
      hint: "Substitute y = 2x into the second equation.",
      explanation: "x + 2x = 12 → x = 4",
    },
    {
      prompt: "Pythagoras: legs 9 cm and 12 cm. Hypotenuse (cm)?",
      answer: "15",
      hint: "Use a² + b² = c². Try a 9-12-15 triangle.",
      explanation: "81 + 144 = 225, √225 = 15",
    },
    {
      prompt: "Write the nth term: 4, 7, 10, 13, …",
      answer: "3n+1",
      alt: ["3n + 1"],
      hint: "Common difference is 3.",
      explanation: "Sequence increases by 3 each time: 3n + 1",
    },
    {
      prompt: "Solve: 2(x − 3) + 4 = 3x",
      answer: "-2",
      hint: "Expand brackets first.",
      explanation: "2x − 6 + 4 = 3x → 2x − 2 = 3x → x = −2",
    },
  ],

  boss: [
    { prompt: "Solve: 4(2x − 1) = 28", answer: 4, hint: "Divide by 4 first.", explanation: "2x − 1 = 7 → 2x = 8 → x = 4" },
    { prompt: "Compound: £200 at 10% for 2 years (simple interest £)", answer: 40, hint: "10% of 200 each year, add both.", explanation: "£20 + £20 = £40 interest" },
    { prompt: "Interior angle of regular pentagon (°)", answer: 108, hint: "(n−2)×180÷n", explanation: "3×180÷5 = 108°" },
    { prompt: "Solve: x² − 5x + 6 = 0 (smaller root)", answer: 2, hint: "Factorise (x − 2)(x − 3).", explanation: "x = 2 or x = 3; smaller is 2" },
    { prompt: "Volume of cylinder r=3, h=10 (use πr²h, π≈3.14, round answer)", answer: 283, hint: "3.14 × 9 × 10", explanation: "≈ 282.6 → 283 cm³" },
    { prompt: "Rearrange A = ½bh for b", answer: "2a/h", alt: ["2A/h", "2A ÷ h"], hint: "Multiply by 2, divide by h.", explanation: "b = 2A/h" },
  ],

  daily: [
    { prompt: "Solve: 6x − 14 = 2x + 10", answer: 6, hint: "Collect x on one side.", explanation: "4x = 24, x = 6" },
    { prompt: "Decrease 85 by 12%", answer: 74.8, hint: "12% of 85 = 10.2", explanation: "85 − 10.2 = 74.8" },
    { prompt: "Find missing angle: parallel lines, co-interior 115°", answer: 65, hint: "Co-interior angles sum to 180°.", explanation: "180 − 115 = 65°" },
    { prompt: "Standard form: 6,300,000", answer: "6.3 × 10⁶", alt: ["6.3e6", "6.3 x 10^6"], hint: "One digit before decimal.", explanation: "6.3 × 10⁶" },
    { prompt: "Mean of grouped estimate — scores 8,10,6,9,7", answer: 8, hint: "Add and divide by 5.", explanation: "40 ÷ 5 = 8" },
  ],
};

window.MathoraGameUI = {
  shuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  pickRandom(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
  },

  normalizeText(value) {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/×/g, "x")
      .replace(/−/g, "-");
  },

  checkText(user, answer, alt = []) {
    const u = this.normalizeText(user);
    const ok = [answer, ...alt].some((a) => this.normalizeText(a) === u);
    return ok;
  },

  checkNumeric(user, answer, tolerance = 0.15) {
    const u = Number(String(user).trim().replace(/,/g, ""));
    if (Number.isNaN(u)) return false;
    return Math.abs(u - Number(answer)) <= tolerance;
  },

  feedbackHtml({ correct, userAnswer, correctAnswer, explanation, hintShown, showCorrectWhenWrongOnly }) {
    const status = correct ? "Correct!" : "Not quite.";
    const yours =
      userAnswer !== undefined && userAnswer !== ""
        ? `<p class="game-feedback__yours">Your answer: <strong>${userAnswer}</strong></p>`
        : "";
    const answerLine =
      !showCorrectWhenWrongOnly || !correct
        ? `<p class="game-feedback__answer">Correct answer: <strong>${correctAnswer}</strong></p>`
        : "";
    const hintBlock = hintShown ? `<p class="game-feedback__hint">Hint used: ${hintShown}</p>` : "";
    return `
      <p class="game-feedback__status">${status}</p>
      ${yours}
      ${answerLine}
      <p class="game-feedback__explain">${explanation}</p>
      ${hintBlock}
    `;
  },

  mountShell(body, extra = "") {
    body.innerHTML = `
      <p class="game-progress" data-progress></p>
      <p class="game-question" data-prompt></p>
      <button type="button" class="btn btn-outline btn-sm" data-hint-btn>Show hint</button>
      <p class="game-hint" data-hint-text hidden></p>
      <div data-input-area></div>
      <div class="game-feedback" data-feedback hidden></div>
      <div class="btn-row" data-actions></div>
      ${extra}
    `;
    return {
      progress: body.querySelector("[data-progress]"),
      prompt: body.querySelector("[data-prompt]"),
      hintBtn: body.querySelector("[data-hint-btn]"),
      hintText: body.querySelector("[data-hint-text]"),
      inputArea: body.querySelector("[data-input-area]"),
      feedback: body.querySelector("[data-feedback]"),
      actions: body.querySelector("[data-actions]"),
    };
  },

  mountDualBoxShell(body, extra = "") {
    body.innerHTML = `
      <p class="game-progress" data-progress></p>
      <div class="game-qa-grid">
        <div class="game-qa-box game-qa-box--question">
          <span class="game-qa-label">Question</span>
          <p class="game-qa-text" data-prompt></p>
        </div>
        <div class="game-qa-box game-qa-box--answer">
          <span class="game-qa-label">Your answer</span>
          <div data-input-area></div>
        </div>
      </div>
      <button type="button" class="btn btn-outline btn-sm" data-hint-btn>Show hint</button>
      <p class="game-hint" data-hint-text hidden></p>
      <div class="game-feedback" data-feedback hidden></div>
      <div class="btn-row" data-actions></div>
      ${extra}
    `;
    return {
      progress: body.querySelector("[data-progress]"),
      prompt: body.querySelector("[data-prompt]"),
      hintBtn: body.querySelector("[data-hint-btn]"),
      hintText: body.querySelector("[data-hint-text]"),
      inputArea: body.querySelector("[data-input-area]"),
      feedback: body.querySelector("[data-feedback]"),
      actions: body.querySelector("[data-actions]"),
    };
  },

  bindHint(ui, hint) {
    ui.hintText.hidden = true;
    ui.hintText.textContent = hint;
    ui.hintBtn.onclick = () => {
      ui.hintText.hidden = false;
    };
  },

  showFeedback(ui, payload) {
    const correct = payload.correct;
    ui.feedback.hidden = false;
    ui.feedback.className = `game-feedback ${correct ? "game-feedback--ok" : "game-feedback--bad"}`;
    ui.feedback.innerHTML = window.MathoraGameUI.feedbackHtml({
      correct,
      userAnswer: payload.userAnswer,
      correctAnswer: payload.correctAnswer,
      explanation: payload.explanation,
      hintShown: ui.hintText.hidden ? "" : ui.hintText.textContent,
      showCorrectWhenWrongOnly: payload.showCorrectWhenWrongOnly,
    });
  },

  clearFeedback(ui) {
    ui.feedback.hidden = true;
    ui.feedback.innerHTML = "";
    ui.hintText.hidden = true;
  },
};

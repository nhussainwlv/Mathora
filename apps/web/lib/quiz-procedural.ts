type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

type Raw = [prompt: string, options: string[], answerIndex: number, explanation: string];

function hash(topicId: string, n: number): number {
  let h = 2166136261;
  const s = `${topicId}:${n}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickOptions(correct: string, wrong: string[], seed: number): [string[], number] {
  const uniq = [correct, ...wrong.filter((w) => w !== correct)];
  const pool = uniq.length >= 4 ? uniq.slice(0, 4) : [...uniq, ...wrong, "0", "1", "2"].slice(0, 4);
  const options = shuffle([...new Set(pool)].slice(0, 4), seed);
  return [options, options.indexOf(correct)];
}

function num(n: number): string {
  return String(n);
}

function addRaw(a: number, b: number, seed: number): Raw {
  const sum = a + b;
  const [options, answerIndex] = pickOptions(num(sum), [num(sum - 1), num(sum + 1), num(sum + 2)], seed);
  return [`${a} + ${b} =`, options, answerIndex, `${a} plus ${b} equals ${sum}.`];
}

function subRaw(a: number, b: number, seed: number): Raw {
  const diff = a - b;
  const [options, answerIndex] = pickOptions(num(diff), [num(diff + 1), num(diff - 1), num(diff + 2)], seed);
  return [`${a} − ${b} =`, options, answerIndex, `${a} minus ${b} equals ${diff}.`];
}

function mulRaw(a: number, b: number, seed: number): Raw {
  const p = a * b;
  const [options, answerIndex] = pickOptions(num(p), [num(p + a), num(p - b), num(p + 1)], seed);
  return [`${a} × ${b} =`, options, answerIndex, `${a} times ${b} is ${p}.`];
}

function divRaw(a: number, b: number, seed: number): Raw {
  const q = a / b;
  const [options, answerIndex] = pickOptions(num(q), [num(q + 1), num(q - 1), num(q + 2)], seed);
  return [`${a} ÷ ${b} =`, options, answerIndex, `${a} divided by ${b} is ${q}.`];
}

function moneyAdd(a: number, b: number, seed: number): Raw {
  const sum = a + b;
  const correct = `${sum}p`;
  const [options, answerIndex] = pickOptions(correct, [`${sum - 1}p`, `${sum + 1}p`, `${sum + 2}p`], seed);
  return [`${a}p + ${b}p =`, options, answerIndex, `${a}p and ${b}p make ${sum}p.`];
}

function moneyChange(cost: number, pay: number, seed: number): Raw {
  const change = pay - cost;
  const correct = `${change}p`;
  const [options, answerIndex] = pickOptions(correct, [`${change - 1}p`, `${change + 1}p`, `${change + 2}p`], seed);
  return [`Item ${cost}p, pay ${pay}p. Change?`, options, answerIndex, `${pay} − ${cost} = ${change}p.`];
}

const COINS = ["1p", "2p", "5p", "10p", "20p", "50p", "£1", "£2"];

function proceduralForTopic(topicId: string, n: number): Raw {
  const h = hash(topicId, n);
  const r = (max: number) => (h + n * 17) % max;
  const r2 = (max: number) => (h >> 3 + n) % max;

  switch (topicId) {
    case "ks1-counting": {
      const step = [2, 5, 10][r(3)];
      const start = 2 + r(8) * step;
      const next = start + step;
      const seq = `${start - step}, ${start}, ?`;
      const [options, answerIndex] = pickOptions(num(next), [num(next - 1), num(next + step), num(next + 1)], h);
      return [`Count in ${step}s: ${seq}`, options, answerIndex, `Add ${step} to ${start}.`];
    }
    case "ks1-addition": {
      const a = 1 + r(9);
      const b = 1 + r2(9);
      return addRaw(a, b, h);
    }
    case "ks1-subtraction": {
      const b = 1 + r(8);
      const a = b + 2 + r(10);
      return subRaw(a, b, h);
    }
    case "ks1-shapes": {
      const prompts = [
        () => {
          const sides = [3, 4, 5, 6, 8][r(5)];
          const names: Record<number, string> = { 3: "Triangle", 4: "Square", 5: "Pentagon", 6: "Hexagon", 8: "Octagon" };
          const correct = names[sides] ?? "Hexagon";
          const [options, answerIndex] = pickOptions(correct, ["Circle", "Rectangle", "Sphere", "Cube"], h);
          return [`A shape with ${sides} equal sides is a:`, options, answerIndex, `${correct} has ${sides} sides.`] as Raw;
        },
        () => {
          const correct = r(2) === 0 ? "Cube" : "Sphere";
          const [options, answerIndex] = pickOptions(correct, ["Square", "Triangle", "Circle", "Cone"], h);
          return [`Which is a 3D shape?`, options, answerIndex, `${correct} has length, width and height (or is round).`];
        },
        () => {
          const correct = "4";
          const [options, answerIndex] = pickOptions(correct, ["3", "5", "6"], h);
          return [`How many corners does a square have?`, options, answerIndex, `A square has 4 vertices.`];
        },
      ];
      return prompts[n % prompts.length]();
    }
    case "ks1-time": {
      const hour = 1 + r(12);
      const half = r(2) === 0;
      const correct = half ? `${hour}:30` : `${hour}:00`;
      const [options, answerIndex] = pickOptions(correct, [`${hour}:15`, `${hour}:45`, `${(hour % 12) + 1}:00`], h);
      return [half ? `Half past ${hour} is:` : `O'clock at ${hour} is:`, options, answerIndex, half ? "Half past means 30 minutes." : "O'clock means :00."];
    }
    case "ks1-money": {
      if (n % 3 === 0) {
        const a = 1 + r(9);
        const b = 1 + r2(9);
        return moneyAdd(a, b, h);
      }
      if (n % 3 === 1) {
        const cost = 2 + r(15);
        const pay = cost + 1 + r(8);
        return moneyChange(cost, pay, h);
      }
      const pool = shuffle([...COINS], h).slice(0, 4);
      const values = [1, 2, 5, 10, 20, 50, 100, 200];
      const best = pool.reduce((a, b) => (values[COINS.indexOf(b)] > values[COINS.indexOf(a)] ? b : a), pool[0]);
      const [options, answerIndex] = pickOptions(best, pool.filter((c) => c !== best), h);
      return ["Which coin is worth the most in this list?", options, answerIndex, `${best} has the highest value shown.`];
    }
    case "ks1-fractions-basics": {
      if (n % 2 === 0) {
        const whole = 4 + r(8) * 2;
        const half = whole / 2;
        const [options, answerIndex] = pickOptions(num(half), [num(half - 1), num(half + 1), num(whole)], h);
        return [`1/2 of ${whole} =`, options, answerIndex, `Half of ${whole} is ${half}.`];
      }
      const den = 2 + r(3);
      const whole = den * (2 + r(4));
      const part = whole / den;
      const [options, answerIndex] = pickOptions(num(part), [num(part + 1), num(part - 1), num(whole)], h);
      return [`1/${den} of ${whole} =`, options, answerIndex, `${whole} ÷ ${den} = ${part}.`];
    }
    case "ks2-multiplication": {
      const a = 2 + r(10);
      const b = 2 + r2(10);
      return mulRaw(a, b, h);
    }
    case "ks2-division": {
      const b = 2 + r(9);
      const q = 2 + r2(10);
      return divRaw(b * q, b, h);
    }
    case "ks2-decimals": {
      const t = 1 + r(9);
      const correct = `${t / 10}`;
      const [options, answerIndex] = pickOptions(correct, [`${(t + 1) / 10}`, `${(t - 1) / 10}`, `${t}`], h);
      return [`${t} tenths as a decimal:`, options, answerIndex, `${t}/10 = ${t / 10}.`];
    }
    case "ks2-fractions": {
      const den = 2 + r(5);
      const nume = 1 + r(den - 1);
      const whole = den * (2 + r(4));
      const ans = (nume * whole) / den;
      const [options, answerIndex] = pickOptions(num(ans), [num(ans + 1), num(ans - 1), num(whole)], h);
      return [`What is ${nume}/${den} of ${whole}?`, options, answerIndex, `${whole} × ${nume}/${den} = ${ans}.`];
    }
    case "ks2-geometry": {
      const w = 2 + r(8);
      const l = w + 1 + r(5);
      const p = 2 * (w + l);
      const [options, answerIndex] = pickOptions(`${p} cm`, [`${p + 2} cm`, `${p - 2} cm`, `${w + l} cm`], h);
      return [`Rectangle ${l} cm by ${w} cm. Perimeter?`, options, answerIndex, `Perimeter = 2(${l}+${w}) = ${p} cm.`];
    }
    case "ks2-measurements": {
      const kg = 1 + r(9);
      const g = kg * 1000;
      const [options, answerIndex] = pickOptions(`${g} g`, [`${kg} g`, `${g / 10} g`, `${g * 10} g`], h);
      return [`${kg} kg = ? g`, options, answerIndex, `1 kg = 1000 g.`];
    }
    case "ks2-word-problems": {
      const a = 3 + r(12);
      const b = 2 + r2(10);
      return addRaw(a, b, h);
    }
    case "ks3-algebra": {
      const x = 1 + r(8);
      const c = 2 + r2(9);
      const expr = `${c}x`;
      const val = c * x;
      const [options, answerIndex] = pickOptions(num(val), [num(val + c), num(val - c), num(val + 1)], h);
      return [`If x = ${x}, value of ${expr}?`, options, answerIndex, `${c} × ${x} = ${val}.`];
    }
    case "ks3-ratios": {
      const a = 2 + r(5);
      const b = 2 + r2(5);
      const scale = 2 + r(4);
      const [options, answerIndex] = pickOptions(`${a * scale}:${b * scale}`, [`${a}:${b}`, `${a + scale}:${b}`, `${a}:${b + scale}`], h);
      return [`Ratio ${a}:${b} equivalent to:`, options, answerIndex, `Multiply both parts by ${scale}.`];
    }
    case "ks3-probability": {
      const fav = 1 + r(5);
      const total = fav + 1 + r(5);
      const correct = `${fav}/${total}`;
      const [options, answerIndex] = pickOptions(correct, [`${fav + 1}/${total}`, `${fav}/${total + 1}`, `${total - fav}/${total}`], h);
      return [`${fav} favourable out of ${total} equally likely outcomes. P =`, options, answerIndex, `Probability = favourable ÷ total.`];
    }
    case "ks3-graphs": {
      const m = 1 + r(5);
      const x = 1 + r2(8);
      const c = r(4);
      const y = m * x + c;
      const [options, answerIndex] = pickOptions(`(${x}, ${y})`, [`(${x}, ${y + 1})`, `(${x + 1}, ${y})`, `(${y}, ${x})`], h);
      return [`Line y = ${m}x + ${c} passes through:`, options, answerIndex, `Substitute x = ${x}.`];
    }
    case "ks3-angles": {
      const a = 30 + r(50);
      const b = 180 - a;
      const [options, answerIndex] = pickOptions(`${b}°`, [`${b + 10}°`, `${b - 10}°`, `90°`], h);
      return [`Angles on a straight line: ${a}° and ?`, options, answerIndex, `Straight line sums to 180°.`];
    }
    case "ks3-statistics": {
      const start = 1 + r(6);
      const vals = [0, 1, 2, 3, 4].map((i) => start + i * 2);
      const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
      const list = vals.join(", ");
      const [options, answerIndex] = pickOptions(num(mean), [num(mean + 1), num(mean - 1), num(mean + 2)], h);
      return [`Mean of ${list}?`, options, answerIndex, `Add and divide by ${vals.length}.`];
    }
    case "ks3-percentages": {
      const p = 10 * (1 + r(9));
      const of = 10 + r(9) * 10;
      const ans = (p / 100) * of;
      const [options, answerIndex] = pickOptions(num(ans), [num(ans + 10), num(ans - 10), num(ans / 2)], h);
      return [`${p}% of ${of}?`, options, answerIndex, `${p}% = ${p}/100 × ${of}.`];
    }
    case "ks3-equations": {
      const x = 2 + r(8);
      const a = 3 + r2(6);
      const b = a * x + (1 + r(5));
      const [options, answerIndex] = pickOptions(num(x), [num(x + 1), num(x - 1), num(x + 2)], h);
      return [`Solve: ${a}x + ${b - a * x} = ${b}`, options, answerIndex, `Isolate x to get ${x}.`];
    }
    case "ks4-gcse-foundation": {
      const n = 5 + r(15);
      const sq = n * n;
      const [options, answerIndex] = pickOptions(num(sq), [num(sq + n), num(sq - n), num(n + sq)], h);
      return [`${n}² =`, options, answerIndex, `${n} × ${n} = ${sq}.`];
    }
    case "ks4-gcse-higher": {
      const a = 1 + r(5);
      const b = 1 + r2(5);
      const correct = `${a * b}`;
      const [options, answerIndex] = pickOptions(correct, [`${a + b}`, `${a + b + 1}`, `${a * b + 1}`], h);
      return [`Simplify √((${a})²(${b})²)`, options, answerIndex, `√(a²b²) = ${a * b}.`];
    }
    case "ks4-trigonometry": {
      const opp = 3 + r(4);
      const hyp = opp + 2 + r(3);
      const [options, answerIndex] = pickOptions(`sin θ = ${opp}/${hyp}`, [`cos θ = ${opp}/${hyp}`, `tan θ = ${opp}/${hyp}`, `sin θ = ${hyp}/${opp}`], h);
      return [`Opposite ${opp}, hypotenuse ${hyp}.`, options, answerIndex, `sin = opposite/hypotenuse.`];
    }
    case "ks4-simultaneous-equations": {
      const x = 1 + r(5);
      const y = 1 + r2(5);
      const [options, answerIndex] = pickOptions(`x = ${x}, y = ${y}`, [`x = ${y}, y = ${x}`, `x = ${x + 1}, y = ${y}`, `x = ${x}, y = ${y + 1}`], h);
      return [`x + y = ${x + y}, x − y = ${x - y}. Solution?`, options, answerIndex, `Add/subtract equations.`];
    }
    case "ks4-quadratics": {
      const r1 = 1 + r(5);
      const r2v = 1 + r2(5);
      const [options, answerIndex] = pickOptions(`(x − ${r1})(x − ${r2v})`, [`(x + ${r1})(x + ${r2v})`, `(x − ${r1 + r2v})`, `(x − ${r1 * r2v})`], h);
      return [`Factor x² − ${r1 + r2v}x + ${r1 * r2v}`, options, answerIndex, `Roots ${r1} and ${r2v}.`];
    }
    case "ks4-functions": {
      const x = 1 + r(8);
      const k = 1 + r2(4);
      const ans = x * x + k;
      const [options, answerIndex] = pickOptions(num(ans), [num(ans + 1), num(x * 2), num(x + k)], h);
      return [`f(x) = x² + ${k}, f(${x}) =`, options, answerIndex, `${x}² + ${k} = ${ans}.`];
    }
    case "ks4-vectors": {
      const a = 1 + r(4);
      const b = 1 + r2(4);
      const [options, answerIndex] = pickOptions(`(${a + 2}, ${b + 3})`, [`(${a}, ${b})`, `(${2 * a}, ${2 * b})`, `(${a + 2}, ${b})`], h);
      return [`(2,3) + (${a},${b}) =`, options, answerIndex, `Add components separately.`];
    }
    case "ks4-histograms": {
      const freq = 5 + r(15);
      const width = 2 + r(3);
      const fd = freq / width;
      const [options, answerIndex] = pickOptions(num(fd), [num(fd + 2), num(freq), num(width)], h);
      return [`Frequency ${freq}, class width ${width}. FD =`, options, answerIndex, `FD = frequency ÷ width.`];
    }
    case "ks4-circle-theorems": {
      const ang = 40 + r(40);
      const [options, answerIndex] = pickOptions(`${ang}°`, [`${180 - ang}°`, `${90 - ang}°`, `${2 * ang}°`], h);
      return [`Angle at centre is ${2 * ang}°. Angle at circumference on same arc?`, options, answerIndex, `Angle at centre is twice angle at circumference.`];
    }
    case "ks4-probability-trees": {
      const num = 1 + r(4);
      const den = num + 2 + r(4);
      const p = `${num}/${den}`;
      const p2 = num / den;
      const correct = `${Math.round(p2 * p2 * 100) / 100}`;
      const [options, answerIndex] = pickOptions(correct, [`${num + 1}/${den}`, `${num}/${den + 1}`, `${2 * num}/${den}`], h);
      return [`Two independent events each P = ${p}. P(both)?`, options, answerIndex, `Multiply: ${p} × ${p}.`];
    }
    case "ks4-algebraic-fractions": {
      const k = 2 + r(8);
      const j = 1 + r2(5);
      const [options, answerIndex] = pickOptions(`${k + j}/x`, [`x/${k}`, `${k}x`, `${j}/x`], h);
      return [`Simplify (${k}x + ${j}x)/x² for x ≠ 0`, options, answerIndex, `Factor x in the numerator, cancel one x.`];
    }
    default: {
      const a = 1 + r(9);
      const b = 1 + r2(9);
      return addRaw(a, b, h);
    }
  }
}

function rawToQuestion(topicId: string, raw: Raw, index: number): QuizQuestion {
  return {
    id: `${topicId}-q${index + 1}`,
    prompt: raw[0],
    options: raw[1],
    answerIndex: raw[2],
    explanation: raw[3],
  };
}

function genericFallback(topicId: string, seed: number): Raw {
  const h = hash(topicId, seed);
  const a = 2 + (h % 15);
  const b = 2 + ((h >> 4) % 12);
  const op = seed % 4;
  if (op === 0) return addRaw(a, b, h);
  if (op === 1 && a > b) return subRaw(a, b, h);
  if (op === 2) return mulRaw(Math.min(a, 12), Math.min(b, 12), h);
  if (a % b === 0) return divRaw(a, b, h);
  return addRaw(a, b, h);
}

export function fillQuizToCount(topicId: string, questions: QuizQuestion[], target = 20): QuizQuestion[] {
  const prompts = new Set(questions.map((q) => q.prompt));
  const out = [...questions];
  let guard = 0;
  let n = 0;

  while (out.length < target && guard < 200) {
    guard++;
    const raw =
      guard % 5 === 0 && out.length < target
        ? genericFallback(topicId, n + guard)
        : proceduralForTopic(topicId, n + guard * 3);
    n++;
    if (prompts.has(raw[0])) continue;
    prompts.add(raw[0]);
    out.push(rawToQuestion(topicId, raw, out.length));
  }

  return out.slice(0, target);
}

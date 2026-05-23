import { create, all, lusolve, matrix, type MathJsInstance } from "mathjs";

const math: MathJsInstance = create(all, { number: "number", precision: 14 });

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "undefined";
  const rounded = Math.round(n * 1e8) / 1e8;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

/** Turn informal powers like x2 or 3x2 into x^2 / 3x^2 (not plain numbers like 12 or x25). */
function normaliseExponents(text: string): string {
  let out = text;
  // Coefficient + variable + single-digit power: 2x2 → 2x^2, 3y3 → 3y^3
  out = out.replace(/(\d)([a-z])([2-9])(?![0-9a-z])/gi, "$1$2^$3");
  // Variable + single-digit power: x2 → x^2 (skip if another digit follows: x25 stays x25)
  out = out.replace(/([a-z])([2-9])(?![0-9a-z.])/gi, "$1^$2");
  return out;
}

function normaliseInput(question: string): string {
  const base = question
    .trim()
    .replace(/[−–—]/g, "-")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/√/g, "sqrt")
    .replace(/\^/g, "^");
  return normaliseExponents(base);
}

function stripQuestionPrefix(text: string): string {
  return text
    .replace(
      /^(please\s+)?(can you\s+)?(solve|find|work\s*out|calculate|what\s+is|evaluate|simplify|factorise|factorize)\s+/i,
      "",
    )
    .replace(/\?+$/g, "")
    .trim();
}

function insertImplicitMultiplication(expr: string): string {
  return expr
    .replace(/(\d)([a-z])/gi, "$1*$2")
    .replace(/(\))([a-z\d(])/gi, "$1*$2")
    .replace(/([a-z])(\()/gi, "$1*$2");
}

function formatPolynomial(a: number, b: number, c: number, variable: string): string {
  const parts: string[] = [];
  if (Math.abs(a) > 1e-12) {
    const lead = a === 1 ? `${variable}²` : a === -1 ? `-${variable}²` : `${formatNumber(a)}${variable}²`;
    parts.push(lead);
  }
  if (Math.abs(b) > 1e-12) {
    const mid =
      b === 1
        ? variable
        : b === -1
          ? `-${variable}`
          : `${formatNumber(b)}${variable}`;
    parts.push(parts.length && b > 0 ? `+ ${mid}` : mid);
  }
  if (Math.abs(c) > 1e-12) {
    parts.push(parts.length && c > 0 ? `+ ${formatNumber(c)}` : formatNumber(c));
  }
  return parts.join(" ") || "0";
}

function expandedPolynomialForm(expr: string, variable: string): string | null {
  try {
    const poly = solvePolynomialFromSamples(expr, variable);
    if (!poly || poly.type === "other") return null;
    if (poly.type === "linear") return `${formatNumber(poly.b)}${variable} ${poly.c >= 0 ? "+" : ""}${formatNumber(poly.c)}`;
    return formatPolynomial(poly.a, poly.b, poly.c, variable);
  } catch {
    return null;
  }
}

function prettifyMath(expr: string): string {
  return expr
    .replace(/\s*\^\s*2/g, "²")
    .replace(/\s*\^\s*3/g, "³")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatQuadraticRoots(a: number, b: number, c: number): string | null {
  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) < 1e-12) return null;
    return formatNumber(-c / b);
  }
  const disc = b * b - 4 * a * c;
  if (disc < 0) return "No real solutions (discriminant < 0)";
  const sqrtDisc = Math.sqrt(disc);
  const s1 = (-b + sqrtDisc) / (2 * a);
  const s2 = (-b - sqrtDisc) / (2 * a);
  if (Math.abs(s1 - s2) < 1e-9) return formatNumber(s1);
  return `x = ${formatNumber(s1)} or x = ${formatNumber(s2)}`;
}

function evalExpr(exprStr: string, variable: string, value: number): number {
  return Number(math.evaluate(exprStr, { [variable]: value }));
}

function detectVariable(text: string): string | null {
  const vars = ["x", "y", "z", "t", "n"];
  for (const v of vars) {
    if (new RegExp(v, "i").test(text)) return v;
  }
  return null;
}

function solvePolynomialFromSamples(
  exprStr: string,
  variable: string,
): { type: "linear" | "quadratic" | "other"; a: number; b: number; c: number } | null {
  try {
    const f0 = evalExpr(exprStr, variable, 0);
    const f1 = evalExpr(exprStr, variable, 1);
    const f2 = evalExpr(exprStr, variable, 2);
    const f3 = evalExpr(exprStr, variable, 3);
    if (![f0, f1, f2, f3].every(Number.isFinite)) return null;

    const a = (f2 - f0 - 2 * (f1 - f0)) / 2;
    const b = f1 - f0 - a;
    const c = f0;

    const quadAt3 = a * 9 + b * 3 + c;
    if (Math.abs(quadAt3 - f3) > 1e-4) {
      return { type: "other", a: 0, b: 0, c: 0 };
    }

    if (Math.abs(a) < 1e-9) return { type: "linear", a: 0, b, c };
    return { type: "quadratic", a, b, c };
  } catch {
    return null;
  }
}

function numericRoots(exprStr: string, variable: string): number[] {
  const roots: number[] = [];
  const step = 0.25;
  let prevX = -40;
  let prevY = evalExpr(exprStr, variable, prevX);
  for (let x = prevX + step; x <= 40; x += step) {
    const y = evalExpr(exprStr, variable, x);
    if (Number.isFinite(prevY) && Number.isFinite(y) && prevY * y <= 0) {
      let lo = x - step;
      let hi = x;
      for (let i = 0; i < 40; i += 1) {
        const mid = (lo + hi) / 2;
        const ym = evalExpr(exprStr, variable, mid);
        if (Math.abs(ym) < 1e-8) {
          roots.push(mid);
          break;
        }
        if (prevY * ym <= 0) hi = mid;
        else lo = mid;
      }
      if (roots.length === 0 || Math.abs(roots[roots.length - 1] - (lo + hi) / 2) > 1e-6) {
        roots.push((lo + hi) / 2);
      }
    }
    prevX = x;
    prevY = y;
  }
  const unique: number[] = [];
  for (const r of roots) {
    if (!unique.some((u) => Math.abs(u - r) < 0.05)) unique.push(r);
  }
  return unique.slice(0, 4);
}

function tryExpandBrackets(question: string): string | null {
  const text = stripQuestionPrefix(normaliseInput(question));
  if (!/\([^)]+\)/.test(text) || /=/.test(text)) return null;
  if (!/expand|multiply|product/i.test(text) && !/\)\s*\(/.test(text)) return null;

  try {
    const expr = insertImplicitMultiplication(text.replace(/^expand\s+/i, ""));
    const variable = detectVariable(expr) ?? "x";
    const expanded =
      expandedPolynomialForm(expr, variable) ?? prettifyMath(math.simplify(expr).toString());
    return `Expanding brackets

1. Multiply each term in the first bracket by each term in the second (FOIL).
2. Collect like terms.

Expanded form: ${expanded}`;
  } catch {
    return null;
  }
}

function tryAlgebraicEquation(question: string): string | null {
  const text = insertImplicitMultiplication(stripQuestionPrefix(normaliseInput(question)));
  if (!text.includes("=")) return null;

  const eqIndex = text.indexOf("=");
  const left = text.slice(0, eqIndex);
  const right = text.slice(eqIndex + 1);
  if (!left || !right) return null;

  const variable = detectVariable(text);
  if (!variable) return null;

  const hasBrackets = /\([^)]+\)/.test(left) || /\([^)]+\)/.test(right);
  const hasPoly =
    hasBrackets ||
    /\^2/i.test(text) ||
    /x\s*\*\s*x/i.test(text) ||
    /\)\s*\(/.test(text);

  if (!hasPoly && !/[xy]/i.test(left)) return null;

  try {
    const exprStr = `(${left})-(${right})`;
    const expandedLeft =
      hasBrackets && variable
        ? expandedPolynomialForm(left, variable) ?? prettifyMath(math.simplify(left).toString())
        : left;
    const poly = solvePolynomialFromSamples(exprStr, variable);

    if (!poly) return null;

    if (poly.type === "linear") {
      const root = formatQuadraticRoots(0, poly.b, poly.c);
      if (!root) return null;
      return `Algebra

1. Expand and simplify${hasBrackets ? `:\n   ${prettifyMath(expandedLeft)} = ${prettifyMath(right)}` : ` the equation.`}
2. Rearrange to isolate ${variable}.

Answer: ${variable} = ${root}`;
    }

    if (poly.type === "quadratic") {
      const { a, b, c } = poly;
      const standard = `${formatNumber(a)}${variable}² ${b >= 0 ? "+" : ""}${formatNumber(b)}${variable} ${c >= 0 ? "+" : ""}${formatNumber(c)} = 0`;
      const roots = formatQuadraticRoots(a, b, c);
      if (!roots) return null;

      const step1 = hasBrackets
        ? `Expand the brackets:\n   ${prettifyMath(expandedLeft)} = ${prettifyMath(right)}`
        : `Equation:\n   ${prettifyMath(left)} = ${prettifyMath(right)}`;

      return `Quadratic equation

1. ${step1}
2. Rearrange to standard form:
   ${standard}
3. Use the quadratic formula (a = ${formatNumber(a)}, b = ${formatNumber(b)}, c = ${formatNumber(c)}).

Answer: ${roots}`;
    }

    const roots = numericRoots(exprStr, variable);
    if (!roots.length) return null;
    const rootText = roots.map((r) => `${variable} ≈ ${formatNumber(r)}`).join(" or ");
    return `Algebra (numerical solution)

1. Expand: ${prettifyMath(expandedLeft)} = ${prettifyMath(right)}
2. Rearrange to f(${variable}) = 0 and find where the graph crosses the axis.

Answer: ${rootText}`;
  } catch {
    return null;
  }
}

function tryEvaluateExpression(question: string): string | null {
  const stripped = stripQuestionPrefix(normaliseInput(question));
  if (!stripped) return null;

  let expr = stripped
    .replace(/(\d+)\s*%\s*of\s*(\d+)/gi, "($1/100)*$2")
    .replace(/(\d+)\s*%/g, "($1/100)")
    .replace(/,/g, "");

  expr = insertImplicitMultiplication(expr);
  const hasLongWord = /[a-z]{2,}/i.test(expr.replace(/sqrt/gi, ""));
  if (hasLongWord) return null;
  if (!/[0-9]/.test(expr)) return null;

  try {
    const value = math.evaluate(expr) as number | { re?: number; im?: number };
    if (typeof value === "object" && value !== null && "re" in value) {
      const re = value.re ?? 0;
      const im = value.im ?? 0;
      if (Math.abs(im) > 1e-9) {
        return `Complex result\n\nAnswer: ${formatNumber(re)} + ${formatNumber(im)}i`;
      }
      return `Calculation\n\nAnswer: ${formatNumber(re)}`;
    }
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    const display = expr.replace(/\*/g, " × ").replace(/\//g, " ÷ ");
    return `Calculation\n\nExpression: ${display}\n\nAnswer: ${formatNumber(value)}`;
  } catch {
    return null;
  }
}

type LinearEq = { a: number; b: number; c: number };

function parseLinearEquation(line: string): LinearEq | null {
  const eq = line.replace(/\s+/g, "");
  const parts = eq.split("=");
  if (parts.length !== 2) return null;
  const right = Number(parts[1]);
  if (!Number.isFinite(right)) return null;

  let a = 0;
  let b = 0;
  let constLeft = 0;
  const tokens = parts[0].replace(/-/g, "+-").split("+").filter(Boolean);

  for (const token of tokens) {
    const xm = token.match(/^([+-]?\d*\.?\d*)\*?x$/i);
    const ym = token.match(/^([+-]?\d*\.?\d*)\*?y$/i);
    const nm = token.match(/^([+-]?\d+\.?\d*)$/);
    if (xm) {
      const raw = xm[1];
      const coef = raw === "" || raw === "+" ? 1 : raw === "-" ? -1 : Number(raw);
      if (!Number.isFinite(coef)) return null;
      a += coef;
    } else if (ym) {
      const raw = ym[1];
      const coef = raw === "" || raw === "+" ? 1 : raw === "-" ? -1 : Number(raw);
      if (!Number.isFinite(coef)) return null;
      b += coef;
    } else if (nm) {
      constLeft += Number(nm[1]);
    } else {
      return null;
    }
  }

  return { a, b, c: right - constLeft };
}

function trySimultaneousEquations(question: string): string | null {
  const text = stripQuestionPrefix(normaliseInput(question));
  const chunks = text
    .split(/[,;]|\n/)
    .map((c) => c.trim())
    .filter((c) => /=/.test(c) && /[xy]/i.test(c));

  if (chunks.length < 2) return null;

  const eqs: LinearEq[] = [];
  for (const chunk of chunks.slice(0, 3)) {
    const parsed = parseLinearEquation(chunk);
    if (!parsed) return null;
    eqs.push(parsed);
  }

  try {
    const coeffs = matrix(eqs.map((e) => [e.a, e.b]));
    const constants = matrix(eqs.map((e) => [e.c]));
    const solution = lusolve(coeffs, constants).valueOf() as number[][];
    const x = solution[0]?.[0];
    const y = solution[1]?.[0];
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

    return `Simultaneous equations

1. Rearrange both equations into the form ax + by = c.
2. Solve the system (elimination or substitution).

Solution: x = ${formatNumber(x)}, y = ${formatNumber(y)}

Check: substitute into both original equations.`;
  } catch {
    return null;
  }
}

function solveLinearInVariable(left: string, right: string, variable: string): string | null {
  if (!left.includes(variable) && !right.includes(variable)) return null;
  try {
    const exprStr = `(${left}) - (${right})`;
    const scope0: Record<string, number> = { [variable]: 0 };
    const scope1: Record<string, number> = { [variable]: 1 };
    const v0 = Number(math.evaluate(exprStr, scope0));
    const v1 = Number(math.evaluate(exprStr, scope1));
    if (!Number.isFinite(v0) || !Number.isFinite(v1)) return null;
    const coef = v1 - v0;
    const constTerm = v0;
    if (Math.abs(coef) < 1e-12) {
      if (Math.abs(constTerm) < 1e-9) {
        return `Equation in ${variable}\n\nAll real numbers satisfy this (identity).`;
      }
      return `Equation in ${variable}\n\nNo solution — contradiction.`;
    }
    const solution = -constTerm / coef;
    return `Linear equation in ${variable}

1. Start: ${left} = ${right}
2. Rearrange so all ${variable} terms are on one side.
3. Divide by the coefficient of ${variable}.

Answer: ${variable} = ${formatNumber(solution)}`;
  } catch {
    return null;
  }
}

function trySingleVariableEquation(question: string): string | null {
  const text = insertImplicitMultiplication(stripQuestionPrefix(normaliseInput(question)));
  if (!text.includes("=")) return null;
  const [left, right] = text.split("=");
  if (!left || right === undefined) return null;

  for (const variable of ["x", "y", "z", "t", "n"]) {
    const result = solveLinearInVariable(left, right, variable);
    if (result) return result;
  }

  const quad = text.match(/^([+-]?\d*\.?\d*)x\^2([+-]\d*\.?\d*)x?([+-]\d+\.?\d*)?=([+-]?\d+\.?\d*)$/i);
  if (quad) {
    const a = quad[1] === "" || quad[1] === "+" ? 1 : quad[1] === "-" ? -1 : Number(quad[1]);
    const b = quad[2] ? Number(quad[2]) : 0;
    const c = quad[3] ? Number(quad[3].replace(/^\+/, "")) : 0;
    const rhs = Number(quad[4]);
    const c0 = c - rhs;
    const disc = b * b - 4 * a * c0;
    if (disc < 0) return `Quadratic equation\n\nNo real solutions (discriminant < 0).`;
    const s1 = (-b + Math.sqrt(disc)) / (2 * a);
    const s2 = (-b - Math.sqrt(disc)) / (2 * a);
    if (Math.abs(s1 - s2) < 1e-9) {
      return `Quadratic equation\n\nRepeated root: x = ${formatNumber(s1)}`;
    }
    return `Quadratic equation\n\nx = ${formatNumber(s1)} or x = ${formatNumber(s2)}`;
  }

  return null;
}

function tryPercentage(question: string): string | null {
  const text = normaliseInput(question);
  const ofMatch = text.match(/(\d+\.?\d*)\s*%\s*of\s*(\d+\.?\d*)/i);
  if (ofMatch) {
    const pct = Number(ofMatch[1]);
    const base = Number(ofMatch[2]);
    const ans = (pct / 100) * base;
    return `Percentages\n\n1. ${pct}% = ${pct / 100}\n2. ${pct / 100} × ${base}\n\nAnswer: ${formatNumber(ans)}`;
  }

  const changeMatch = text.match(/(\d+\.?\d*)\s*(increased|decreased)\s*by\s*(\d+\.?\d*)\s*%/i);
  if (changeMatch) {
    const base = Number(changeMatch[1]);
    const dir = changeMatch[2].toLowerCase();
    const pct = Number(changeMatch[3]);
    const factor = dir === "increased" ? 1 + pct / 100 : 1 - pct / 100;
    return `Percentages\n\nMultiplier = ${formatNumber(factor)}\nAnswer: ${formatNumber(base * factor)}`;
  }

  return null;
}

function tryRatio(question: string): string | null {
  const text = normaliseInput(question);
  const m = text.match(
    /ratio\s*(\d+)\s*:\s*(\d+)(?:\s*:\s*(\d+))?\s*(?:totalling|total(?:\s+of)?|=\s*)?\s*(\d+\.?\d*)/i,
  );
  if (!m) return null;
  const parts = [Number(m[1]), Number(m[2]), m[3] ? Number(m[3]) : null].filter((p) => p !== null) as number[];
  const total = Number(m[4]);
  const sumParts = parts.reduce((a, b) => a + b, 0);
  const share = total / sumParts;
  const amounts = parts.map((p) => formatNumber(p * share));
  return `Ratio\n\n1. Parts = ${sumParts}\n2. One share = ${formatNumber(share)}\n\nAnswer: ${amounts.join(", ")}`;
}

function tryGeometry(question: string): string | null {
  const text = normaliseInput(question).toLowerCase();
  const circle = text.match(/(?:radius|r)\s*=?\s*(\d+\.?\d*)/);
  if (/area.*circle|circle.*area/.test(text) && circle) {
    const r = Number(circle[1]);
    return `Circle area\n\nA = πr² ≈ ${formatNumber(Math.PI * r * r)}`;
  }
  if (/circumference/.test(text) && circle) {
    const r = Number(circle[1]);
    return `Circumference\n\nC = 2πr ≈ ${formatNumber(2 * Math.PI * r)}`;
  }
  const rect = text.match(/length\s*=?\s*(\d+\.?\d*).*width\s*=?\s*(\d+\.?\d*)/);
  if (rect && /area/.test(text)) {
    const l = Number(rect[1]);
    const w = Number(rect[2]);
    return `Rectangle area\n\nA = ${l} × ${w} = ${formatNumber(l * w)}`;
  }
  return null;
}

function tryPythagoras(question: string): string | null {
  const text = normaliseInput(question).toLowerCase();
  const m = text.match(/(?:legs?|sides?)\s*(\d+\.?\d*)\s*(?:and|,)\s*(\d+\.?\d*)/);
  if (!m || !/pythag|hypotenuse|right.?angle/.test(text)) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  const c = Math.sqrt(a * a + b * b);
  return `Pythagoras\n\na² + b² = c² → c ≈ ${formatNumber(c)}`;
}

function tryTrigonometry(question: string): string | null {
  const text = normaliseInput(question).toLowerCase();
  const m = text.match(/(?:find\s+)?(sin|cos|tan)\s*\(?\s*(\d+\.?\d*)\s*(?:°|degrees?|deg)?\s*\)?/i);
  if (!m) return null;
  const fn = m[1].toLowerCase() as "sin" | "cos" | "tan";
  const deg = Number(m[2]);
  if (!Number.isFinite(deg)) return null;
  const rad = (deg * Math.PI) / 180;
  const val = Math[fn](rad);
  return `Trigonometry (SOHCAHTOA)

Use degrees on GCSE papers unless told otherwise.

${fn}(${deg}°) = ${formatNumber(val)}`;
}

function tryMean(question: string): string | null {
  const text = normaliseInput(question);
  if (!/mean|average/i.test(text)) return null;
  const nums = text.match(/\d+\.?\d*/g)?.map(Number).filter(Number.isFinite);
  if (!nums || nums.length < 2) return null;
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / nums.length;
  return `Mean (average)

1. Add all values: ${nums.join(" + ")} = ${formatNumber(sum)}
2. Divide by how many numbers (${nums.length})

Answer: ${formatNumber(mean)}`;
}

/** Built-in advanced maths tutor — no external AI service required. */
export function solveWithBuiltin(question: string): string | null {
  const trimmed = question.trim();
  if (!trimmed) return null;

  for (const fn of [
    trySimultaneousEquations,
    tryExpandBrackets,
    tryAlgebraicEquation,
    trySingleVariableEquation,
    tryPercentage,
    tryRatio,
    tryPythagoras,
    tryGeometry,
    tryTrigonometry,
    tryMean,
    tryEvaluateExpression,
  ]) {
    const result = fn(trimmed);
    if (result) return result;
  }

  return null;
}

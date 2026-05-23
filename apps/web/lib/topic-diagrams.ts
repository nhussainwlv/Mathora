/** Inline SVG diagrams — labels offset from lines with readable backgrounds. */

export type DiagramAsset = {
  alt: string;
  caption: string;
  svg: string;
};

const svgWrap = (body: string) =>
  `<svg class="learn-diagram-svg" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="false">${body}</svg>`;

/** Label with background pill — keeps text off diagram lines */
function label(
  x: number,
  y: number,
  text: string,
  opts: { anchor?: "start" | "middle" | "end"; w?: number; accent?: boolean; rotate?: number } = {},
): string {
  const anchor = opts.anchor ?? "middle";
  const w = opts.w ?? Math.max(44, text.length * 7.2);
  const h = 20;
  const rx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  const bgClass = opts.accent ? "diagram-label-bg-accent" : "diagram-label-bg";
  const textClass = opts.accent ? "diagram-label-text-accent" : "diagram-label-text";
  const transform = opts.rotate ? ` transform="rotate(${opts.rotate} ${x} ${y})"` : "";
  return `<g class="diagram-label"${transform}>
    <rect x="${rx}" y="${y - 14}" width="${w}" height="${h}" rx="4" class="${bgClass}"/>
    <text x="${x}" y="${y + 1}" text-anchor="${anchor}" class="${textClass}">${text}</text>
  </g>`;
}

const diagramStyles = `<style>
  .diagram-label-bg { fill: rgba(248,250,252,0.96); stroke: rgba(148,163,184,0.45); stroke-width: 1; }
  .diagram-label-bg-accent { fill: rgba(238,242,255,0.98); stroke: rgba(79,70,229,0.35); stroke-width: 1; }
  .diagram-label-text { font-size: 13px; font-weight: 600; fill: #0f172a; }
  .diagram-label-text-accent { font-size: 13px; font-weight: 600; fill: #4f46e5; }
</style>`;

export const diagramAssets: Record<string, DiagramAsset> = {
  "number-line": {
    alt: "Number line from 0 to 10 with arrows showing counting on",
    caption: "Number line — count forwards (+) or backwards (−).",
    svg: svgWrap(`${diagramStyles}
      <line x1="36" y1="130" x2="364" y2="130" stroke="currentColor" stroke-width="2"/>
      ${[0, 2, 4, 6, 8, 10]
        .map((n, i) => {
          const cx = 36 + i * 65.6;
          return `<circle cx="${cx}" cy="130" r="4" fill="currentColor"/>
            <text x="${cx}" y="158" text-anchor="middle" font-size="13" fill="currentColor">${n}</text>`;
        })
        .join("")}
      <path d="M 168 108 L 232 108 L 232 98 L 258 118 L 232 138 L 232 128 L 168 128 Z" fill="#4f46e5"/>
      ${label(198, 92, "+3", { w: 36, accent: true })}
    `),
  },

  fractions: {
    alt: "Circle divided into four equal quarters",
    caption: "Equal parts — one quarter is 1/4 of the whole.",
    svg: svgWrap(`${diagramStyles}
      <circle cx="200" cy="125" r="72" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="200" y1="53" x2="200" y2="197" stroke="currentColor" stroke-width="2"/>
      <line x1="128" y1="125" x2="272" y2="125" stroke="currentColor" stroke-width="2"/>
      <path d="M 200 125 L 200 53 A 72 72 0 0 1 272 125 Z" fill="#4f46e5" opacity="0.3"/>
      ${label(238, 88, "1/4", { anchor: "start", w: 40 })}
    `),
  },

  shapes: {
    alt: "Triangle, square and circle labelled",
    caption: "2D shapes — count sides and corners.",
    svg: svgWrap(`${diagramStyles}
      <polygon points="70,175 110,85 150,175" fill="none" stroke="currentColor" stroke-width="2"/>
      ${label(110, 198, "Triangle", { w: 72 })}
      <rect x="175" y="95" width="80" height="80" fill="none" stroke="currentColor" stroke-width="2"/>
      ${label(215, 198, "Square", { w: 58 })}
      <circle cx="310" cy="135" r="42" fill="none" stroke="currentColor" stroke-width="2"/>
      ${label(310, 198, "Circle", { w: 56 })}
    `),
  },

  "right-triangle": {
    alt: "Right-angled triangle with opposite, adjacent and hypotenuse labelled",
    caption: "SOH CAH TOA — label sides relative to angle θ at the bottom-left corner.",
    svg: svgWrap(`${diagramStyles}
      <!-- A bottom-left (θ), B bottom-right (90°), C top-right -->
      <polygon points="55,195 305,195 305,65" fill="rgba(79,70,229,0.06)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Right angle at B -->
      <polyline points="285,195 285,175 305,175" fill="none" stroke="currentColor" stroke-width="2"/>
      <!-- Angle θ at A -->
      <path d="M 82 195 A 30 30 0 0 0 72 172" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <text x="88" y="178" font-size="15" font-weight="600" fill="currentColor">θ</text>
      ${label(55, 218, "adjacent", { anchor: "start", w: 72, accent: true })}
      ${label(328, 128, "opposite", { anchor: "start", w: 72, accent: true })}
      ${label(155, 88, "hypotenuse", { w: 88, accent: true, rotate: -24 })}
    `),
  },

  parabola: {
    alt: "U-shaped parabola graph",
    caption: "Quadratic graph y = ax² + bx + c (a > 0 opens upward).",
    svg: svgWrap(`${diagramStyles}
      <line x1="40" y1="200" x2="360" y2="200" stroke="currentColor" stroke-width="1.5"/>
      <line x1="200" y1="35" x2="200" y2="215" stroke="currentColor" stroke-width="1.5"/>
      <path d="M 70 200 Q 200 35 330 200" fill="none" stroke="#4f46e5" stroke-width="3"/>
      <circle cx="200" cy="118" r="5" fill="#4f46e5"/>
      ${label(200, 88, "turning point", { w: 100 })}
    `),
  },

  circle: {
    alt: "Circle with centre, radius and tangent",
    caption: "Radius to tangent is 90° at the point of contact.",
    svg: svgWrap(`${diagramStyles}
      <circle cx="185" cy="125" r="70" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="185" cy="125" r="4" fill="#4f46e5"/>
      <line x1="185" y1="125" x2="255" y2="125" stroke="#4f46e5" stroke-width="2"/>
      <line x1="255" y1="55" x2="255" y2="195" stroke="currentColor" stroke-width="2"/>
      <polyline points="255,175 235,175 235,195" fill="none" stroke="currentColor" stroke-width="2"/>
      ${label(192, 118, "O", { w: 28 })}
      ${label(218, 108, "r", { w: 24, accent: true })}
      ${label(268, 125, "tangent", { anchor: "start", w: 62 })}
    `),
  },

  "parallel-lines": {
    alt: "Parallel lines cut by a transversal showing alternate angles",
    caption: "Parallel lines — alternate angles are equal.",
    svg: svgWrap(`${diagramStyles}
      <line x1="50" y1="85" x2="350" y2="85" stroke="currentColor" stroke-width="2"/>
      <line x1="50" y1="165" x2="350" y2="165" stroke="currentColor" stroke-width="2"/>
      <line x1="110" y1="45" x2="290" y2="205" stroke="#4f46e5" stroke-width="2"/>
      ${label(38, 82, "line a", { anchor: "end", w: 52 })}
      ${label(38, 168, "line b", { anchor: "end", w: 52 })}
      ${label(148, 62, "θ", { w: 28, accent: true })}
      ${label(248, 188, "θ", { w: 28, accent: true })}
    `),
  },

  "linear-graph": {
    alt: "Straight line graph with positive gradient",
    caption: "Linear graph — gradient m = rise ÷ run.",
    svg: svgWrap(`${diagramStyles}
      <line x1="45" y1="205" x2="355" y2="205" stroke="currentColor" stroke-width="1.5"/>
      <line x1="75" y1="225" x2="75" y2="40" stroke="currentColor" stroke-width="1.5"/>
      <line x1="75" y1="205" x2="295" y2="75" stroke="#4f46e5" stroke-width="3"/>
      <line x1="175" y1="145" x2="255" y2="105" stroke="#4f46e5" stroke-width="2" stroke-dasharray="6 4"/>
      ${label(268, 88, "gradient m", { w: 88, accent: true })}
    `),
  },

  multiplication: {
    alt: "Array of dots in 3 rows of 4",
    caption: "Array — 3 × 4 = 12 (3 rows, 4 columns).",
    svg: svgWrap(`${diagramStyles}
      ${Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) =>
          `<circle cx="${130 + c * 42}" cy="${75 + r * 42}" r="11" fill="#4f46e5" opacity="0.65"/>`,
        ).join(""),
      ).join("")}
      ${label(200, 215, "3 × 4 = 12", { w: 88 })}
    `),
  },

  equation: {
    alt: "Balance scale showing both sides equal",
    caption: "Equations balance — do the same to both sides.",
    svg: svgWrap(`${diagramStyles}
      <line x1="200" y1="55" x2="200" y2="95" stroke="currentColor" stroke-width="3"/>
      <line x1="95" y1="95" x2="305" y2="95" stroke="currentColor" stroke-width="3"/>
      <line x1="115" y1="95" x2="85" y2="165" stroke="currentColor" stroke-width="2"/>
      <line x1="285" y1="95" x2="315" y2="165" stroke="currentColor" stroke-width="2"/>
      <rect x="55" y="145" width="78" height="38" rx="6" fill="none" stroke="#4f46e5" stroke-width="2"/>
      <rect x="245" y="145" width="78" height="38" rx="6" fill="none" stroke="#4f46e5" stroke-width="2"/>
      ${label(94, 168, "2x + 1", { w: 56 })}
      ${label(284, 168, "9", { w: 32 })}
      ${label(200, 200, "both sides equal", { w: 118 })}
    `),
  },

  ratio: {
    alt: "Bar split in ratio 2 to 3",
    caption: "Ratio 2:3 — bar divided into 5 equal parts.",
    svg: svgWrap(`${diagramStyles}
      <rect x="70" y="100" width="110" height="48" fill="#4f46e5" opacity="0.45" stroke="currentColor"/>
      <rect x="180" y="100" width="165" height="48" fill="#4f46e5" opacity="0.2" stroke="currentColor"/>
      <line x1="180" y1="100" x2="180" y2="148" stroke="currentColor" stroke-width="2"/>
      ${label(125, 126, "2 parts", { w: 62 })}
      ${label(262, 126, "3 parts", { w: 62 })}
      ${label(200, 175, "ratio 2 : 3", { w: 80 })}
    `),
  },

  probability: {
    alt: "Probability scale from 0 to 1",
    caption: "Probability from 0 (impossible) to 1 (certain).",
    svg: svgWrap(`${diagramStyles}
      <line x1="55" y1="130" x2="345" y2="130" stroke="currentColor" stroke-width="3"/>
      ${label(42, 130, "0", { w: 28 })}
      ${label(358, 130, "1", { anchor: "start", w: 28 })}
      <circle cx="200" cy="130" r="7" fill="#4f46e5"/>
      ${label(200, 95, "even chance", { w: 92 })}
      ${label(200, 168, "P = 1/2", { w: 56 })}
    `),
  },

  histogram: {
    alt: "Histogram with bars of different widths",
    caption: "Histogram — area of each bar = frequency.",
    svg: svgWrap(`${diagramStyles}
      <line x1="50" y1="205" x2="360" y2="205" stroke="currentColor" stroke-width="2"/>
      ${[
        [75, 55, 48],
        [133, 38, 38],
        [181, 88, 68],
        [259, 48, 88],
      ]
        .map(([x, h, w]) => `<rect x="${x}" y="${205 - h}" width="${w}" height="${h}" fill="#4f46e5" opacity="0.4" stroke="currentColor"/>`)
        .join("")}
      ${label(200, 228, "frequency density → height", { w: 200 })}
    `),
  },

  vector: {
    alt: "Vector arrow from origin",
    caption: "Column vector (x, y) — move x right, y up.",
    svg: svgWrap(`${diagramStyles}
      <line x1="70" y1="205" x2="330" y2="205" stroke="currentColor" stroke-width="1.5"/>
      <line x1="70" y1="205" x2="70" y2="45" stroke="currentColor" stroke-width="1.5"/>
      <line x1="70" y1="205" x2="205" y2="118" stroke="#4f46e5" stroke-width="3"/>
      <polygon points="205,118 193,126 197,113" fill="#4f46e5"/>
      ${label(228, 108, "(3, 4)", { anchor: "start", w: 52, accent: true })}
      ${label(48, 212, "x", { w: 24 })}
      ${label(52, 48, "y", { w: 24 })}
    `),
  },

  money: {
    alt: "Coins adding to a total",
    caption: "Add coin values to find a total amount.",
    svg: svgWrap(`${diagramStyles}
      <circle cx="130" cy="125" r="32" fill="none" stroke="currentColor" stroke-width="2"/>
      ${label(130, 128, "10p", { w: 40 })}
      <circle cx="205" cy="125" r="32" fill="none" stroke="currentColor" stroke-width="2"/>
      ${label(205, 128, "5p", { w: 36 })}
      ${label(300, 128, "= 15p", { w: 56, accent: true })}
    `),
  },

  clock: {
    alt: "Analogue clock showing half past",
    caption: "Clock — half past means minute hand on 6.",
    svg: svgWrap(`${diagramStyles}
      <circle cx="200" cy="120" r="68" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="200" y1="120" x2="200" y2="68" stroke="currentColor" stroke-width="3"/>
      <line x1="200" y1="120" x2="238" y2="148" stroke="#4f46e5" stroke-width="2.5"/>
      ${label(200, 205, "half past", { w: 72 })}
    `),
  },

  "bar-chart": {
    alt: "Bar chart with three bars",
    caption: "Bar chart — compare categories by height.",
    svg: svgWrap(`${diagramStyles}
      <line x1="65" y1="205" x2="335" y2="205" stroke="currentColor" stroke-width="2"/>
      ${[
        [95, 75, "A"],
        [165, 120, "B"],
        [235, 90, "C"],
      ]
        .map(([x, h, cat]) => {
          const y = 205 - h;
          return `<rect x="${x}" y="${y}" width="48" height="${h}" fill="#4f46e5" opacity="0.5" stroke="currentColor"/>
            ${label(x + 24, 222, cat, { w: 28 })}`;
        })
        .join("")}
    `),
  },
};

/** Which inline diagram to show per topic */
export const topicDiagramIds: Record<string, string> = {
  "ks1-counting": "number-line",
  "ks1-addition": "number-line",
  "ks1-subtraction": "number-line",
  "ks1-shapes": "shapes",
  "ks1-time": "clock",
  "ks1-money": "money",
  "ks1-fractions-basics": "fractions",
  "ks2-multiplication": "multiplication",
  "ks2-division": "multiplication",
  "ks2-decimals": "number-line",
  "ks2-fractions": "fractions",
  "ks2-geometry": "shapes",
  "ks2-measurements": "shapes",
  "ks2-word-problems": "bar-chart",
  "ks3-algebra": "equation",
  "ks3-ratios": "ratio",
  "ks3-probability": "probability",
  "ks3-graphs": "linear-graph",
  "ks3-angles": "parallel-lines",
  "ks3-statistics": "bar-chart",
  "ks3-percentages": "fractions",
  "ks3-equations": "equation",
  "ks4-gcse-foundation": "linear-graph",
  "ks4-gcse-higher": "parabola",
  "ks4-trigonometry": "right-triangle",
  "ks4-simultaneous-equations": "equation",
  "ks4-quadratics": "parabola",
  "ks4-functions": "linear-graph",
  "ks4-vectors": "vector",
  "ks4-histograms": "histogram",
  "ks4-circle-theorems": "circle",
  "ks4-probability-trees": "probability",
  "ks4-algebraic-fractions": "fractions",
};

export function resolveDiagram(topicId: string): DiagramAsset | undefined {
  const id = topicDiagramIds[topicId];
  return id ? diagramAssets[id] : undefined;
}

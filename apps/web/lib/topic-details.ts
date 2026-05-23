export type StageKey = "KS1" | "KS2" | "KS3" | "KS4";

export type Formula = { label: string; expression: string };
export type TopicDetail = {
  detailedExplanation: string;
  formulas: Formula[];
  workedExamples: string[];
  topicLinks: { label: string; url: string }[];
};

const BBC: Record<StageKey, string> = {
  KS1: "https://www.bbc.co.uk/bitesize/subjects/zjxhfg8",
  KS2: "https://www.bbc.co.uk/bitesize/subjects/z826n39",
  KS3: "https://www.bbc.co.uk/bitesize/subjects/zqny6sg",
  KS4: "https://www.bbc.co.uk/bitesize/subjects/z38pycw",
};

function D(
  stage: StageKey,
  paragraphs: string[],
  formulas: [string, string][],
  examples: string[],
  extraLinks: { label: string; url: string }[] = [],
): TopicDetail {
  return {
    detailedExplanation: paragraphs.join("\n\n"),
    formulas: formulas.map(([label, expression]) => ({ label, expression })),
    workedExamples: examples,
    topicLinks: [
      { label: `BBC Bitesize — ${stage} maths`, url: BBC[stage] },
      ...extraLinks,
    ],
  };
}

/** Rich content for each topic at its key stage only (no cross-stage blocks). */
export const topicDetails: Record<string, TopicDetail> = {
  "ks1-counting": D(
    "KS1",
    [
      "In KS1, counting is the first step to understanding number. Pupils count objects one-by-one, count forwards and backwards, and begin skip-counting in 2s, 5s and 10s.",
      "A number line helps pupils see order and gaps. Comparing numbers uses words such as more than, less than and equal to before formal symbols.",
      "Secure counting to 20 (and beyond) supports addition, subtraction and place value in Year 2.",
    ],
    [
      ["Next number", "number after n = n + 1"],
      ["Count in 2s", "0, 2, 4, 6, …"],
      ["Compare", "largest = greatest value"],
    ],
    [
      "Count 12 cubes: touch each cube once as you say the number.",
      "Number line: start at 7, jump forward 3 lands on 10.",
      "Order these: 9, 4, 11 → 4, 9, 11.",
    ],
    [{ label: "Maths is Fun — Counting", url: "https://www.mathsisfun.com/numbers/counting.html" }],
  ),

  "ks1-addition": D(
    "KS1",
    [
      "KS1 addition joins two or more groups to find how many altogether. Pupils start with objects and pictures, then use number bonds.",
      "Number bonds to 10 and 20 are key facts (e.g. 7 + 3 = 10). Bridging through 10 helps harder sums such as 8 + 5 = 8 + 2 + 3 = 10 + 3 = 13.",
      "The + sign means plus or add. Always check by counting or using the related subtraction fact.",
    ],
    [
      ["Addition", "a + b = total"],
      ["Number bond", "parts that make a whole (e.g. 6 + 4 = 10)"],
      ["Bridging 10", "split a number to reach 10 first"],
    ],
    [
      "3 red counters + 5 blue counters = 8 counters.",
      "9 + 6: think 9 + 1 = 10, then 10 + 5 = 15.",
      "Word problem: 4 birds on a branch, 3 more arrive → 4 + 3 = 7 birds.",
    ],
  ),

  "ks1-subtraction": D(
    "KS1",
    [
      "Subtraction finds how many are left, the difference between numbers, or what must be added to reach a target. It is the inverse of addition.",
      "Pupils use take away with objects, count back on a number line, and learn phrases: difference, less than, fewer.",
      "Every subtraction links to an addition fact: if 12 − 5 = 7 then 7 + 5 = 12.",
    ],
    [
      ["Subtraction", "a − b = difference"],
      ["Take away", "start − removed = left"],
      ["Inverse", "if a − b = c then c + b = a"],
    ],
    [
      "12 − 5: count back 5 from 12 on a number line → 7.",
      "Bar model: show 10 as a bar, split off 4, remainder 6.",
      "Missing number: 10 − □ = 6 → □ = 4 because 4 + 6 = 10.",
    ],
  ),

  "ks1-shapes": D(
    "KS1",
    [
      "Pupils name and describe 2D shapes (flat) and 3D shapes (solid). They count sides, vertices (corners) and faces.",
      "Common 2D shapes: circle, triangle, square, rectangle. Common 3D: cube, cuboid, sphere, cylinder, cone, pyramid.",
      "Symmetry and position words (above, below, left, right) build spatial reasoning for later geometry.",
    ],
    [
      ["Triangle", "3 sides, 3 vertices"],
      ["Square", "4 equal sides, 4 right angles"],
      ["Cube", "6 square faces"],
    ],
    [
      "How many sides on a hexagon? → 6.",
      "Which 3D shape rolls? → sphere (and cylinder).",
      "Mirror line through a square: 4 lines of symmetry.",
    ]
  ),

  "ks1-time": D(
    "KS1",
    [
      "Children read analogue clocks to o'clock and half past, sequence days and months, and compare durations in simple contexts.",
      "Key facts: 60 minutes in 1 hour, 24 hours in 1 day, 7 days in 1 week.",
      "Vocabulary: earlier, later, morning, afternoon, how long until…",
    ],
    [
      ["O'clock", "minute hand on 12"],
      ["Half past", "minute hand on 6 → 30 minutes"],
      ["Days in a week", "7"],
    ],
    [
      "Draw hands for half past 9.",
      "Tuesday → next day is Wednesday.",
      "Lunch 12:00 to 12:30 is 30 minutes.",
    ],
  ),

  "ks1-money": D(
    "KS1",
    [
      "Pupils recognise UK coins (1p–£2) and combine amounts in pence. Simple shopping problems use addition and subtraction.",
      "Recording money uses p for pence and £ for pounds. 100p = £1.",
      "Finding change means subtracting the price from the amount paid.",
    ],
    [
      ["Total cost", "add all prices"],
      ["Change", "paid − price"],
      ["£1", "100p"],
    ],
    [
      "5p + 2p + 2p = 9p.",
      "Toy 35p, pay 50p → change 15p.",
      "Two 20p coins make 40p.",
    ],
  ),

  "ks1-fractions-basics": D(
    "KS1",
    [
      "Fractions describe equal parts of a whole or set. KS1 focuses on halves and quarters of shapes and small quantities.",
      "One half means 1 part out of 2 equal parts. One quarter means 1 out of 4 equal parts.",
      "Pupils compare simple unit fractions using diagrams before written symbols.",
    ],
    [
      ["Half", "1/2 = one of two equal parts"],
      ["Quarter", "1/4 = one of four equal parts"],
      ["Half of a number", "number ÷ 2"],
    ],
    [
      "Shade half of a rectangle split into 2 equal columns.",
      "Half of 10 apples = 5 apples.",
      "Which is larger: 1/2 or 1/4? → 1/2.",
    ]
  ),

  "ks2-multiplication": D(
    "KS2",
    [
      "Multiplication is repeated addition and scaling. Pupils learn times tables to 12 × 12 and use grid or column methods for larger numbers.",
      "Arrays show multiplication visually: 3 rows of 4 = 3 × 4 = 12.",
      "Commutative law: 3 × 4 = 4 × 3. Use known facts to derive others (6 × 7 = 6 × 3 + 6 × 4).",
    ],
    [
      ["Multiply", "a × b = a groups of b"],
      ["Commutative", "a × b = b × a"],
      ["Grid method", "partition each number then add partial products"],
    ],
    [
      "7 × 8 = 56 (from times tables).",
      "23 × 4 = (20 × 4) + (3 × 4) = 92.",
      "A tray has 6 rows of 8 buns → 6 × 8 = 48 buns.",
    ],
  ),

  "ks2-division": D(
    "KS2",
    [
      "Division shares into equal groups or finds how many times one number fits into another. It links to multiplication facts.",
      "Remainders appear when sharing does not come out exactly. Interpret remainders in context (left over apples vs need extra boxes).",
      "Short division (bus stop) is used for larger numbers with place value understanding.",
    ],
    [
      ["Division", "a ÷ b = how many b in a"],
      ["Inverse", "if a ÷ b = c then c × b = a"],
      ["Remainder", "amount left after equal sharing"],
    ],
    [
      "48 ÷ 6 = 8 because 6 × 8 = 48.",
      "19 ÷ 4 = 4 remainder 3 (4 full groups, 3 left).",
      "Share 45 sweets among 9 children → 45 ÷ 9 = 5 each.",
    ],
  ),

  "ks2-decimals": D(
    "KS2",
    [
      "Decimals extend the place value system to tenths and hundredths. The decimal point separates wholes from parts.",
      "Money and measure use decimals daily (e.g. 3.5 m, £2.75). Compare by looking at each place value column.",
      "Multiply/divide by 10, 100 shifts digits left or right on a place value chart.",
    ],
    [
      ["Tenths", "0.1 = 1/10"],
      ["Hundredths", "0.01 = 1/100"],
      ["Compare", "compare tenths, then hundredths"],
    ],
    [
      "0.6 + 0.27 = 0.87.",
      "Order: 0.5, 0.25, 0.9 → 0.25, 0.5, 0.9.",
      "3.4 × 10 = 34 (digits move one place left).",
    ],
  ),

  "ks2-fractions": D(
    "KS2",
    [
      "KS2 fractions include equivalence, simplifying, and adding/subtracting with the same denominator. Mixed numbers combine wholes and parts.",
      "Multiply a fraction by a whole number: multiply the numerator only. Find fractions of amounts using division.",
      "Always use diagrams until the method is secure.",
    ],
    [
      ["Equivalent", "same value, different look (e.g. 1/2 = 2/4)"],
      ["Add same denominator", "a/c + b/c = (a+b)/c"],
      ["Fraction of amount", "amount × numerator ÷ denominator"],
    ],
    [
      "1/3 + 1/3 = 2/3.",
      "2/5 of 60 = 60 ÷ 5 × 2 = 24.",
      "Simplify 8/12 → divide top and bottom by 4 → 2/3.",
    ]
  ),

  "ks2-geometry": D(
    "KS2",
    [
      "Geometry covers properties of 2D and 3D shapes, angles, symmetry, coordinates and translations.",
      "Angles are measured in degrees. Angles on a straight line sum to 180°; around a point sum to 360°.",
      "Coordinates are written (x, y): move right for x, up for y.",
    ],
    [
      ["Angles on a line", "sum = 180°"],
      ["Angles at a point", "sum = 360°"],
      ["Area of rectangle", "length × width"],
    ],
    [
      "Find missing angle on a line: 70° and ? → 110°.",
      "Reflect a shape in a vertical mirror line.",
      "Plot points A(2,1) and B(5,4) on a grid.",
    ],
  ),

  "ks2-measurements": D(
    "KS2",
    [
      "Pupils convert between metric units (mm, cm, m, km; g, kg; ml, l) and solve perimeter and area problems.",
      "Perimeter is distance around a shape. Area for rectangles is length × width; for triangles, ½ × base × height.",
      "Always include units in the final answer.",
    ],
    [
      ["Perimeter", "sum of all side lengths"],
      ["Area (rectangle)", "L × W"],
      ["Convert cm → m", "divide by 100"],
    ],
    [
      "Rectangle 6 cm by 4 cm: perimeter 20 cm, area 24 cm².",
      "2.3 km = 2300 m.",
      "Volume of cuboid 3 × 4 × 2 = 24 cm³.",
    ],
  ),

  "ks2-word-problems": D(
    "KS2",
    [
      "Word problems require reading carefully, choosing an operation and checking if the answer is reasonable.",
      "Bar models draw the maths story. Key words are guides only — always think about the situation.",
      "Multi-step problems may need two calculations (e.g. total cost then change).",
    ],
    [
      ["Estimate first", "round then calculate roughly"],
      ["Bar model", "visual strip for parts and total"],
      ["Check", "does the answer fit the story?"],
    ],
    [
      "Shop: 3 items at £2 each → 3 × 2 = £6.",
      "Train leaves 09:15, journey 45 min → arrive 10:00.",
      "Share 52 cards among 4 players → 52 ÷ 4 = 13 each.",
    ],
  ),

  "ks3-algebra": D(
    "KS3",
    [
      "Algebra uses letters for unknown numbers and general rules. Pupils simplify expressions by collecting like terms and solve linear equations.",
      "Substitution replaces a variable with a number. Formulae such as C = 2πr are evaluated by substituting values.",
      "Always show steps and check solutions by substituting back.",
    ],
    [
      ["Like terms", "same letter and power can be combined"],
      ["Solve linear", "use inverse operations both sides"],
      ["Substitution", "replace letter with value"],
    ],
    [
      "Simplify 5a + 2a − a = 6a.",
      "Solve 3x + 4 = 19 → 3x = 15 → x = 5.",
      "If y = 2x + 1 and x = 4, y = 9.",
    ],
    [{ label: "Dr Frost — Algebra", url: "https://www.drfrost.org/" }],
  ),

  "ks3-ratios": D(
    "KS3",
    [
      "Ratio compares parts of a whole or scales one quantity to another. Write ratios in simplest form by dividing by the HCF.",
      "Sharing in ratio: add parts, divide total by sum of parts, multiply by each share.",
      "Direct proportion means as one quantity doubles, so does the other (y = kx).",
    ],
    [
      ["Simplify ratio", "divide all parts by HCF"],
      ["Share £A in m:n", "parts = m+n, one part = A÷(m+n)"],
      ["Direct proportion", "y/x = constant"],
    ],
    [
      "Simplify 18:24 → 3:4.",
      "Divide 60 in ratio 2:3 → £24 and £36.",
      "Recipe scale 3:2 flour:sugar, 300 g flour → 200 g sugar.",
    ],
  ),

  "ks3-probability": D(
    "KS3",
    [
      "Probability measures likelihood from 0 (impossible) to 1 (certain). For equally likely outcomes: P(event) = favourable / total.",
      "Sample spaces list all outcomes. Combined events use tables or tree diagrams.",
      "Experimental probability comes from trials; theoretical from reasoning.",
    ],
    [
      ["Probability", "P = favourable outcomes / total outcomes"],
      ["Complement", "P(not A) = 1 − P(A)"],
      ["Range", "0 ≤ P ≤ 1"],
    ],
    [
      "Fair die P(6) = 1/6.",
      "Bag 3 red, 7 blue: P(red) = 3/10.",
      "Two coins: HH, HT, TH, TT → P(two heads) = 1/4.",
    ],
  ),

  "ks3-graphs": D(
    "KS3",
    [
      "Coordinates plot points (x, y). Linear graphs follow y = mx + c where m is gradient and c is y-intercept.",
      "Gradient = change in y ÷ change in x. Parallel lines have equal gradients.",
      "Real graphs tell stories (distance-time, conversion graphs).",
    ],
    [
      ["Gradient", "m = Δy / Δx"],
      ["y-intercept", "c where line crosses y-axis"],
      ["y = mx + c", "linear equation"],
    ],
    [
      "Plot y = 2x + 1 for x = 0,1,2,3.",
      "Gradient between (1,2) and (4,8) = 6/3 = 2.",
      "Horizontal line has gradient 0.",
    ]
  ),

  "ks3-angles": D(
    "KS3",
    [
      "Angle facts: on a straight line sum 180°; at a point sum 360°; vertically opposite angles are equal.",
      "Parallel lines create alternate and corresponding equal angles with a transversal.",
      "Angles in a triangle sum to 180°; in a quadrilateral sum to 360°.",
    ],
    [
      ["Straight line", "angles sum to 180°"],
      ["Point", "angles sum to 360°"],
      ["Triangle", "interior angles sum to 180°"],
    ],
    [
      "Triangle angles 55° and 70° → third = 55°.",
      "Parallel lines: alternate angle = 48°.",
      "Exterior angle of triangle equals sum of opposite interiors.",
    ]
  ),

  "ks3-statistics": D(
    "KS3",
    [
      "Data is summarised with averages (mean, median, mode) and spread (range). Choose the best average for the data type.",
      "Charts include bar charts, pie charts, scatter graphs. Correlation describes trend in scatter plots.",
      "Grouped data uses midpoints to estimate the mean.",
    ],
    [
      ["Mean", "sum of values ÷ count"],
      ["Median", "middle value when ordered"],
      ["Range", "largest − smallest"],
    ],
    [
      "Mean of 4, 7, 8 = 19/3 ≈ 6.33.",
      "Median of 3, 5, 9, 12 = (5+9)/2 = 7.",
      "Describe positive correlation on a scatter graph.",
    ],
  ),

  "ks3-percentages": D(
    "KS3",
    [
      "Percent means out of 100. Convert fraction ↔ decimal ↔ percentage. Find % of an amount by multiplying by the decimal form.",
      "Increase/decrease: multiplier = 1 ± (percentage/100). Reverse problems divide by the multiplier.",
      "Compound interest applies the multiplier repeatedly.",
    ],
    [
      ["% of amount", "amount × (p/100)"],
      ["Increase 20%", "× 1.20"],
      ["Decrease 15%", "× 0.85"],
    ],
    [
      "15% of £80 = 0.15 × 80 = £12.",
      "£50 increased by 10% → £55.",
      "Sale price £72 after 20% off → original £90 (72 ÷ 0.8).",
    ],
  ),

  "ks3-equations": D(
    "KS3",
    [
      "Equations balance like a scale — do the same to both sides. Collect like terms before solving.",
      "Brackets multiply out: a(b + c) = ab + ac. Unknown on both sides: collect x terms one side, numbers the other.",
      "Always substitute the answer to verify.",
    ],
    [
      ["Balance", "same operation both sides"],
      ["Expand", "a(b + c) = ab + ac"],
      ["Two-step", "ax + b = c → ax = c − b"],
    ],
    [
      "Solve 5x − 3 = 2x + 9 → 3x = 12 → x = 4.",
      "Solve 2(x − 3) = 10 → x − 3 = 5 → x = 8.",
      "Make x subject: y = x + 7 → x = y − 7.",
    ],
  ),

  "ks4-gcse-foundation": D(
    "KS4",
    [
      "GCSE Foundation covers grades 1–5: number, ratio, algebra, geometry, probability and statistics with clear methods.",
      "Show working step by step. Use calculators where allowed and round as instructed.",
      "Focus on fluent arithmetic, linear graphs, standard form, and interpreting charts.",
    ],
    [
      ["Standard form", "a × 10ⁿ, 1 ≤ a < 10"],
      ["Pythagoras", "a² + b² = c² (right triangle)"],
      ["Percentage multiplier", "new = old × multiplier"],
    ],
    [
      "Solve 4x − 7 = 13 → x = 5.",
      "Triangle legs 6 cm and 8 cm → hypotenuse 10 cm.",
      "Share £84 in ratio 3:4 → £36 and £48.",
    ],
    [{ label: "Maths Genie — GCSE", url: "https://www.mathsgenie.co.uk/gcse.html" }],
  ),

  "ks4-gcse-higher": D(
    "KS4",
    [
      "GCSE Higher targets grades 4–9 with advanced algebra, trigonometry, circle theorems, functions and proof.",
      "Algebraic fluency (factorising, quadratics, surds) is essential. Show logical reasoning in proof questions.",
      "Non-calculator papers need strong mental and written methods.",
    ],
    [
      ["Quadratic formula", "x = (−b ± √(b²−4ac)) / 2a"],
      ["Difference of squares", "a² − b² = (a+b)(a−b)"],
      ["Gradient", "m = (y₂−y₁)/(x₂−x₁)"],
    ],
    [
      "Factorise x² + 7x + 12 → (x+3)(x+4).",
      "Expand (x+2)² = x² + 4x + 4.",
      "Prove consecutive integers differ by 1 using algebra.",
    ],
    [{ label: "Maths Genie — Higher", url: "https://www.mathsgenie.co.uk/gcse.html" }],
  ),

  "ks4-trigonometry": D(
    "KS4",
    [
      "GCSE trigonometry links angles and sides in triangles. In right-angled triangles use SOH CAH TOA with the hypotenuse opposite the right angle.",
      "Label sides relative to angle θ: opposite, adjacent, hypotenuse. Calculator mode must be degrees for GCSE.",
      "Non-right triangles use the sine rule and cosine rule. Area = ½ab sin C. Know exact values: sin 30° = ½, cos 60° = ½, tan 45° = 1.",
      "Trig graphs y = sin x, cos x, tan x appear on Higher tier; solve basic equations in a given interval.",
    ],
    [
      ["sin θ", "opposite / hypotenuse"],
      ["cos θ", "adjacent / hypotenuse"],
      ["tan θ", "opposite / adjacent"],
      ["Sine rule", "a / sin A = b / sin B = c / sin C"],
      ["Cosine rule", "a² = b² + c² − 2bc cos A"],
      ["Area", "½ × a × b × sin C"],
    ],
    [
      "Right triangle: opp = 5 cm, hyp = 13 cm → sin θ = 5/13.",
      "Angle of elevation: tree shadow forms right triangle with tan θ = opp/adj.",
      "Solve sin θ = 0.5 for 0° ≤ θ ≤ 180° → θ = 30° or 150°.",
    ],
    [
      { label: "BBC Bitesize — Trigonometry", url: "https://www.bbc.co.uk/bitesize/topics/hyqfb9q" },
      { label: "Corbettmaths — Trigonometry", url: "https://corbettmaths.com/contents/" },
    ],
  ),

  "ks4-simultaneous-equations": D(
    "KS4",
    [
      "Two equations at once define a point (x, y) that satisfies both. Linear pairs can be solved by elimination or substitution.",
      "Elimination: multiply equations so one variable cancels when added/subtracted. Substitution: express one variable and replace in the other.",
      "One solution means lines cross; parallel lines give no solution; identical lines give infinitely many.",
    ],
    [
      ["Elimination", "match coefficients of one variable"],
      ["Substitution", "y = … from one equation into the other"],
      ["Graphical", "intersection of two lines"],
    ],
    [
      "x + y = 10 and x − y = 2 → add: 2x = 12 → x = 6, y = 4.",
      "y = 3x and x + y = 20 → x + 3x = 20 → x = 5.",
      "Check solution in both original equations.",
    ],
  ),

  "ks4-quadratics": D(
    "KS4",
    [
      "Quadratics contain x² as the highest power. Graphs are parabolas (U-shaped). Solve by factorising, completing the square or the quadratic formula.",
      "Discriminant b² − 4ac tells roots: positive → two real; zero → one repeated; negative → no real roots.",
      "Expand (x + a)(x + b) = x² + (a+b)x + ab. Vertex form a(x − h)² + k shows turning point (h, k).",
    ],
    [
      ["Factorise", "x² + bx + c = (x + p)(x + q) where pq = c, p+q = b"],
      ["Quadratic formula", "x = (−b ± √(b²−4ac)) / 2a"],
      ["Discriminant", "Δ = b² − 4ac"],
    ],
    [
      "Solve x² − 5x + 6 = 0 → (x−2)(x−3)=0 → x = 2 or 3.",
      "Complete square x² + 6x + 5 = (x+3)² − 4.",
      "Sketch y = x² − 4x turning point at (2, −4).",
    ]
  ),

  "ks4-functions": D(
    "KS4",
    [
      "A function maps each input to exactly one output, written f(x). Composite fg(x) means apply g then f.",
      "Inverse f⁻¹ undoes f. Domain is allowed inputs; range is possible outputs.",
      "Graph transformations: f(x) + a shifts up; f(x + a) shifts left; af(x) stretches vertically.",
    ],
    [
      ["Function notation", "y = f(x)"],
      ["Composite", "fg(x) = f(g(x))"],
      ["Inverse", "f(f⁻¹(x)) = x"],
    ],
    [
      "f(x) = 2x − 1, f(3) = 5.",
      "fg(2) where f(x)=x+1, g(x)=x² → g(2)=4, f(4)=5.",
      "Reflect y = f(x) in x-axis → y = −f(x).",
    ],
  ),

  "ks4-vectors": D(
    "KS4",
    [
      "Vectors have magnitude and direction, written as column vectors (x, y) or with bold letters. Add by adding components; multiply by scalar k stretches the vector.",
      "Parallel vectors are scalar multiples. Use vectors for translations and geometric proofs (e.g. midpoint of AB).",
      "Magnitude |a| = √(x² + y²) for vector (x, y).",
    ],
    [
      ["Column vector", "v = (x, y)"],
      ["Add", "(a,b) + (c,d) = (a+c, b+d)"],
      ["Magnitude", "|v| = √(x² + y²)"],
    ],
    [
      "(3,1) + (−2,4) = (1,5).",
      "Translate point A by vector (2,−3).",
      "|(3,4)| = √(9+16) = 5.",
    ],
  ),

  "ks4-histograms": D(
    "KS4",
    [
      "Histograms display grouped continuous data. Bar area represents frequency, not height alone.",
      "Frequency density = frequency ÷ class width. Height of bar = frequency density.",
      "Estimate mean using class midpoints × frequency, then divide by total frequency.",
    ],
    [
      ["Frequency density", "frequency / class width"],
      ["Frequency", "area of bar"],
      ["Estimated mean", "Σ(midpoint × freq) / Σfreq"],
    ],
    [
      "Class 10–20 width 10, frequency 40 → density 4.",
      "Read proportion between two values from cumulative frequency.",
      "Compare spread using interquartile range from CF graph.",
    ],
  ),

  "ks4-circle-theorems": D(
    "KS4",
    [
      "Circle theorems describe angle and line relationships. Angle at the centre is twice angle at the circumference on the same arc.",
      "Angle in a semicircle is 90°. Tangent is perpendicular to radius at the point of contact.",
      "Opposite angles in a cyclic quadrilateral sum to 180°. Two tangents from a point are equal in length.",
    ],
    [
      ["Centre vs circumference", "angle at centre = 2 × angle at circumference"],
      ["Semicircle", "angle in semicircle = 90°"],
      ["Tangent–radius", "tangent ⊥ radius"],
    ],
    [
      "Arc AB subtends 70° at centre → 35° at circumference.",
      "Tangent meets radius at 90° — find missing angle in triangle.",
      "Cyclic quadrilateral angles 85° and ? → 95°.",
    ]
  ),

  "ks4-probability-trees": D(
    "KS4",
    [
      "Tree diagrams show stages of combined experiments. Multiply along branches for AND; add end branches for OR.",
      "With replacement: probabilities stay the same each stage. Without replacement: adjust the second branch.",
      "Conditional probability P(A|B) means probability of A given B has happened.",
    ],
    [
      ["AND (along branches)", "P(A and B) = P(A) × P(B|A)"],
      ["OR (different ends)", "add probabilities of separate routes"],
      ["Complement", "P(at least one) = 1 − P(none)"],
    ],
    [
      "Two fair coins: P(two heads) = ½ × ½ = ¼.",
      "Bag without replacement: P(red then blue) = (3/10)×(7/9).",
      "At least one six with two dice: 1 − (5/6)².",
    ],
  ),

  "ks4-algebraic-fractions": D(
    "KS4",
    [
      "Algebraic fractions follow the same rules as number fractions. Factorise numerator/denominator before cancelling common factors.",
      "To add/subtract, find a common denominator (often the product of denominators). Multiply tops and combine.",
      "Solve equations by multiplying both sides by the denominator — check solutions do not make denominator zero.",
    ],
    [
      ["Cancel", "factorise, then cancel common factors"],
      ["Add", "a/b + c/d = (ad + bc) / bd"],
      ["Solve", "multiply through by LCD"],
    ],
    [
      "(x² − 9)/(x − 3) = (x+3)(x−3)/(x−3) = x+3 (x ≠ 3).",
      "1/x + 1/(2x) = 3/(2x).",
      "Solve 4/(x−1) = 2 → multiply both sides by (x−1).",
    ],
  ),
};

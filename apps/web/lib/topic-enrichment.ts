export type StageKey = "KS1" | "KS2" | "KS3" | "KS4";

export type TopicEnrichment = {
  information: string;
  examplesByStage: Record<StageKey, string[]>;
  topicLinks: { label: string; url: string }[];
};

const BBC: Record<StageKey, string> = {
  KS1: "https://www.bbc.co.uk/bitesize/subjects/zjxhfg8",
  KS2: "https://www.bbc.co.uk/bitesize/subjects/z826n39",
  KS3: "https://www.bbc.co.uk/bitesize/subjects/zqny6sg",
  KS4: "https://www.bbc.co.uk/bitesize/subjects/z38pycw",
};

function ex(ks1: string[], ks2: string[], ks3: string[], ks4: string[]): Record<StageKey, string[]> {
  return { KS1: ks1, KS2: ks2, KS3: ks3, KS4: ks4 };
}

function links(extra: { label: string; url: string }[]): TopicEnrichment["topicLinks"] {
  return [
    { label: "BBC Bitesize — KS1 maths", url: BBC.KS1 },
    { label: "BBC Bitesize — KS2 maths", url: BBC.KS2 },
    { label: "BBC Bitesize — KS3 maths", url: BBC.KS3 },
    { label: "BBC Bitesize — GCSE maths", url: BBC.KS4 },
    ...extra,
  ];
}

export const topicEnrichment: Record<string, TopicEnrichment> = {
  "ks1-counting": {
    information:
      "Counting underpins all number work: pupils learn to count forwards and backwards, compare quantities, and use number lines. Secure counting in steps prepares learners for multiplication and sequences later on.",
    examplesByStage: ex(
      ["Count 15 cubes into groups of five.", "What number is 3 more than 17?", "Place 8, 12 and 5 in order smallest to largest."],
      ["Count in 4s from 0 to 48.", "Count backwards from 100 in tens.", "Estimate a set of about 50 items then count to check."],
      ["Write the next three terms: 4, 7, 10, …", "Count outcomes when rolling two dice.", "Use a number line with negative values."],
      ["How many ways to arrange 3 books?", "Find the nth term when counting increases by 5.", "Counting principle: 4 shirts × 3 trousers."],
    ),
    topicLinks: links([{ label: "Maths is Fun — Counting", url: "https://www.mathsisfun.com/numbers/counting.html" }]),
  },
  "ks1-addition": {
    information:
      "Addition combines sets and builds number bonds. Pupils move from concrete objects to mental strategies such as bridging through 10, which supports faster calculation in later key stages.",
    examplesByStage: ex(
      ["6 + 4 = 10 using counters.", "9 + 7: split 7 into 1 + 6 to make 10 first.", "Word problem: 5 apples + 8 apples."],
      ["347 + 125 using column addition.", "Add three numbers: 24 + 16 + 30.", "Money: £2.40 + £1.35."],
      ["Simplify 3a + 5 + 2a.", "Add algebraic fractions with same denominator.", "Add vectors (3,1) + (−2,4)."],
      ["Add functions: f(x)+g(x).", "Add probabilities of mutually exclusive events.", "Matrix addition in transformations."],
    ),
    topicLinks: links([{ label: "NRICH — Number", url: "https://nrich.maths.org/primary" }]),
  },
  "ks1-subtraction": {
    information:
      "Subtraction finds the difference between numbers. It links to addition through inverse facts and supports solving comparison and take-away problems.",
    examplesByStage: ex(
      ["12 − 5 = 7 with a bar model.", "Check 9 − 4 using 4 + 5.", "Empty box: 10 − □ = 6."],
      ["503 − 178 with exchange.", "Difference between 625 and 489.", "Change from £5 for a £3.20 item."],
      ["Expand and simplify (2x+1) − (x−3).", "Solve 5x − 11 = 2x + 4.", "Subtract functions f(x) − g(x)."],
      ["Differentiate x² − 3x (term by term).", "Subtract surds: 3√2 − √2.", "Apply subtraction in vector proofs."],
    ),
    topicLinks: links([]),
  },
  "ks1-shapes": {
    information:
      "Shape work develops spatial reasoning. Pupils name 2D and 3D shapes, count faces and edges, and describe symmetry and position.",
    examplesByStage: ex(
      ["Name a shape with 6 square faces.", "How many lines of symmetry on a square?", "Describe position: 2 right, 1 up."],
      ["Angles in a triangle sum to 180°.", "Area of a parallelogram.", "Reflect a shape in the y-axis."],
      ["Circle theorem: angle in semicircle.", "Volume of a cylinder.", "Vector description of a translation."],
      ["Equation of a circle.", "3D trigonometry in a cuboid.", "Transformations matrix for rotation."],
    ),
    topicLinks: links([{ label: "Corbettmaths — Geometry", url: "https://corbettmaths.com/contents/" }]),
  },
  "ks1-time": {
    information:
      "Time includes reading clocks, calendars, and duration. Pupils learn units from seconds to days and solve simple problems about intervals.",
    examplesByStage: ex(
      ["Read half past 4 on an analogue clock.", "Order days of the week.", "How many months in a year?"],
      ["Convert 150 minutes to hours and minutes.", "Timetable: bus leaves 09:15, arrives 10:02.", "Calculate duration 45 min + 1 h 20 min."],
      ["Speed = distance ÷ time.", "Convert 2.5 hours to seconds.", "Graph a journey with changing speed."],
      ["Differentiate displacement with respect to time.", "Calculate arc length using time on a dial.", "Optimise a schedule using inequalities."],
    ),
    topicLinks: links([]),
  },
  "ks1-money": {
    information:
      "Money contexts teach decimals, addition, and change. Pupils recognise coins and notes and solve practical shopping problems.",
    examplesByStage: ex(
      ["Make 20p using two coins.", "Total cost: 35p + 12p.", "Change from £1 for 65p."],
      ["£4.50 + £2.75.", "20% off £18.", "Compare unit prices per kg."],
      ["Compound interest for 3 years.", "Reverse percentage: sale price was £72 after 10% off.", "Currency conversion at a given rate."],
      ["Exponential growth in investments.", "Marginal cost functions.", "Optimise profit with linear programming."],
    ),
    topicLinks: links([]),
  },
  "ks1-fractions-basics": {
    information:
      "Early fractions use halves and quarters of shapes and sets. Pupils learn that fractions are equal parts and begin to compare simple unit fractions.",
    examplesByStage: ex(
      ["Shade 1/4 of 12 stars.", "Which is larger: 1/2 or 1/3?", "Share 10 sweets between 2 equally."],
      ["Add 1/3 + 1/6.", "Convert 3/8 to a decimal.", "Find 2/5 of 60."],
      ["Solve 2/x + 1 = 5.", "Simplify (x²−1)/(x+1).", "Partial fractions decomposition."],
      ["Integrate rational functions.", "Algebraic fractions in equations.", "Binomial expansion with fractional indices."],
    ),
    topicLinks: links([]),
  },
  "ks2-multiplication": {
    information:
      "Multiplication represents repeated addition and scaling. Pupils learn tables, grid and column methods, and apply multiplication in area and scaling problems.",
    examplesByStage: ex(
      ["3 groups of 4 counters.", "7 × 6 from times tables.", "Rectangular array 5 × 8."],
      ["36 × 24 long multiplication.", "Scale a recipe by ×3.", "Area: 12 cm × 7 cm."],
      ["Expand (x+2)(x+3).", "Multiply algebraic fractions.", "Product rule for counting."],
      ["Differentiate x² · e^x.", "Multiply complex numbers.", "Matrix multiplication."],
    ),
    topicLinks: links([]),
  },
  "ks2-division": {
    information:
      "Division shares into equal groups or finds how many groups. It connects to fractions and underpins ratio and algebra manipulation later.",
    examplesByStage: ex(
      ["Share 20 stickers among 4 children.", "24 ÷ 6 = ?", "Remainder: 17 ÷ 5."],
      ["456 ÷ 12 short division.", "Interpret remainder in context.", "Divide £84 in ratio 2:5."],
      ["Factorise 6x+9.", "Polynomial division overview.", "Divide surds: √50 ÷ √2."],
      ["Divide functions f/g.", "Quotient rule differentiation.", "Partial fractions after division."],
    ),
    topicLinks: links([]),
  },
  "ks2-decimals": {
    information:
      "Decimals extend place value to tenths and hundredths. Pupils compare, order, and calculate with decimals in measure and money.",
    examplesByStage: ex(
      ["Write 3 tenths as 0.3.", "Order 0.5, 0.25, 0.9.", "0.6 + 0.27."],
      ["3.4 × 0.2.", "Convert metres to kilometres.", "Round 4.687 to 2 d.p."],
      ["Write 0.0023 in standard form.", "Recurring decimal 1/3.", "Bounds from 3.4 cm (1 d.p.)."],
      ["Prove √2 is irrational.", "Use logarithms with decimals.", "Numerical methods for roots."],
    ),
    topicLinks: links([]),
  },
  "ks2-fractions": {
    information:
      "Fractions describe parts of a whole. Pupils equivalence, compare, and operate on fractions with like denominators before mixed numbers.",
    examplesByStage: ex(
      ["Equivalent to 1/2: 2/4.", "Add 1/5 + 2/5.", "Place 3/4 on a number line."],
      ["2 1/3 + 1 3/4.", "Multiply 2/3 × 4.", "Divide 3/4 ÷ 2."],
      ["Solve 3/(x−1) = 2.", "Simplify (x+1)/(x²−1).", "Partial fractions."],
      ["Integrate 1/(x+2).", "Algebraic fractions in quadratics.", "Binomial with fractional powers."],
    ),
    topicLinks: links([]),
  },
  "ks2-geometry": {
    information:
      "Geometry covers properties of shapes, angles, perimeter, and area. Pupils use correct vocabulary and begin coordinate work.",
    examplesByStage: ex(
      ["Perimeter of a rectangle 5 by 3.", "Identify parallel sides.", "Coordinates (2,4) on a grid."],
      ["Area of a triangle.", "Angles on a straight line.", "Translate a shape 3 right."],
      ["Circle theorems.", "Similar triangles.", "Trigonometry in right triangles."],
      ["Equation of tangent to a circle.", "3D Pythagoras.", "Vector proofs."],
    ),
    topicLinks: links([]),
  },
  "ks2-measurements": {
    information:
      "Measurement includes length, mass, capacity, and time conversions. Pupils choose suitable units and read scales accurately.",
    examplesByStage: ex(
      ["Measure a pencil in centimetres.", "Compare 1 kg and 500 g.", "Read a jug at 250 ml."],
      ["Convert 2.3 km to metres.", "Area in m² of a room.", "Volume of a cuboid."],
      ["Upper and lower bounds.", "Compound measures: density.", "Convert units in algebra."],
      ["Related rates problems.", "Optimisation with constraints.", "Calculus in kinematics."],
    ),
    topicLinks: links([]),
  },
  "ks2-word-problems": {
    information:
      "Word problems require reading, modelling, and choosing operations. Bar models and diagrams help represent the mathematics.",
    examplesByStage: ex(
      ["Ali has 5 more than Ben who has 8.", "Share 24 equally among some boxes.", "How much left after spending?"],
      ["Multi-step: tickets £4, 6 people, £10 note.", "Ratio of red to blue counters.", "Percentage increase problem."],
      ["Form equation from scenario.", "Simultaneous equations story.", "Quadratic model for area."],
      ["Exponential decay model.", "Statistical inference question.", "Optimisation with two variables."],
    ),
    topicLinks: links([{ label: "White Rose — Problem solving", url: "https://whiterosemaths.com/" }]),
  },
  "ks3-algebra": {
    information:
      "Algebra uses letters for unknowns and generalises patterns. Pupils substitute, simplify expressions, and solve linear equations.",
    examplesByStage: ex(
      ["Pattern: 2, 4, 6 — next number?", "□ + 3 = 10.", "Cost = 5 + 2n for n items."],
      ["Simplify 3a + 2a − a.", "Solve 4x − 7 = 21.", "Substitute x=2 into x²+1."],
      ["Expand (2x−1)(x+4).", "Factorise x²+7x+12.", "Solve 2x² = 18."],
      ["Complete the square.", "Algebraic proof (odd squares).", "Functions and composite fg(x)."],
    ),
    topicLinks: links([{ label: "DrFrost — Algebra", url: "https://www.drfrost.org/" }]),
  },
  "ks3-ratios": {
    information:
      "Ratio compares parts of a whole or scaling between quantities. It leads to proportion, maps, and multiplicative reasoning.",
    examplesByStage: ex(
      ["Red:blue counters 2:3, 10 red — how many blue?", "Scale drawing double size.", "Share £10 in ratio 1:1."],
      ["Divide 84 in ratio 3:4.", "Direct proportion: 5 books cost £20.", "Convert km to cm on a map 1:25000."],
      ["Inverse proportion: speed and time.", "Combine ratios.", "Growth factor 1.05 for 4 years."],
      ["Compound measures.", "Trigonometric ratios in non-right triangles.", "Ratio in algebraic geometry."],
    ),
    topicLinks: links([]),
  },
  "ks3-probability": {
    information:
      "Probability measures likelihood from 0 to 1. Pupils use experiments, sample spaces, and theoretical probability for fair events.",
    examplesByStage: ex(
      ["Impossible, certain, even chance language.", "Roll a die: P(6).", "Two colours on a spinner."],
      ["Two coins: list sample space.", "P(at least one head).", "Expected frequency out of 200 trials."],
      ["Tree diagrams without replacement.", "Conditional P(A|B).", "Venn diagram probabilities."],
      ["Binomial distribution context.", "Hypothesis testing intro.", "Combined events rules."],
    ),
    topicLinks: links([]),
  },
  "ks3-graphs": {
    information:
      "Graphs visualise relationships. Pupils plot coordinates, interpret linear graphs, and recognise gradients as rates of change.",
    examplesByStage: ex(
      ["Plot (1,2) and (3,5).", "Read a bar chart.", "Line graph of temperature."],
      ["y = 2x + 1 table of values.", "Gradient from graph.", "Distance-time graph story."],
      ["Plot y = x².", "Solve graphically x²=9.", "Recognise parallel lines same gradient."],
      ["Sketch y = sin x.", "Transform graphs y = af(x).", "Estimate solutions using intersection."],
    ),
    topicLinks: links([]),
  },
  "ks3-angles": {
    information:
      "Angle facts explain relationships in shapes and on lines. Pupils use angle sums in triangles and quadrilaterals and angle rules with parallel lines.",
    examplesByStage: ex(
      ["Right angle is 90°.", "Angles on a straight line.", "Compare acute and obtuse."],
      ["Angles in triangle 180°.", "Alternate angles equal.", "Exterior angle of triangle."],
      ["Interior angles in polygons.", "Bearings from North.", "Angle in semicircle theorem."],
      ["Circle theorems proof.", "Trigonometry for angles.", "Vectors and angle between lines."],
    ),
    topicLinks: links([]),
  },
  "ks3-statistics": {
    information:
      "Statistics summarises data. Pupils collect, display, and interpret data using tables, charts, averages, and spread.",
    examplesByStage: ex(
      ["Tally chart of favourite fruit.", "Find mode of a list.", "Read a pictogram."],
      ["Mean of 4, 7, 8.", "Compare median and mean.", "Line graph trends."],
      ["Grouped frequency mean estimate.", "Compare distributions.", "Scatter graph correlation."],
      ["Standard deviation idea.", "Regression line use.", "Interpret cumulative frequency."],
    ),
    topicLinks: links([]),
  },
  "ks3-percentages": {
    information:
      "Percentages are fractions out of 100. Pupils find percentages of amounts, convert between fractions/decimals/percentages, and solve increase/decrease problems.",
    examplesByStage: ex(
      ["50% means half.", "10% of 80.", "Shade 25% of a grid."],
      ["Increase 60 by 15%.", "Reverse: after 20% off costs £40.", "Compare 3/5 and 65%."],
      ["Compound interest 2 years.", "Percentage error with bounds.", "Exponential growth model."],
      ["Log scale graphs.", "Optimisation with percentages.", "Statistical confidence intervals."],
    ),
    topicLinks: links([]),
  },
  "ks3-equations": {
    information:
      "Equations maintain balance while finding unknowns. Pupils solve one- and two-step linear equations and rearrange simple formulae.",
    examplesByStage: ex(
      ["□ + 4 = 9.", "Balance scales model.", "Two-step: 2n + 1 = 11."],
      ["5x − 3 = 2x + 9.", "Equations with brackets.", "Form equation from words."],
      ["Simultaneous y=2x, x+y=12.", "Quadratic factorise solve.", "Change subject of A=πr²."],
      ["Solve quadratic formula.", "Simultaneous linear-quadratic.", "Inequalities on graphs."],
    ),
    topicLinks: links([]),
  },
  "ks4-gcse-foundation": {
    information:
      "GCSE Foundation consolidates number, algebra, geometry, and statistics to grade 5 standard. Focus is fluent methods and clear communication.",
    examplesByStage: ex(
      ["Number bonds and tables still useful.", "Standard written methods.", "Check answers with estimation."],
      ["Ratio and percentage mix questions.", "Area and volume formulae.", "Two-way tables."],
      ["Linear and quadratic graphs.", "Trigonometry in right triangles.", "Probability trees."],
      ["Foundation papers: multi-step problem.", "Interpret histograms.", "Reasoning with bounds."],
    ),
    topicLinks: links([{ label: "GCSE Foundation revision", url: "https://www.mathsgenie.co.uk/gcse.html" }]),
  },
  "ks4-gcse-higher": {
    information:
      "GCSE Higher extends to grades 6–9 with algebra, functions, trigonometry, and proof. Links strongly to A Level mathematics.",
    examplesByStage: ex(
      ["Secure number and fraction skills.", "Strong algebra manipulation.", "Accurate diagrams."],
      ["Quadratic graphs and roots.", "Trigonometry non-right.", "Circle theorems."],
      ["Vectors and proof.", "Functions and transformations.", "Algebraic fractions."],
      ["Higher tier: proof, sine rule, iteration.", "Composite and inverse functions.", "Gradients and tangents."],
    ),
    topicLinks: links([{ label: "GCSE Higher revision", url: "https://www.mathsgenie.co.uk/gcse.html" }]),
  },
  "ks4-trigonometry": {
    information:
      "Trigonometry relates angles and sides in triangles. GCSE includes SOHCAHTOA, sine/cosine rules, and graphs of trig functions.",
    examplesByStage: ex(
      ["Compare steepness of ramps.", "Right angle in corner of room.", "Turn 90° quarter turn."],
      ["Find missing side in right triangle.", "Angle of elevation problem.", "Use tanθ = opp/adj."],
      ["Sine rule for non-right triangle.", "Area ½ab sinC.", "Exact values sin 30°, cos 60°."],
      ["Solve 3sinθ = 2 in 0°–360°.", "Prove identities.", "Graph y = cos(2x)."],
    ),
    topicLinks: links([{ label: "Corbett — Trigonometry", url: "https://corbettmaths.com/contents/" }]),
  },
  "ks4-simultaneous-equations": {
    information:
      "Simultaneous equations meet at a point satisfying two rules. GCSE methods include elimination, substitution, and graphical intersection.",
    examplesByStage: ex(
      ["Two rules: x+y=10, x=6.", "Intersection on a grid.", "Prices of two items given totals."],
      ["Elimination with scaling.", "Substitution into quadratic.", "Word problem with two unknowns."],
      ["Linear and quadratic simultaneous.", "Discriminant for intersections.", "Graph both equations."],
      ["Three equations (extension).", "Interpret no solution parallel lines.", "Modelling with constraints."],
    ),
    topicLinks: links([]),
  },
  "ks4-quadratics": {
    information:
      "Quadratics involve x² terms: graphs are parabolas. Pupils factorise, complete the square, use the formula, and interpret roots.",
    examplesByStage: ex(
      ["Square numbers 1,4,9,16.", "Area of square side x.", "Pattern n²."],
      ["Expand (x+3)(x+2).", "Solve x²=25.", "Sketch y=x²."],
      ["Factorise x²+5x+6.", "Complete square form.", "Discriminant b²−4ac."],
      ["Quadratic inequality.", "Prove by completing square.", "Optimise projectile height model."],
    ),
    topicLinks: links([]),
  },
  "ks4-functions": {
    information:
      "Functions map inputs to outputs. GCSE covers notation f(x), composite fg(x), inverse functions, and graph transformations.",
    examplesByStage: ex(
      ["Input machine: add 2.", "Table x → 3x.", "Graph of y=2x+1."],
      ["f(x)=x², find f(3).", "Composite f(g(2)).", "Transform shift 2 right."],
      ["Inverse f⁻¹(x) for linear f.", "Domain and range.", "Graph reflections."],
      ["Iteration x_{n+1}=f(x_n).", "Proof with functions.", "Exponential f(x)=a^x."],
    ),
    topicLinks: links([]),
  },
  "ks4-vectors": {
    information:
      "Vectors describe direction and magnitude. GCSE uses column vectors for translation and geometric proofs.",
    examplesByStage: ex(
      ["Move 3 right, 2 up.", "Describe direction.", "Arrow on a grid."],
      ["Add vectors (2,1)+(−1,3).", "Translate shape by vector.", "Magnitude √(9+16)."],
      ["Parallel vectors scalar multiple.", "Vector proof of midpoint.", "Column vector notation."],
      ["Prove points collinear.", "Vector equation of line intro.", "Geometric problems in coordinates."],
    ),
    topicLinks: links([]),
  },
  "ks4-histograms": {
    information:
      "Histograms display grouped continuous data with frequency density. Pupils interpret area as frequency and compare distributions.",
    examplesByStage: ex(
      ["Bar chart vs histogram idea.", "Group data in intervals.", "Read frequency from height."],
      ["Calculate frequency density.", "Draw histogram from table.", "Estimate mean from grouped data."],
      ["Compare two distributions.", "Cumulative frequency graph.", "Interquartile range estimate."],
      ["GCSE: interpret skew.", "Compare medians from CF.", "Statistical conclusions with caution."],
    ),
    topicLinks: links([]),
  },
  "ks4-circle-theorems": {
    information:
      "Circle theorems explain angles and lengths in circles. GCSE proofs and problem solving use cyclic quadrilaterals and tangent properties.",
    examplesByStage: ex(
      ["Name parts of a circle.", "Half turn is 180°.", "Equal radii in a circle."],
      ["Angle at centre twice circumference.", "Tangent perpendicular to radius.", "Semicircle angle 90°."],
      ["Alternate segment (higher).", "Two tangents equal lengths.", "Cyclic quadrilateral opposite sum 180°."],
      ["Prove theorem carefully.", "Multi-step circle proofs.", "Combine with trigonometry."],
    ),
    topicLinks: links([]),
  },
  "ks4-probability-trees": {
    information:
      "Tree diagrams organise combined experiments. GCSE includes independent and conditional branches, and expected frequency.",
    examplesByStage: ex(
      ["Flip two coins list outcomes.", "P(red then blue) with replacement.", "Expected 60 heads in 100 flips."],
      ["Tree without replacement.", "Conditional probability.", "And/Or rules."],
      ["Three-stage tree.", "Venn with probabilities.", "Table for two-way events."],
      ["Higher: dependent events.", "Combined conditional chains.", "Interpret real data cautiously."],
    ),
    topicLinks: links([]),
  },
  "ks4-algebraic-fractions": {
    information:
      "Algebraic fractions combine algebra with rational expressions. GCSE simplifies, factorises, and solves equations involving fractions in x.",
    examplesByStage: ex(
      ["Half of n: n/2.", "Share x sweets among 3: x/3.", "Add 1/4 + 1/4."],
      ["Simplify (2x)/6.", "Add 1/x + 1/2x.", "Solve 3/x = 1."],
      ["Factorise numerator to cancel.", "Solve (x+1)/(x−2)=3.", "Common denominator."],
      ["GCSE: quadratic in denominator.", "Prove identity by fractions.", "Check extraneous solutions."],
    ),
    topicLinks: links([]),
  },
};

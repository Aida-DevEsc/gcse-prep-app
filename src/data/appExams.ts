/**
 * Original exam papers written for this app in the style of AQA Level 2 Further Maths (8365):
 * same structure, timing, marks and content, but not AQA's questions. Every answer is checked by
 * scripts/check-exams.ts (run: node scripts/check-exams.ts).
 */
import type { AppExamPaper, AppExamSet } from '../types/exam';

const FM_GRADES = ['9', '8', '7', '6', '5', '4'];

const NON_CALC_RULES = [
  'You may NOT use a calculator.',
  'Work on paper, then type your final answer in the box.',
  'Give exact answers (fractions, surds) unless the question says otherwise.',
];

const CALC_RULES = [
  'You may use a calculator.',
  'Work on paper, then type your final answer in the box.',
  'Round answers as the question asks. If it doesn’t say, give 3 significant figures.',
];

export const furtherMathsSet1: AppExamSet = {
  id: 'fm-set1',
  label: 'Smooth Operator Further Maths Set 1',
  grades: FM_GRADES,
  // Average of AQA's June 2022 and June 2023 8365 subject boundaries (out of 160).
  totalBoundaries: [133, 115, 98, 79, 61, 52],
  boundaryNote: 'Estimated from the average of AQA’s June 2022 and June 2023 Further Maths grade boundaries.',
};

export const furtherMathsSet1Paper1: AppExamPaper = {
  id: 'fm-set1-p1',
  subjectId: 'maths',
  setId: 'fm-set1',
  setLabel: 'Set 1',
  qualification: 'Level 2 Further Maths (8365 style)',
  title: 'Paper 1 (non-calculator)',
  code: 'FM1',
  calculator: false,
  minutes: 105,
  maxMarks: 80,
  grades: FM_GRADES,
  boundaries: [64, 55, 46, 37, 29, 24],
  instructions: NON_CALC_RULES,
  questions: [
    {
      id: 'p1q1', number: 1,
      parts: [
        {
          id: 'p1q1a', label: '(a)', marks: 2, topicId: 'maths-expressions',
          prompt: 'Expand and simplify (2x − 3)(x + 4)',
          answer: { kind: 'expression', expr: '2x^2+5x-12', vars: ['x'], form: 'expanded' },
          display: '2x² + 5x − 12',
          solution: '2x × x = 2x², 2x × 4 = 8x, −3 × x = −3x, −3 × 4 = −12.\nCollect the x terms: 8x − 3x = 5x, so 2x² + 5x − 12.',
          hint: 'Type powers with ^, e.g. 3x^2 − x + 1',
          samples: { accept: ['2x^2+5x-12', '2x²+5x−12', '-12 + 5x + 2x^2'], reject: ['(2x-3)(x+4)', '2x^2+11x-12'] },
        },
        {
          id: 'p1q1b', label: '(b)', marks: 2, topicId: 'maths-quadratics',
          prompt: 'Factorise fully 6x² − 13x − 5',
          answer: { kind: 'expression', expr: '6x^2-13x-5', vars: ['x'], form: 'factorised' },
          display: '(3x + 1)(2x − 5)',
          solution: 'Find two numbers that multiply to 6 × −5 = −30 and add to −13: −15 and 2.\n6x² − 15x + 2x − 5 = 3x(2x − 5) + 1(2x − 5) = (3x + 1)(2x − 5).',
          samples: { accept: ['(3x+1)(2x-5)', '(2x-5)(3x+1)'], reject: ['6x^2-13x-5', '(3x-1)(2x+5)'] },
        },
      ],
    },
    {
      id: 'p1q2', number: 2,
      parts: [
        {
          id: 'p1q2a', marks: 2, topicId: 'maths-indices-surds',
          prompt: 'Simplify 3√12 + √75\nGive your answer in the form k√3',
          answer: { kind: 'number', value: 11 * Math.sqrt(3), form: 'surd' },
          display: '11√3',
          solution: '√12 = √4 × √3 = 2√3, so 3√12 = 6√3.\n√75 = √25 × √3 = 5√3.\n6√3 + 5√3 = 11√3.',
          hint: 'Type √ with the button or as sqrt, e.g. 4√5 or 4sqrt(5)',
          samples: { accept: ['11√3', '11sqrt(3)', '11 sqrt 3'], reject: ['√363', '19.05', '8√3'] },
        },
      ],
    },
    {
      id: 'p1q3', number: 3,
      parts: [
        {
          id: 'p1q3a', marks: 3, topicId: 'maths-indices-surds',
          prompt: 'Rationalise the denominator and simplify (4 + √2) / (3 − √2)\nGive your answer in the form a + b√2',
          answer: { kind: 'number', value: 2 + Math.sqrt(2), form: 'surd' },
          display: '2 + √2',
          solution: 'Multiply top and bottom by (3 + √2).\nTop: (4 + √2)(3 + √2) = 12 + 4√2 + 3√2 + 2 = 14 + 7√2.\nBottom: (3 − √2)(3 + √2) = 9 − 2 = 7.\n(14 + 7√2) / 7 = 2 + √2.',
          samples: { accept: ['2+√2', '√2 + 2', '2+sqrt2'], reject: ['(4+√2)/(3-√2)', '(14+7√2)/7x'] },
        },
      ],
    },
    {
      id: 'p1q4', number: 4,
      stem: 'Work out the exact value of',
      parts: [
        {
          id: 'p1q4a', label: '(a)', marks: 1, topicId: 'maths-indices-surds',
          prompt: '27^(2/3)',
          answer: { kind: 'number', value: 9 },
          display: '9',
          solution: '27^(1/3) = 3, then 3² = 9.',
          samples: { accept: ['9'], reject: ['18'] },
        },
        {
          id: 'p1q4b', label: '(b)', marks: 2, topicId: 'maths-indices-surds',
          prompt: '(16/81)^(−3/4)',
          answer: { kind: 'number', value: 27 / 8 },
          display: '27/8',
          solution: 'The negative power flips the fraction: (81/16)^(3/4).\nFourth root: 3/2. Cube it: 27/8.',
          hint: 'Fractions like 5/3 are fine',
          samples: { accept: ['27/8', '3.375', '3 3/8'], reject: ['8/27', '3.37'] },
        },
      ],
    },
    {
      id: 'p1q5', number: 5,
      stem: 'A is the point (−1, 5) and B is the point (3, −3).',
      parts: [
        {
          id: 'p1q5a', label: '(a)', marks: 1, topicId: 'maths-linear',
          prompt: 'Work out the gradient of AB.',
          answer: { kind: 'number', value: -2 },
          display: '−2',
          solution: 'Gradient = (−3 − 5) / (3 − (−1)) = −8 / 4 = −2.',
          samples: { accept: ['-2', '−2', '-8/4'], reject: ['2', '-1/2'] },
        },
        {
          id: 'p1q5b', label: '(b)', marks: 1, topicId: 'maths-linear',
          prompt: 'Write down the coordinates of the midpoint of AB.',
          answer: { kind: 'coordinates', points: [['1', '1']] },
          display: '(1, 1)',
          solution: 'Midpoint = ((−1 + 3)/2, (5 + (−3))/2) = (1, 1).',
          hint: 'Type coordinates like (2, 3)',
          samples: { accept: ['(1,1)', '( 1 , 1 )'], reject: ['(2, 2)'] },
        },
        {
          id: 'p1q5c', label: '(c)', marks: 3, topicId: 'maths-linear',
          prompt: 'Find the equation of the perpendicular bisector of AB.\nGive your answer in the form y = mx + c',
          answer: { kind: 'equation', expr: 'y - x/2 - 1/2', vars: ['x', 'y'] },
          display: 'y = ½x + ½',
          solution: 'Perpendicular gradient = −1 ÷ −2 = ½.\nIt passes through the midpoint (1, 1): y − 1 = ½(x − 1).\ny = ½x + ½.',
          hint: 'Type an equation, e.g. y = 3x − 2 (use / for fractions: y = x/2 + 1)',
          samples: { accept: ['y = x/2 + 1/2', 'y=0.5x+0.5', '2y = x + 1'], reject: ['y = -2x + 3', 'y = 2x - 1'] },
        },
        {
          id: 'p1q5d', label: '(d)', marks: 2, topicId: 'maths-pythagoras',
          prompt: 'Work out the length of AB.\nGive your answer as a simplified surd.',
          answer: { kind: 'number', value: 4 * Math.sqrt(5), form: 'surd' },
          display: '4√5',
          solution: 'AB² = (3 − (−1))² + (−3 − 5)² = 16 + 64 = 80.\nAB = √80 = √16 × √5 = 4√5.',
          samples: { accept: ['4√5', '4sqrt(5)'], reject: ['√80', '8.94', '5√4'] },
        },
      ],
    },
    {
      id: 'p1q6', number: 6,
      stem: 'f(x) = x³ − 4x² + x + 6',
      parts: [
        {
          id: 'p1q6a', label: '(a)', marks: 1, topicId: 'maths-quadratics',
          prompt: 'Show that (x − 2) is a factor of f(x).',
          answer: { kind: 'self', checklist: [{ text: 'Works out f(2) = 8 − 16 + 2 + 6 = 0 and says that means (x − 2) is a factor', marks: 1 }] },
          display: 'f(2) = 8 − 16 + 2 + 6 = 0, so (x − 2) is a factor.',
          solution: 'Factor theorem: if f(a) = 0 then (x − a) is a factor.\nf(2) = 2³ − 4(2²) + 2 + 6 = 8 − 16 + 2 + 6 = 0, so (x − 2) is a factor.',
        },
        {
          id: 'p1q6b', label: '(b)', marks: 3, topicId: 'maths-quadratics',
          prompt: 'Hence factorise f(x) fully.',
          answer: { kind: 'expression', expr: 'x^3-4x^2+x+6', vars: ['x'], form: 'factorised' },
          display: '(x − 2)(x − 3)(x + 1)',
          solution: 'Divide by (x − 2): x³ − 4x² + x + 6 = (x − 2)(x² − 2x − 3).\nFactorise the quadratic: x² − 2x − 3 = (x − 3)(x + 1).\nf(x) = (x − 2)(x − 3)(x + 1).',
          samples: { accept: ['(x-2)(x-3)(x+1)', '(x+1)(x-2)(x-3)'], reject: ['(x-2)(x^2-2x-3)x', 'x^3-4x^2+x+6'] },
        },
        {
          id: 'p1q6c', label: '(c)', marks: 1, topicId: 'maths-quadratics',
          prompt: 'Solve f(x) = 0',
          answer: { kind: 'numbers', values: [2, 3, -1] },
          display: 'x = −1, x = 2, x = 3',
          solution: 'Each bracket can be zero: x = 2, x = 3 or x = −1.',
          hint: 'Separate answers with commas, e.g. x = 1, x = −4',
          samples: { accept: ['x = -1, x = 2, x = 3', '2, 3, -1', '-1 or 2 or 3'], reject: ['2, 3', '1, 2, 3'] },
        },
      ],
    },
    {
      id: 'p1q7', number: 7,
      parts: [
        {
          id: 'p1q7a', marks: 5, topicId: 'maths-simultaneous',
          prompt: 'Solve the simultaneous equations\ny = 2x − 1\nx² + y² = 13',
          answer: { kind: 'coordinates', points: [['2', '3'], ['-6/5', '-17/5']] },
          display: 'x = 2, y = 3 and x = −6/5, y = −17/5',
          solution: 'Substitute: x² + (2x − 1)² = 13\nx² + 4x² − 4x + 1 = 13\n5x² − 4x − 12 = 0\n(5x + 6)(x − 2) = 0, so x = 2 or x = −6/5.\ny = 2x − 1 gives y = 3 and y = −17/5.',
          hint: 'Give each solution as a pair, e.g. (1, 2), (−3, 4)',
          samples: { accept: ['(2,3), (-6/5,-17/5)', '(-1.2, -3.4) and (2, 3)', 'x=2, y=3 or x=-1.2, y=-3.4'], reject: ['(3,2)', '(2,3), (1.2, 3.4)'] },
        },
      ],
    },
    {
      id: 'p1q8', number: 8,
      parts: [
        {
          id: 'p1q8a', marks: 3, topicId: 'maths-quadratics',
          prompt: 'Solve x² − x − 12 > 0',
          answer: { kind: 'inequality', expr: 'x < -3 or x > 4', variable: 'x' },
          display: 'x < −3 or x > 4',
          solution: 'x² − x − 12 = (x − 4)(x + 3), which is 0 at x = −3 and x = 4.\nThe graph is a ∪ shape, so it is above zero outside the roots: x < −3 or x > 4.',
          hint: 'Use < > <= >= (or ≤ ≥), and "or" between two regions',
          samples: { accept: ['x < -3 or x > 4', 'x>4 or x<-3', 'x < −3, x > 4'], reject: ['-3 < x < 4', 'x <= -3 or x >= 4', 'x > 4'] },
        },
      ],
    },
    {
      id: 'p1q9', number: 9,
      stem: 'A = [[2, −1], [3, 4]]   B = [[1, 0], [−2, 5]]\n(Matrices are written row by row.)',
      parts: [
        {
          id: 'p1q9a', label: '(a)', marks: 2, topicId: 'maths-matrices',
          prompt: 'Work out AB.',
          answer: { kind: 'matrix', rows: 2, cols: 2, values: [4, -5, -5, 20] },
          display: '[[4, −5], [−5, 20]]',
          solution: 'Row 1: (2)(1) + (−1)(−2) = 4, (2)(0) + (−1)(5) = −5.\nRow 2: (3)(1) + (4)(−2) = −5, (3)(0) + (4)(5) = 20.',
          samples: { accept: ['4|-5|-5|20'], reject: ['2|-5|3|20'] },
        },
        {
          id: 'p1q9b', label: '(b)', marks: 2, topicId: 'maths-matrices',
          prompt: 'Describe fully the single transformation represented by the matrix [[0, −1], [1, 0]].',
          answer: {
            kind: 'choice',
            options: [
              'Rotation 90° clockwise about the origin',
              'Rotation 90° anticlockwise about the origin',
              'Reflection in the line y = x',
              'Reflection in the line y = −x',
            ],
            correct: 1,
          },
          display: 'Rotation 90° anticlockwise about the origin',
          solution: 'The columns are the images of (1, 0) and (0, 1).\n(1, 0) → (0, 1) and (0, 1) → (−1, 0): a quarter turn anticlockwise about O.',
          samples: { accept: ['1'], reject: ['0'] },
        },
        {
          id: 'p1q9c', label: '(c)', marks: 2, topicId: 'maths-matrices',
          prompt: '[[p, 3], [2, 1]] × [[1, −3], [−2, p]] = I, where I is the 2 × 2 identity matrix.\nWork out the value of p.',
          answer: { kind: 'number', value: 7 },
          display: 'p = 7',
          solution: 'The product is [[p − 6, 0], [0, p − 6]].\nFor the identity, p − 6 = 1, so p = 7.',
          samples: { accept: ['7', 'p = 7'], reject: ['6'] },
        },
      ],
    },
    {
      id: 'p1q10', number: 10,
      stem: 'A curve has equation y = 2x³ − 9x² + 12x + 1',
      parts: [
        {
          id: 'p1q10a', label: '(a)', marks: 2, topicId: 'maths-calculus',
          prompt: 'Work out dy/dx',
          answer: { kind: 'expression', expr: '6x^2-18x+12', vars: ['x'] },
          display: '6x² − 18x + 12',
          solution: 'Multiply by the power and reduce the power by one: 6x² − 18x + 12. The constant 1 differentiates to 0.',
          samples: { accept: ['6x^2-18x+12', 'dy/dx = 6x² − 18x + 12', '6(x-1)(x-2)'], reject: ['6x^2-18x+13', '2x^2-9x+12'] },
        },
        {
          id: 'p1q10b', label: '(b)', marks: 3, topicId: 'maths-calculus',
          prompt: 'Work out the coordinates of the two stationary points.',
          answer: { kind: 'coordinates', points: [['1', '6'], ['2', '5']] },
          display: '(1, 6) and (2, 5)',
          solution: '6x² − 18x + 12 = 0 → x² − 3x + 2 = 0 → (x − 1)(x − 2) = 0.\nx = 1: y = 2 − 9 + 12 + 1 = 6.\nx = 2: y = 16 − 36 + 24 + 1 = 5.',
          hint: 'Give each point as a pair, e.g. (1, 2), (3, 4)',
          samples: { accept: ['(1,6), (2,5)', '(2, 5) and (1, 6)'], reject: ['(1,6)', '(6,1),(5,2)'] },
        },
        {
          id: 'p1q10c', label: '(c)', marks: 1, topicId: 'maths-calculus',
          prompt: 'What type of stationary point is at x = 1?',
          answer: { kind: 'choice', options: ['Maximum', 'Minimum', 'Neither'], correct: 0 },
          display: 'Maximum',
          solution: 'd²y/dx² = 12x − 18. At x = 1 this is −6, which is negative, so it is a maximum.',
          samples: { accept: ['0'], reject: ['1'] },
        },
      ],
    },
    {
      id: 'p1q11', number: 11,
      parts: [
        {
          id: 'p1q11a', label: '(a)', marks: 3, topicId: 'maths-circles',
          prompt: 'The point P(2, 4) lies on the circle x² + y² = 20.\nFind the equation of the tangent to the circle at P.\nGive your answer in the form y = mx + c',
          answer: { kind: 'equation', expr: 'y + x/2 - 5', vars: ['x', 'y'] },
          display: 'y = −½x + 5',
          solution: 'The radius from O(0, 0) to P(2, 4) has gradient 4/2 = 2.\nThe tangent is perpendicular to the radius, so its gradient is −½.\ny − 4 = −½(x − 2), so y = −½x + 5.',
          hint: 'Type an equation, e.g. y = −x/3 + 2',
          samples: { accept: ['y = -x/2 + 5', 'y=-0.5x+5', 'x + 2y = 10'], reject: ['y = 2x', 'y = x/2 + 3'] },
        },
        {
          id: 'p1q11b', label: '(b)', marks: 3, topicId: 'maths-circles',
          prompt: 'A different circle has centre (3, −2) and passes through the point (7, 1).\nWork out the equation of this circle.',
          answer: { kind: 'equation', expr: '(x-3)^2 + (y+2)^2 - 25', vars: ['x', 'y'] },
          display: '(x − 3)² + (y + 2)² = 25',
          solution: 'Radius² = (7 − 3)² + (1 − (−2))² = 16 + 9 = 25.\nCircle with centre (a, b): (x − a)² + (y − b)² = r², so (x − 3)² + (y + 2)² = 25.',
          hint: 'e.g. (x − 1)^2 + (y + 4)^2 = 9',
          samples: { accept: ['(x-3)^2+(y+2)^2=25', 'x^2 + y^2 - 6x + 4y - 12 = 0'], reject: ['(x-3)^2+(y+2)^2=5', '(x+3)^2+(y-2)^2=25'] },
        },
      ],
    },
    {
      id: 'p1q12', number: 12,
      parts: [
        {
          id: 'p1q12a', label: '(a)', marks: 3, topicId: 'maths-sequences',
          prompt: 'Here are the first five terms of a quadratic sequence:\n4, 11, 22, 37, 56\nWork out an expression for the nth term.',
          answer: { kind: 'expression', expr: '2n^2+n+1', vars: ['n'] },
          display: '2n² + n + 1',
          solution: 'First differences: 7, 11, 15, 19. Second difference: 4, so the sequence starts 2n².\nSequence − 2n²: 2, 3, 4, 5, 6, which is n + 1.\nnth term = 2n² + n + 1.',
          samples: { accept: ['2n^2+n+1', '2n² + n + 1'], reject: ['4n^2+n+1', '2x^2+x+1'] },
        },
        {
          id: 'p1q12b', label: '(b)', marks: 1, topicId: 'maths-sequences',
          prompt: 'The nth term of a different sequence is (3n + 1) / (2n − 5).\nWrite down the limiting value of the sequence as n → ∞.',
          answer: { kind: 'number', value: 1.5 },
          display: '3/2',
          solution: 'For very large n only the n terms matter: 3n / 2n = 3/2.',
          samples: { accept: ['3/2', '1.5'], reject: ['-1/5'] },
        },
      ],
    },
    {
      id: 'p1q13', number: 13,
      stem: 'f(x) = 2x + 3    g(x) = x² − 1',
      parts: [
        {
          id: 'p1q13a', label: '(a)', marks: 2, topicId: 'maths-functions',
          prompt: 'Work out f(g(x)). Simplify your answer.',
          answer: { kind: 'expression', expr: '2x^2+1', vars: ['x'], form: 'expanded' },
          display: '2x² + 1',
          solution: 'f(g(x)) = 2(x² − 1) + 3 = 2x² − 2 + 3 = 2x² + 1.',
          samples: { accept: ['2x^2+1', 'fg(x) = 2x² + 1'], reject: ['(2x+3)^2-1', '4x^2+12x+8'] },
        },
        {
          id: 'p1q13b', label: '(b)', marks: 2, topicId: 'maths-functions',
          prompt: 'Work out the inverse function f⁻¹(x).',
          answer: { kind: 'expression', expr: '(x-3)/2', vars: ['x'] },
          display: 'f⁻¹(x) = (x − 3)/2',
          solution: 'Write y = 2x + 3 and rearrange for x: x = (y − 3)/2.\nSo f⁻¹(x) = (x − 3)/2.',
          samples: { accept: ['(x-3)/2', 'x/2 - 3/2', 'f^-1(x) = (x-3)/2'], reject: ['(x+3)/2', '1/(2x+3)'] },
        },
        {
          id: 'p1q13c', label: '(c)', marks: 2, topicId: 'maths-quadratics',
          prompt: 'h(x) = x² − 6x + 11\nWrite h(x) in the form (x + a)² + b',
          answer: { kind: 'expression', expr: 'x^2-6x+11', vars: ['x'], form: 'completedSquare' },
          display: '(x − 3)² + 2',
          solution: 'Halve the x coefficient: (x − 3)² = x² − 6x + 9.\nx² − 6x + 11 = (x − 3)² − 9 + 11 = (x − 3)² + 2.',
          samples: { accept: ['(x-3)^2+2', '(x − 3)² + 2'], reject: ['x^2-6x+11', '(x-3)^2+11', '(x+3)^2+2'] },
        },
        {
          id: 'p1q13d', label: '(d)', marks: 2, topicId: 'maths-functions',
          prompt: 'The domain of h(x) is all values of x.\nWrite down the range of h(x).',
          answer: { kind: 'inequality', expr: 'y >= 2', variable: 'y' },
          display: 'h(x) ≥ 2',
          solution: '(x − 3)² is never negative, so the smallest value of h(x) is 2 (when x = 3). Range: h(x) ≥ 2.',
          hint: 'e.g. h(x) ≥ 5',
          samples: { accept: ['h(x) >= 2', 'h(x) ≥ 2', 'y>=2'], reject: ['h(x) > 2', 'x >= 3'] },
        },
      ],
    },
    {
      id: 'p1q14', number: 14,
      parts: [
        {
          id: 'p1q14a', label: '(a)', marks: 2, topicId: 'maths-trig',
          prompt: 'Solve 2 sin θ = 1 for 0° ≤ θ ≤ 360°',
          answer: { kind: 'numbers', values: [30, 150] },
          display: 'θ = 30°, 150°',
          solution: 'sin θ = ½, so θ = 30°.\nSine is also positive in the second quadrant: 180° − 30° = 150°.',
          hint: 'Separate answers with commas',
          samples: { accept: ['30, 150', 'θ = 30°, θ = 150°', '30° and 150°'], reject: ['30', '30, 330'] },
        },
        {
          id: 'p1q14b', label: '(b)', marks: 2, topicId: 'maths-trig',
          prompt: 'θ is acute and cos θ = 3/5\nWork out the exact value of tan θ.',
          answer: { kind: 'number', value: 4 / 3 },
          display: '4/3',
          solution: 'Draw a right-angled triangle with adjacent 3 and hypotenuse 5. The opposite side is √(25 − 9) = 4.\ntan θ = opposite / adjacent = 4/3.',
          samples: { accept: ['4/3', '1 1/3'], reject: ['3/4', '1.33'] },
        },
      ],
    },
    {
      id: 'p1q15', number: 15,
      parts: [
        {
          id: 'p1q15a', marks: 4, topicId: 'maths-proof',
          prompt: 'Prove that the sum of the squares of any two consecutive odd numbers is 2 more than a multiple of 8.',
          answer: {
            kind: 'self',
            checklist: [
              { text: 'Uses 2n + 1 and 2n + 3 (or 2n − 1 and 2n + 1) for two consecutive odd numbers', marks: 1 },
              { text: 'Expands both squares correctly, e.g. 4n² + 4n + 1 and 4n² + 12n + 9', marks: 1 },
              { text: 'Adds to get 8n² + 16n + 10', marks: 1 },
              { text: 'Writes it as 8(n² + 2n + 1) + 2 and concludes it is 2 more than a multiple of 8', marks: 1 },
            ],
          },
          display: '(2n + 1)² + (2n + 3)² = 8n² + 16n + 10 = 8(n² + 2n + 1) + 2',
          solution: 'Let the odd numbers be 2n + 1 and 2n + 3.\n(2n + 1)² + (2n + 3)² = 4n² + 4n + 1 + 4n² + 12n + 9 = 8n² + 16n + 10.\n= 8(n² + 2n + 1) + 2, which is 2 more than a multiple of 8.',
        },
      ],
    },
    {
      id: 'p1q16', number: 16,
      parts: [
        {
          id: 'p1q16a', marks: 3, topicId: 'maths-expressions',
          prompt: 'Simplify fully (x² − 9) / (2x² + 5x − 3)',
          answer: { kind: 'expression', expr: '(x-3)/(2x-1)', vars: ['x'], form: 'noPowers' },
          display: '(x − 3)/(2x − 1)',
          solution: 'Top: difference of two squares, (x − 3)(x + 3).\nBottom: (2x − 1)(x + 3).\nCancel (x + 3): (x − 3)/(2x − 1).',
          hint: 'Use brackets, e.g. (x + 1)/(x − 2)',
          samples: { accept: ['(x-3)/(2x-1)'], reject: ['(x^2-9)/(2x^2+5x-3)', '(x+3)/(2x-1)'] },
        },
      ],
    },
    {
      id: 'p1q17', number: 17,
      parts: [
        {
          id: 'p1q17a', marks: 4, topicId: 'maths-calculus',
          prompt: 'Find the equation of the normal to the curve y = x³ − 2x at the point where x = 1.',
          answer: { kind: 'equation', expr: 'y + x', vars: ['x', 'y'] },
          display: 'y = −x',
          solution: 'At x = 1, y = 1 − 2 = −1.\ndy/dx = 3x² − 2, which is 1 at x = 1.\nThe normal is perpendicular to the tangent, so its gradient is −1.\ny − (−1) = −1(x − 1), so y = −x.',
          samples: { accept: ['y = -x', 'x + y = 0'], reject: ['y = x - 2', 'y = -x - 1'] },
        },
      ],
    },
    {
      id: 'p1q18', number: 18,
      parts: [
        {
          id: 'p1q18a', marks: 3, topicId: 'maths-indices-surds',
          prompt: 'Solve 9^x = 27^(x − 1)',
          answer: { kind: 'number', value: 3 },
          display: 'x = 3',
          solution: 'Write both sides as powers of 3: 3^(2x) = 3^(3(x − 1)).\n2x = 3x − 3, so x = 3.',
          samples: { accept: ['3', 'x = 3'], reject: ['1'] },
        },
      ],
    },
  ],
};

export const furtherMathsSet1Paper2: AppExamPaper = {
  id: 'fm-set1-p2',
  subjectId: 'maths',
  setId: 'fm-set1',
  setLabel: 'Set 1',
  qualification: 'Level 2 Further Maths (8365 style)',
  title: 'Paper 2 (calculator)',
  code: 'FM2',
  calculator: true,
  minutes: 105,
  maxMarks: 80,
  grades: FM_GRADES,
  boundaries: [70, 60, 52, 42, 33, 28],
  instructions: CALC_RULES,
  questions: [
    {
      id: 'p2q1', number: 1,
      parts: [
        {
          id: 'p2q1a', marks: 3, topicId: 'maths-quadratics',
          prompt: 'Solve 3x² − 5x − 4 = 0\nGive your answers to 2 decimal places.',
          answer: { kind: 'numbers', values: [2.257334, -0.590667], tolerance: 0.005 },
          display: 'x = 2.26, x = −0.59',
          solution: 'Quadratic formula with a = 3, b = −5, c = −4:\nx = (5 ± √(25 + 48)) / 6 = (5 ± √73) / 6.\nx = 2.26 or x = −0.59.',
          hint: 'Separate answers with commas',
          samples: { accept: ['2.26, -0.59', 'x=-0.59 or x=2.26', '2.2573, -0.5907'], reject: ['2.26', '2.3, -0.6', '-2.26, 0.59'] },
        },
      ],
    },
    {
      id: 'p2q2', number: 2,
      stem: 'In triangle ABC, AB = 8.4 cm, AC = 11.2 cm and angle BAC = 48°.',
      parts: [
        {
          id: 'p2q2a', label: '(a)', marks: 3, topicId: 'maths-trig',
          prompt: 'Work out the length of BC.\nGive your answer to 3 significant figures.',
          answer: { kind: 'number', value: 8.372358, tolerance: 0.006 },
          display: '8.37 cm',
          solution: 'Cosine rule: BC² = 8.4² + 11.2² − 2 × 8.4 × 11.2 × cos 48° = 196 − 125.90… = 70.10…\nBC = 8.37 cm.',
          samples: { accept: ['8.37', '8.37 cm', '8.3724'], reject: ['8.4', '70.1'] },
        },
        {
          id: 'p2q2b', label: '(b)', marks: 2, topicId: 'maths-trig',
          prompt: 'Work out the area of triangle ABC.\nGive your answer to 3 significant figures.',
          answer: { kind: 'number', value: 34.957533, tolerance: 0.05 },
          display: '35.0 cm²',
          solution: 'Area = ½ × 8.4 × 11.2 × sin 48° = 34.96 = 35.0 cm² (3 s.f.).',
          samples: { accept: ['35.0', '35', '34.96 cm^2'], reject: ['69.9', '31.5'] },
        },
      ],
    },
    {
      id: 'p2q3', number: 3,
      parts: [
        {
          id: 'p2q3a', marks: 3, topicId: 'maths-trig',
          prompt: 'Solve 5 sin θ + 2 = 0 for 0° ≤ θ ≤ 360°\nGive your answers to 1 decimal place.',
          answer: { kind: 'numbers', values: [203.578178, 336.421822], tolerance: 0.06 },
          display: 'θ = 203.6°, 336.4°',
          solution: 'sin θ = −0.4. The calculator gives −23.6°, which is outside the range.\nSine is negative in the third and fourth quadrants: 180° + 23.6° = 203.6° and 360° − 23.6° = 336.4°.',
          samples: { accept: ['203.6, 336.4', '203.6° and 336.4°'], reject: ['-23.6', '23.6, 156.4', '203.6'] },
        },
      ],
    },
    {
      id: 'p2q4', number: 4,
      parts: [
        {
          id: 'p2q4a', marks: 2, topicId: 'maths-trig',
          prompt: 'Show that (sin θ + cos θ)² ≡ 1 + 2 sin θ cos θ',
          answer: {
            kind: 'self',
            checklist: [
              { text: 'Expands to sin²θ + 2 sin θ cos θ + cos²θ', marks: 1 },
              { text: 'Uses sin²θ + cos²θ = 1 to reach 1 + 2 sin θ cos θ', marks: 1 },
            ],
          },
          display: 'sin²θ + 2 sin θ cos θ + cos²θ = 1 + 2 sin θ cos θ',
          solution: '(sin θ + cos θ)² = sin²θ + 2 sin θ cos θ + cos²θ.\nsin²θ + cos²θ = 1, so this is 1 + 2 sin θ cos θ.',
        },
      ],
    },
    {
      id: 'p2q5', number: 5,
      stem: 'A cuboid is 6 cm long, 4 cm wide and 3 cm high.',
      parts: [
        {
          id: 'p2q5a', label: '(a)', marks: 2, topicId: 'maths-pythagoras',
          prompt: 'Work out the length of a diagonal through the middle of the cuboid (from one corner to the opposite corner).\nGive your answer to 3 significant figures.',
          answer: { kind: 'number', value: 7.81025, tolerance: 0.006 },
          display: '7.81 cm',
          solution: 'd² = 6² + 4² + 3² = 36 + 16 + 9 = 61, so d = √61 = 7.81 cm.',
          samples: { accept: ['7.81', '√61'], reject: ['7.21', '13'] },
        },
        {
          id: 'p2q5b', label: '(b)', marks: 3, topicId: 'maths-trig',
          prompt: 'Work out the angle between that diagonal and the base of the cuboid.\nGive your answer to 1 decimal place.',
          answer: { kind: 'number', value: 22.588539, tolerance: 0.06 },
          display: '22.6°',
          solution: 'The diagonal of the base is √(6² + 4²) = √52.\ntan θ = 3 / √52, so θ = 22.6°.',
          samples: { accept: ['22.6', '22.6°'], reject: ['67.4', '26.6'] },
        },
      ],
    },
    {
      id: 'p2q6', number: 6,
      parts: [
        {
          id: 'p2q6a', label: '(a)', marks: 2, topicId: 'maths-matrices',
          prompt: 'The point P(3, −2) is transformed by the matrix [[2, 1], [−1, 3]].\nWork out the coordinates of the image of P.',
          answer: { kind: 'coordinates', points: [['4', '-9']] },
          display: '(4, −9)',
          solution: '[[2, 1], [−1, 3]] × (3, −2): 2(3) + 1(−2) = 4 and −1(3) + 3(−2) = −9.',
          samples: { accept: ['(4,-9)'], reject: ['(4,9)', '(-9,4)'] },
        },
        {
          id: 'p2q6b', label: '(b)', marks: 2, topicId: 'maths-matrices',
          prompt: 'A = [[2, 1], [1, 1]]\nWork out A².',
          answer: { kind: 'matrix', rows: 2, cols: 2, values: [5, 3, 3, 2] },
          display: '[[5, 3], [3, 2]]',
          solution: 'A² = A × A. Row 1: 2(2) + 1(1) = 5, 2(1) + 1(1) = 3. Row 2: 1(2) + 1(1) = 3, 1(1) + 1(1) = 2.',
          samples: { accept: ['5|3|3|2'], reject: ['4|1|1|1'] },
        },
        {
          id: 'p2q6c', label: '(c)', marks: 1, topicId: 'maths-matrices',
          prompt: 'Describe the transformation represented by [[3, 0], [0, 3]].',
          answer: {
            kind: 'choice',
            options: [
              'Enlargement, scale factor 3, centre the origin',
              'Stretch parallel to the x-axis, scale factor 3',
              'Translation by 3 units right and 3 units up',
              'Rotation of 30° about the origin',
            ],
            correct: 0,
          },
          display: 'Enlargement, scale factor 3, centre (0, 0)',
          solution: '(x, y) → (3x, 3y): every coordinate is multiplied by 3, an enlargement from the origin.',
          samples: { accept: ['0'], reject: ['1'] },
        },
      ],
    },
    {
      id: 'p2q7', number: 7,
      stem: 'A curve has equation y = x³ − 6x² + 9x + 2',
      parts: [
        {
          id: 'p2q7a', label: '(a)', marks: 2, topicId: 'maths-calculus',
          prompt: 'Work out dy/dx',
          answer: { kind: 'expression', expr: '3x^2-12x+9', vars: ['x'] },
          display: '3x² − 12x + 9',
          solution: 'dy/dx = 3x² − 12x + 9.',
          samples: { accept: ['3x^2-12x+9', '3(x-1)(x-3)'], reject: ['3x^2-12x+11'] },
        },
        {
          id: 'p2q7b', label: '(b)', marks: 3, topicId: 'maths-calculus',
          prompt: 'Work out the range of values of x for which y is a decreasing function of x.',
          answer: { kind: 'inequality', expr: '1 < x < 3', variable: 'x' },
          display: '1 < x < 3',
          solution: 'Decreasing means dy/dx < 0: 3(x − 1)(x − 3) < 0.\nThis ∪-shaped quadratic is negative between its roots: 1 < x < 3.',
          samples: { accept: ['1 < x < 3', 'x > 1 and x < 3'], reject: ['x < 1 or x > 3', '1 <= x <= 3'] },
        },
        {
          id: 'p2q7c', label: '(c)', marks: 3, topicId: 'maths-calculus',
          prompt: 'Find the equation of the tangent to the curve at the point where x = 4.',
          answer: { kind: 'equation', expr: 'y - 9x + 30', vars: ['x', 'y'] },
          display: 'y = 9x − 30',
          solution: 'At x = 4: y = 64 − 96 + 36 + 2 = 6, and dy/dx = 48 − 48 + 9 = 9.\ny − 6 = 9(x − 4), so y = 9x − 30.',
          samples: { accept: ['y = 9x - 30', '9x - y = 30'], reject: ['y = 9x + 6', 'y = 6x - 18'] },
        },
      ],
    },
    {
      id: 'p2q8', number: 8,
      stem: 'A circle has equation x² + y² − 6x + 4y − 12 = 0',
      parts: [
        {
          id: 'p2q8a', label: '(a)', marks: 2, topicId: 'maths-circles',
          prompt: 'Work out the coordinates of the centre of the circle.',
          answer: { kind: 'coordinates', points: [['3', '-2']] },
          display: '(3, −2)',
          solution: 'Complete the square: (x − 3)² − 9 + (y + 2)² − 4 − 12 = 0, so (x − 3)² + (y + 2)² = 25.\nCentre (3, −2).',
          samples: { accept: ['(3,-2)'], reject: ['(-3,2)', '(6,-4)'] },
        },
        {
          id: 'p2q8b', label: '(b)', marks: 1, topicId: 'maths-circles',
          prompt: 'Work out the radius of the circle.',
          answer: { kind: 'number', value: 5 },
          display: '5',
          solution: 'r² = 25, so r = 5.',
          samples: { accept: ['5'], reject: ['25', '12'] },
        },
      ],
    },
    {
      id: 'p2q9', number: 9,
      parts: [
        {
          id: 'p2q9a', marks: 5, topicId: 'maths-simultaneous',
          prompt: 'Solve the simultaneous equations\nx + y = 7\nxy = 11\nGive your answers to 2 decimal places.',
          answer: { kind: 'coordinates', points: [['4.618034', '2.381966'], ['2.381966', '4.618034']], tolerance: 0.005 },
          display: 'x = 4.62, y = 2.38 and x = 2.38, y = 4.62',
          solution: 'y = 7 − x, so x(7 − x) = 11 → x² − 7x + 11 = 0.\nx = (7 ± √5) / 2 = 4.62 or 2.38.\ny = 7 − x gives 2.38 and 4.62.',
          hint: 'Give each solution as a pair, e.g. (1.23, 4.56), (4.56, 1.23)',
          samples: { accept: ['(4.62, 2.38), (2.38, 4.62)', 'x = 4.62, y = 2.38 or x = 2.38, y = 4.62'], reject: ['(4.62, 2.38)', '(4.6, 2.4), (2.4, 4.6)'] },
        },
      ],
    },
    {
      id: 'p2q10', number: 10,
      parts: [
        {
          id: 'p2q10a', marks: 2, topicId: 'maths-functions',
          prompt: 'f(x) = 3x − 2 with domain 1 ≤ x ≤ 5\nWrite down the range of f(x).',
          answer: { kind: 'inequality', expr: '1 <= y <= 13', variable: 'y' },
          display: '1 ≤ f(x) ≤ 13',
          solution: 'f is increasing, so the range runs from f(1) = 1 to f(5) = 13: 1 ≤ f(x) ≤ 13.',
          hint: 'e.g. 2 ≤ f(x) ≤ 9',
          samples: { accept: ['1 <= f(x) <= 13', '1 ≤ f(x) ≤ 13'], reject: ['1 < f(x) < 13', '1 <= x <= 5'] },
        },
      ],
    },
    {
      id: 'p2q11', number: 11,
      stem: 'The nth term of a sequence is (2n + 7) / (n + 1).',
      parts: [
        {
          id: 'p2q11a', label: '(a)', marks: 1, topicId: 'maths-sequences',
          prompt: 'Write down the limiting value of the sequence as n → ∞.',
          answer: { kind: 'number', value: 2 },
          display: '2',
          solution: 'For large n: 2n / n = 2.',
          samples: { accept: ['2'], reject: ['7'] },
        },
        {
          id: 'p2q11b', label: '(b)', marks: 3, topicId: 'maths-sequences',
          prompt: 'Which term of the sequence is equal to 2.25?',
          answer: { kind: 'number', value: 19 },
          display: 'The 19th term',
          solution: '(2n + 7) / (n + 1) = 9/4 → 4(2n + 7) = 9(n + 1) → 8n + 28 = 9n + 9 → n = 19.',
          samples: { accept: ['19', 'n = 19'], reject: ['20'] },
        },
      ],
    },
    {
      id: 'p2q12', number: 12,
      stem: '(x + 2) is a factor of x³ + ax² − 4x − 12',
      parts: [
        {
          id: 'p2q12a', label: '(a)', marks: 2, topicId: 'maths-quadratics',
          prompt: 'Work out the value of a.',
          answer: { kind: 'number', value: 3 },
          display: 'a = 3',
          solution: 'Substitute x = −2 and set it equal to 0: −8 + 4a + 8 − 12 = 0, so 4a = 12 and a = 3.',
          samples: { accept: ['3', 'a = 3'], reject: ['-3'] },
        },
        {
          id: 'p2q12b', label: '(b)', marks: 2, topicId: 'maths-quadratics',
          prompt: 'Hence factorise x³ + ax² − 4x − 12 fully.',
          answer: { kind: 'expression', expr: 'x^3+3x^2-4x-12', vars: ['x'], form: 'factorised' },
          display: '(x + 2)(x + 3)(x − 2)',
          solution: 'x³ + 3x² − 4x − 12 = (x + 2)(x² + x − 6) = (x + 2)(x + 3)(x − 2).',
          samples: { accept: ['(x+2)(x+3)(x-2)', '(x-2)(x+2)(x+3)'], reject: ['(x+2)(x-3)(x+2)'] },
        },
      ],
    },
    {
      id: 'p2q13', number: 13,
      parts: [
        {
          id: 'p2q13a', marks: 3, topicId: 'maths-expressions',
          prompt: 'Expand and simplify (x + 2)(x − 3)(2x + 1)',
          answer: { kind: 'expression', expr: '2x^3-x^2-13x-6', vars: ['x'], form: 'expanded' },
          display: '2x³ − x² − 13x − 6',
          solution: '(x + 2)(x − 3) = x² − x − 6.\n(x² − x − 6)(2x + 1) = 2x³ + x² − 2x² − x − 12x − 6 = 2x³ − x² − 13x − 6.',
          samples: { accept: ['2x^3-x^2-13x-6'], reject: ['(x+2)(x-3)(2x+1)', '2x^3+x^2-13x-6'] },
        },
      ],
    },
    {
      id: 'p2q14', number: 14,
      parts: [
        {
          id: 'p2q14a', marks: 3, topicId: 'maths-expressions',
          prompt: 'Expand and simplify (2 + x)⁴',
          answer: { kind: 'expression', expr: '(2+x)^4', vars: ['x'], form: 'expanded' },
          display: '16 + 32x + 24x² + 8x³ + x⁴',
          solution: 'Pascal’s triangle row 1, 4, 6, 4, 1:\n1(2⁴) + 4(2³)x + 6(2²)x² + 4(2)x³ + x⁴ = 16 + 32x + 24x² + 8x³ + x⁴.',
          samples: { accept: ['16+32x+24x^2+8x^3+x^4', 'x^4+8x^3+24x^2+32x+16'], reject: ['(2+x)^4', '16+8x+24x^2+8x^3+x^4'] },
        },
      ],
    },
    {
      id: 'p2q15', number: 15,
      parts: [
        {
          id: 'p2q15a', marks: 3, topicId: 'maths-proof',
          prompt: 'Prove that (3n + 1)² − (3n − 1)² is a multiple of 12 for all integers n.',
          answer: {
            kind: 'self',
            checklist: [
              { text: 'Expands (3n + 1)² = 9n² + 6n + 1', marks: 1 },
              { text: 'Expands (3n − 1)² = 9n² − 6n + 1 and subtracts correctly to get 12n', marks: 1 },
              { text: 'Concludes 12n = 12 × n, so it is a multiple of 12', marks: 1 },
            ],
          },
          display: '9n² + 6n + 1 − (9n² − 6n + 1) = 12n',
          solution: '(3n + 1)² − (3n − 1)² = (9n² + 6n + 1) − (9n² − 6n + 1) = 12n.\n12n = 12 × n and n is an integer, so it is a multiple of 12.',
        },
      ],
    },
    {
      id: 'p2q16', number: 16,
      parts: [
        {
          id: 'p2q16a', marks: 3, topicId: 'maths-calculus',
          prompt: 'y = 2x² − 12x + 7\nUse calculus to work out the minimum value of y.',
          answer: { kind: 'number', value: -11 },
          display: '−11',
          solution: 'dy/dx = 4x − 12 = 0 at x = 3.\ny = 2(9) − 36 + 7 = −11.',
          samples: { accept: ['-11', 'y = -11'], reject: ['3', '11'] },
        },
      ],
    },
    {
      id: 'p2q17', number: 17,
      parts: [
        {
          id: 'p2q17a', marks: 4, topicId: 'maths-expressions',
          prompt: 'Solve 3/(x − 1) + 2/(x + 2) = 1\nGive your answers to 2 decimal places.',
          answer: { kind: 'numbers', values: [5.162278, -1.162278], tolerance: 0.005 },
          display: 'x = 5.16, x = −1.16',
          solution: 'Multiply through by (x − 1)(x + 2): 3(x + 2) + 2(x − 1) = (x − 1)(x + 2).\n5x + 4 = x² + x − 2 → x² − 4x − 6 = 0.\nx = 2 ± √10 = 5.16 or −1.16.',
          samples: { accept: ['5.16, -1.16', 'x = -1.16 or x = 5.16'], reject: ['5.16', '5.2, -1.2'] },
        },
      ],
    },
    {
      id: 'p2q18', number: 18,
      parts: [
        {
          id: 'p2q18a', marks: 3, topicId: 'maths-trig',
          prompt: 'In triangle PQR, PQ = 9 cm, angle PRQ = 63° and angle QPR = 42°.\nWork out the length of QR.\nGive your answer to 3 significant figures.',
          answer: { kind: 'number', value: 6.758846, tolerance: 0.006 },
          display: '6.76 cm',
          solution: 'Sine rule: QR / sin 42° = 9 / sin 63°.\nQR = 9 × sin 42° / sin 63° = 6.76 cm.',
          samples: { accept: ['6.76', '6.76 cm'], reject: ['11.98', '6.8'] },
        },
      ],
    },
    {
      id: 'p2q19', number: 19,
      stem: 'The line L has equation 3x + 4y = 24. It crosses the x-axis at A and the y-axis at B. O is the origin.',
      parts: [
        {
          id: 'p2q19a', label: '(a)', marks: 2, topicId: 'maths-linear',
          prompt: 'Work out the area of triangle OAB.',
          answer: { kind: 'number', value: 24 },
          display: '24',
          solution: 'y = 0 gives A(8, 0); x = 0 gives B(0, 6). Area = ½ × 8 × 6 = 24.',
          samples: { accept: ['24'], reject: ['48'] },
        },
        {
          id: 'p2q19b', label: '(b)', marks: 1, topicId: 'maths-pythagoras',
          prompt: 'Work out the length AB.',
          answer: { kind: 'number', value: 10 },
          display: '10',
          solution: 'AB = √(8² + 6²) = √100 = 10.',
          samples: { accept: ['10'], reject: ['14'] },
        },
        {
          id: 'p2q19c', label: '(c)', marks: 2, topicId: 'maths-linear',
          prompt: 'Find the equation of the line parallel to L that passes through (2, 1).\nGive your answer in the form ax + by = c',
          answer: { kind: 'equation', expr: '3x + 4y - 10', vars: ['x', 'y'] },
          display: '3x + 4y = 10',
          solution: 'A parallel line keeps 3x + 4y. At (2, 1): 3(2) + 4(1) = 10, so 3x + 4y = 10.',
          samples: { accept: ['3x + 4y = 10', 'y = -3x/4 + 5/2'], reject: ['3x + 4y = 24', '4x + 3y = 11'] },
        },
      ],
    },
    {
      id: 'p2q20', number: 20,
      stem: 'A = [[1, 2], [0, 1]]   B = [[0, 1], [1, 0]]',
      parts: [
        {
          id: 'p2q20a', label: '(a)', marks: 2, topicId: 'maths-matrices',
          prompt: 'Work out BA.',
          answer: { kind: 'matrix', rows: 2, cols: 2, values: [0, 1, 1, 2] },
          display: '[[0, 1], [1, 2]]',
          solution: 'Row 1 of B with columns of A: (0)(1) + (1)(0) = 0, (0)(2) + (1)(1) = 1.\nRow 2: (1)(1) + (0)(0) = 1, (1)(2) + (0)(1) = 2.',
          samples: { accept: ['0|1|1|2'], reject: ['2|1|1|0'] },
        },
        {
          id: 'p2q20b', label: '(b)', marks: 1, topicId: 'maths-matrices',
          prompt: 'Describe the transformation represented by B.',
          answer: {
            kind: 'choice',
            options: ['Reflection in the line y = x', 'Reflection in the x-axis', 'Rotation 90° clockwise about the origin', 'Reflection in the line y = −x'],
            correct: 0,
          },
          display: 'Reflection in the line y = x',
          solution: '(1, 0) → (0, 1) and (0, 1) → (1, 0): the x and y coordinates swap, a reflection in y = x.',
          samples: { accept: ['0'], reject: ['3'] },
        },
      ],
    },
    {
      id: 'p2q21', number: 21,
      stem: 'g(x) = 5 − (x + 2)²',
      parts: [
        {
          id: 'p2q21a', label: '(a)', marks: 1, topicId: 'maths-functions',
          prompt: 'Write down the maximum value of g(x).',
          answer: { kind: 'number', value: 5 },
          display: '5',
          solution: '(x + 2)² is never negative, so g(x) is biggest when (x + 2)² = 0: g = 5.',
          samples: { accept: ['5'], reject: ['-2'] },
        },
        {
          id: 'p2q21b', label: '(b)', marks: 1, topicId: 'maths-functions',
          prompt: 'Write down the value of x where the maximum occurs.',
          answer: { kind: 'number', value: -2 },
          display: 'x = −2',
          solution: 'x + 2 = 0 when x = −2.',
          samples: { accept: ['-2', 'x = -2'], reject: ['2'] },
        },
      ],
    },
    {
      id: 'p2q22', number: 22,
      parts: [
        {
          id: 'p2q22a', marks: 2, topicId: 'maths-quadratics',
          prompt: 'Solve x⁴ − 5x² + 4 = 0',
          answer: { kind: 'numbers', values: [1, -1, 2, -2] },
          display: 'x = ±1, ±2',
          solution: 'Treat it as a quadratic in x²: (x² − 1)(x² − 4) = 0.\nx² = 1 or x² = 4, so x = 1, −1, 2 or −2.',
          samples: { accept: ['1, -1, 2, -2', 'x = -2, -1, 1, 2'], reject: ['1, 4', '1, 2'] },
        },
      ],
    },
  ],
};

export const appExamSets: AppExamSet[] = [furtherMathsSet1];
export const appExamPapers: AppExamPaper[] = [furtherMathsSet1Paper1, furtherMathsSet1Paper2];

export function getAppExamPaper(paperId: string): AppExamPaper | undefined {
  return appExamPapers.find(p => p.id === paperId);
}

export function getAppExamSet(setId: string): AppExamSet | undefined {
  return appExamSets.find(s => s.id === setId);
}

export function getAppExamPapersForSubject(subjectId: string): AppExamPaper[] {
  return appExamPapers.filter(p => p.subjectId === subjectId);
}

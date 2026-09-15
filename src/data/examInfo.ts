// Real exam structure, sourced from The Purbeck School's GCSE Revision & Independent
// Study Booklet (2023-24) and the relevant exam board specifications, so tutor-style
// explanations and subject pages can reference the actual paper a topic will be tested in.

export interface ExamPaper {
  name: string;
  topicsCovered: string;
  marks?: number;
  weighting: string;
  duration: string;
}

export interface ExamInfo {
  board: string;
  specCode: string;
  papers: ExamPaper[];
  notes?: string;
}

export const examInfo: Record<string, ExamInfo> = {
  maths: {
    board: 'AQA',
    specCode: '8300',
    papers: [
      { name: 'Paper 1 (Non-Calculator)', topicsCovered: 'All topics on the specification', marks: 80, weighting: '33.3%', duration: '1h 30m' },
      { name: 'Paper 2 (Calculator)', topicsCovered: 'All topics on the specification', marks: 80, weighting: '33.3%', duration: '1h 30m' },
      { name: 'Paper 3 (Calculator)', topicsCovered: 'All topics on the specification', marks: 80, weighting: '33.3%', duration: '1h 30m' },
    ],
    notes: 'Higher tier targets grades 4–9. Any topic can appear on any paper, so all three papers require full specification coverage.',
  },
  biology: {
    board: 'AQA',
    specCode: '8461',
    papers: [
      { name: 'Paper 1', topicsCovered: 'B1–B9: Cell Biology, Organisation, Infection & Response, Bioenergetics', marks: 100, weighting: '50%', duration: '1h 45m' },
      { name: 'Paper 2', topicsCovered: 'B10–B18: Homeostasis & Response, Inheritance/Variation/Evolution, Ecology', marks: 100, weighting: '50%', duration: '1h 45m' },
    ],
    notes: 'Both papers include required-practical questions and a mix of multiple choice, structured, short answer and open response questions.',
  },
  chemistry: {
    board: 'AQA',
    specCode: '8462',
    papers: [
      { name: 'Paper 1', topicsCovered: 'C1–C7: Atomic Structure, Periodic Table, Structure & Bonding, Quantitative Chemistry, Chemical Changes, Electrolysis, Energy Changes', marks: 100, weighting: '50%', duration: '1h 45m' },
      { name: 'Paper 2', topicsCovered: 'C8–C15: Rates & Equilibria, Crude Oil, Organic Reactions, Polymers, Chemical Analysis, Earth\'s Atmosphere, Earth\'s Resources, Using Resources', marks: 100, weighting: '50%', duration: '1h 45m' },
    ],
    notes: 'Paper 2 can also draw on C1–C4 fundamentals, so early topics stay examinable throughout the course.',
  },
  physics: {
    board: 'AQA',
    specCode: '8463',
    papers: [
      { name: 'Paper 1', topicsCovered: 'P1–P7: Conservation & Dissipation of Energy, Energy Transfer by Heating, Energy Resources, Electric Circuits, Electricity in the Home, Molecules & Matter, Radioactivity', marks: 100, weighting: '50%', duration: '1h 45m' },
      { name: 'Paper 2', topicsCovered: 'P8–P16: Forces in Balance, Motion, Force & Motion, Force & Pressure, Wave Properties, EM Waves, Light, Electromagnetism, Space', marks: 100, weighting: '50%', duration: '1h 45m' },
    ],
    notes: 'Paper 2 can also draw on P1–P7 fundamentals. Both papers include required-practical questions.',
  },
  history: {
    board: 'WJEC Eduqas',
    specCode: 'GCSE (9–1) History',
    papers: [
      { name: 'Component 1A — British depth study', topicsCovered: 'The Elizabethan Age, 1558–1603', weighting: 'Component 1: 50%', duration: '1h' },
      { name: 'Component 1B — Non-British depth study', topicsCovered: 'Germany in Transition, 1919–1939', weighting: 'Component 1: 50%', duration: '1h' },
      { name: 'Component 2A — Period study', topicsCovered: 'The Development of the USA, 1929–2000', weighting: 'Component 2: 50%', duration: '45m' },
      { name: 'Component 2B — Thematic study', topicsCovered: 'Changes in Health and Medicine in Britain, c.500 to the present day', weighting: 'Component 2: 50%', duration: '1h 15m' },
    ],
    notes: 'The school booklet lists these four papers with these timings and recommends the "WJEC Eduqas GCSE (9–1) History" revision guide. The app\'s Medicine content currently starts at c.1250 and the Elizabethan content stops at 1588, so c.500–1250 and 1588–1603 still need adding.',
  },
  english: {
    board: 'AQA',
    specCode: 'Language 8700 / Literature 8702',
    papers: [
      { name: 'Language Paper 1', topicsCovered: 'Explorations in Creative Reading & Writing', marks: 80, weighting: '50% of Language', duration: '1h 45m' },
      { name: 'Language Paper 2', topicsCovered: 'Writers\' Viewpoints & Perspectives', marks: 80, weighting: '50% of Language', duration: '1h 45m' },
      { name: 'Literature Paper 1', topicsCovered: 'Shakespeare: Romeo and Juliet + The Sign of Four (19th-century novel)', marks: 64, weighting: '40% of Literature', duration: '1h 45m' },
      { name: 'Literature Paper 2', topicsCovered: 'An Inspector Calls (modern text) + Conflict Poetry anthology + unseen poetry', marks: 96, weighting: '60% of Literature', duration: '2h 15m' },
    ],
    notes: 'A separate, non-exam Speaking endorsement is reported but does not count towards the Language grade.',
  },
  computerscience: {
    board: 'OCR',
    specCode: 'J277',
    papers: [
      { name: 'Paper 1 (J277/01): Computer systems', topicsCovered: '1.1 Systems architecture, 1.2 Memory and storage, 1.3 Networks, connections and protocols, 1.4 Network security, 1.5 Systems software, 1.6 Ethical, legal, cultural and environmental impacts', marks: 80, weighting: '50%', duration: '1h 30m' },
      { name: 'Paper 2 (J277/02): Computational thinking, algorithms and programming', topicsCovered: '2.1 Algorithms, 2.2 Programming fundamentals, 2.3 Producing robust programs, 2.4 Boolean logic, 2.5 Programming languages and IDEs', marks: 80, weighting: '50%', duration: '1h 30m' },
    ],
    notes: 'Paper 2 Section B asks you to write and fix code in OCR Exam Reference Language or a high-level language — the school uses Python. There is also a practical programming task, which is not assessed but must be completed.',
  },
  spanish: {
    board: 'AQA',
    specCode: '8692',
    papers: [
      { name: 'Paper 1: Listening', topicsCovered: 'All three themes; includes a dictation section', marks: 50, weighting: '25%', duration: '45m (Higher)' },
      { name: 'Paper 2: Speaking', topicsCovered: 'Role-play, reading aloud with follow-up questions, and photo card conversation', marks: 50, weighting: '25%', duration: '10–12m + 15m prep (Higher)' },
      { name: 'Paper 3: Reading', topicsCovered: 'All three themes; includes translation into English', marks: 50, weighting: '25%', duration: '1h (Higher)' },
      { name: 'Paper 4: Writing', topicsCovered: 'Structured and open-ended writing; translation into Spanish', marks: 50, weighting: '25%', duration: '1h 15m (Higher)' },
    ],
    notes: 'Higher tier shown. Themes: People and lifestyle; Popular culture; Communication and the world around us. All four papers are sat at the same tier. The school booklet recommends the CGP AQA guide, so the board is taken to be AQA — check with her teacher.',
  },
};

/**
 * Which exam paper/component each unit is examined in. The subject diagnostic uses this to
 * test every paper's topics and to report results paper by paper.
 */
export const unitSections: Record<string, string> = {
  // Maths: every paper can test every topic, so the diagnostic is split into two halves.
  'maths-number': 'Part A: Number, Algebra & Ratio',
  'maths-algebra': 'Part A: Number, Algebra & Ratio',
  'maths-ratio': 'Part A: Number, Algebra & Ratio',
  'maths-geometry': 'Part B: Geometry, Statistics & Further',
  'maths-stats': 'Part B: Geometry, Statistics & Further',
  'maths-further': 'Part B: Geometry, Statistics & Further',

  'bio-cells': 'Paper 1', 'bio-organisation': 'Paper 1', 'bio-infection': 'Paper 1', 'bio-bioenergetics': 'Paper 1',
  'bio-homeostasis': 'Paper 2', 'bio-inheritance': 'Paper 2', 'bio-ecology': 'Paper 2',

  'chem-atomic': 'Paper 1', 'chem-bonding': 'Paper 1', 'chem-quant': 'Paper 1', 'chem-changes': 'Paper 1', 'chem-energy': 'Paper 1',
  'chem-rates': 'Paper 2', 'chem-organic': 'Paper 2', 'chem-analysis': 'Paper 2', 'chem-atmosphere': 'Paper 2', 'chem-resources': 'Paper 2',

  'phys-energy': 'Paper 1', 'phys-electricity': 'Paper 1', 'phys-particles': 'Paper 1', 'phys-atomic': 'Paper 1',
  'phys-forces': 'Paper 2', 'phys-waves': 'Paper 2', 'phys-magnetism': 'Paper 2', 'phys-space': 'Paper 2',

  'hist-elizabeth': 'Component 1: Studies in Depth', 'hist-germany': 'Component 1: Studies in Depth',
  'hist-usa': 'Component 2: Studies in Breadth', 'hist-medicine': 'Component 2: Studies in Breadth',

  'eng-lang1': 'Language Paper 1', 'eng-lang2': 'Language Paper 2',
  'eng-writing': 'Language Skills (both papers)', 'eng-reading': 'Language Skills (both papers)',
  'eng-r-and-j': 'Literature Paper 1', 'eng-19c': 'Literature Paper 1',
  'eng-modern': 'Literature Paper 2', 'eng-poetry': 'Literature Paper 2',

  'cs-systems': 'Paper 1: Computer Systems',
  'cs-programming': 'Paper 2: Computational Thinking & Programming',

  'sp-theme1': 'Theme 1: People and Lifestyle',
  'sp-theme2': 'Theme 2: Popular Culture',
  'sp-theme3': 'Theme 3: Communication and the World Around Us',
  'sp-grammar': 'Grammar & Exam Skills (all papers)',
};

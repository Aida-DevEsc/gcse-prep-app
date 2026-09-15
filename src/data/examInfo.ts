// Real exam structure, sourced from The Purbeck School's GCSE Revision & Independent
// Study Booklet (2023-24) and the relevant exam board specifications, so tutor-style
// explanations and subject pages can reference the actual paper a topic will be tested in.

export interface ExamPaper {
  name: string;
  topicsCovered: string;
  marks: number;
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
    board: 'Edexcel',
    specCode: '1HI0',
    papers: [
      { name: 'Paper 1 (Thematic + British Depth)', topicsCovered: 'Medicine in Britain, c1250–present + Early Elizabethan England, 1558–88', marks: 84, weighting: '30%', duration: '1h 45m' },
      { name: 'Paper 2 (Period Study + Modern Depth)', topicsCovered: 'The USA, 1929–2000: Boom, Bust and Civil Rights + Weimar & Nazi Germany, 1918–39', marks: 84, weighting: '40%', duration: '1h 45m' },
    ],
    notes: 'The Purbeck School\'s own revision booklet times these as four separate content blocks for revision purposes (Germany, Medicine, the USA, and Elizabethan England) even though they sit across two combined exam papers.',
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
};

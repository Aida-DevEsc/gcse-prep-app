/**
 * Real past papers, linked (not copied) from the exam board's public filestore.
 * Grade boundaries are AQA's published figures: the subject boundary (all papers added up) is the
 * real one; per-paper boundaries are AQA's "notional component boundaries", for illustration only.
 */

export interface PastPaper {
  id: string;
  number: number;
  code: string;
  title: string;
  calculator: boolean;
  maxMarks: number;
  minutes: number;
  questionPaper: string;
  markScheme: string;
  examinerReport?: string;
  /** Notional boundaries, aligned with the qualification's `grades`. */
  boundaries?: number[];
}

export interface PastPaperSeries {
  id: string;
  label: string;
  /** Sort key, newest first. */
  sortKey: string;
  papers: PastPaper[];
  /** Real subject boundaries for the whole series, aligned with the qualification's `grades`. */
  totalBoundaries: number[];
  note?: string;
}

export interface PastPaperQualification {
  id: string;
  subjectId: string;
  name: string;
  shortName: string;
  board: string;
  code: string;
  /** Highest grade first. Below the last boundary is a U. */
  grades: string[];
  totalMarks: number;
  series: PastPaperSeries[];
  about: string;
  moreLink?: { label: string; url: string };
}

const FILESTORE = 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes';

// ---------------- AQA GCSE Mathematics 8300 Higher ----------------

const MATHS_8300_PAPERS = [
  { number: 1, title: 'Paper 1 (non-calculator)', calculator: false },
  { number: 2, title: 'Paper 2 (calculator)', calculator: true },
  { number: 3, title: 'Paper 3 (calculator)', calculator: true },
];

interface SeriesInput {
  code: string;       // e.g. JUN23
  label: string;      // e.g. June 2023
  year: number;
  month: 'june' | 'november';
  /** Older mark schemes are published with a "W-" (web) prefix. */
  webMarkScheme?: boolean;
  total: number[];
  papers: number[][];
  note?: string;
}

function maths8300Series(s: SeriesInput): PastPaperSeries {
  const base = `${FILESTORE}/${s.year}/${s.month}`;
  return {
    id: `8300H-${s.code}`,
    label: s.label,
    sortKey: `${s.year}-${s.month === 'june' ? '06' : '11'}`,
    totalBoundaries: s.total,
    note: s.note,
    papers: MATHS_8300_PAPERS.map((p, i) => ({
      id: `8300H-${s.code}-${p.number}`,
      number: p.number,
      code: `8300/${p.number}H`,
      title: p.title,
      calculator: p.calculator,
      maxMarks: 80,
      minutes: 90,
      questionPaper: `${base}/AQA-8300${p.number}H-QP-${s.code}.PDF`,
      markScheme: `${base}/AQA-8300${p.number}H-${s.webMarkScheme ? 'W-' : ''}MS-${s.code}.PDF`,
      examinerReport: `${base}/AQA-8300${p.number}H-WRE-${s.code}.PDF`,
      boundaries: s.papers[i],
    })),
  };
}

const NOVEMBER_NOTE = 'November papers are the resit series — the same standard, and good extra practice.';

export const maths8300Higher: PastPaperQualification = {
  id: '8300H',
  subjectId: 'maths',
  name: 'AQA GCSE Mathematics — Higher tier (8300H)',
  shortName: 'GCSE Maths Higher',
  board: 'AQA',
  code: '8300H',
  grades: ['9', '8', '7', '6', '5', '4', '3'],
  totalMarks: 240,
  about: 'Three papers of 80 marks, 1 hour 30 minutes each. Your real grade comes from all three papers added together (out of 240).',
  moreLink: { label: 'AQA GCSE Maths assessment resources', url: 'https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/assessment-resources' },
  series: [
    maths8300Series({
      code: 'JUN23', label: 'June 2023', year: 2023, month: 'june',
      total: [214, 186, 158, 125, 92, 59, 42],
      papers: [[70, 59, 49, 39, 30, 21, 16], [71, 62, 53, 41, 30, 19, 13], [72, 64, 56, 43, 31, 19, 13]],
    }),
    maths8300Series({
      code: 'NOV22', label: 'November 2022', year: 2022, month: 'november', note: NOVEMBER_NOTE,
      total: [201, 172, 143, 111, 79, 48, 32],
      papers: [[67, 57, 47, 37, 27, 18, 13], [67, 57, 47, 36, 25, 14, 8], [68, 58, 49, 38, 27, 16, 10]],
    }),
    maths8300Series({
      code: 'JUN22', label: 'June 2022', year: 2022, month: 'june',
      total: [214, 185, 156, 121, 86, 51, 33],
      papers: [[71, 60, 50, 38, 26, 14, 8], [72, 63, 54, 43, 32, 20, 14], [71, 61, 52, 40, 28, 17, 11]],
      note: 'Students were given advance information about the topics in 2022, so the grade boundaries are higher than usual.',
    }),
    maths8300Series({
      code: 'NOV21', label: 'November 2021', year: 2021, month: 'november', note: NOVEMBER_NOTE,
      total: [192, 155, 119, 90, 62, 34, 20],
      papers: [[64, 51, 39, 30, 21, 12, 7], [63, 50, 38, 29, 20, 11, 6], [65, 53, 42, 32, 22, 11, 5]],
    }),
    maths8300Series({
      code: 'NOV20', label: 'November 2020', year: 2020, month: 'november', webMarkScheme: true, note: NOVEMBER_NOTE,
      total: [194, 159, 124, 95, 67, 39, 25],
      papers: [[64, 51, 39, 30, 21, 12, 7], [65, 53, 42, 32, 22, 12, 7], [65, 54, 43, 33, 24, 15, 10]],
    }),
    maths8300Series({
      code: 'NOV19', label: 'November 2019', year: 2019, month: 'november', webMarkScheme: true, note: NOVEMBER_NOTE,
      total: [199, 168, 137, 107, 78, 49, 34],
      papers: [[66, 55, 44, 33, 23, 13, 9], [66, 56, 46, 36, 27, 18, 12], [67, 57, 47, 37, 27, 18, 12]],
    }),
    maths8300Series({
      code: 'JUN19', label: 'June 2019', year: 2019, month: 'june', webMarkScheme: true,
      total: [206, 171, 136, 105, 74, 43, 27],
      papers: [[68, 55, 42, 32, 23, 14, 9], [69, 57, 46, 35, 24, 14, 9], [70, 59, 48, 37, 26, 15, 9]],
    }),
  ],
};

// ---------------- AQA Level 2 Certificate in Further Mathematics 8365 ----------------

function furtherMathsSeries(code: string, label: string, year: number, total: number[], papers: number[][]): PastPaperSeries {
  const base = `${FILESTORE}/${year}/june`;
  return {
    id: `8365-${code}`,
    label,
    sortKey: `${year}-06`,
    totalBoundaries: total,
    papers: [
      { number: 1, title: 'Paper 1 (non-calculator)', calculator: false },
      { number: 2, title: 'Paper 2 (calculator)', calculator: true },
    ].map((p, i) => ({
      id: `8365-${code}-${p.number}`,
      number: p.number,
      code: `8365/${p.number}`,
      title: p.title,
      calculator: p.calculator,
      maxMarks: 80,
      minutes: 105,
      questionPaper: `${base}/AQA-8365${p.number}-QP-${code}.PDF`,
      markScheme: `${base}/AQA-8365${p.number}-MS-${code}.PDF`,
      examinerReport: `${base}/AQA-8365${p.number}-WRE-${code}.PDF`,
      boundaries: papers[i],
    })),
  };
}

export const furtherMaths8365: PastPaperQualification = {
  id: '8365',
  subjectId: 'maths',
  name: 'AQA Level 2 Certificate in Further Mathematics (8365)',
  shortName: 'Level 2 Further Maths',
  board: 'AQA',
  code: '8365',
  grades: ['9', '8', '7', '6', '5', '4'],
  totalMarks: 160,
  about: 'Two papers of 80 marks, 1 hour 45 minutes each. Your grade comes from both papers added together (out of 160). ' +
    'The 2020 and 2021 exams were cancelled and AQA has not yet made papers after 2023 public, so June 2022 and June 2023 are the only full public sets.',
  moreLink: { label: 'AQA Further Maths 8365 specimen papers', url: 'https://www.aqa.org.uk/subjects/mathematics/aqa-certificate/mathematics-8365/assessment-resources' },
  series: [
    furtherMathsSeries('JUN23', 'June 2023', 2023, [137, 120, 103, 85, 68, 59], [[68, 59, 51, 42, 34, 30], [69, 60, 52, 43, 34, 29]]),
    furtherMathsSeries('JUN22', 'June 2022', 2022, [129, 110, 92, 73, 54, 44], [[59, 50, 41, 32, 23, 18], [70, 60, 51, 41, 31, 26]]),
  ],
};

export const pastPaperQualifications: PastPaperQualification[] = [furtherMaths8365, maths8300Higher];

export function getQualificationsForSubject(subjectId: string): PastPaperQualification[] {
  return pastPaperQualifications.filter(q => q.subjectId === subjectId);
}

export function findPaper(paperId: string): { qualification: PastPaperQualification; series: PastPaperSeries; paper: PastPaper } | null {
  for (const qualification of pastPaperQualifications) {
    for (const series of qualification.series) {
      const paper = series.papers.find(p => p.id === paperId);
      if (paper) return { qualification, series, paper };
    }
  }
  return null;
}

/** Where to find past papers for subjects that don't have a marked set in the app yet. */
export const pastPaperPortals: Record<string, { label: string; url: string }> = {
  biology: { label: 'AQA GCSE Biology (8461) past papers', url: 'https://www.aqa.org.uk/subjects/biology/gcse/biology-8461/assessment-resources' },
  chemistry: { label: 'AQA GCSE Chemistry (8462) past papers', url: 'https://www.aqa.org.uk/subjects/chemistry/gcse/chemistry-8462/assessment-resources' },
  physics: { label: 'AQA GCSE Physics (8463) past papers', url: 'https://www.aqa.org.uk/subjects/physics/gcse/physics-8463/assessment-resources' },
  history: { label: 'WJEC Eduqas GCSE History past papers', url: 'https://www.eduqas.co.uk/qualifications/history-gcse/#tab_pastpapers' },
  english: { label: 'AQA GCSE English Language (8700) past papers', url: 'https://www.aqa.org.uk/subjects/english/gcse/english-8700/assessment-resources' },
  computerscience: { label: 'OCR GCSE Computer Science (J277) past papers', url: 'https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/assessment/' },
  spanish: { label: 'AQA GCSE Spanish (8692) past papers', url: 'https://www.aqa.org.uk/subjects/spanish/gcse/spanish-8692/assessment-resources' },
};

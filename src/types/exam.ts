/** Exam papers that are sat and marked inside the app. */

export type AnswerSpec =
  /** A single value. `tolerance` allows rounded answers; `form: 'surd'` also needs a simplified, rationalised surd. */
  | { kind: 'number'; value: number; tolerance?: number; form?: 'surd' }
  /** A set of values in any order, e.g. the solutions of an equation. */
  | { kind: 'numbers'; values: number[]; tolerance?: number }
  /** An expression checked for equivalence by substitution, optionally in a required form. */
  | { kind: 'expression'; expr: string; vars: string[]; form?: 'factorised' | 'expanded' | 'completedSquare' | 'noPowers' }
  /** An equation, e.g. of a line or circle: any rearrangement of `expr = 0` is accepted. */
  | { kind: 'equation'; expr: string; vars: string[] }
  /** One or more coordinate pairs in any order, each written as expressions, e.g. "(-6/5, -17/5)". */
  | { kind: 'coordinates'; points: [string, string][]; tolerance?: number }
  /** A region of the number line such as "x < -3 or x > 4". */
  | { kind: 'inequality'; expr: string; variable: string }
  /** A matrix entered in a grid, row by row. */
  | { kind: 'matrix'; rows: number; cols: number; values: number[] }
  | { kind: 'choice'; options: string[]; correct: number }
  /** "Show that" and proof questions: the student marks her own working against the checklist. */
  | { kind: 'self'; checklist: { text: string; marks: number }[] };

export interface ExamPart {
  id: string;
  label?: string;
  prompt: string;
  marks: number;
  topicId: string;
  answer: AnswerSpec;
  /** The answer as it appears in the mark scheme. */
  display: string;
  /** Worked solution shown after marking. */
  solution: string;
  /** Tells the student how to type the answer. */
  hint?: string;
  /** Checked by scripts/check-exams.ts: sample inputs that must be accepted or rejected. */
  samples?: { accept?: string[]; reject?: string[] };
}

export interface ExamQuestion {
  id: string;
  number: number;
  stem?: string;
  parts: ExamPart[];
}

export interface AppExamPaper {
  id: string;
  subjectId: string;
  /** Groups papers that make up one full exam (e.g. Paper 1 + Paper 2). */
  setId: string;
  setLabel: string;
  qualification: string;
  title: string;
  code: string;
  calculator: boolean;
  minutes: number;
  maxMarks: number;
  grades: string[];
  /** Estimated minimum marks for each grade, aligned with `grades`. */
  boundaries: number[];
  instructions: string[];
  questions: ExamQuestion[];
}

export interface AppExamSet {
  id: string;
  label: string;
  grades: string[];
  /** Estimated boundaries for all papers in the set added together. */
  totalBoundaries: number[];
  boundaryNote: string;
}

/** An exam in progress, saved as she types so a refresh or a closed tab doesn't lose anything. */
export interface ExamDraft {
  paperId: string;
  startedAt: string;
  /** Seconds spent with the exam open; the clock stops while the tab is closed. */
  elapsedSeconds: number;
  answers: Record<string, string>;
  flagged: string[];
  current: number;
}

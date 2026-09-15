import type { PastPaperAttempt, TopicStatus } from '../types';
import type { PastPaperQualification, PastPaperSeries } from '../data/pastPapers';

export interface GradeResult {
  grade: string;
  /** Next grade up, if there is one. */
  nextGrade?: string;
  marksToNext?: number;
}

/**
 * `boundaries` are minimum marks aligned with `grades` (highest first).
 * A mark below the lowest boundary is a U.
 */
export function gradeFromBoundaries(marks: number, boundaries: number[], grades: string[]): GradeResult {
  const index = boundaries.findIndex(b => marks >= b);
  if (index === 0) return { grade: grades[0] };
  if (index === -1) {
    const last = boundaries.length - 1;
    return { grade: 'U', nextGrade: grades[last], marksToNext: boundaries[last] - marks };
  }
  return { grade: grades[index], nextGrade: grades[index - 1], marksToNext: boundaries[index - 1] - marks };
}

export function percent(marks: number, max: number): number {
  return max > 0 ? Math.round((marks / max) * 100) : 0;
}

export function newAttemptId(): string {
  return `pp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Most recent attempt of each paper — a retake replaces the earlier one for grades and topic flags. */
export function latestAttemptsByPaper(attempts: PastPaperAttempt[]): Map<string, PastPaperAttempt> {
  const latest = new Map<string, PastPaperAttempt>();
  for (const a of attempts) {
    const current = latest.get(a.paperId);
    if (!current || a.date > current.date) latest.set(a.paperId, a);
  }
  return latest;
}

export interface SeriesResult {
  papersDone: number;
  papersTotal: number;
  marks: number;
  maxMarks: number;
  /** Only set once every paper in the series has been marked — that is how the real grade works. */
  overall?: GradeResult;
}

export function getSeriesResult(qualification: PastPaperQualification, series: PastPaperSeries, latest: Map<string, PastPaperAttempt>): SeriesResult {
  const done = series.papers.map(p => latest.get(p.id)).filter((a): a is PastPaperAttempt => !!a);
  const marks = done.reduce((sum, a) => sum + a.marks, 0);
  const maxMarks = series.papers.reduce((sum, p) => sum + p.maxMarks, 0);
  const complete = done.length === series.papers.length;
  return {
    papersDone: done.length,
    papersTotal: series.papers.length,
    marks,
    maxMarks,
    overall: complete ? gradeFromBoundaries(marks, series.totalBoundaries, qualification.grades) : undefined,
  };
}

/** Marks lost on one topic across the latest attempts: 4+ is a Priority, 1–3 a Gap. */
export const PAST_PAPER_PRIORITY_MARKS = 4;

export function statusFromLostMarks(lost: number): TopicStatus | undefined {
  if (lost >= PAST_PAPER_PRIORITY_MARKS) return 'priority';
  if (lost > 0) return 'gap';
  return undefined;
}

export interface PastPaperTopicFlag {
  lost: number;
  /** Date of the most recent attempt that lost marks on this topic. */
  date: string;
  papers: string[];
}

export function getPastPaperTopicFlags(subjectId: string, attempts: PastPaperAttempt[]): Record<string, PastPaperTopicFlag> {
  const latest = latestAttemptsByPaper(attempts.filter(a => a.subjectId === subjectId));
  const flags: Record<string, PastPaperTopicFlag> = {};
  for (const attempt of latest.values()) {
    for (const [topicId, lost] of Object.entries(attempt.lostByTopic)) {
      if (!lost) continue;
      const flag = flags[topicId] || { lost: 0, date: '', papers: [] };
      flag.lost += lost;
      if (attempt.date > flag.date) flag.date = attempt.date;
      flag.papers.push(attempt.paperId);
      flags[topicId] = flag;
    }
  }
  return flags;
}

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

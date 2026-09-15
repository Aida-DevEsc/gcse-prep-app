import type { Subject, Topic, Question, DiagnosticResult, TopicProgress, TopicStatus, UserState } from '../types';

/** Two questions per topic lets us tell a partial gap (1/2) from a priority (0/2). */
export const QUESTIONS_PER_TOPIC = 2;

export interface DiagnosticSection {
  key: string;
  topics: Topic[];
}

/** One section per exam paper/component, in paper order. */
export function getDiagnosticSections(subject: Subject): DiagnosticSection[] {
  const sections: DiagnosticSection[] = [];
  for (const unit of subject.units) {
    const key = unit.examSection || 'All topics';
    let section = sections.find(s => s.key === key);
    if (!section) {
      section = { key, topics: [] };
      sections.push(section);
    }
    section.topics.push(...unit.topics);
  }
  return sections;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pitched at a grade 7–9 student: for each topic take one "further" and one "higher" question
 * where the topic has them, only falling back to easier questions when it doesn't.
 */
export function pickHighGradeQuestions(topics: Topic[], perTopic = QUESTIONS_PER_TOPIC): Question[] {
  const picked: Question[] = [];
  for (const topic of topics) {
    const by = (d: Question['difficulty']) => shuffle(topic.questions.filter(q => q.difficulty === d));
    const further = by('further');
    const higher = by('higher');
    const ordered = [
      ...further.slice(0, 1),
      ...higher.slice(0, 1),
      ...further.slice(1),
      ...higher.slice(1),
      ...by('intermediate'),
      ...by('foundation'),
    ];
    picked.push(...ordered.slice(0, perTopic));
  }
  return shuffle(picked);
}

export function statusFromScore(correct: number, total: number): TopicStatus {
  if (total === 0) return 'untested';
  if (correct >= total) return 'secure';
  if (correct === 0) return 'priority';
  return 'gap';
}

/**
 * A topic's diagnostic status, upgraded to "secure" once she has closed the gap through practice
 * (at least 10 practice questions at 80%+ mastery).
 */
export function getTopicStatus(topicId: string, diagnostic?: DiagnosticResult, progress?: TopicProgress): TopicStatus {
  const score = diagnostic?.topicScores[topicId];
  const base = score ? statusFromScore(score.correct, score.total) : 'untested';
  if ((base === 'priority' || base === 'gap') && progress && progress.questionsAttempted >= 10 && progress.masteryPercent >= 80) {
    return 'secure';
  }
  return base;
}

export const STATUS_META: Record<TopicStatus, { label: string; icon: string; className: string; hint: string }> = {
  priority: { label: 'Priority', icon: '🔴', className: 'bg-red-100 text-red-700 border-red-300', hint: 'Missed both diagnostic questions — revise this first' },
  gap: { label: 'Gap', icon: '🟠', className: 'bg-amber-100 text-amber-800 border-amber-300', hint: 'Missed one diagnostic question — partly secure' },
  secure: { label: 'Secure', icon: '🟢', className: 'bg-emerald-100 text-emerald-700 border-emerald-300', hint: 'Answered grade 7–9 questions correctly' },
  untested: { label: 'Not tested', icon: '⚪', className: 'bg-slate-100 text-slate-500 border-slate-200', hint: 'Take the diagnostic to find out' },
};

export function getSubjectStatuses(subject: Subject, state: UserState): Record<string, TopicStatus> {
  const diagnostic = state.diagnosticResults.find(d => d.subjectId === subject.id);
  const out: Record<string, TopicStatus> = {};
  for (const topic of subject.units.flatMap(u => u.topics)) {
    out[topic.id] = getTopicStatus(topic.id, diagnostic, state.topicProgress[topic.id]);
  }
  return out;
}

export function countStatuses(statuses: Record<string, TopicStatus>): Record<TopicStatus, number> {
  const counts: Record<TopicStatus, number> = { priority: 0, gap: 0, secure: 0, untested: 0 };
  for (const s of Object.values(statuses)) counts[s]++;
  return counts;
}

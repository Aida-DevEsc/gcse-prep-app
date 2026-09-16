import type { Subject, UserState, StudyPlan, StudyPlanDay, StudySession, WeekDay } from '../types';
import { MIN_DAILY_MINUTES, OPTIONAL_STUDY_DAYS } from '../types';
import { getSubjectStatuses } from './diagnostic';

const WEEKDAYS: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function newSessionId(): string {
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const isCustomSession = (s: StudySession) => s.kind === 'custom';

/** Study minutes for the day — her own project slots are not counted. */
export function dayTotal(day: StudyPlanDay): number {
  return day.sessions.reduce((sum, s) => sum + (isCustomSession(s) ? 0 : s.minutes || 0), 0);
}

export function isOptionalDay(day: WeekDay): boolean {
  return OPTIONAL_STUDY_DAYS.includes(day);
}

export function isDayBelowMinimum(day: StudyPlanDay): boolean {
  return !isOptionalDay(day.day) && dayTotal(day) < MIN_DAILY_MINUTES;
}

function averageMastery(subject: Subject, state: UserState): number {
  const topics = subject.units.flatMap(u => u.topics);
  if (topics.length === 0) return 0;
  return topics.reduce((sum, t) => sum + (state.topicProgress[t.id]?.masteryPercent || 0), 0) / topics.length;
}

/**
 * Builds a weekly plan with at least an hour of study every day except optional days (Sunday),
 * split across two subjects. Her own free-text slots are kept.
 * Subjects with more diagnostic Priority/Gap topics (then lower mastery) get more sessions,
 * and each session is pointed at that subject's next Priority or Gap topic where there is one.
 */
export function generateStudyPlan(subjects: Subject[], state: UserState): StudyPlan {
  const info = subjects.map(subject => {
    const statuses = getSubjectStatuses(subject, state);
    const topics = subject.units.flatMap(u => u.topics);
    const priority = topics.filter(t => statuses[t.id] === 'priority').map(t => t.id);
    const gap = topics.filter(t => statuses[t.id] === 'gap').map(t => t.id);
    const untested = topics.filter(t => statuses[t.id] === 'untested').length;
    const diagnosed = state.diagnosticResults.some(d => d.subjectId === subject.id);
    // Undiagnosed subjects get a middling weight so they still appear (their first session is the diagnostic);
    // partly diagnosed subjects keep some of that weight until every section is done.
    const weight = diagnosed ? priority.length * 3 + gap.length + (untested > 0 ? 3 : 0) : 6;
    return { subject, focusQueue: [...priority, ...gap], weight, mastery: averageMastery(subject, state) };
  });

  const ranked = [...info].sort((a, b) => b.weight - a.weight || a.mastery - b.mastery);

  // 7 days x 2 subjects = 14 sessions; walk the ranked list round-robin so the weakest subjects get extra sessions.
  const sessionsPerDay = 2;
  const studyDays = WEEKDAYS.filter(d => !isOptionalDay(d));
  const slots: typeof ranked = [];
  while (slots.length < studyDays.length * sessionsPerDay && ranked.length > 0) {
    slots.push(ranked[slots.length % ranked.length]);
  }

  const queues = new Map(info.map(i => [i.subject.id, [...i.focusQueue]]));

  return WEEKDAYS.map((day): StudyPlanDay => {
    const custom = (state.studyPlan.find(d => d.day === day)?.sessions || []).filter(isCustomSession);
    if (isOptionalDay(day)) return { day, sessions: custom };
    const dayIndex = studyDays.indexOf(day);
    const weekend = day === 'Sat';
    const minutes = weekend ? 45 : 30; // weekdays 60 min total, Saturday 90 min
    const daySlots = slots.slice(dayIndex * sessionsPerDay, dayIndex * sessionsPerDay + sessionsPerDay);
    // Avoid the same subject twice in one day when the list is short.
    const unique = daySlots.filter((s, i) => daySlots.findIndex(x => x.subject.id === s.subject.id) === i);
    const sessions: StudySession[] = unique.map(slot => ({
      id: newSessionId(),
      subjectId: slot.subject.id,
      topicId: queues.get(slot.subject.id)?.shift() ?? null,
      minutes: unique.length === 1 ? Math.max(MIN_DAILY_MINUTES, minutes * 2) : minutes,
    }));
    return { day, sessions: [...sessions, ...custom] };
  });
}

export function dayLabel(day: WeekDay): string {
  const map: Record<WeekDay, string> = {
    Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
  };
  return map[day];
}

export function todayWeekDay(): WeekDay {
  const order: WeekDay[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return order[new Date().getDay()];
}

import type { Subject, UserState, StudyPlan, StudyPlanDay, WeekDay } from '../types';

const WEEKDAYS: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function subjectAverageMastery(subject: Subject, state: UserState): number {
  const topics = subject.units.flatMap(u => u.topics);
  if (topics.length === 0) return 0;
  const total = topics.reduce((sum, t) => sum + (state.topicProgress[t.id]?.masteryPercent || 0), 0);
  return total / topics.length;
}

function subjectHasUnfinishedSummerTopics(subject: Subject, state: UserState): boolean {
  return subject.units.some(u =>
    u.topics.some(t => t.summerTerm && (state.topicProgress[t.id]?.masteryPercent || 0) < 70)
  );
}

/**
 * Builds a suggested weekly study plan: weaker subjects (lower average mastery, or with
 * unfinished Summer Term focus topics) are prioritised for weekday slots. Saturday is
 * reserved for the single weakest subject as extra revision; Sunday is a rest day.
 */
export function generateStudyPlan(subjects: Subject[], state: UserState): StudyPlan {
  const ranked = [...subjects].sort((a, b) => {
    const aSummer = subjectHasUnfinishedSummerTopics(a, state) ? 1 : 0;
    const bSummer = subjectHasUnfinishedSummerTopics(b, state) ? 1 : 0;
    if (aSummer !== bSummer) return bSummer - aSummer; // summer-focus subjects first
    return subjectAverageMastery(a, state) - subjectAverageMastery(b, state); // weakest first
  });

  const weekdaySubjects = ranked.slice(0, 5);
  // Ensure exactly 5 weekday slots even if there are fewer than 5 subjects (cycle through).
  while (weekdaySubjects.length < 5 && ranked.length > 0) {
    weekdaySubjects.push(ranked[weekdaySubjects.length % ranked.length]);
  }

  const weakest = ranked[0];

  const plan: StudyPlan = WEEKDAYS.map((day, i): StudyPlanDay => {
    if (day === 'Sun') return { day, subjectId: null, minutes: 0 };
    if (day === 'Sat') return { day, subjectId: weakest ? weakest.id : null, minutes: 45 };
    return { day, subjectId: weekdaySubjects[i] ? weekdaySubjects[i].id : null, minutes: 30 };
  });

  return plan;
}

export function dayLabel(day: WeekDay): string {
  const map: Record<WeekDay, string> = {
    Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
  };
  return map[day];
}

export function todayWeekDay(): WeekDay {
  const idx = new Date().getDay(); // 0=Sun..6=Sat
  const order: WeekDay[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return order[idx];
}

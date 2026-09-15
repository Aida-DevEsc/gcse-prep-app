import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAllSubjects } from '../data/index';
import { generateStudyPlan, dayLabel, todayWeekDay, dayTotal, isDayBelowMinimum, newSessionId } from '../utils/studyPlan';
import { getSubjectStatuses, STATUS_META } from '../utils/diagnostic';
import { MIN_DAILY_MINUTES } from '../types';
import type { StudySession, TopicStatus, WeekDay } from '../types';

export default function StudyPlanCard() {
  const { state, dispatch } = useApp();
  const subjects = getAllSubjects();
  const [editing, setEditing] = useState(false);
  const currentDay = todayWeekDay();

  // Seed a suggested plan the first time a profile has no sessions planned.
  useEffect(() => {
    if (state.studyPlan.every(d => d.sessions.length === 0)) {
      dispatch({ type: 'SET_STUDY_PLAN', plan: generateStudyPlan(subjects, state) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusesBySubject = useMemo(() => {
    const out: Record<string, Record<string, TopicStatus>> = {};
    for (const s of subjects) out[s.id] = getSubjectStatuses(s, state);
    return out;
  }, [subjects, state]);

  const sessionsFor = (day: WeekDay) => state.studyPlan.find(d => d.day === day)?.sessions || [];
  const setSessions = (day: WeekDay, sessions: StudySession[]) =>
    dispatch({ type: 'UPDATE_STUDY_PLAN_DAY', day, patch: { sessions } });

  const updateSession = (day: WeekDay, id: string, patch: Partial<StudySession>) =>
    setSessions(day, sessionsFor(day).map(s => (s.id === id ? { ...s, ...patch } : s)));

  const removeSession = (day: WeekDay, id: string) => setSessions(day, sessionsFor(day).filter(s => s.id !== id));

  const addSession = (day: WeekDay) => {
    const used = new Set(sessionsFor(day).map(s => s.subjectId));
    const subject = subjects.find(s => !used.has(s.id)) || subjects[0];
    setSessions(day, [...sessionsFor(day), { id: newSessionId(), subjectId: subject.id, topicId: null, minutes: 30 }]);
  };

  const regenerate = () => {
    if (editing || confirm('Replace your plan with a new suggestion based on your latest Priorities and Gaps?')) {
      dispatch({ type: 'SET_STUDY_PLAN', plan: generateStudyPlan(subjects, state) });
    }
  };

  const daysBelow = state.studyPlan.filter(isDayBelowMinimum);
  const weekMinutes = state.studyPlan.reduce((sum, d) => sum + dayTotal(d), 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5 mb-6 md:mb-8">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="text-xl">📅</span>
        <h2 className="text-lg font-bold text-slate-800">Your Study Plan</h2>
        <span className="text-xs text-slate-400">
          {Math.floor(weekMinutes / 60)}h {weekMinutes % 60 ? `${weekMinutes % 60}m` : ''} this week · min {MIN_DAILY_MINUTES} min a day
        </span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={regenerate}
            className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200"
            title="Rebuild the plan from your diagnostic Priorities and Gaps"
          >
            🔄 Suggest plan
          </button>
          <button
            onClick={() => setEditing(e => !e)}
            disabled={editing && daysBelow.length > 0}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed ${
              editing ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {editing ? '✓ Done editing' : '✏️ Edit plan'}
          </button>
        </div>
      </div>
      {editing && daysBelow.length > 0 && (
        <p className="text-xs text-red-600 mb-2">
          Every day needs at least {MIN_DAILY_MINUTES} minutes — {daysBelow.map(d => dayLabel(d.day)).join(', ')} {daysBelow.length === 1 ? 'is' : 'are'} short.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
        {state.studyPlan.map(entry => {
          const isToday = entry.day === currentDay;
          const total = dayTotal(entry);
          const short = total < MIN_DAILY_MINUTES;
          return (
            <div
              key={entry.day}
              className={`rounded-lg p-2.5 border ${
                isToday ? 'border-indigo-400 bg-indigo-50' : short ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className={`text-[10px] font-semibold uppercase tracking-wide ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {dayLabel(entry.day)} {isToday && '• Today'}
                </p>
                <span className={`text-[10px] font-semibold ${short ? 'text-red-600' : 'text-slate-400'}`}>
                  {total} min{short && ` · needs ${MIN_DAILY_MINUTES - total} more`}
                </span>
              </div>

              <div className="space-y-1.5">
                {entry.sessions.map(session => {
                  const subject = subjects.find(s => s.id === session.subjectId);
                  if (!subject) return null;
                  const topics = subject.units.flatMap(u => u.topics);
                  const statuses = statusesBySubject[subject.id] || {};
                  const focus = topics.find(t => t.id === session.topicId);
                  const diagnosed = state.diagnosticResults.some(d => d.subjectId === subject.id);

                  if (editing) {
                    const rank = (s: TopicStatus) => ['priority', 'gap', 'untested', 'secure'].indexOf(s);
                    const sortedTopics = [...topics].sort((a, b) => rank(statuses[a.id]) - rank(statuses[b.id]));
                    return (
                      <div key={session.id} className="bg-white border border-slate-200 rounded p-1.5 space-y-1">
                        <div className="flex gap-1">
                          <select
                            value={session.subjectId}
                            onChange={e => updateSession(entry.day, session.id, { subjectId: e.target.value, topicId: null })}
                            className="flex-1 min-w-0 text-xs border border-slate-300 rounded px-1 py-1 bg-white"
                          >
                            {subjects.map(s => (
                              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min={5}
                            step={5}
                            value={session.minutes}
                            onChange={e => updateSession(entry.day, session.id, { minutes: Math.max(0, Number(e.target.value) || 0) })}
                            className="w-14 text-xs border border-slate-300 rounded px-1 py-1"
                            aria-label="Minutes"
                          />
                          <button
                            onClick={() => removeSession(entry.day, session.id)}
                            className="text-slate-400 hover:text-red-500 px-1"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                        <select
                          value={session.topicId || ''}
                          onChange={e => updateSession(entry.day, session.id, { topicId: e.target.value || null })}
                          className="w-full text-[11px] border border-slate-200 rounded px-1 py-0.5 bg-white text-slate-600"
                        >
                          <option value="">General revision</option>
                          {sortedTopics.map(t => (
                            <option key={t.id} value={t.id}>
                              {statuses[t.id] !== 'untested' ? `${STATUS_META[statuses[t.id]].icon} ` : ''}{t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  const to = !diagnosed
                    ? `/subject/${subject.id}/diagnostic`
                    : focus ? `/subject/${subject.id}/topic/${focus.id}` : `/subject/${subject.id}`;
                  return (
                    <Link key={session.id} to={to} className="block no-underline bg-white/70 rounded px-2 py-1.5 hover:bg-white">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {subject.icon} {subject.name} <span className="text-[11px] font-normal text-slate-400">· {session.minutes}m</span>
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {!diagnosed
                          ? '🩺 Start with the diagnostic'
                          : focus
                            ? `${statuses[focus.id] !== 'untested' ? STATUS_META[statuses[focus.id]].icon + ' ' : ''}${focus.name}`
                            : 'General revision'}
                      </p>
                    </Link>
                  );
                })}
                {entry.sessions.length === 0 && !editing && <p className="text-xs text-red-500 italic">Nothing planned</p>}
                {editing && (
                  <button
                    onClick={() => addSession(entry.day)}
                    className="w-full text-[11px] py-1 border border-dashed border-slate-300 rounded text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
                  >
                    + Add subject
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

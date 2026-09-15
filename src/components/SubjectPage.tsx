import { useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getSubjectById } from '../data/index';
import { getMasteryLevel, getMasteryColor } from '../types';
import { examInfo } from '../data/examInfo';
import { getDiagnosticSections, getSubjectStatuses, countStatuses, STATUS_META } from '../utils/diagnostic';
import SchoolResourcesCard from './SchoolResourcesCard';
import PastPapersTab from './PastPapersTab';
import { getQualificationsForSubject } from '../data/pastPapers';

export default function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { state } = useApp();
  const navigate = useNavigate();
  const subject = getSubjectById(subjectId || '');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
  const [examOpen, setExamOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'papers' ? 'papers' : 'topics';

  if (!subject) {
    return <div className="p-8 text-center text-slate-500">Subject not found.</div>;
  }

  const diagnostic = state.diagnosticResults.find(d => d.subjectId === subject.id);
  const allTopics = subject.units.flatMap(u => u.topics);
  const completedTopics = allTopics.filter(t => {
    const prog = state.topicProgress[t.id];
    return prog && prog.masteryPercent >= 70;
  }).length;
  const overallProgress = allTopics.length > 0 ? Math.round((completedTopics / allTopics.length) * 100) : 0;

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const checkpointsForSubject = state.checkpointResults.filter(c => c.subjectId === subject.id);
  const exam = examInfo[subject.id];
  const sections = getDiagnosticSections(subject);
  const sectionsDone = sections.filter(s => diagnostic?.sectionsCompleted?.includes(s.key)).length;
  const statuses = getSubjectStatuses(subject, state);
  const counts = countStatuses(statuses);
  const priorityTopics = allTopics.filter(t => statuses[t.id] === 'priority');
  const gapTopics = allTopics.filter(t => statuses[t.id] === 'gap');
  const paperAttempts = (state.pastPaperAttempts || []).filter(a => a.subjectId === subject.id);
  const paperCount = getQualificationsForSubject(subject.id).reduce((n, q) => n + q.series.reduce((m, s) => m + s.papers.length, 0), 0);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <span className="text-3xl md:text-5xl">{subject.icon}</span>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-slate-800">{subject.name}</h1>
          <p className="text-sm text-slate-500">{subject.examBoard} • {subject.specification}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: subject.color }}>{overallProgress}%</p>
          <p className="text-xs text-slate-400">{completedTopics}/{allTopics.length} topics mastered</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {([
          { key: 'topics', label: '📚 Topics' },
          { key: 'papers', label: `📄 Past papers${paperCount ? ` (${paperCount})` : ''}` },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setSearchParams(t.key === 'topics' ? {} : { tab: t.key }, { replace: true })}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.key ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'papers' ? <PastPapersTab key={subject.id} subject={subject} /> : (<>
      {/* Exam structure (from the school's own revision guide / exam board spec) */}
      {exam && (
        <div className="bg-slate-800 rounded-xl mb-6 overflow-hidden">
          <button
            onClick={() => setExamOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold text-white flex items-center gap-2">
              🎓 How you're assessed — {exam.board} {exam.specCode}
            </span>
            <span className="text-slate-400 text-xs">{examOpen ? '▲ Hide' : '▼ Show'}</span>
          </button>
          {examOpen && (
            <div className="px-4 pb-4 space-y-2">
              {exam.papers.map(p => (
                <div key={p.name} className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{p.name}</span>
                    <span className="text-xs text-slate-300">{p.marks ? `${p.marks} marks • ` : ''}{p.weighting} • {p.duration}</span>
                  </div>
                  <p className="text-xs text-slate-300">{p.topicsCovered}</p>
                </div>
              ))}
              {exam.notes && <p className="text-xs text-slate-400 pt-1">ℹ️ {exam.notes}</p>}
            </div>
          )}
        </div>
      )}

      {/* The school's revision booklet guidance for this subject */}
      <SchoolResourcesCard key={subject.id} subjectId={subject.id} subjectName={subject.name} />

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
        <div
          className="h-3 rounded-full transition-all duration-700"
          style={{ width: `${overallProgress}%`, backgroundColor: subject.color }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
        <button
          onClick={() => navigate(`/subject/${subject.id}/diagnostic`)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          🩺 {diagnostic ? 'Diagnostic' : 'Take Diagnostic'}
        </button>
        <button
          onClick={() => navigate(`/subject/${subject.id}/checkpoint`)}
          className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          📋 GCSE Checkpoint
        </button>
        <button
          onClick={() => navigate(`/subject/${subject.id}/mock-test`)}
          className="px-5 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors"
        >
          📝 {subject.examBoard} Mock Exam
        </button>
        {diagnostic && (
          <div className="ml-auto bg-white rounded-lg border border-slate-200 px-4 py-2">
            <p className="text-xs text-slate-400">Last diagnostic</p>
            <p className="text-sm font-semibold" style={{ color: subject.color }}>{diagnostic.score}%</p>
          </div>
        )}
      </div>

      {/* Start here: diagnostic prompt until every paper has been diagnosed */}
      {sectionsDone < sections.length && (
        <div className="bg-indigo-600 text-white rounded-xl p-5 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[220px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
              {sectionsDone === 0 ? 'Start here' : `${sectionsDone} of ${sections.length} papers diagnosed`}
            </p>
            <h3 className="text-lg font-bold">Take the grade 7–9 diagnostic</h3>
            <p className="text-sm text-indigo-100">
              Two harder questions on every topic, paper by paper. Topics you miss are marked
              <strong> Priority</strong> or <strong>Gap</strong> and go straight into your study plan.
            </p>
          </div>
          <button
            onClick={() => navigate(`/subject/${subject.id}/diagnostic`)}
            className="px-5 py-2.5 bg-white text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-50"
          >
            {sectionsDone === 0 ? 'Start diagnostic →' : 'Continue →'}
          </button>
        </div>
      )}

      {/* Priorities and gaps from the diagnostic and past papers */}
      {(diagnostic || paperAttempts.length > 0) && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 className="font-semibold text-slate-700 mr-2">🎯 Your priorities</h3>
            {(['priority', 'gap', 'secure', 'untested'] as const).map(s => (
              <span key={s} className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_META[s].className}`}>
                {STATUS_META[s].icon} {counts[s]} {STATUS_META[s].label}
              </span>
            ))}
          </div>
          {priorityTopics.length + gapTopics.length === 0 ? (
            <p className="text-sm text-emerald-700">No gaps in the papers diagnosed so far — great work.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {[...priorityTopics, ...gapTopics].map(topic => {
                const st = statuses[topic.id];
                return (
                  <Link
                    key={topic.id}
                    to={`/subject/${subject.id}/topic/${topic.id}`}
                    title={STATUS_META[st].hint}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border no-underline hover:opacity-80 ${STATUS_META[st].className}`}
                  >
                    {STATUS_META[st].icon} {topic.name} →
                  </Link>
                );
              })}
            </div>
          )}
          <p className="text-[11px] text-slate-400 mt-3">
            Priorities and Gaps come from the diagnostic{paperCount ? ' and the marks you lose in past papers' : ''}. One turns Secure once you score 80%+ over at least 10 practice questions on that topic.
          </p>
        </div>
      )}

      {/* Checkpoint history */}
      {checkpointsForSubject.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <h3 className="font-semibold text-slate-700 mb-3">📊 Checkpoint History</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {checkpointsForSubject.slice(-5).map((cp, i) => (
              <div key={cp.id} className="flex-shrink-0 bg-slate-50 rounded-lg p-3 min-w-[100px] text-center">
                <p className="text-xs text-slate-400">#{i + 1}</p>
                <p className="text-xl font-bold" style={{ color: cp.score >= 70 ? '#22c55e' : '#ef4444' }}>
                  {Math.round((cp.score / cp.totalQuestions) * 100)}%
                </p>
                <p className="text-xs text-slate-400">{new Date(cp.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic Grid - IXL Style */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">Curriculum Topics</h2>
      <div className="space-y-3">
        {subject.units.map(unit => {
          const isExpanded = expandedUnits[unit.id] !== false;
          const unitTopics = unit.topics;
          const unitMastered = unitTopics.filter(t => {
            const prog = state.topicProgress[t.id];
            return prog && prog.masteryPercent >= 70;
          }).length;

          return (
            <div key={unit.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => toggleUnit(unit.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{isExpanded ? '▼' : '▶'}</span>
                  <div>
                    {unit.examSection && (
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">{unit.examSection}</p>
                    )}
                    <h3 className="font-semibold text-slate-700">{unit.name}</h3>
                    <p className="text-xs text-slate-400">{unitTopics.length} topics • {unitMastered} mastered</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${unitTopics.length > 0 ? (unitMastered / unitTopics.length) * 100 : 0}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8">
                    {unitTopics.length > 0 ? Math.round((unitMastered / unitTopics.length) * 100) : 0}%
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100 divide-y divide-slate-50">
                  {unitTopics.map(topic => {
                    const prog = state.topicProgress[topic.id];
                    const mastery = prog?.masteryPercent || 0;
                    const level = getMasteryLevel(mastery);
                    const colorClass = getMasteryColor(level);

                    return (
                      <Link
                        key={topic.id}
                        to={`/subject/${subject.id}/topic/${topic.id}`}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors no-underline group"
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold border ${colorClass}`}>
                          {mastery > 0 ? `${mastery}%` : '—'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                            {topic.name}
                            {statuses[topic.id] !== 'untested' && (
                              <span
                                title={STATUS_META[statuses[topic.id]].hint}
                                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold border ${STATUS_META[statuses[topic.id]].className}`}
                              >
                                {STATUS_META[statuses[topic.id]].icon} {STATUS_META[statuses[topic.id]].label}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-400 truncate">{topic.description}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          {prog?.explanationRead && <span title="Explanation read">📖</span>}
                          {prog?.flashcardsReviewed && <span title="Flashcards reviewed">📇</span>}
                          {prog && prog.questionsAttempted > 0 && (
                            <span title="Questions attempted">
                              ✏️ {prog.questionsCorrect}/{prog.questionsAttempted}
                            </span>
                          )}
                          <span className="text-indigo-400 group-hover:text-indigo-600">→</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </>)}
    </div>
  );
}

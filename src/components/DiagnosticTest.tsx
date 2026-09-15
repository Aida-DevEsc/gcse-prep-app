import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getSubjectById, getAllSubjects } from '../data/index';
import { scoreQuiz } from '../utils/scoring';
import { XP_REWARDS } from '../utils/xp';
import { getDiagnosticSections, pickHighGradeQuestions, statusFromScore, STATUS_META, QUESTIONS_PER_TOPIC } from '../utils/diagnostic';
import type { Question } from '../types';

type Stage = 'choose' | 'quiz' | 'results';

export default function DiagnosticTest() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const subject = getSubjectById(subjectId || '');

  const [stage, setStage] = useState<Stage>('choose');
  const [sectionKeys, setSectionKeys] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState(Date.now());
  const [result, setResult] = useState<ReturnType<typeof scoreQuiz> | null>(null);
  const [showReview, setShowReview] = useState(false);

  if (!subject) return <div className="p-8 text-center text-slate-500">Subject not found.</div>;

  const sections = getDiagnosticSections(subject);
  const existing = state.diagnosticResults.find(d => d.subjectId === subject.id);
  const done = new Set(existing?.sectionsCompleted || []);
  const allTopics = subject.units.flatMap(u => u.topics);

  const start = (keys: string[]) => {
    const topics = sections.filter(s => keys.includes(s.key)).flatMap(s => s.topics);
    setSectionKeys(keys);
    setQuestions(pickHighGradeQuestions(topics));
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setShowReview(false);
    setStartTime(Date.now());
    setStage('quiz');
  };

  const handleAnswer = (answerIndex: number) => {
    const q = questions[currentIndex];
    const newAnswers = { ...answers, [q.id]: answerIndex };
    setAnswers(newAnswers);
    dispatch({ type: 'ANSWER_QUESTION', correct: answerIndex === q.correctAnswer });

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    const quizResult = scoreQuiz(questions, newAnswers, startTime);
    setResult(quizResult);
    setStage('results');

    dispatch({
      type: 'ADD_DIAGNOSTIC_RESULT',
      result: {
        subjectId: subject.id,
        date: new Date().toISOString(),
        score: quizResult.percentage,
        totalQuestions: quizResult.totalQuestions,
        topicScores: quizResult.topicBreakdown,
        weakTopics: [],
        strongTopics: [],
        sectionsCompleted: sectionKeys,
      },
    });
    dispatch({ type: 'ADD_XP', amount: XP_REWARDS.DIAGNOSTIC_COMPLETE });

    const otherSubjectsDone = getAllSubjects()
      .filter(s => s.id !== subject.id)
      .every(s => state.diagnosticResults.some(d => d.subjectId === s.id));
    if (otherSubjectsDone) dispatch({ type: 'EARN_BADGE', badgeId: 'all-diagnostics' });
  };

  // ---------- Choose a section ----------
  if (stage === 'choose') {
    const totalQuestions = allTopics.length * QUESTIONS_PER_TOPIC;
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <Link to={`/subject/${subject.id}`} className="text-sm text-slate-400 hover:text-indigo-600 no-underline">
          ← {subject.icon} {subject.name}
        </Link>
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mt-3">
          <div className="text-center mb-6">
            <span className="text-5xl block mb-3">{subject.icon}</span>
            <h1 className="text-2xl font-bold text-slate-800">{subject.name} Diagnostic</h1>
            <p className="text-sm font-semibold text-indigo-600 mt-1">Pitched at grades 7–9 · {subject.examBoard}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm text-slate-600 space-y-2">
            <p>
              Every topic on every paper is tested with <strong>{QUESTIONS_PER_TOPIC} harder GCSE questions</strong>, so the results
              show exactly where the gaps are before you start revising.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {(['priority', 'gap', 'secure'] as const).map(s => (
                <span key={s} className={`text-xs px-2 py-1 rounded-full border ${STATUS_META[s].className}`}>
                  {STATUS_META[s].icon} {STATUS_META[s].label}: {STATUS_META[s].hint.toLowerCase()}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400">Do one section at a time or all at once. Retaking a section replaces that section's results.</p>
          </div>

          <div className="space-y-3 mb-6">
            {sections.map(section => {
              const sectionDone = done.has(section.key);
              const topicScores = section.topics.map(t => existing?.topicScores[t.id]).filter(Boolean) as { correct: number; total: number }[];
              const pct = topicScores.length
                ? Math.round((topicScores.reduce((a, s) => a + s.correct, 0) / topicScores.reduce((a, s) => a + s.total, 0)) * 100)
                : null;
              return (
                <div key={section.key} className="border border-slate-200 rounded-lg p-4 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-semibold text-slate-700">{section.key}</p>
                    <p className="text-xs text-slate-400">
                      {section.topics.length} topics · {section.topics.length * QUESTIONS_PER_TOPIC} questions
                      {sectionDone && pct !== null && <span className="text-emerald-600"> · done ({pct}%)</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => start([section.key])}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      sectionDone ? 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {sectionDone ? 'Retake' : 'Start'}
                  </button>
                </div>
              );
            })}
          </div>

          {sections.length > 1 && (
            <button
              onClick={() => start(sections.map(s => s.key))}
              className="w-full py-3 rounded-lg text-sm font-semibold border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              Take the whole diagnostic in one go ({totalQuestions} questions)
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------- Results ----------
  if (stage === 'results' && result) {
    const tested = sections
      .map(s => ({ ...s, topics: s.topics.filter(t => result.topicBreakdown[t.id]) }))
      .filter(s => s.topics.length > 0);
    const statusOf = (topicId: string) => {
      const b = result.topicBreakdown[topicId];
      return statusFromScore(b.correct, b.total);
    };
    const counts = { priority: 0, gap: 0, secure: 0 };
    tested.forEach(s => s.topics.forEach(t => {
      const st = statusOf(t.id);
      if (st !== 'untested') counts[st]++;
    }));
    const missed = questions.filter(q => answers[q.id] !== q.correctAnswer);
    const remaining = sections.filter(s => !done.has(s.key) && !sectionKeys.includes(s.key));

    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Diagnostic complete</h2>
            <p className="text-5xl font-bold my-3" style={{ color: result.percentage >= 70 ? '#22c55e' : result.percentage >= 40 ? '#f59e0b' : '#ef4444' }}>
              {result.percentage}%
            </p>
            <p className="text-slate-500 text-sm">{result.correctAnswers} of {result.totalQuestions} grade 7–9 questions correct</p>
            <p className="text-sm text-emerald-600 mt-1">+{XP_REWARDS.DIAGNOSTIC_COMPLETE} XP</p>
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              {(['priority', 'gap', 'secure'] as const).map(s => (
                <span key={s} className={`text-sm px-3 py-1 rounded-full border font-medium ${STATUS_META[s].className}`}>
                  {STATUS_META[s].icon} {counts[s]} {STATUS_META[s].label}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-5 mb-6">
            {tested.map(section => (
              <div key={section.key}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{section.key}</h3>
                <div className="space-y-1.5">
                  {[...section.topics]
                    .sort((a, b) => ['priority', 'gap', 'secure'].indexOf(statusOf(a.id)) - ['priority', 'gap', 'secure'].indexOf(statusOf(b.id)))
                    .map(topic => {
                      const st = statusOf(topic.id);
                      const b = result.topicBreakdown[topic.id];
                      return (
                        <Link
                          key={topic.id}
                          to={`/subject/${subject.id}/topic/${topic.id}`}
                          className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 no-underline"
                        >
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold whitespace-nowrap ${STATUS_META[st].className}`}>
                            {STATUS_META[st].icon} {STATUS_META[st].label}
                          </span>
                          <span className="flex-1 text-sm text-slate-700">{topic.name}</span>
                          <span className="text-xs text-slate-400">{b.correct}/{b.total}</span>
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          {missed.length > 0 && (
            <div className="mb-6">
              <button onClick={() => setShowReview(r => !r)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                {showReview ? '▲ Hide' : '▼ Review'} the {missed.length} question{missed.length === 1 ? '' : 's'} you missed
              </button>
              {showReview && (
                <div className="mt-3 space-y-3">
                  {missed.map(q => (
                    <div key={q.id} className="border border-slate-200 rounded-lg p-3 text-sm">
                      <p className="font-medium text-slate-800 mb-1">{q.question}</p>
                      {answers[q.id] !== undefined && (
                        <p className="text-red-600 text-xs">Your answer: {q.options[answers[q.id]]}</p>
                      )}
                      <p className="text-emerald-700 text-xs">Correct: {q.options[q.correctAnswer]}</p>
                      <p className="text-slate-500 text-xs mt-1">{q.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate(`/subject/${subject.id}`)}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
            >
              See my priorities →
            </button>
            {remaining.length > 0 && (
              <button
                onClick={() => start([remaining[0].key])}
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
              >
                Next: {remaining[0].key}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Quiz ----------
  const question = questions[currentIndex];
  if (!question) return null;
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-slate-800">{subject.icon} {subject.name} Diagnostic</h2>
        <span className="text-sm text-slate-500">{currentIndex + 1} / {questions.length}</span>
      </div>
      <p className="text-xs text-slate-400 mb-3">{sectionKeys.length === 1 ? sectionKeys[0] : 'All papers'} · grade 7–9 questions</p>
      <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, backgroundColor: subject.color }}
        />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-lg font-medium text-slate-800 mb-6">{question.question}</p>
        <div className="space-y-2">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full p-4 rounded-lg text-left text-sm font-medium border-2 border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 transition-all text-slate-700"
            >
              <span className="inline-flex items-center gap-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => { if (confirm('Leave the diagnostic? Answers so far will not be saved.')) setStage('choose'); }}
        className="mt-4 text-xs text-slate-400 hover:text-slate-600"
      >
        ✕ Leave diagnostic
      </button>
    </div>
  );
}

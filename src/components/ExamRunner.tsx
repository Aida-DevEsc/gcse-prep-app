import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getSubjectById } from '../data/index';
import { getAppExamPaper, getAppExamSet, appExamPapers } from '../data/appExams';
import type { AppExamPaper, ExamPart } from '../types/exam';
import type { PastPaperAttempt, Subject } from '../types';
import { markPart, scorePaper, isAnswered, normaliseMath } from '../utils/examMarking';
import { gradeFromBoundaries, percent, newAttemptId, statusFromLostMarks, formatMinutes, latestAttemptsByPaper } from '../utils/pastPapers';
import { STATUS_META } from '../utils/diagnostic';
import { XP_REWARDS } from '../utils/xp';
import MathText from './MathText';

type Stage = 'intro' | 'exam' | 'selfmark' | 'results';

const SYMBOLS = ['√', '²', '³', '^', '(', ')', '/', 'π', 'θ', '≤', '≥', '−'];

function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function gradeClass(grade: string): string {
  if (['9', '8', '7'].includes(grade)) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (['6', '5'].includes(grade)) return 'bg-amber-100 text-amber-800 border-amber-300';
  return 'bg-red-100 text-red-700 border-red-300';
}

function allParts(paper: AppExamPaper): ExamPart[] {
  return paper.questions.flatMap(q => q.parts);
}

/** How a stored answer reads back in the results. */
function answerText(part: ExamPart, input: string | undefined): string {
  const raw = (input || '').trim();
  if (!raw) return '—';
  const a = part.answer;
  if (a.kind === 'choice') return a.options[Number(raw)] ?? '—';
  if (a.kind === 'matrix') {
    const cells = raw.split('|');
    const rows = Array.from({ length: a.rows }, (_, r) => `[${cells.slice(r * a.cols, r * a.cols + a.cols).map(c => c || '?').join(', ')}]`);
    return `[${rows.join(', ')}]`;
  }
  return raw;
}

// ------------------------------------------------------------------ answer inputs

interface InputProps {
  part: ExamPart;
  value: string;
  onChange: (value: string) => void;
  onFocusInput: (el: HTMLInputElement | HTMLTextAreaElement, partId: string) => void;
}

function PartInput({ part, value, onChange, onFocusInput }: InputProps) {
  const a = part.answer;

  if (a.kind === 'choice') {
    return (
      <div className="space-y-1.5">
        {a.options.map((option, i) => (
          <label key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer text-sm ${value === String(i) ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
            <input type="radio" name={part.id} checked={value === String(i)} onChange={() => onChange(String(i))} className="mt-0.5" />
            <span>{option}</span>
          </label>
        ))}
      </div>
    );
  }

  if (a.kind === 'matrix') {
    const cells = value ? value.split('|') : Array(a.values.length).fill('');
    const setCell = (i: number, v: string) => {
      const next = [...cells];
      while (next.length < a.values.length) next.push('');
      next[i] = v.replace(/\|/g, '');
      onChange(next.join('|'));
    };
    return (
      <div className="inline-flex items-stretch">
        <span className="w-2 border-l-2 border-t-2 border-b-2 border-slate-600 rounded-l" />
        <div className="grid gap-2 p-2" style={{ gridTemplateColumns: `repeat(${a.cols}, 4.5rem)` }}>
          {Array.from({ length: a.values.length }, (_, i) => (
            <input
              key={i}
              value={cells[i] || ''}
              onChange={e => setCell(i, e.target.value)}
              inputMode="decimal"
              autoComplete="off"
              aria-label={`Row ${Math.floor(i / a.cols) + 1}, column ${(i % a.cols) + 1}`}
              className="border border-slate-300 rounded-md px-2 py-1.5 text-center font-mono"
            />
          ))}
        </div>
        <span className="w-2 border-r-2 border-t-2 border-b-2 border-slate-600 rounded-r" />
      </div>
    );
  }

  if (a.kind === 'self') {
    return (
      <div>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={e => onFocusInput(e.target, part.id)}
          rows={5}
          placeholder="Write your working here, line by line. (Or do it on paper and just note the key steps.)"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
        />
        <p className="text-[11px] text-slate-500 mt-1">✍️ You’ll mark this one yourself against the mark scheme when you finish.</p>
      </div>
    );
  }

  return (
    <div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={e => onFocusInput(e.target, part.id)}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder="Your answer"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono text-slate-800"
      />
      {value.trim() && /\^|sqrt|√|\//.test(value) && (
        <p className="text-xs text-slate-500 mt-1">Reads as: <MathText text={normaliseMath(value).replace(/sqrt/g, '√')} className="text-slate-700" /></p>
      )}
      {part.hint && <p className="text-[11px] text-slate-400 mt-1">{part.hint}</p>}
    </div>
  );
}

// ------------------------------------------------------------------ results

function ExamResults({ paper, attempt, subject }: { paper: AppExamPaper; attempt: PastPaperAttempt; subject: Subject }) {
  const { state } = useApp();
  const navigate = useNavigate();
  const [onlyLost, setOnlyLost] = useState(true);
  const grade = gradeFromBoundaries(attempt.marks, paper.boundaries, paper.grades);
  const answers = attempt.answers || {};
  const partMarks = attempt.partMarks || {};
  const topicsById = new Map(subject.units.flatMap(u => u.topics).map(t => [t.id, t]));
  const lost = Object.entries(attempt.lostByTopic).sort((a, b) => b[1] - a[1]);

  // Full-set grade once every paper in the set has been sat.
  const set = getAppExamSet(paper.setId);
  const setPapers = appExamPapers.filter(p => p.setId === paper.setId);
  const latest = latestAttemptsByPaper(state.pastPaperAttempts.filter(a => setPapers.some(p => p.id === a.paperId)));
  const setDone = setPapers.every(p => latest.has(p.id));
  const setMarks = setPapers.reduce((s, p) => s + (latest.get(p.id)?.marks || 0), 0);
  const setMax = setPapers.reduce((s, p) => s + p.maxMarks, 0);
  const setGrade = set && setDone ? gradeFromBoundaries(setMarks, set.totalBoundaries, set.grades) : null;

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{paper.qualification} · {paper.setLabel}</p>
        <h2 className="text-xl font-bold text-slate-800">{paper.title}</h2>
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <p className="text-4xl font-bold text-slate-800">{attempt.marks}<span className="text-lg text-slate-400">/{attempt.maxMarks}</span></p>
          <p className="text-2xl font-semibold text-slate-600">{percent(attempt.marks, attempt.maxMarks)}%</p>
          <span className={`text-lg px-3 py-1 rounded-full border font-bold ${gradeClass(grade.grade)}`}>Grade {grade.grade}</span>
          {attempt.minutesTaken && <span className="text-sm text-slate-500">⏱️ {formatMinutes(attempt.minutesTaken)} (allowed {formatMinutes(paper.minutes)})</span>}
        </div>
        {grade.nextGrade && grade.marksToNext !== undefined && (
          <p className="text-sm text-slate-600 mt-2">{grade.marksToNext} more mark{grade.marksToNext === 1 ? '' : 's'} for a grade {grade.nextGrade}.</p>
        )}
        <p className="text-[11px] text-slate-400 mt-2">Estimated grade — boundaries are based on AQA’s real Further Maths boundaries from 2022 and 2023.</p>
        {setGrade && (
          <p className="text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-emerald-800 mt-3">
            🏁 Both {paper.setLabel} papers done: <strong>{setMarks}/{setMax}</strong> — estimated <strong>grade {setGrade.grade}</strong>
            {setGrade.nextGrade ? ` (${setGrade.marksToNext} mark${setGrade.marksToNext === 1 ? '' : 's'} off grade ${setGrade.nextGrade})` : ''}.
          </p>
        )}
      </div>

      {lost.length > 0 && (
        <div className="bg-white border border-red-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-700 mb-2">🔎 Where the marks went — added to your revision list</p>
          <p className="text-[11px] text-slate-400 mb-2">Questions you left blank still score 0 but aren’t added here.</p>
          <div className="flex flex-wrap gap-1.5">
            {lost.map(([topicId, n]) => {
              const topic = topicsById.get(topicId);
              if (!topic) return null;
              const st = statusFromLostMarks(n) || 'gap';
              return (
                <Link key={topicId} to={`/subject/${subject.id}/topic/${topicId}`} className={`text-xs px-2.5 py-1 rounded-full border no-underline hover:opacity-80 ${STATUS_META[st].className}`}>
                  {STATUS_META[st].icon} {topic.name} · −{n}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-800">Question by question</h3>
        <label className="text-xs text-slate-600 flex items-center gap-1.5">
          <input type="checkbox" checked={onlyLost} onChange={e => setOnlyLost(e.target.checked)} /> Only show questions where I lost marks
        </label>
      </div>

      <div className="space-y-3">
        {paper.questions.map(q => {
          const parts = q.parts.filter(p => !onlyLost || (partMarks[p.id] ?? 0) < p.marks);
          if (parts.length === 0) return null;
          return (
            <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-800 mb-1">Question {q.number}</p>
              {q.stem && <MathText text={q.stem} className="text-sm text-slate-600 block mb-2" />}
              <div className="space-y-3">
                {parts.map(part => {
                  const got = partMarks[part.id] ?? 0;
                  const status = got === part.marks ? 'full' : got > 0 ? 'some' : 'none';
                  const feedback = part.answer.kind !== 'self' ? markPart(part, answers[part.id]).message : undefined;
                  return (
                    <div key={part.id} className={`rounded-lg border p-3 ${status === 'full' ? 'border-emerald-200 bg-emerald-50/50' : status === 'some' ? 'border-amber-200 bg-amber-50/50' : 'border-red-200 bg-red-50/40'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm text-slate-700 min-w-0">
                          {part.label && <span className="font-semibold mr-1">{part.label}</span>}
                          <MathText text={part.prompt} />
                        </div>
                        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${status === 'full' ? 'bg-emerald-600 text-white' : status === 'some' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
                          {got}/{part.marks}
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Your answer</p>
                          <p className="font-mono text-slate-700 whitespace-pre-wrap break-words">{answerText(part, answers[part.id])}</p>
                          {feedback && <p className="text-xs text-amber-700 mt-0.5">{feedback}</p>}
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mark scheme answer</p>
                          <MathText text={part.display} className="text-slate-800 font-medium" />
                        </div>
                      </div>
                      <details className="mt-2">
                        <summary className="text-xs text-indigo-600 cursor-pointer">Worked solution</summary>
                        <MathText text={part.solution} className="text-sm text-slate-700 block mt-1.5 bg-white rounded-md border border-slate-100 p-2.5" />
                        <Link to={`/subject/${subject.id}/topic/${part.topicId}`} className="text-xs text-indigo-600 mt-1 inline-block">
                          Revise {topicsById.get(part.topicId)?.name} →
                        </Link>
                      </details>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => navigate(`/subject/${subject.id}?tab=papers`)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">
          Back to past papers
        </button>
        <button onClick={() => navigate(`/subject/${subject.id}/exam/${paper.id}`)} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50">
          Sit it again
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ runner

export default function ExamRunner() {
  const { subjectId, paperId } = useParams<{ subjectId: string; paperId: string }>();
  const [searchParams] = useSearchParams();
  const reviewId = searchParams.get('review');
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const subject = getSubjectById(subjectId || '');
  const paper = getAppExamPaper(paperId || '');
  const draft = paper ? state.examDrafts?.[paper.id] : undefined;

  const [stage, setStage] = useState<Stage>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>(draft?.answers || {});
  const [flagged, setFlagged] = useState<string[]>(draft?.flagged || []);
  const [current, setCurrent] = useState(draft?.current || 0);
  const [elapsed, setElapsed] = useState(draft?.elapsedSeconds || 0);
  const [startedAt, setStartedAt] = useState(draft?.startedAt || '');
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [selfTicks, setSelfTicks] = useState<Record<string, boolean[]>>({});
  const [savedAttemptId, setSavedAttemptId] = useState<string | null>(null);
  const activeInput = useRef<{ el: HTMLInputElement | HTMLTextAreaElement; partId: string } | null>(null);

  // Clock runs only while the exam screen is open.
  useEffect(() => {
    if (stage !== 'exam') return;
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, [stage]);

  // Save progress shortly after each change, and every 15 seconds for the clock.
  const elapsedBucket = Math.floor(elapsed / 15);
  useEffect(() => {
    if (stage !== 'exam' || !paper) return;
    const t = setTimeout(() => {
      dispatch({ type: 'SAVE_EXAM_DRAFT', draft: { paperId: paper.id, startedAt, elapsedSeconds: elapsed, answers, flagged, current } });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, flagged, current, elapsedBucket, stage]);

  if (!subject || !paper) return <div className="p-8 text-center text-slate-500">Exam not found.</div>;

  const backToPapers = `/subject/${subject.id}?tab=papers`;

  if (reviewId || savedAttemptId) {
    const attempt = state.pastPaperAttempts.find(a => a.id === (savedAttemptId || reviewId));
    if (!attempt) return <div className="p-8 text-center text-slate-500">Attempt not found. <Link to={backToPapers}>Back to past papers</Link></div>;
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {savedAttemptId && <p className="text-sm text-emerald-700 mb-3">✅ Saved. +{XP_REWARDS.PAST_PAPER_MARKED} XP</p>}
        <ExamResults paper={paper} attempt={attempt} subject={subject} />
      </div>
    );
  }

  const parts = allParts(paper);
  const selfParts = parts.filter(p => p.answer.kind === 'self');
  const answeredCount = parts.filter(p => isAnswered(p, answers[p.id])).length;
  const remaining = paper.minutes * 60 - elapsed;
  const question = paper.questions[Math.min(current, paper.questions.length - 1)];

  const setAnswer = (partId: string, value: string) => setAnswers(prev => ({ ...prev, [partId]: value }));

  const insertSymbol = (symbol: string) => {
    const target = activeInput.current;
    if (!target) return;
    const { el, partId } = target;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const next = el.value.slice(0, start) + symbol + el.value.slice(end);
    setAnswer(partId, next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + symbol.length, start + symbol.length);
    });
  };

  const begin = () => {
    if (!startedAt) setStartedAt(new Date().toISOString());
    setStage('exam');
  };

  const saveAttempt = (selfMarks: Record<string, number>) => {
    const score = scorePaper(paper, answers, selfMarks);
    const attempt: PastPaperAttempt = {
      id: newAttemptId(),
      subjectId: subject.id,
      qualificationId: 'app',
      seriesId: paper.setId,
      paperId: paper.id,
      date: new Date().toISOString(),
      marks: score.total,
      maxMarks: paper.maxMarks,
      lostByTopic: score.lostByTopic,
      minutesTaken: Math.max(1, Math.round(elapsed / 60)),
      answers,
      partMarks: score.partMarks,
    };
    dispatch({ type: 'ADD_PAST_PAPER_ATTEMPT', attempt });
    dispatch({ type: 'CLEAR_EXAM_DRAFT', paperId: paper.id });
    setSavedAttemptId(attempt.id);
    setStage('results');
    window.scrollTo(0, 0);
  };

  const finish = () => {
    setConfirmFinish(false);
    if (selfParts.length > 0) {
      setSelfTicks(Object.fromEntries(selfParts.map(p => [p.id, p.answer.kind === 'self' ? p.answer.checklist.map(() => false) : []])));
      setStage('selfmark');
      window.scrollTo(0, 0);
    } else {
      saveAttempt({});
    }
  };

  // ---------------- intro
  if (stage === 'intro') {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <Link to={backToPapers} className="text-sm text-slate-500 no-underline hover:text-slate-700">← Past papers</Link>
        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-3 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">{paper.qualification} · {paper.setLabel}</p>
            <h1 className="text-2xl font-bold text-slate-800">{paper.title}</h1>
            <p className="text-sm text-slate-500 mt-1">{paper.maxMarks} marks · {formatMinutes(paper.minutes)} · {paper.questions.length} questions</p>
          </div>
          <ul className="space-y-1.5 text-sm text-slate-700">
            {paper.instructions.map(line => <li key={line} className="flex gap-2"><span>•</span><span>{line}</span></li>)}
            <li className="flex gap-2"><span>•</span><span>The clock only runs while this page is open. Your answers save as you go, so you can come back later.</span></li>
            <li className="flex gap-2"><span>•</span><span>When you finish, the app marks every answer, gives you an estimated grade and adds lost-mark topics to your priorities.</span></li>
          </ul>
          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-700">Typing maths</p>
            <p>Powers: <code>x^2</code> or use the ² button · Roots: <code>√3</code> or <code>sqrt(3)</code> · Fractions: <code>3/4</code>, <code>(x+1)/(x-2)</code></p>
            <p>Several answers: separate with commas, e.g. <code>x = 2, x = −3</code> · Inequalities: <code>x &lt; −3 or x &gt; 4</code>, <code>1 ≤ x ≤ 5</code></p>
            <p>Any correct equivalent answer gets the marks (e.g. <code>y = x/2 + 1</code> or <code>2y = x + 2</code>), unless a question asks for a set form such as “factorise”.</p>
          </div>
          <button onClick={begin} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
            {draft ? `Resume — ${formatClock(paper.minutes * 60 - (draft.elapsedSeconds || 0))} left` : 'Start the exam'}
          </button>
          {draft && (
            <button
              onClick={() => { if (confirm('Throw away your answers and start again?')) { dispatch({ type: 'CLEAR_EXAM_DRAFT', paperId: paper.id }); setAnswers({}); setFlagged([]); setCurrent(0); setElapsed(0); setStartedAt(''); } }}
              className="w-full text-xs text-slate-500 hover:text-red-600"
            >
              Start again from scratch
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------------- self-marking
  if (stage === 'selfmark') {
    const selfMarks: Record<string, number> = {};
    for (const p of selfParts) {
      if (p.answer.kind !== 'self') continue;
      selfMarks[p.id] = p.answer.checklist.reduce((s, item, i) => s + (selfTicks[p.id]?.[i] ? item.marks : 0), 0);
    }
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">✍️ Mark your “show that” answers</h1>
          <p className="text-sm text-slate-500">Everything else is marked for you. For these, tick each step your working clearly shows — be as strict as an examiner.</p>
        </div>
        {selfParts.map(p => {
          if (p.answer.kind !== 'self') return null;
          const q = paper.questions.find(qq => qq.parts.includes(p))!;
          return (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-sm text-slate-700"><strong>Question {q.number}{p.label ? ` ${p.label}` : ''}</strong> — <MathText text={p.prompt} /></p>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Your working</p>
                  <p className="font-mono text-slate-700 whitespace-pre-wrap break-words">{answers[p.id]?.trim() || '(nothing typed — mark what you wrote on paper)'}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">Model answer</p>
                  <MathText text={p.solution} className="text-slate-700" />
                </div>
              </div>
              <div className="space-y-1.5">
                {p.answer.checklist.map((item, i) => (
                  <label key={i} className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={!!selfTicks[p.id]?.[i]}
                      onChange={e => setSelfTicks(prev => {
                        const list = [...(prev[p.id] || [])];
                        list[i] = e.target.checked;
                        return { ...prev, [p.id]: list };
                      })}
                    />
                    <span>{item.text} <span className="text-slate-400">({item.marks} mark{item.marks === 1 ? '' : 's'})</span></span>
                  </label>
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-600">{selfMarks[p.id]} / {p.marks} marks</p>
            </div>
          );
        })}
        <button onClick={() => saveAttempt(selfMarks)} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
          See my results
        </button>
      </div>
    );
  }

  // ---------------- exam
  const questionMarks = question.parts.reduce((s, p) => s + p.marks, 0);
  const isFlagged = flagged.includes(question.id);
  const hasTextInput = question.parts.some(p => !['choice', 'matrix'].includes(p.answer.kind));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 px-4 md:px-8 py-2.5 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 truncate">{paper.title}</p>
          <p className="text-[11px] text-slate-400">{answeredCount}/{parts.length} parts answered</p>
        </div>
        <span className={`font-mono text-lg font-bold px-3 py-1 rounded-lg ${remaining <= 0 ? 'bg-red-600 text-white' : remaining < 600 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
          {remaining > 0 ? formatClock(remaining) : `+${formatClock(-remaining)}`}
        </span>
        <button onClick={() => navigate(backToPapers)} className="text-xs text-slate-500 hover:text-slate-700">Save &amp; exit</button>
        <button onClick={() => setConfirmFinish(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">Finish &amp; mark</button>
      </div>

      <div className="px-4 md:px-8 py-4 space-y-4">
        {remaining <= 0 && (
          <p className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg p-2.5">⏰ Time’s up in the real exam. Finish now for an honest result, or carry on for practice — your time is recorded.</p>
        )}

        {confirmFinish && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-2">
            <p className="text-sm text-slate-800 font-semibold">Finish and mark the paper?</p>
            {answeredCount < parts.length && <p className="text-sm text-slate-600">{parts.length - answeredCount} part{parts.length - answeredCount === 1 ? ' is' : 's are'} still blank.</p>}
            <div className="flex gap-2">
              <button onClick={finish} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold">Yes, mark it</button>
              <button onClick={() => setConfirmFinish(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm">Keep going</button>
            </div>
          </div>
        )}

        {/* Question navigator */}
        <div className="flex flex-wrap gap-1.5">
          {paper.questions.map((q, i) => {
            const done = q.parts.every(p => isAnswered(p, answers[p.id]));
            const some = q.parts.some(p => isAnswered(p, answers[p.id]));
            return (
              <button
                key={q.id}
                onClick={() => setCurrent(i)}
                aria-label={`Question ${q.number}`}
                className={`w-9 h-9 rounded-lg text-sm font-semibold border-2 ${i === current ? 'border-indigo-600' : 'border-transparent'} ${
                  done ? 'bg-indigo-600 text-white' : some ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-600'
                } ${flagged.includes(q.id) ? 'ring-2 ring-amber-400' : ''}`}
              >
                {q.number}
              </button>
            );
          })}
        </div>

        {/* Question */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-lg font-bold text-slate-800">Question {question.number}</h2>
            <span className="text-xs text-slate-400">[{questionMarks} mark{questionMarks === 1 ? '' : 's'}]</span>
          </div>
          {question.stem && <MathText text={question.stem} className="text-slate-700 block mb-4" />}
          <div className="space-y-6">
            {question.parts.map(part => (
              <div key={part.id}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="text-slate-800">
                    {part.label && <span className="font-semibold mr-1.5">{part.label}</span>}
                    <MathText text={part.prompt} />
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">[{part.marks}]</span>
                </div>
                <PartInput
                  part={part}
                  value={answers[part.id] || ''}
                  onChange={v => setAnswer(part.id, v)}
                  onFocusInput={(el, partId) => { activeInput.current = { el, partId }; }}
                />
              </div>
            ))}
          </div>

          {hasTextInput && (
            <div className="flex flex-wrap gap-1 mt-5 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 self-center mr-1">Insert:</span>
              {SYMBOLS.map(s => (
                <button
                  key={s}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => insertSymbol(s)}
                  className="min-w-8 h-8 px-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button disabled={current === 0} onClick={() => setCurrent(c => c - 1)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm disabled:opacity-40">← Previous</button>
          <button
            onClick={() => setFlagged(f => (f.includes(question.id) ? f.filter(x => x !== question.id) : [...f, question.id]))}
            className={`px-4 py-2 rounded-lg text-sm border ${isFlagged ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-300 text-slate-600'}`}
          >
            {isFlagged ? '🚩 Flagged' : '🏳️ Flag to come back'}
          </button>
          <span className="flex-1" />
          {current < paper.questions.length - 1 ? (
            <button onClick={() => setCurrent(c => c + 1)} className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">Next →</button>
          ) : (
            <button onClick={() => setConfirmFinish(true)} className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">Finish &amp; mark</button>
          )}
        </div>
      </div>
    </div>
  );
}

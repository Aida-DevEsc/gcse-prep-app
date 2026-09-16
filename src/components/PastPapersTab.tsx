import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Subject, PastPaperAttempt } from '../types';
import { getQualificationsForSubject, pastPaperPortals, findPaper } from '../data/pastPapers';
import type { PastPaper, PastPaperQualification, PastPaperSeries } from '../data/pastPapers';
import {
  gradeFromBoundaries, percent, newAttemptId, latestAttemptsByPaper, getSeriesResult,
  statusFromLostMarks, formatMinutes, PAST_PAPER_PRIORITY_MARKS,
} from '../utils/pastPapers';
import type { GradeResult } from '../utils/pastPapers';
import { STATUS_META } from '../utils/diagnostic';
import { XP_REWARDS } from '../utils/xp';
import AppExamsSection from './AppExamsSection';

function gradeClass(grade: string): string {
  if (grade === '9' || grade === '8' || grade === '7') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (grade === '6' || grade === '5') return 'bg-amber-100 text-amber-800 border-amber-300';
  return 'bg-red-100 text-red-700 border-red-300';
}

function GradePill({ result, notional }: { result: GradeResult; notional?: boolean }) {
  return (
    <span
      title={notional ? 'Paper grade from AQA’s notional paper boundaries — your real grade comes from all papers added together' : 'Grade from AQA’s real boundaries for this series'}
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-bold ${gradeClass(result.grade)}`}
    >
      Grade {result.grade}{notional ? '*' : ''}
    </span>
  );
}

function FileLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700 no-underline whitespace-nowrap"
    >
      {label} ↗
    </a>
  );
}

// ---------------------------------------------------------------------------------------------

interface MarkingFormProps {
  subject: Subject;
  qualification: PastPaperQualification;
  series: PastPaperSeries;
  paper: PastPaper;
  onSaved: (attempt: PastPaperAttempt) => void;
  onCancel: () => void;
}

function MarkingForm({ subject, qualification, series, paper, onSaved, onCancel }: MarkingFormProps) {
  const { dispatch } = useApp();
  const [marksText, setMarksText] = useState('');
  const [minutesText, setMinutesText] = useState('');
  const [lost, setLost] = useState<Record<string, number>>({});

  const marks = marksText.trim() === '' ? NaN : Number(marksText);
  const marksValid = Number.isInteger(marks) && marks >= 0 && marks <= paper.maxMarks;
  const lostTotal = marksValid ? paper.maxMarks - marks : 0;
  const tagged = Object.values(lost).reduce((sum, n) => sum + n, 0);
  const untagged = Math.max(0, lostTotal - tagged);
  const preview = marksValid && paper.boundaries ? gradeFromBoundaries(marks, paper.boundaries, qualification.grades) : null;

  const bump = (topicId: string, delta: number) => {
    setLost(prev => {
      const next = Math.max(0, (prev[topicId] || 0) + delta);
      if (delta > 0 && tagged >= lostTotal) return prev;
      const copy = { ...prev, [topicId]: next };
      if (next === 0) delete copy[topicId];
      return copy;
    });
  };

  const save = () => {
    if (!marksValid) return;
    const minutes = Number(minutesText);
    const attempt: PastPaperAttempt = {
      id: newAttemptId(),
      subjectId: subject.id,
      qualificationId: qualification.id,
      seriesId: series.id,
      paperId: paper.id,
      date: new Date().toISOString(),
      marks,
      maxMarks: paper.maxMarks,
      lostByTopic: lost,
      minutesTaken: Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : undefined,
    };
    dispatch({ type: 'ADD_PAST_PAPER_ATTEMPT', attempt });
    onSaved(attempt);
  };

  return (
    <div className="mt-3 border-2 border-indigo-200 bg-indigo-50/40 rounded-xl p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-slate-800">✍️ Mark {series.label} {paper.code}</h4>
        <div className="flex gap-2">
          <FileLink href={paper.markScheme} label="Open mark scheme" />
          {paper.examinerReport && <FileLink href={paper.examinerReport} label="Examiner report" />}
        </div>
      </div>

      <ol className="text-xs text-slate-600 space-y-1 list-decimal pl-4">
        <li>Go through the mark scheme question by question. Only give a mark if your working matches it — <strong>M</strong> = method, <strong>A</strong> = accurate answer (needs the M mark), <strong>B</strong> = independent mark.</li>
        <li>Add up your marks and type the total below.</li>
        <li>For every question where you dropped marks, add those marks to the closest topic. These become Priorities and Gaps.</li>
      </ol>

      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm">
          <span className="block text-xs font-semibold text-slate-600 mb-1">Your total</span>
          <span className="flex items-center gap-1">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={paper.maxMarks}
              value={marksText}
              onChange={e => { setMarksText(e.target.value); setLost({}); }}
              className="w-20 border border-slate-300 rounded-lg px-2 py-1.5 text-lg font-bold text-slate-800"
              placeholder="0"
              autoFocus
            />
            <span className="text-slate-500">/ {paper.maxMarks}</span>
          </span>
        </label>
        <label className="text-sm">
          <span className="block text-xs font-semibold text-slate-600 mb-1">Time taken (optional)</span>
          <span className="flex items-center gap-1">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={minutesText}
              onChange={e => setMinutesText(e.target.value)}
              className="w-20 border border-slate-300 rounded-lg px-2 py-1.5"
              placeholder={String(paper.minutes)}
            />
            <span className="text-slate-500 text-xs">min (exam: {formatMinutes(paper.minutes)})</span>
          </span>
        </label>
        {marksValid && (
          <div className="flex items-center gap-2 pb-1">
            <span className="text-lg font-bold text-slate-700">{percent(marks, paper.maxMarks)}%</span>
            {preview && <GradePill result={preview} notional />}
          </div>
        )}
      </div>
      {marksText !== '' && !marksValid && (
        <p className="text-xs text-red-600">Enter a whole number from 0 to {paper.maxMarks}.</p>
      )}

      {marksValid && lostTotal > 0 && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <p className="text-sm font-semibold text-slate-700">Where did you lose your {lostTotal} marks?</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${untagged === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
              {tagged} tagged · {untagged} left
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {subject.units.map(unit => (
              <div key={unit.id}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">{unit.name}</p>
                <div className="grid sm:grid-cols-2 gap-1.5">
                  {unit.topics.map(topic => {
                    const n = lost[topic.id] || 0;
                    return (
                      <div key={topic.id} className={`flex items-center justify-between gap-2 rounded-lg border px-2 py-1 ${n > 0 ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}>
                        <span className="text-xs text-slate-700 truncate">{topic.name}</span>
                        <span className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => bump(topic.id, -1)}
                            disabled={n === 0}
                            aria-label={`One fewer mark lost on ${topic.name}`}
                            className="w-6 h-6 rounded bg-slate-100 text-slate-600 disabled:opacity-30"
                          >−</button>
                          <span className={`w-5 text-center text-xs font-bold ${n > 0 ? 'text-red-700' : 'text-slate-300'}`}>{n}</span>
                          <button
                            type="button"
                            onClick={() => bump(topic.id, 1)}
                            disabled={untagged === 0}
                            aria-label={`One more mark lost on ${topic.name}`}
                            className="w-6 h-6 rounded bg-slate-100 text-slate-600 disabled:opacity-30"
                          >+</button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Losing {PAST_PAPER_PRIORITY_MARKS}+ marks on a topic makes it a 🔴 Priority; 1–{PAST_PAPER_PRIORITY_MARKS - 1} makes it a 🟠 Gap.
            No exact match? Pick the closest topic.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={save}
          disabled={!marksValid}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40"
        >
          Save result
        </button>
        <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
        {marksValid && untagged > 0 && (
          <span className="text-xs text-slate-500">You can save now, but tagging every lost mark gives a better revision list.</span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

function SavedResult({ attempt, subject, onClose }: { attempt: PastPaperAttempt; subject: Subject; onClose: () => void }) {
  const { state } = useApp();
  const found = findPaper(attempt.paperId);
  if (!found) return null;
  const { qualification, series, paper } = found;
  const paperGrade = paper.boundaries ? gradeFromBoundaries(attempt.marks, paper.boundaries, qualification.grades) : null;
  const seriesResult = getSeriesResult(qualification, series, latestAttemptsByPaper(state.pastPaperAttempts));
  const topicsById = new Map(subject.units.flatMap(u => u.topics).map(t => [t.id, t]));
  const lostTopics = Object.entries(attempt.lostByTopic).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mt-3 bg-white border-2 border-emerald-300 rounded-xl p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-2xl">🎉</span>
        <div className="flex-1 min-w-[200px]">
          <p className="font-semibold text-slate-800">
            {series.label} {paper.code}: {attempt.marks}/{attempt.maxMarks} ({percent(attempt.marks, attempt.maxMarks)}%)
          </p>
          <p className="text-xs text-slate-500">+{XP_REWARDS.PAST_PAPER_MARKED} XP for marking a real paper</p>
        </div>
        {paperGrade && <GradePill result={paperGrade} notional />}
      </div>

      {paperGrade?.nextGrade && paperGrade.marksToNext !== undefined && (
        <p className="text-sm text-slate-600">
          {paperGrade.marksToNext} more mark{paperGrade.marksToNext === 1 ? '' : 's'} on this paper would have been a grade {paperGrade.nextGrade}.
        </p>
      )}

      {seriesResult.overall ? (
        <p className="text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-emerald-800">
          🏁 All {seriesResult.papersTotal} {series.label} papers marked: <strong>{seriesResult.marks}/{seriesResult.maxMarks}</strong> — that's a real <strong>grade {seriesResult.overall.grade}</strong>
          {seriesResult.overall.nextGrade ? ` (${seriesResult.overall.marksToNext} mark${seriesResult.overall.marksToNext === 1 ? '' : 's'} off grade ${seriesResult.overall.nextGrade})` : ''}.
        </p>
      ) : (
        <p className="text-xs text-slate-500">
          Mark the other {seriesResult.papersTotal - seriesResult.papersDone} {series.label} paper{seriesResult.papersTotal - seriesResult.papersDone === 1 ? '' : 's'} to get your real overall grade.
        </p>
      )}

      {lostTopics.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1.5">Added to your revision list:</p>
          <div className="flex flex-wrap gap-1.5">
            {lostTopics.map(([topicId, n]) => {
              const topic = topicsById.get(topicId);
              const st = statusFromLostMarks(n) || 'gap';
              if (!topic) return null;
              return (
                <Link
                  key={topicId}
                  to={`/subject/${subject.id}/topic/${topicId}`}
                  className={`text-xs px-2.5 py-1 rounded-full border no-underline hover:opacity-80 ${STATUS_META[st].className}`}
                >
                  {STATUS_META[st].icon} {topic.name} · −{n}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-700">Close</button>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

function BoundaryTable({ qualification, series }: { qualification: PastPaperQualification; series: PastPaperSeries }) {
  return (
    <details className="mt-3">
      <summary className="text-xs text-slate-500 cursor-pointer">Grade boundaries for {series.label}</summary>
      <div className="overflow-x-auto mt-2">
        <table className="text-xs text-slate-600 border-collapse">
          <thead>
            <tr>
              <th className="text-left pr-3 py-1 font-semibold">Grade</th>
              {qualification.grades.map(g => <th key={g} className="px-2 py-1 font-semibold">{g}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200">
              <td className="pr-3 py-1 font-semibold whitespace-nowrap">Total /{series.papers.reduce((s, p) => s + p.maxMarks, 0)}</td>
              {series.totalBoundaries.map((b, i) => <td key={i} className="px-2 py-1 text-center font-semibold text-slate-800">{b}</td>)}
            </tr>
            {series.papers.map(p => p.boundaries && (
              <tr key={p.id} className="border-t border-slate-100 text-slate-400 italic">
                <td className="pr-3 py-1 whitespace-nowrap">Paper {p.number} /{p.maxMarks}*</td>
                {p.boundaries.map((b, i) => <td key={i} className="px-2 py-1 text-center">{b}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-400 mt-1">Source: AQA published grade boundaries. *Paper rows are AQA's notional boundaries, shown for guidance only.</p>
    </details>
  );
}

// ---------------------------------------------------------------------------------------------

export default function PastPapersTab({ subject }: { subject: Subject }) {
  const { state, dispatch } = useApp();
  const qualifications = getQualificationsForSubject(subject.id);
  const [qualId, setQualId] = useState(qualifications[0]?.id);
  const [markingPaperId, setMarkingPaperId] = useState<string | null>(null);
  const [savedAttempt, setSavedAttempt] = useState<PastPaperAttempt | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  if (qualifications.length === 0) {
    const portal = pastPaperPortals[subject.id];
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-3">
        <p className="text-4xl">📄</p>
        <h3 className="font-semibold text-slate-800">Marked past papers for {subject.name} are coming next</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Maths is first. Until then you can find {subject.examBoard} past papers and mark schemes on the exam board's website.
        </p>
        {portal && (
          <a href={portal.url} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold no-underline hover:bg-slate-900">
            {portal.label} ↗
          </a>
        )}
      </div>
    );
  }

  const qualification = qualifications.find(q => q.id === qualId) || qualifications[0];
  const qualAttempts = state.pastPaperAttempts.filter(a => a.qualificationId === qualification.id);
  const latest = latestAttemptsByPaper(qualAttempts);
  const totalPapers = qualification.series.reduce((n, s) => n + s.papers.length, 0);
  const seriesResults = qualification.series.map(s => ({ series: s, result: getSeriesResult(qualification, s, latest) }));
  const completeSeries = seriesResults.filter(r => r.result.overall);
  const gradeRank = (g: string) => (g === 'U' ? qualification.grades.length : qualification.grades.indexOf(g));
  const bestSeries = [...completeSeries]
    .sort((a, b) => gradeRank(a.result.overall!.grade) - gradeRank(b.result.overall!.grade))
    .find(r => r.result.overall!.grade !== 'U');

  // Where marks are going, across the latest attempt of each paper in this qualification.
  const lostTotals: Record<string, number> = {};
  for (const a of latest.values()) for (const [t, n] of Object.entries(a.lostByTopic)) lostTotals[t] = (lostTotals[t] || 0) + n;
  const topicsById = new Map(subject.units.flatMap(u => u.topics).map(t => [t.id, t]));
  const topLost = Object.entries(lostTotals).filter(([t]) => topicsById.has(t)).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const averagePct = latest.size > 0
    ? Math.round([...latest.values()].reduce((s, a) => s + percent(a.marks, a.maxMarks), 0) / latest.size)
    : null;

  const startMarking = (paperId: string) => {
    setSavedAttempt(null);
    setMarkingPaperId(paperId);
  };

  return (
    <div className="space-y-5">
      <AppExamsSection subjectId={subject.id} />

      {/* How it works */}
      <div className="bg-slate-800 text-white rounded-xl p-4 md:p-5">
        <h3 className="font-bold mb-2">📄 Real AQA past papers — sit on paper, mark with AQA’s mark scheme</h3>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-slate-200">
          <li className="bg-slate-700/60 rounded-lg p-2.5"><strong className="text-white block mb-0.5">1. Sit it</strong>Open the question paper, set a timer and follow the calculator rule.</li>
          <li className="bg-slate-700/60 rounded-lg p-2.5"><strong className="text-white block mb-0.5">2. Mark it</strong>Use AQA's mark scheme. Be strict — it's how the examiner marks.</li>
          <li className="bg-slate-700/60 rounded-lg p-2.5"><strong className="text-white block mb-0.5">3. Enter it</strong>Type your score and tag where you lost marks.</li>
          <li className="bg-slate-700/60 rounded-lg p-2.5"><strong className="text-white block mb-0.5">4. Fix it</strong>Get your grade from AQA's real boundaries; weak topics go to your priorities.</li>
        </ol>
      </div>

      {/* Qualification switcher */}
      {qualifications.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {qualifications.map(q => (
            <button
              key={q.id}
              onClick={() => { setQualId(q.id); setMarkingPaperId(null); setSavedAttempt(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                q.id === qualification.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {q.shortName} <span className="opacity-70 font-normal">({q.code})</span>
            </button>
          ))}
        </div>
      )}

      <div>
        <h3 className="font-semibold text-slate-800">{qualification.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{qualification.about}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <p className="text-xs text-slate-400">Papers marked</p>
          <p className="text-xl font-bold text-slate-800">{latest.size}<span className="text-sm text-slate-400">/{totalPapers}</span></p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <p className="text-xs text-slate-400">Average score</p>
          <p className="text-xl font-bold text-slate-800">{averagePct === null ? '—' : `${averagePct}%`}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <p className="text-xs text-slate-400">Full sets done</p>
          <p className="text-xl font-bold text-slate-800">{completeSeries.length}<span className="text-sm text-slate-400">/{qualification.series.length}</span></p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <p className="text-xs text-slate-400">Best real grade</p>
          <p className="text-xl font-bold text-slate-800">{bestSeries ? bestSeries.result.overall!.grade : '—'}</p>
          {bestSeries && <p className="text-[10px] text-slate-400">{bestSeries.series.label}</p>}
        </div>
      </div>

      {topLost.length > 0 && (
        <div className="bg-white border border-red-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-700 mb-2">🔎 Where you're losing marks</p>
          <div className="flex flex-wrap gap-1.5">
            {topLost.map(([topicId, n]) => {
              const st = statusFromLostMarks(n) || 'gap';
              return (
                <Link
                  key={topicId}
                  to={`/subject/${subject.id}/topic/${topicId}`}
                  className={`text-xs px-2.5 py-1 rounded-full border no-underline hover:opacity-80 ${STATUS_META[st].className}`}
                >
                  {STATUS_META[st].icon} {topicsById.get(topicId)!.name} · −{n}
                </Link>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">From your latest go at each paper. Practise a topic to 80%+ (10+ questions) after the paper, or retake the paper, to clear it.</p>
        </div>
      )}

      {/* Series */}
      <div className="space-y-4">
        {seriesResults.map(({ series, result }) => (
          <div key={series.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <h4 className="font-bold text-slate-800">{series.label}</h4>
              {result.overall ? (
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  {result.marks}/{result.maxMarks} ({percent(result.marks, result.maxMarks)}%)
                  <GradePill result={result.overall} />
                </span>
              ) : (
                <span className="text-xs text-slate-400">
                  {result.papersDone === 0 ? 'Not started' : `${result.papersDone} of ${result.papersTotal} papers marked · ${result.marks} marks so far`}
                </span>
              )}
            </div>
            {series.note && <p className="text-[11px] text-slate-400 mb-2">{series.note}</p>}

            <div className="space-y-2 mt-2">
              {series.papers.map(paper => {
                const attempt = latest.get(paper.id);
                const tries = qualAttempts.filter(a => a.paperId === paper.id).length;
                const grade = attempt && paper.boundaries ? gradeFromBoundaries(attempt.marks, paper.boundaries, qualification.grades) : null;
                return (
                  <div key={paper.id} className="border border-slate-100 rounded-lg p-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <div className="flex-1 min-w-[180px]">
                        <p className="text-sm font-semibold text-slate-700">
                          {paper.calculator ? '🧮' : '✏️'} {paper.title}
                        </p>
                        <p className="text-[11px] text-slate-400">{paper.code} · {paper.maxMarks} marks · {formatMinutes(paper.minutes)}</p>
                      </div>
                      {attempt && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-700">{attempt.marks}/{attempt.maxMarks}</span>
                          {grade && <GradePill result={grade} notional />}
                          {tries > 1 && <span className="text-[10px] text-slate-400">{tries} tries</span>}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        <FileLink href={paper.questionPaper} label="Question paper" />
                        <FileLink href={paper.markScheme} label="Mark scheme" />
                        {paper.examinerReport && <FileLink href={paper.examinerReport} label="Examiner report" />}
                      </div>
                      <button
                        onClick={() => (markingPaperId === paper.id ? setMarkingPaperId(null) : startMarking(paper.id))}
                        className={`text-xs px-3 py-1.5 rounded-md font-semibold ${
                          attempt ? 'bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {markingPaperId === paper.id ? 'Close' : attempt ? 'Mark again' : 'Mark it'}
                      </button>
                    </div>

                    {markingPaperId === paper.id && (
                      <MarkingForm
                        key={paper.id}
                        subject={subject}
                        qualification={qualification}
                        series={series}
                        paper={paper}
                        onCancel={() => setMarkingPaperId(null)}
                        onSaved={attempt => { setMarkingPaperId(null); setSavedAttempt(attempt); }}
                      />
                    )}
                    {savedAttempt?.paperId === paper.id && (
                      <SavedResult attempt={savedAttempt} subject={subject} onClose={() => setSavedAttempt(null)} />
                    )}
                  </div>
                );
              })}
            </div>

            <BoundaryTable qualification={qualification} series={series} />
          </div>
        ))}
      </div>

      {qualification.moreLink && (
        <a href={qualification.moreLink.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-indigo-600 hover:text-indigo-800">
          More practice: {qualification.moreLink.label} ↗
        </a>
      )}

      {/* History */}
      {qualAttempts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <button onClick={() => setShowHistory(h => !h)} className="text-sm font-semibold text-slate-700">
            🗂️ All attempts ({qualAttempts.length}) {showHistory ? '▲' : '▼'}
          </button>
          {showHistory && (
            <div className="mt-3 divide-y divide-slate-100">
              {[...qualAttempts].sort((a, b) => b.date.localeCompare(a.date)).map(a => {
                const found = findPaper(a.paperId);
                if (!found) return null;
                const grade = found.paper.boundaries ? gradeFromBoundaries(a.marks, found.paper.boundaries, qualification.grades) : null;
                return (
                  <div key={a.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                    <span className="text-xs text-slate-400 w-20">{new Date(a.date).toLocaleDateString()}</span>
                    <span className="flex-1 min-w-[140px] text-slate-700">{found.series.label} · Paper {found.paper.number}</span>
                    <span className="font-semibold text-slate-700">{a.marks}/{a.maxMarks}</span>
                    {grade && <GradePill result={grade} notional />}
                    {a.minutesTaken && <span className="text-xs text-slate-400">{formatMinutes(a.minutesTaken)}</span>}
                    <button
                      onClick={() => { if (confirm('Delete this attempt?')) dispatch({ type: 'DELETE_PAST_PAPER_ATTEMPT', id: a.id }); }}
                      className="text-xs text-slate-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <p className="text-[11px] text-slate-400">
        Question papers, mark schemes and examiner reports open on AQA's website (© AQA). *Paper grades use AQA's notional paper boundaries —
        your real grade is worked out from all papers in a series added together.
      </p>
    </div>
  );
}

import { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { writingTasks, translationSets } from '../data/spanishSkills';
import type { WritingTask, TranslationSet } from '../data/spanishSkills';
import { analyseWriting, markTranslation } from '../utils/spanishMarking';
import type { WritingReport } from '../utils/spanishMarking';
import { newAttemptId, latestAttemptsByPaper } from '../utils/pastPapers';
import type { PastPaperAttempt } from '../types';

const SKILLS = 'spanish-skills';
const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];

function AccentBar({ onInsert }: { onInsert: (ch: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {ACCENTS.map(a => (
        <button key={a} type="button" onMouseDown={e => e.preventDefault()} onClick={() => onInsert(a)} className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200">
          {a}
        </button>
      ))}
    </div>
  );
}

function insertAt(el: HTMLInputElement | HTMLTextAreaElement | null, value: string, ch: string, set: (v: string) => void) {
  if (!el) { set(value + ch); return; }
  const start = el.selectionStart ?? value.length;
  const end = el.selectionEnd ?? value.length;
  set(value.slice(0, start) + ch + value.slice(end));
  requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + ch.length, start + ch.length); });
}

function Tick({ ok }: { ok: boolean }) {
  return <span className={ok ? 'text-emerald-600' : 'text-red-500'}>{ok ? '✓' : '✗'}</span>;
}

// ------------------------------------------------------------------ writing task

function WritingRunner({ task, onClose }: { task: WritingTask; onClose: () => void }) {
  const { dispatch } = useApp();
  const [text, setText] = useState('');
  const [report, setReport] = useState<WritingReport | null>(null);
  const [selfChecks, setSelfChecks] = useState<boolean[]>([false, false, false, false]);
  const [saved, setSaved] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const words = (text.match(/\p{L}+/gu) || []).length;

  const SELF = [
    'Verb endings match the person (yo como, ella come…)',
    'Adjectives agree with their nouns (las casas bonitas)',
    'Accents and ñ are in the right places',
    'I used ser/estar and por/para correctly',
  ];

  const save = () => {
    if (!report) return;
    // 10-point record: the coach's range/coverage score, less one point per accuracy check not ticked.
    const marks = Math.max(0, Math.round(report.score / 10) - selfChecks.filter(c => !c).length);
    const attempt: PastPaperAttempt = {
      id: newAttemptId(),
      subjectId: 'spanish',
      qualificationId: SKILLS,
      seriesId: 'writing',
      paperId: task.id,
      date: new Date().toISOString(),
      marks,
      maxMarks: 10,
      lostByTopic: marks < 10 ? { 'sp-exam-skills': 10 - marks } : {},
      answers: { text },
    };
    dispatch({ type: 'ADD_PAST_PAPER_ATTEMPT', attempt });
    setSaved(true);
  };

  return (
    <div className="space-y-4">
      <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">← All writing tasks</button>
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">{task.kind}-word task</p>
        <h3 className="text-lg font-bold text-slate-800">✍️ {task.title}</h3>
        <p className="text-sm text-slate-600">{task.intro}</p>
        <ul className="space-y-1">
          {task.bullets.map((b, i) => (
            <li key={i} className="text-sm text-slate-800">
              • <strong>{b.es}</strong> <span className="text-slate-400">({b.en})</span>
            </li>
          ))}
        </ul>
        <textarea
          ref={area}
          value={text}
          onChange={e => { setText(e.target.value); setReport(null); setSaved(false); }}
          rows={task.kind === '150' ? 12 : 8}
          spellCheck={false}
          lang="es"
          placeholder="Escribe aquí…"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 leading-relaxed"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <AccentBar onInsert={ch => insertAt(area.current, text, ch, setText)} />
          <span className={`text-sm font-semibold ${words < task.targetWords * 0.8 ? 'text-slate-400' : words > task.targetWords * 1.6 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {words} / ~{task.targetWords} words
          </span>
        </div>
        <button onClick={() => setReport(analyseWriting(task, text))} disabled={words < 10} className="w-full py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 disabled:opacity-40">
          Get feedback
        </button>
      </div>

      {report && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-3xl font-bold text-slate-800">{report.score}<span className="text-base text-slate-400">/100</span></p>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-semibold">{report.band}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            The coach checks the task and the range of your Spanish (bullet points, tenses, opinions, linking words, complex structures).
            It can’t fully check grammar, so compare with the model answer and tick the accuracy checks honestly.
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-slate-700 mb-1">Bullet points</p>
              {report.bullets.map((b, i) => (
                <p key={i}><Tick ok={b.covered && b.tenseOk} /> {b.bullet}{b.tense && <span className="text-slate-400"> ({b.tense} tense{b.covered && !b.tenseOk ? ' missing' : ''})</span>}</p>
              ))}
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-1">Time frames</p>
              <p><Tick ok={report.tenses.past} /> Past <Tick ok={report.tenses.present} /> Present <Tick ok={report.tenses.future} /> Future <Tick ok={report.tenses.conditional} /> Conditional</p>
              <p className="mt-2"><strong>{report.opinions.length}</strong> opinions · <strong>{report.connectives.length}</strong> connectives · <strong>{report.complex.length}</strong> complex structures</p>
              {report.complex.length > 0 && <p className="text-xs text-slate-500">{report.complex.join(' · ')}</p>}
            </div>
          </div>

          {report.tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-amber-800 mb-1">To improve</p>
              <ul className="text-sm text-amber-900 space-y-0.5">{report.tips.map(t => <li key={t}>• {t}</li>)}</ul>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Check your accuracy against the model</p>
            {SELF.map((s, i) => (
              <label key={s} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={selfChecks[i]} onChange={e => setSelfChecks(c => c.map((v, j) => (j === i ? e.target.checked : v)))} />
                {s}
              </label>
            ))}
          </div>

          <details>
            <summary className="text-sm font-semibold text-rose-600 cursor-pointer">Model answer (grade 9)</summary>
            <p className="mt-2 text-sm text-slate-700 whitespace-pre-line bg-slate-50 rounded-lg p-3">{task.model}</p>
          </details>

          {saved ? (
            <p className="text-sm text-emerald-700">✅ Saved to your progress.</p>
          ) : (
            <button onClick={save} className="px-5 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold">Save this piece</button>
          )}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ translation

function TranslationRunner({ set, onClose }: { set: TranslationSet; onClose: () => void }) {
  const { dispatch } = useApp();
  const [typed, setTyped] = useState<string[]>(set.sentences.map(() => ''));
  const [checked, setChecked] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [focused, setFocused] = useState(0);
  const results = set.sentences.map((s, i) => markTranslation(s, typed[i]));
  const total = results.reduce((n, r) => n + r.marks, 0);
  const max = set.sentences.length * 2;

  const check = () => {
    setChecked(true);
    const attempt: PastPaperAttempt = {
      id: newAttemptId(),
      subjectId: 'spanish',
      qualificationId: SKILLS,
      seriesId: 'translation',
      paperId: set.id,
      date: new Date().toISOString(),
      marks: total,
      maxMarks: max,
      lostByTopic: total < max ? { [set.topicId]: max - total } : {},
      answers: Object.fromEntries(typed.map((t, i) => [String(i), t])),
    };
    dispatch({ type: 'ADD_PAST_PAPER_ATTEMPT', attempt });
  };

  return (
    <div className="space-y-4">
      <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">← All writing tasks</button>
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Translation into Spanish</p>
          <h3 className="text-lg font-bold text-slate-800">🔁 {set.title}</h3>
        </div>
        {set.sentences.map((s, i) => (
          <div key={i}>
            <p className="text-sm text-slate-800 mb-1">{i + 1}. {s.en}</p>
            <input
              ref={el => { inputs.current[i] = el; }}
              value={typed[i]}
              disabled={checked}
              onFocus={() => setFocused(i)}
              onChange={e => setTyped(t => t.map((v, j) => (j === i ? e.target.value : v)))}
              spellCheck={false}
              lang="es"
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="En español…"
            />
            {checked && (
              <div className={`mt-1 text-sm rounded-lg p-2 ${results[i].marks === 2 ? 'bg-emerald-50' : results[i].marks === 1 ? 'bg-amber-50' : 'bg-red-50'}`}>
                <p><strong>{results[i].marks}/2</strong> · Model: {s.model}</p>
                {results[i].missing.length > 0 && <p className="text-xs text-slate-600">Missing or not matched: {results[i].missing.join(' · ')}</p>}
                {results[i].accentSlip && <p className="text-xs text-amber-700">Check your accents.</p>}
              </div>
            )}
          </div>
        ))}
        {!checked && <AccentBar onInsert={ch => insertAt(inputs.current[focused], typed[focused], ch, v => setTyped(t => t.map((x, j) => (j === focused ? v : x))))} />}
        {!checked ? (
          <button onClick={check} className="w-full py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700">Mark my translation</button>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-slate-800">{total}/{max} marks</p>
            <button onClick={onClose} className="px-5 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold">Done</button>
          </div>
        )}
        {checked && <p className="text-[11px] text-slate-400">Marked by key phrases. If your version is different but correct, check it with your teacher — there is often more than one right answer.</p>}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ list

export default function SpanishWriting() {
  const { state } = useApp();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [runKey, setRunKey] = useState(0);
  const latest = latestAttemptsByPaper(state.pastPaperAttempts.filter(a => a.qualificationId === SKILLS));

  const writing = writingTasks.find(t => t.id === taskId);
  const translation = translationSets.find(t => t.id === taskId);
  const close = () => setTaskId(null);
  if (writing) return <WritingRunner key={runKey} task={writing} onClose={close} />;
  if (translation) return <TranslationRunner key={runKey} set={translation} onClose={close} />;

  const open = (id: string) => { setTaskId(id); setRunKey(k => k + 1); window.scrollTo(0, 0); };
  const lastScore = (id: string) => {
    const a = latest.get(id);
    return a ? <span className="text-xs font-semibold text-slate-500">Last: {a.marks}/{a.maxMarks}</span> : <span className="text-xs text-slate-300">Not tried</span>;
  };

  return (
    <div className="space-y-5">
      <div className="bg-rose-600 text-white rounded-xl p-4 md:p-5">
        <h3 className="font-bold text-lg">✍️ Writing practice</h3>
        <p className="text-sm text-rose-100">
          Exam-style tasks with instant feedback on the bullet points, tenses, opinions and complex language examiners look for,
          plus grade 9 model answers. Translations into Spanish are marked phrase by phrase.
        </p>
      </div>
      {(['90', '150'] as const).map(kind => (
        <div key={kind}>
          <h4 className="font-semibold text-slate-700 mb-2">{kind}-word tasks</h4>
          <div className="grid sm:grid-cols-3 gap-2">
            {writingTasks.filter(t => t.kind === kind).map(t => (
              <button key={t.id} onClick={() => open(t.id)} className="text-left bg-white border border-slate-200 rounded-xl p-3 hover:border-rose-300">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-500">{t.bullets.length} bullet points</p>
                <p className="font-semibold text-slate-800">{t.title}</p>
                {lastScore(t.id)}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div>
        <h4 className="font-semibold text-slate-700 mb-2">Translation into Spanish</h4>
        <div className="grid sm:grid-cols-3 gap-2">
          {translationSets.map(t => (
            <button key={t.id} onClick={() => open(t.id)} className="text-left bg-white border border-slate-200 rounded-xl p-3 hover:border-rose-300">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-500">{t.sentences.length} sentences</p>
              <p className="font-semibold text-slate-800">{t.title}</p>
              {lastScore(t.id)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

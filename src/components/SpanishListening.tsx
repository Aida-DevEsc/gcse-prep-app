import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { listeningTasks, dictationSets } from '../data/spanishSkills';
import type { ListeningTask, DictationSet } from '../data/spanishSkills';
import { markListening, markDictation } from '../utils/spanishMarking';
import { useSpanishSpeech } from '../utils/speech';
import { newAttemptId, latestAttemptsByPaper } from '../utils/pastPapers';
import type { PastPaperAttempt } from '../types';

const SKILLS = 'spanish-skills';

function SpeechWarning({ supported, hasVoice }: { supported: boolean; hasVoice: boolean }) {
  if (supported && hasVoice) return null;
  return (
    <p className="text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3">
      {supported
        ? 'No Spanish voice found on this device. On Windows: Settings → Time & language → Speech → add Spanish (Spain). On iPhone/iPad: Settings → Accessibility → Spoken Content → Voices → Spanish. Then reload.'
        : 'This browser can’t play the audio. Try Chrome, Edge or Safari.'}
    </p>
  );
}

function RateToggle({ rate, setRate }: { rate: number; setRate: (r: number) => void }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-slate-500">Speed</span>
      {[0.75, 0.9, 1].map(r => (
        <button key={r} onClick={() => setRate(r)} className={`px-2 py-1 rounded ${rate === r ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
          {r === 1 ? 'Exam' : r === 0.9 ? 'Normal' : 'Slow'}
        </button>
      ))}
    </div>
  );
}

function saveAttempt(dispatch: ReturnType<typeof useApp>['dispatch'], id: string, kind: string, topicId: string, marks: number, max: number, answers: Record<string, string>) {
  const attempt: PastPaperAttempt = {
    id: newAttemptId(),
    subjectId: 'spanish',
    qualificationId: SKILLS,
    seriesId: kind,
    paperId: id,
    date: new Date().toISOString(),
    marks,
    maxMarks: max,
    lostByTopic: marks < max ? { [topicId]: max - marks } : {},
    answers,
  };
  dispatch({ type: 'ADD_PAST_PAPER_ATTEMPT', attempt });
}

// ------------------------------------------------------------------ comprehension

function ListeningRunner({ task, onClose }: { task: ListeningTask; onClose: () => void }) {
  const { dispatch } = useApp();
  const speech = useSpanishSpeech();
  const [rate, setRate] = useState(0.9);
  const [plays, setPlays] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const score = task.questions.filter(q => markListening(q, answers[q.id])).length;

  const play = () => {
    setPlays(p => p + 1);
    speech.speak(task.lines, rate);
  };

  const check = () => {
    speech.stop();
    setChecked(true);
    saveAttempt(dispatch, task.id, 'listening', task.topicId, score, task.questions.length, answers);
  };

  return (
    <div className="space-y-4">
      <button onClick={() => { speech.stop(); onClose(); }} className="text-sm text-slate-500 hover:text-slate-700">← All listening tasks</button>
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">{task.level}</p>
            <h3 className="text-lg font-bold text-slate-800">🎧 {task.title}</h3>
          </div>
          <RateToggle rate={rate} setRate={setRate} />
        </div>
        <SpeechWarning supported={speech.supported} hasVoice={speech.hasSpanishVoice} />
        <div className="flex flex-wrap items-center gap-2">
          {speech.speaking ? (
            <button onClick={speech.stop} className="px-5 py-2.5 bg-slate-800 text-white rounded-lg font-semibold">■ Stop</button>
          ) : (
            <button onClick={play} disabled={!speech.supported} className="px-5 py-2.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 disabled:opacity-40">
              ▶ {plays === 0 ? 'Play recording' : 'Play again'}
            </button>
          )}
          <span className="text-xs text-slate-500">
            Played {plays} time{plays === 1 ? '' : 's'}{plays > 2 ? ' — in the exam you hear it twice' : ' · the exam plays each recording twice'}
          </span>
        </div>
        {speech.speaking && speech.currentLine !== null && (
          <p className="text-xs text-slate-400">Speaking part {speech.currentLine + 1} of {task.lines.length}…</p>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 space-y-4">
        <p className="text-sm font-semibold text-slate-700">Answer in English</p>
        {task.questions.map((q, i) => {
          const right = checked && markListening(q, answers[q.id]);
          return (
            <div key={q.id} className={checked ? `rounded-lg p-3 border ${right ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}` : ''}>
              <p className="text-sm text-slate-800 mb-2">{i + 1}. {q.prompt}</p>
              {q.type === 'choice' ? (
                <div className="space-y-1.5">
                  {q.options.map((o, j) => (
                    <label key={j} className={`flex items-start gap-2 text-sm p-2 rounded-lg border cursor-pointer ${
                      checked && j === q.correct ? 'border-emerald-400 bg-white' : answers[q.id] === String(j) ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                    }`}>
                      <input type="radio" disabled={checked} checked={answers[q.id] === String(j)} onChange={() => setAnswers(a => ({ ...a, [q.id]: String(j) }))} className="mt-0.5" />
                      {o}
                    </label>
                  ))}
                </div>
              ) : (
                <>
                  <input
                    value={answers[q.id] || ''}
                    disabled={checked}
                    onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="Your answer in English"
                  />
                  {checked && <p className="text-xs text-slate-600 mt-1">Mark scheme: {q.answer}</p>}
                </>
              )}
            </div>
          );
        })}
        {!checked ? (
          <button onClick={check} className="w-full py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700">Check my answers</button>
        ) : (
          <div className="space-y-3">
            <p className="text-lg font-bold text-slate-800">{score}/{task.questions.length} correct</p>
            <details open>
              <summary className="text-sm font-semibold text-slate-700 cursor-pointer">Transcript and translation</summary>
              <div className="grid md:grid-cols-2 gap-3 mt-2 text-sm">
                <div className="bg-slate-50 rounded-lg p-3 space-y-1.5">
                  {task.lines.map((l, i) => (
                    <p key={i}>
                      {l.speaker && <strong className="text-rose-600 mr-1">{l.speaker}:</strong>}
                      {l.text}{' '}
                      <button onClick={() => speech.speak(task.lines, rate, i, true)} className="text-xs text-rose-500" aria-label="Play this line">🔊</button>
                    </p>
                  ))}
                </div>
                <p className="bg-slate-50 rounded-lg p-3 text-slate-600">{task.translation}</p>
              </div>
            </details>
            <button onClick={onClose} className="px-5 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ dictation

function DictationRunner({ set, onClose }: { set: DictationSet; onClose: () => void }) {
  const { dispatch } = useApp();
  const speech = useSpanishSpeech();
  const [rate, setRate] = useState(0.75);
  const [typed, setTyped] = useState<string[]>(set.sentences.map(() => ''));
  const [checked, setChecked] = useState(false);
  const lines = set.sentences.map(text => ({ text }));
  const results = set.sentences.map((s, i) => markDictation(s, typed[i]));
  const total = results.reduce((n, r) => n + r.marks, 0);
  const max = set.sentences.length * 2;
  const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];
  const [focused, setFocused] = useState(0);

  const insert = (ch: string) => setTyped(t => t.map((v, i) => (i === focused ? v + ch : v)));

  const check = () => {
    speech.stop();
    setChecked(true);
    saveAttempt(dispatch, set.id, 'dictation', 'sp-exam-skills', total, max, Object.fromEntries(typed.map((t, i) => [String(i), t])));
  };

  return (
    <div className="space-y-4">
      <button onClick={() => { speech.stop(); onClose(); }} className="text-sm text-slate-500 hover:text-slate-700">← All listening tasks</button>
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Dictation</p>
            <h3 className="text-lg font-bold text-slate-800">✍️ {set.title}</h3>
          </div>
          <RateToggle rate={rate} setRate={setRate} />
        </div>
        <p className="text-sm text-slate-600">Listen to each sentence and write exactly what you hear, with accents. In the exam each sentence is read several times.</p>
        <SpeechWarning supported={speech.supported} hasVoice={speech.hasSpanishVoice} />
        <div className="space-y-3">
          {set.sentences.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <button
                onClick={() => speech.speak(lines, rate, i, true)}
                disabled={!speech.supported}
                className="shrink-0 w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-semibold hover:bg-rose-200 disabled:opacity-40"
                aria-label={`Play sentence ${i + 1}`}
              >
                {speech.speaking && speech.currentLine === i ? '…' : `▶${i + 1}`}
              </button>
              <div className="flex-1">
                <input
                  value={typed[i]}
                  disabled={checked}
                  onFocus={() => setFocused(i)}
                  onChange={e => setTyped(t => t.map((v, j) => (j === i ? e.target.value : v)))}
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  placeholder={`Sentence ${i + 1}`}
                />
                {checked && (
                  <p className="text-sm mt-1 flex flex-wrap gap-x-1">
                    {results[i].words.map((w, k) => (
                      <span
                        key={k}
                        className={w.status === 'right' ? 'text-emerald-700' : w.status === 'accent' ? 'text-amber-600 underline decoration-dotted' : 'text-red-600 line-through decoration-red-300'}
                        title={w.status === 'accent' ? 'Check the accent' : w.status === 'right' ? '' : 'Missing or wrong'}
                      >
                        {w.word}
                      </span>
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-500">{results[i].marks}/2</span>
                  </p>
                )}
                {checked && <p className="text-xs text-slate-400">Correct: {s}</p>}
              </div>
            </div>
          ))}
        </div>
        {!checked && (
          <div className="flex flex-wrap gap-1">
            {ACCENTS.map(a => (
              <button key={a} onMouseDown={e => e.preventDefault()} onClick={() => insert(a)} className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200">{a}</button>
            ))}
          </div>
        )}
        {!checked ? (
          <button onClick={check} className="w-full py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700">Check my dictation</button>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-slate-800">{total}/{max} marks</p>
            <button onClick={onClose} className="px-5 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold">Done</button>
          </div>
        )}
        {checked && <p className="text-[11px] text-slate-400">2 marks for a perfect sentence, 1 if most words are right. Amber words have an accent problem.</p>}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ list

export default function SpanishListening() {
  const { state } = useApp();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [runKey, setRunKey] = useState(0);
  const latest = latestAttemptsByPaper(state.pastPaperAttempts.filter(a => a.qualificationId === SKILLS));

  const task = listeningTasks.find(t => t.id === taskId);
  const dictation = dictationSets.find(d => d.id === taskId);
  const close = () => setTaskId(null);
  if (task) return <ListeningRunner key={runKey} task={task} onClose={close} />;
  if (dictation) return <DictationRunner key={runKey} set={dictation} onClose={close} />;

  const open = (id: string) => { setTaskId(id); setRunKey(k => k + 1); window.scrollTo(0, 0); };
  const lastScore = (id: string) => {
    const a = latest.get(id);
    return a ? <span className="text-xs font-semibold text-slate-500">Last: {a.marks}/{a.maxMarks}</span> : <span className="text-xs text-slate-300">Not tried</span>;
  };

  return (
    <div className="space-y-5">
      <div className="bg-rose-600 text-white rounded-xl p-4 md:p-5">
        <h3 className="font-bold text-lg">🎧 Listening practice</h3>
        <p className="text-sm text-rose-100">
          Recordings are read aloud by your device’s Spanish voice. Answer the questions, then check the transcript.
          The new AQA exam also has a dictation section — practise it below.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-slate-700 mb-2">Comprehension</h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {listeningTasks.map(t => (
            <button key={t.id} onClick={() => open(t.id)} className="text-left bg-white border border-slate-200 rounded-xl p-3 hover:border-rose-300">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-500">{t.level} · {t.questions.length} questions</p>
              <p className="font-semibold text-slate-800">{t.title}</p>
              {lastScore(t.id)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-700 mb-2">Dictation</h4>
        <div className="grid sm:grid-cols-3 gap-2">
          {dictationSets.map(d => (
            <button key={d.id} onClick={() => open(d.id)} className="text-left bg-white border border-slate-200 rounded-xl p-3 hover:border-rose-300">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-500">{d.sentences.length} sentences</p>
              <p className="font-semibold text-slate-800">{d.title}</p>
              {lastScore(d.id)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

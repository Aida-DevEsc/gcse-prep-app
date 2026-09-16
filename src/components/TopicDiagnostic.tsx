import { useState } from 'react';
import type { Question, DifficultyLevel } from '../types';

interface Props {
  questions: Question[];
  topicName: string;
  subjectColor: string;
  onComplete: (level: DifficultyLevel, correct: number, total: number) => void;
}

const LEVEL_ORDER: DifficultyLevel[] = ['foundation', 'intermediate', 'higher', 'further'];

/** Picks up to 5 questions spanning the available difficulty range in this topic's pool. */
function pickDiagnosticQuestions(pool: Question[]): Question[] {
  const byLevel: Record<DifficultyLevel, Question[]> = {
    foundation: pool.filter(q => q.difficulty === 'foundation'),
    intermediate: pool.filter(q => q.difficulty === 'intermediate'),
    higher: pool.filter(q => q.difficulty === 'higher'),
    further: pool.filter(q => q.difficulty === 'further'),
  };
  const pickOne = (arr: Question[]) => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : null);

  const picks: Question[] = [];
  // Pitched at a grade 7–9 student: mostly higher/further, one intermediate as a warm-up.
  const wanted: DifficultyLevel[] = ['intermediate', 'higher', 'higher', 'further', 'further'];
  for (const level of wanted) {
    const remaining = byLevel[level].filter(q => !picks.includes(q));
    const q = pickOne(remaining);
    if (q) picks.push(q);
  }
  // Top up from anything left if the topic doesn't have all difficulty tiers
  if (picks.length < 5) {
    const leftover = pool.filter(q => !picks.includes(q));
    while (picks.length < 5 && leftover.length) {
      picks.push(leftover.splice(Math.floor(Math.random() * leftover.length), 1)[0]);
    }
  }
  return picks.slice(0, 5);
}

function levelFromScore(score: number, highestAvailable: DifficultyLevel): DifficultyLevel {
  const ceiling = LEVEL_ORDER.indexOf(highestAvailable);
  if (score >= 80) return LEVEL_ORDER[Math.min(ceiling, 3)]; // further (capped at what the topic offers)
  if (score >= 50) return LEVEL_ORDER[Math.min(ceiling, 2)]; // higher
  return 'intermediate';
}

export default function TopicDiagnostic({ questions, topicName, subjectColor, onComplete }: Props) {
  const [diagQuestions] = useState(() => pickDiagnosticQuestions(questions));
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Chosen option per question; 'skip' means she moved on without answering (it counts as wrong unless she comes back).
  const [answers, setAnswers] = useState<Record<number, number | 'skip'>>({});

  if (diagQuestions.length === 0) {
    // No questions to diagnose with — skip straight to intermediate practice.
    onComplete('intermediate', 0, 0);
    return null;
  }

  const highestAvailable = diagQuestions.reduce<DifficultyLevel>((max, q) => {
    return LEVEL_ORDER.indexOf(q.difficulty) > LEVEL_ORDER.indexOf(max) ? q.difficulty : max;
  }, 'foundation');

  if (!started) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 text-center">
        <div className="text-4xl mb-3">🩺</div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Quick Level Check</h3>
        <p className="text-xs font-semibold text-indigo-600 mb-2">Grade 7–9 questions</p>
        <p className="text-sm text-slate-500 mb-1 max-w-md mx-auto">
          Before you practise <strong>{topicName}</strong>, answer {diagQuestions.length} quick questions so we can
          start you at the right difficulty — no time pressure, this isn't marked against you.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="mt-5 px-6 py-2.5 text-white rounded-lg font-semibold"
          style={{ backgroundColor: subjectColor }}
        >
          Start Level Check
        </button>
      </div>
    );
  }

  const question = diagQuestions[currentIndex];
  const chosen = answers[currentIndex];
  const answered = typeof chosen === 'number';
  const isLast = currentIndex === diagQuestions.length - 1;
  const doneCount = Object.values(answers).filter(a => typeof a === 'number').length;

  const handleAnswer = (i: number) => {
    if (answered) return;
    setAnswers(prev => ({ ...prev, [currentIndex]: i }));
  };

  const finish = (final: Record<number, number | 'skip'>) => {
    const correct = diagQuestions.filter((q, i) => final[i] === q.correctAnswer).length;
    const score = Math.round((correct / diagQuestions.length) * 100);
    onComplete(levelFromScore(score, highestAvailable), correct, diagQuestions.length);
  };

  const handleNext = () => {
    if (isLast) finish(answers);
    else setCurrentIndex(i => i + 1);
  };

  const handleSkip = () => {
    const next = answered ? answers : { ...answers, [currentIndex]: 'skip' as const };
    setAnswers(next);
    if (isLast) finish(next);
    else setCurrentIndex(i => i + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Level Check — Question {currentIndex + 1} of {diagQuestions.length}</p>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-500">{question.difficulty}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${(doneCount / diagQuestions.length) * 100}%`, backgroundColor: subjectColor }}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-lg font-medium text-slate-800 mb-6">{question.question}</p>
        <div className="space-y-2">
          {question.options.map((option, i) => {
            let btnClass = 'w-full p-4 rounded-lg text-left text-sm font-medium transition-all border-2 ';
            if (answered) {
              if (i === question.correctAnswer) btnClass += 'bg-emerald-50 border-emerald-400 text-emerald-800';
              else if (i === chosen) btnClass += 'bg-red-50 border-red-400 text-red-800';
              else btnClass += 'bg-slate-50 border-slate-200 text-slate-400';
            } else {
              btnClass += 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer text-slate-700';
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={answered} className={btnClass}>
                <span className="inline-flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {answered && question.explanation && (
          <p className="mt-4 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{question.explanation}</p>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex(i => i - 1)}
            disabled={currentIndex === 0}
            className="px-4 py-3 rounded-lg font-medium border border-slate-300 text-slate-600 disabled:opacity-30"
          >
            ← Back
          </button>
          {answered ? (
            <button onClick={handleNext} className="flex-1 py-3 text-white rounded-lg font-medium" style={{ backgroundColor: subjectColor }}>
              {isLast ? 'See my starting level →' : 'Next Question →'}
            </button>
          ) : (
            <button onClick={handleSkip} className="flex-1 py-3 rounded-lg font-medium border border-slate-300 text-slate-600 hover:bg-slate-50">
              {isLast ? 'Skip & see my level →' : 'Skip →'}
            </button>
          )}
        </div>
        {chosen === 'skip' && <p className="text-xs text-slate-400 mt-2">You skipped this one — answer it now or it counts as not known.</p>}
      </div>
    </div>
  );
}

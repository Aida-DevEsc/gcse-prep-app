// Checks the Spanish skills content against its own marking. Run with: node scripts/check-spanish.ts
import { listeningTasks, dictationSets, writingTasks, translationSets } from '../src/data/spanishSkills.ts';
import { markListening, markDictation, markTranslation, analyseWriting } from '../src/utils/spanishMarking.ts';

let failures = 0;
const fail = (msg: string) => { failures++; console.log('FAIL', msg); };

for (const task of listeningTasks) {
  for (const q of task.questions) {
    if (q.type === 'choice') {
      const lengths = q.options.map(o => o.length);
      const longest = Math.max(...lengths);
      if (lengths[q.correct] === longest && lengths.filter(l => l === longest).length === 1 && longest > Math.max(...lengths.filter((_, i) => i !== q.correct)) * 1.15) {
        fail(`${task.id}/${q.id}: the correct option is clearly the longest`);
      }
      if (!markListening(q, String(q.correct))) fail(`${task.id}/${q.id}: correct choice not accepted`);
    } else {
      if (!markListening(q, q.answer)) fail(`${task.id}/${q.id}: model answer "${q.answer}" not accepted`);
      if (markListening(q, 'I do not know')) fail(`${task.id}/${q.id}: nonsense accepted`);
    }
  }
}

for (const set of dictationSets) {
  for (const s of set.sentences) {
    if (markDictation(s, s).marks !== 2) fail(`${set.id}: exact sentence not given 2 marks: ${s}`);
    const noAccents = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (noAccents !== s && markDictation(s, noAccents).marks !== 1) fail(`${set.id}: accent-free version should get 1 mark: ${s}`);
    if (markDictation(s, 'hola').marks !== 0) fail(`${set.id}: nonsense scored`);
  }
}

for (const set of translationSets) {
  for (const s of set.sentences) {
    const r = markTranslation(s, s.model);
    if (r.marks !== 2 || r.accentSlip) fail(`${set.id}: model "${s.model}" got ${r.marks} (missing ${r.missing.join(', ')}, accentSlip ${r.accentSlip})`);
    if (markTranslation(s, 'no sé').marks !== 0) fail(`${set.id}: nonsense scored for "${s.en}"`);
  }
}

for (const task of writingTasks) {
  const r = analyseWriting(task, task.model);
  const uncovered = r.bullets.filter(b => !b.covered || !b.tenseOk);
  if (uncovered.length) fail(`${task.id}: model misses bullets ${uncovered.map(b => b.bullet).join('; ')}`);
  if (r.score < 85) fail(`${task.id}: model only scores ${r.score} (${JSON.stringify({ tenses: r.tenses, op: r.opinions.length, con: r.connectives.length, cx: r.complex })})`);
  if (r.accentWarnings.length) fail(`${task.id}: false accent warnings ${r.accentWarnings.join(', ')}`);
  const weak = analyseWriting(task, 'Mi familia es grande. Me gusta.');
  if (weak.score >= 55) fail(`${task.id}: a two-sentence answer scores ${weak.score}`);
  console.log(`${task.id}: model ${r.score} (${r.band}), weak ${weak.score}`);
}

console.log(failures ? `${failures} failure(s)` : 'All Spanish checks passed');
process.exit(failures ? 1 : 0);

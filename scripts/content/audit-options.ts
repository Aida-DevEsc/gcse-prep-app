// Finds multiple-choice questions whose correct option stands out by length.
// Run: node scripts/content/audit-options.ts [outDir]
import { writeFileSync, mkdirSync } from 'node:fs';
import { mathsSubject } from '../../src/data/maths.ts';
import { biologySubject } from '../../src/data/biology.ts';
import { chemistrySubject } from '../../src/data/chemistry.ts';
import { physicsSubject } from '../../src/data/physics.ts';
import { historySubject } from '../../src/data/history.ts';
import { englishSubject } from '../../src/data/english.ts';
import { computerScienceSubject } from '../../src/data/computerscience.ts';
import { spanishSubject } from '../../src/data/spanish.ts';
import { mockTests } from '../../src/data/mockTests.ts';
import { dailyChallengePool } from '../../src/data/dailyChallenges.ts';
import type { Question, Subject } from '../../src/types/index.ts';

export function standsOut(q: Question): boolean {
  const lengths = q.options.map(o => o.length);
  const c = lengths[q.correctAnswer];
  const others = lengths.filter((_, i) => i !== q.correctAnswer);
  const next = Math.max(...others);
  return c > next && (c - next >= 4 || c >= next * 1.1);
}

const groups: Record<string, Question[]> = {};
const add = (name: string, qs: Question[]) => { groups[name] = [...(groups[name] || []), ...qs]; };
const subjects: Subject[] = [mathsSubject, biologySubject, chemistrySubject, physicsSubject, historySubject, englishSubject, computerScienceSubject, spanishSubject];
for (const s of subjects) add(s.id, [...s.units.flatMap(u => u.topics.flatMap(t => t.questions)), ...(s.diagnosticQuestions || [])]);
for (const m of mockTests) add(`mock-${m.subjectId}`, m.questions);
add('daily', dailyChallengePool);

const outDir = process.argv[2];
let total = 0;
let flagged = 0;
let longest = 0;
for (const [name, qs] of Object.entries(groups)) {
  const bad = qs.filter(standsOut);
  const isLongest = qs.filter(q => q.options[q.correctAnswer].length === Math.max(...q.options.map(o => o.length))).length;
  total += qs.length; flagged += bad.length; longest += isLongest;
  console.log(`${name.padEnd(22)} ${String(qs.length).padStart(4)} questions  correct-is-longest ${String(Math.round((100 * isLongest) / qs.length)).padStart(3)}%  stands out: ${bad.length}`);
  if (outDir) {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(`${outDir}/${name}.json`, JSON.stringify(bad.map(q => ({ id: q.id, q: q.question, options: q.options, correct: q.correctAnswer })), null, 1));
  }
}
console.log(`TOTAL ${total} questions, correct is longest ${Math.round((100 * longest) / total)}%, stands out ${flagged}`);

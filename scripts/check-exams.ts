// Checks every in-app exam paper: marks add up, topics exist, and each part's model answer and
// sample answers are marked as expected. Run with: node scripts/check-exams.ts
import { appExamPapers } from '../src/data/appExams.ts';
import { markPart } from '../src/utils/examMarking.ts';
import { readFileSync } from 'node:fs';

const mathsSource = readFileSync(new URL('../src/data/maths.ts', import.meta.url), 'utf8');
const topicIds = new Set([...mathsSource.matchAll(/t\('([a-z0-9-]+)'/g)].map(m => m[1]));

let failures = 0;
const fail = (msg: string) => { failures++; console.log('FAIL', msg); };

for (const paper of appExamPapers) {
  const partIds = new Set<string>();
  let total = 0;
  for (const q of paper.questions) {
    for (const part of q.parts) {
      total += part.marks;
      if (partIds.has(part.id)) fail(`${part.id}: duplicate id`);
      partIds.add(part.id);
      if (!topicIds.has(part.topicId)) fail(`${part.id}: unknown topic ${part.topicId}`);
      const a = part.answer;
      if (a.kind === 'self') {
        const sum = a.checklist.reduce((s, c) => s + c.marks, 0);
        if (sum !== part.marks) fail(`${part.id}: checklist adds to ${sum}, part is worth ${part.marks}`);
        continue;
      }
      if (!part.samples?.accept?.length) fail(`${part.id}: no accept samples`);
      for (const input of part.samples?.accept || []) {
        const r = markPart(part, input);
        if (r.marks !== part.marks) fail(`${part.id}: "${input}" should get ${part.marks}, got ${r.marks} (${r.status}${r.message ? ': ' + r.message : ''})`);
      }
      for (const input of part.samples?.reject || []) {
        const r = markPart(part, input);
        if (r.marks >= part.marks) fail(`${part.id}: "${input}" should NOT get full marks`);
      }
      if (markPart(part, '').status !== 'blank') fail(`${part.id}: blank not detected`);
    }
  }
  if (total !== paper.maxMarks) fail(`${paper.id}: marks add to ${total}, expected ${paper.maxMarks}`);
  console.log(`${paper.id}: ${paper.questions.length} questions, ${partIds.size} parts, ${total} marks`);
}

console.log(failures ? `${failures} failure(s)` : 'All exam checks passed');
process.exit(failures ? 1 : 0);

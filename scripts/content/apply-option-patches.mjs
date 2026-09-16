// Applies rewritten multiple-choice options.
// Usage: node scripts/content/apply-option-patches.mjs <patch.json> [<patch.json> ...]
// A patch maps a question id to [correct, distractor, distractor, distractor]. The options are
// shuffled (seeded by the id, so re-running is stable) and written back into the source file.
import { readFileSync, writeFileSync } from 'node:fs';

const TS_FILES = ['maths', 'biology', 'chemistry', 'physics', 'history', 'english', 'mockTests', 'dailyChallenges'].map(f => `src/data/${f}.ts`);
const PY_FILES = ['scripts/content/gen_computerscience.py', 'scripts/content/gen_spanish.py'];

function seededShuffle(items, seedText) {
  let seed = 0;
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Index just past a quoted string starting at `i` (single or double quotes, backslash escapes). */
function skipString(src, i) {
  const quote = src[i];
  i++;
  while (i < src.length && src[i] !== quote) i += src[i] === '\\' ? 2 : 1;
  return i + 1;
}

/** Index just past the bracketed array starting at `i`. */
function skipArray(src, i) {
  let depth = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === "'" || c === '"') { i = skipString(src, i); continue; }
    if (c === '[') depth++;
    if (c === ']' && --depth === 0) return i + 1;
    i++;
  }
  throw new Error('unterminated array');
}

function skipSpaceAndComma(src, i) {
  while (/[\s,]/.test(src[i])) i++;
  return i;
}

function patchTs(src, id, options, correctIndex) {
  const idRe = new RegExp(`id:\\s*['"]${id.replace(/[-]/g, '\\-')}['"]`, 'g');
  const m = idRe.exec(src);
  if (!m) return null;
  const after = m.index + m[0].length;
  const nextId = src.slice(after).search(/\bid:\s*['"]/);
  const limit = nextId === -1 ? src.length : after + nextId;
  const optMatch = /options\s*:\s*\[/.exec(src.slice(after));
  if (!optMatch || after + optMatch.index > limit) throw new Error(`${id}: options not found`);
  const start = after + optMatch.index + optMatch[0].length - 1;
  const end = skipArray(src, start);
  let out = src.slice(0, start) + JSON.stringify(options) + src.slice(end);
  const tail = out.slice(start);
  const ca = /correctAnswer\s*:\s*\d+/.exec(tail);
  if (!ca) throw new Error(`${id}: correctAnswer not found`);
  const caAt = start + ca.index;
  out = out.slice(0, caAt) + `correctAnswer:${correctIndex}` + out.slice(caAt + ca[0].length);
  return out;
}

function patchPy(src, id, options, correctText) {
  const key = `q('${id}',`;
  const at = src.indexOf(key);
  if (at === -1) return null;
  let i = skipSpaceAndComma(src, at + key.length);
  i = skipString(src, i); // question
  i = skipSpaceAndComma(src, i);
  if (src[i] !== '[') throw new Error(`${id}: options list not found`);
  const listStart = i;
  const listEnd = skipArray(src, i);
  i = skipSpaceAndComma(src, listEnd);
  const corrStart = i;
  const corrEnd = skipString(src, i);
  return src.slice(0, listStart) + JSON.stringify(options) + src.slice(listEnd, corrStart) + JSON.stringify(correctText) + src.slice(corrEnd);
}

const sources = new Map();
const load = f => { if (!sources.has(f)) sources.set(f, readFileSync(f, 'utf8')); return sources.get(f); };

let applied = 0;
const problems = [];
for (const patchFile of process.argv.slice(2)) {
  const patch = JSON.parse(readFileSync(patchFile, 'utf8'));
  for (const [id, list] of Object.entries(patch)) {
    if (!Array.isArray(list) || list.length !== 4 || new Set(list).size !== 4) { problems.push(`${id}: need 4 different options`); continue; }
    const correct = list[0];
    const options = seededShuffle(list, id);
    const correctIndex = options.indexOf(correct);
    let done = false;
    for (const f of TS_FILES) {
      const next = patchTs(load(f), id, options, correctIndex);
      if (next) { sources.set(f, next); done = true; break; }
    }
    if (!done) {
      for (const f of PY_FILES) {
        const next = patchPy(load(f), id, options, correct);
        if (next) { sources.set(f, next); done = true; break; }
      }
    }
    if (done) applied++;
    else problems.push(`${id}: question not found`);
  }
}
for (const [f, text] of sources) writeFileSync(f, text);
console.log(`applied ${applied}`);
if (problems.length) { console.log(problems.join('\n')); process.exit(1); }

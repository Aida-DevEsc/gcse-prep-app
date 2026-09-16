/**
 * Marks typed maths answers. Expressions are parsed (with implicit multiplication, powers, √, fractions
 * and trig in degrees) and compared by substituting values, so any equivalent answer earns the marks —
 * unless the question asks for a particular form, such as factorised or a simplified surd.
 *
 * Only type imports here, so scripts/check-exams.ts can run this file directly with Node.
 */
import type { AnswerSpec, AppExamPaper, ExamPart } from '../types/exam';

// ------------------------------------------------------------------ parsing

export type MathNode =
  | { t: 'num'; v: number }
  | { t: 'var'; n: string }
  | { t: 'bin'; op: '+' | '-' | '*' | '/' | '^'; a: MathNode; b: MathNode }
  | { t: 'neg'; a: MathNode }
  | { t: 'fn'; f: string; a: MathNode };

type Token =
  | { k: 'num'; v: number }
  | { k: 'var'; n: string }
  | { k: 'fn'; f: string }
  | { k: 'op'; v: string }
  | { k: '('; } | { k: ')' };

const FUNCTIONS = ['sqrt', 'sin', 'cos', 'tan'];

/** Turns the symbols students type or paste into plain ASCII maths. */
export function normaliseMath(input: string): string {
  return input
    .replace(/[−–—]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4')
    .replace(/π/g, 'pi')
    .replace(/[[{]/g, '(').replace(/[\]}]/g, ')')
    .replace(/\*\*/g, '^')
    .trim();
}

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      const text = src.slice(i, j);
      if ((text.match(/\./g) || []).length > 1 || text === '.') throw new Error('bad number');
      tokens.push({ k: 'num', v: parseFloat(text) });
      i = j;
      continue;
    }
    if (c === '√') { tokens.push({ k: 'fn', f: 'sqrt' }); i++; continue; }
    if (/\p{L}/u.test(c)) {
      const rest = src.slice(i).toLowerCase();
      const fn = FUNCTIONS.find(f => rest.startsWith(f));
      if (fn) { tokens.push({ k: 'fn', f: fn }); i += fn.length; continue; }
      if (rest.startsWith('pi')) { tokens.push({ k: 'num', v: Math.PI }); i += 2; continue; }
      tokens.push({ k: 'var', n: c.toLowerCase() });
      i++;
      continue;
    }
    if ('+-*/^'.includes(c)) { tokens.push({ k: 'op', v: c }); i++; continue; }
    if (c === '(') { tokens.push({ k: '(' }); i++; continue; }
    if (c === ')') { tokens.push({ k: ')' }); i++; continue; }
    throw new Error(`unexpected "${c}"`);
  }
  return tokens;
}

class Parser {
  private pos = 0;
  private tokens: Token[];
  constructor(tokens: Token[]) { this.tokens = tokens; }

  parse(): MathNode {
    if (this.tokens.length === 0) throw new Error('empty');
    const node = this.expr();
    if (this.pos < this.tokens.length) throw new Error('unexpected input');
    return node;
  }

  private peek(): Token | undefined { return this.tokens[this.pos]; }

  private isOp(v: string): boolean {
    const t = this.peek();
    return !!t && t.k === 'op' && t.v === v;
  }

  private startsPrimary(): boolean {
    const t = this.peek();
    return !!t && (t.k === 'num' || t.k === 'var' || t.k === 'fn' || t.k === '(');
  }

  private expr(): MathNode {
    let node = this.term();
    while (this.isOp('+') || this.isOp('-')) {
      const op = (this.tokens[this.pos++] as { v: string }).v as '+' | '-';
      node = { t: 'bin', op, a: node, b: this.term() };
    }
    return node;
  }

  private term(): MathNode {
    let node = this.unary();
    for (;;) {
      if (this.isOp('*') || this.isOp('/')) {
        const op = (this.tokens[this.pos++] as { v: string }).v as '*' | '/';
        node = { t: 'bin', op, a: node, b: this.unary() };
      } else if (this.startsPrimary()) {
        node = { t: 'bin', op: '*', a: node, b: this.power() };
      } else {
        return node;
      }
    }
  }

  private unary(): MathNode {
    if (this.isOp('-')) { this.pos++; return { t: 'neg', a: this.unary() }; }
    if (this.isOp('+')) { this.pos++; return this.unary(); }
    return this.power();
  }

  private power(): MathNode {
    const base = this.primary();
    if (this.isOp('^')) {
      this.pos++;
      return { t: 'bin', op: '^', a: base, b: this.unary() };
    }
    return base;
  }

  private primary(): MathNode {
    const t = this.tokens[this.pos++];
    if (!t) throw new Error('unexpected end');
    if (t.k === 'num') return { t: 'num', v: t.v };
    if (t.k === 'var') return { t: 'var', n: t.n };
    if (t.k === 'fn') return { t: 'fn', f: t.f, a: this.power() };
    if (t.k === '(') {
      const inner = this.expr();
      const close = this.tokens[this.pos++];
      if (!close || close.k !== ')') throw new Error('missing )');
      return inner;
    }
    throw new Error('unexpected token');
  }
}

export function parseMath(input: string): MathNode {
  return new Parser(tokenize(normaliseMath(input))).parse();
}

export function tryParse(input: string): MathNode | null {
  try { return parseMath(input); } catch { return null; }
}

const DEG = Math.PI / 180;

export function evaluate(node: MathNode, vars: Record<string, number> = {}): number {
  switch (node.t) {
    case 'num': return node.v;
    case 'var': return node.n in vars ? vars[node.n] : NaN;
    case 'neg': return -evaluate(node.a, vars);
    case 'fn': {
      const a = evaluate(node.a, vars);
      if (node.f === 'sqrt') return Math.sqrt(a);
      if (node.f === 'sin') return Math.sin(a * DEG);
      if (node.f === 'cos') return Math.cos(a * DEG);
      return Math.tan(a * DEG);
    }
    case 'bin': {
      const a = evaluate(node.a, vars);
      const b = evaluate(node.b, vars);
      switch (node.op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        case '^': return Math.pow(a, b);
      }
    }
  }
}

function variablesIn(node: MathNode, out = new Set<string>()): Set<string> {
  if (node.t === 'var') out.add(node.n);
  else if (node.t === 'neg' || node.t === 'fn') variablesIn(node.a, out);
  else if (node.t === 'bin') { variablesIn(node.a, out); variablesIn(node.b, out); }
  return out;
}

function hasSqrt(node: MathNode): boolean {
  if (node.t === 'fn') return node.f === 'sqrt' || hasSqrt(node.a);
  if (node.t === 'neg') return hasSqrt(node.a);
  if (node.t === 'bin') return hasSqrt(node.a) || hasSqrt(node.b);
  return false;
}

// ------------------------------------------------------------------ comparisons

const close = (a: number, b: number, tolerance = 1e-9) =>
  Math.abs(a - b) <= Math.max(tolerance, 1e-9 * Math.max(1, Math.abs(b)));

/** Fixed, awkward sample values so coincidental matches are very unlikely. */
const SAMPLE_VALUES = [0.37, 1.73, -2.19, 2.91, -0.83, 3.47, -1.51, 0.61, 4.13, -3.29];

function samplePoints(vars: string[]): Record<string, number>[] {
  return SAMPLE_VALUES.map((_, i) => {
    const point: Record<string, number> = {};
    vars.forEach((v, j) => { point[v] = SAMPLE_VALUES[(i + j * 3) % SAMPLE_VALUES.length] + j * 0.11; });
    return point;
  });
}

export function equivalent(a: MathNode, b: MathNode, vars: string[]): boolean {
  let checked = 0;
  for (const point of samplePoints(vars)) {
    const x = evaluate(a, point);
    const y = evaluate(b, point);
    if (!Number.isFinite(y)) continue;
    if (!Number.isFinite(x)) return false;
    if (Math.abs(x - y) > 1e-7 * Math.max(1, Math.abs(y))) return false;
    checked++;
  }
  return checked >= 4;
}

/** True when `a` is a non-zero constant multiple of `b` (so a = 0 and b = 0 describe the same curve). */
function proportional(a: MathNode, b: MathNode, vars: string[]): boolean {
  let ratio: number | null = null;
  let checked = 0;
  for (const point of samplePoints(vars)) {
    const x = evaluate(a, point);
    const y = evaluate(b, point);
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(y) < 1e-6) continue;
    const r = x / y;
    if (ratio === null) ratio = r;
    else if (Math.abs(r - ratio) > 1e-7 * Math.max(1, Math.abs(ratio))) return false;
    checked++;
  }
  return checked >= 4 && ratio !== null && Math.abs(ratio) > 1e-9;
}

// ------------------------------------------------------------------ forms

function stripNeg(node: MathNode): MathNode {
  return node.t === 'neg' ? stripNeg(node.a) : node;
}

function isFactorised(node: MathNode): boolean {
  const root = stripNeg(node);
  return root.t === 'bin' && (root.op === '*' || root.op === '^');
}

/** Every √ holds a square-free whole number, and no √ is left in a denominator. */
function isSimplifiedSurd(node: MathNode): boolean {
  let ok = true;
  const walk = (n: MathNode) => {
    if (n.t === 'fn' && n.f === 'sqrt') {
      const v = evaluate(n.a);
      if (!Number.isInteger(v) || v < 2) { ok = false; return; }
      for (let k = 2; k * k <= v; k++) if (v % (k * k) === 0) ok = false;
      if (n.a.t !== 'num') ok = false;
    } else if (n.t === 'bin') {
      if (n.op === '/' && hasSqrt(n.b)) ok = false;
      walk(n.a);
      walk(n.b);
    } else if (n.t === 'neg' || n.t === 'fn') {
      walk(n.a);
    }
  };
  walk(node);
  return ok;
}

function isCompletedSquare(node: MathNode): boolean {
  const isSquare = (n: MathNode): boolean => {
    const s = stripNeg(n);
    if (s.t === 'bin' && s.op === '*') return (isSquare(s.a) && variablesIn(s.b).size === 0) || (isSquare(s.b) && variablesIn(s.a).size === 0);
    return s.t === 'bin' && s.op === '^' && evaluate(s.b) === 2 && variablesIn(s.a).size > 0 && stripNeg(s.a).t === 'bin';
  };
  if (isSquare(node)) return true;
  return node.t === 'bin' && (node.op === '+' || node.op === '-') && isSquare(node.a) && variablesIn(node.b).size === 0;
}

function hasPower(node: MathNode): boolean {
  if (node.t === 'bin') return node.op === '^' || hasPower(node.a) || hasPower(node.b);
  if (node.t === 'neg' || node.t === 'fn') return hasPower(node.a);
  return false;
}

// ------------------------------------------------------------------ answer parsing helpers

const UNIT = /\s*(cm|mm|km|kg|m|g|s|°|degrees?|deg|units?)\s*(\^?[23])?\s*$/i;
const LEADING_NAME = /^\s*(?:[a-zθ](?:\([a-z]\))?|dy\/dx|f'\(x\)|f\^-1\(x\)|f-1\(x\))\s*=/i;

function cleanValue(text: string): string {
  let s = normaliseMath(text).replace(LEADING_NAME, '');
  s = s.replace(UNIT, '').trim();
  // Mixed numbers like "3 3/8".
  s = s.replace(/^(-?)(\d+)\s+(\d+)\/(\d+)$/, '$1($2+$3/$4)');
  return s;
}

function parseValue(text: string): number | null {
  const s = cleanValue(text);
  if (!s) return null;
  const node = tryParse(s);
  if (!node || variablesIn(node).size > 0) return null;
  const v = evaluate(node);
  return Number.isFinite(v) ? v : null;
}

function splitList(text: string): string[] {
  return normaliseMath(text).split(/,|;|\bor\b|\band\b/i).map(s => s.trim()).filter(Boolean);
}

function matchCount(expected: number[], given: number[], tolerance: number): { matched: number; extra: number } {
  const remaining = [...given];
  let matched = 0;
  for (const e of expected) {
    const i = remaining.findIndex(g => close(g, e, tolerance));
    if (i >= 0) { matched++; remaining.splice(i, 1); }
  }
  return { matched, extra: remaining.length };
}

export function parseCoordinates(text: string): [number, number][] | null {
  const s = normaliseMath(text);
  const pairs: [string, string][] = [];
  for (const m of s.matchAll(/\(([^(),]+),([^(),]+)\)/g)) pairs.push([m[1], m[2]]);
  if (pairs.length === 0) {
    for (const m of s.matchAll(/x\s*=\s*([^,;=]+?)\s*[,;]?\s*(?:and\s+)?y\s*=\s*([^,;=]+?)(?=\s*(?:[,;]|\bor\b|\band\b|$))/gi)) pairs.push([m[1], m[2]]);
  }
  if (pairs.length === 0) return null;
  const out: [number, number][] = [];
  for (const [a, b] of pairs) {
    const x = parseValue(a);
    const y = parseValue(b);
    if (x === null || y === null) return null;
    out.push([x, y]);
  }
  return out;
}

// ------------------------------------------------------------------ inequalities

type Region = (v: number) => boolean;

function parseRegion(text: string, variable: string): { region: Region; constants: number[] } | null {
  let s = normaliseMath(text)
    .replace(/≤|=</g, '<=').replace(/≥|=>/g, '>=')
    .replace(/⩽/g, '<=').replace(/⩾/g, '>=');
  if (variable === 'y') s = s.replace(/[a-z]\s*\(\s*x\s*\)/gi, 'y');
  const clauses = s.split(/\bor\b|,|;|∪/i).map(c => c.trim()).filter(Boolean);
  if (clauses.length === 0) return null;
  const constants: number[] = [];
  const clauseFns: Region[] = [];
  for (const clause of clauses) {
    const atoms = clause.split(/\band\b/i).map(a => a.trim()).filter(Boolean);
    const atomFns: Region[] = [];
    for (const atom of atoms) {
      const pieces = atom.split(/(<=|>=|<|>)/).map(p => p.trim());
      if (pieces.length < 3 || pieces.length % 2 === 0) return null;
      const exprs: MathNode[] = [];
      const ops: string[] = [];
      for (let i = 0; i < pieces.length; i++) {
        if (i % 2 === 1) { ops.push(pieces[i]); continue; }
        const node = tryParse(pieces[i]);
        if (!node) return null;
        const vs = variablesIn(node);
        if ([...vs].some(v => v !== variable)) return null;
        if (vs.size === 0) constants.push(evaluate(node));
        exprs.push(node);
      }
      if (!exprs.some(e => variablesIn(e).has(variable))) return null;
      atomFns.push(v => ops.every((op, i) => {
        const a = evaluate(exprs[i], { [variable]: v });
        const b = evaluate(exprs[i + 1], { [variable]: v });
        if (op === '<') return a < b - 1e-12;
        if (op === '>') return a > b + 1e-12;
        if (op === '<=') return a <= b + 1e-12;
        return a >= b - 1e-12;
      }));
    }
    clauseFns.push(v => atomFns.every(f => f(v)));
  }
  return { region: v => clauseFns.some(f => f(v)), constants };
}

function sameRegion(a: { region: Region; constants: number[] }, b: { region: Region; constants: number[] }): boolean {
  const points: number[] = [];
  for (let x = -60; x <= 60; x += 0.5) points.push(x + 0.123);
  for (const c of [...a.constants, ...b.constants]) points.push(c, c - 1e-4, c + 1e-4);
  return points.every(p => a.region(p) === b.region(p));
}

// ------------------------------------------------------------------ marking

export interface PartMark {
  marks: number;
  status: 'correct' | 'partial' | 'wrong' | 'blank' | 'unreadable' | 'self';
  message?: string;
}

const FORM_MESSAGES: Record<string, string> = {
  factorised: 'Equivalent, but not fully factorised.',
  expanded: 'Equivalent, but the brackets need expanding.',
  completedSquare: 'Equivalent, but not in completed-square form.',
  noPowers: 'Equivalent, but not fully simplified.',
  surd: 'Right value, but not a simplified surd with a rational denominator.',
};

function scaled(marks: number, matched: number, expected: number, extra: number): PartMark {
  if (matched === expected && extra === 0) return { marks, status: 'correct' };
  const awarded = Math.max(0, Math.floor((marks * matched) / expected) - extra);
  return awarded > 0 ? { marks: awarded, status: 'partial' } : { marks: 0, status: 'wrong' };
}

export function markAnswer(spec: AnswerSpec, marks: number, input: string | undefined): PartMark {
  const raw = (input || '').trim();
  if (spec.kind === 'self') return { marks: 0, status: 'self' };
  if (!raw || (spec.kind === 'matrix' && raw.split('|').every(c => !c.trim()))) return { marks: 0, status: 'blank' };

  switch (spec.kind) {
    case 'choice':
      return Number(raw) === spec.correct ? { marks, status: 'correct' } : { marks: 0, status: 'wrong' };

    case 'number': {
      const cleaned = cleanValue(raw);
      const node = tryParse(cleaned);
      if (!node || variablesIn(node).size > 0) return { marks: 0, status: 'unreadable', message: 'Could not read this as a number.' };
      const v = evaluate(node);
      if (!close(v, spec.value, spec.tolerance)) return { marks: 0, status: 'wrong' };
      if (spec.form === 'surd' && !isSimplifiedSurd(node)) return { marks: Math.max(0, marks - 1), status: marks > 1 ? 'partial' : 'wrong', message: FORM_MESSAGES.surd };
      return { marks, status: 'correct' };
    }

    case 'numbers': {
      const values: number[] = [];
      for (const piece of splitList(raw)) {
        const v = parseValue(piece);
        if (v === null) return { marks: 0, status: 'unreadable', message: `Could not read "${piece}".` };
        values.push(v);
      }
      const { matched, extra } = matchCount(spec.values, values, spec.tolerance ?? 1e-9);
      return scaled(marks, matched, spec.values.length, extra);
    }

    case 'expression': {
      let text = normaliseMath(raw);
      if (text.includes('=')) text = text.slice(text.lastIndexOf('=') + 1);
      const node = tryParse(text);
      if (!node) return { marks: 0, status: 'unreadable', message: 'Could not read this expression.' };
      const extraVars = [...variablesIn(node)].filter(v => !spec.vars.includes(v));
      if (extraVars.length) return { marks: 0, status: 'wrong', message: `Unexpected letter "${extraVars[0]}".` };
      if (!equivalent(node, parseMath(spec.expr), spec.vars)) return { marks: 0, status: 'wrong' };
      const form = spec.form;
      const formOk =
        !form ||
        (form === 'factorised' && isFactorised(node)) ||
        (form === 'expanded' && !text.includes('(')) ||
        (form === 'completedSquare' && isCompletedSquare(node)) ||
        (form === 'noPowers' && !hasPower(node));
      if (!formOk) return { marks: Math.max(0, marks - 1), status: marks > 1 ? 'partial' : 'wrong', message: FORM_MESSAGES[form!] };
      return { marks, status: 'correct' };
    }

    case 'equation': {
      const text = normaliseMath(raw);
      const sides = text.split('=');
      if (sides.length !== 2) return { marks: 0, status: 'unreadable', message: 'Write it as an equation, with one "=" sign.' };
      const left = tryParse(sides[0]);
      const right = tryParse(sides[1]);
      if (!left || !right) return { marks: 0, status: 'unreadable', message: 'Could not read this equation.' };
      const node: MathNode = { t: 'bin', op: '-', a: left, b: right };
      const extraVars = [...variablesIn(node)].filter(v => !spec.vars.includes(v));
      if (extraVars.length) return { marks: 0, status: 'wrong', message: `Unexpected letter "${extraVars[0]}".` };
      return proportional(node, parseMath(spec.expr), spec.vars) ? { marks, status: 'correct' } : { marks: 0, status: 'wrong' };
    }

    case 'coordinates': {
      const given = parseCoordinates(raw);
      if (!given) return { marks: 0, status: 'unreadable', message: 'Write coordinates like (2, 3).' };
      const expected = spec.points.map(([a, b]) => [evaluate(parseMath(a)), evaluate(parseMath(b))] as [number, number]);
      const tol = spec.tolerance ?? 1e-9;
      const remaining = [...given];
      let matched = 0;
      for (const [ex, ey] of expected) {
        const i = remaining.findIndex(([gx, gy]) => close(gx, ex, tol) && close(gy, ey, tol));
        if (i >= 0) { matched++; remaining.splice(i, 1); }
      }
      return scaled(marks, matched, expected.length, remaining.length);
    }

    case 'inequality': {
      const given = parseRegion(raw, spec.variable);
      if (!given) return { marks: 0, status: 'unreadable', message: `Write it like ${spec.variable} < 3 or -2 ≤ ${spec.variable} ≤ 5.` };
      const expected = parseRegion(spec.expr, spec.variable)!;
      return sameRegion(given, expected) ? { marks, status: 'correct' } : { marks: 0, status: 'wrong' };
    }

    case 'matrix': {
      const cells = raw.split('|');
      let right = 0;
      spec.values.forEach((v, i) => {
        const g = parseValue(cells[i] || '');
        if (g !== null && close(g, v)) right++;
      });
      if (right === spec.values.length) return { marks, status: 'correct' };
      if (marks > 1 && right * 2 >= spec.values.length) return { marks: marks - 1, status: 'partial' };
      return { marks: 0, status: 'wrong' };
    }
  }
}

export function markPart(part: ExamPart, input: string | undefined): PartMark {
  return markAnswer(part.answer, part.marks, input);
}

export interface PaperScore {
  total: number;
  partMarks: Record<string, number>;
  lostByTopic: Record<string, number>;
}

/** Marks a whole paper (blank parts score 0 but aren't added to lostByTopic). `selfMarks` holds the marks she gave herself on "show that" and proof parts. */
export function scorePaper(paper: AppExamPaper, answers: Record<string, string>, selfMarks: Record<string, number>): PaperScore {
  const partMarks: Record<string, number> = {};
  const lostByTopic: Record<string, number> = {};
  let total = 0;
  for (const question of paper.questions) {
    for (const part of question.parts) {
      const marks = part.answer.kind === 'self'
        ? Math.max(0, Math.min(part.marks, selfMarks[part.id] ?? 0))
        : markPart(part, answers[part.id]).marks;
      partMarks[part.id] = marks;
      total += marks;
      // Only attempted questions feed the revision list, so an unfinished practice run doesn't flag everything.
      const attempted = part.answer.kind === 'self' || isAnswered(part, answers[part.id]);
      if (attempted && marks < part.marks) lostByTopic[part.topicId] = (lostByTopic[part.topicId] || 0) + part.marks - marks;
    }
  }
  return { total, partMarks, lostByTopic };
}

/** Whether a part has an answer typed in (a matrix needs every cell). */
export function isAnswered(part: ExamPart, input: string | undefined): boolean {
  const raw = (input || '').trim();
  if (part.answer.kind === 'matrix') return raw.split('|').length === part.answer.values.length && raw.split('|').every(c => c.trim());
  return raw.length > 0;
}

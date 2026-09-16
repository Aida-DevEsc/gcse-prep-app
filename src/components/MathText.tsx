import type { ReactNode } from 'react';

/** Finds the ")" matching the "(" at `open`. */
function matchParen(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')' && --depth === 0) return i;
  }
  return -1;
}

/** Renders a^(b) and a^2 as superscripts. */
function withPowers(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let buffer = '';
  let i = 0;
  let n = 0;
  while (i < text.length) {
    if (text[i] === '^') {
      let power = '';
      let end = i + 1;
      if (text[i + 1] === '(') {
        const close = matchParen(text, i + 1);
        if (close > 0) { power = text.slice(i + 2, close); end = close + 1; }
      } else {
        const m = /^[-−]?[\w.]+/.exec(text.slice(i + 1));
        if (m) { power = m[0]; end = i + 1 + m[0].length; }
      }
      if (power) {
        if (buffer) out.push(buffer);
        buffer = '';
        out.push(<sup key={`${keyPrefix}-${n++}`}>{withPowers(power, `${keyPrefix}-s${n}`)}</sup>);
        i = end;
        continue;
      }
    }
    buffer += text[i];
    i++;
  }
  if (buffer) out.push(buffer);
  return out;
}

function Matrix({ rows }: { rows: string[][] }) {
  return (
    <span className="inline-flex items-stretch align-middle mx-1 my-0.5">
      <span className="w-1.5 border-l-2 border-t-2 border-b-2 border-slate-600 rounded-l-sm" />
      <span className="inline-grid gap-x-3 px-1.5 py-0.5 text-center" style={{ gridTemplateColumns: `repeat(${rows[0].length}, auto)` }}>
        {rows.flat().map((cell, i) => <span key={i}>{cell.trim()}</span>)}
      </span>
      <span className="w-1.5 border-r-2 border-t-2 border-b-2 border-slate-600 rounded-r-sm" />
    </span>
  );
}

const MATRIX = /\[\[([^[\]]+)\](?:,\s*\[([^[\]]+)\])*\]/g;

function renderLine(line: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of line.matchAll(MATRIX)) {
    if (m.index! > last) out.push(...withPowers(line.slice(last, m.index), `${key}-t${n}`));
    const rows = [...m[0].matchAll(/\[([^[\]]+)\]/g)].map(r => r[1].split(','));
    out.push(<Matrix key={`${key}-m${n++}`} rows={rows} />);
    last = m.index! + m[0].length;
  }
  if (last < line.length) out.push(...withPowers(line.slice(last), `${key}-t${n}`));
  return out;
}

/** Exam text: keeps line breaks, draws matrices as brackets and powers as superscripts. */
export default function MathText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split('\n').map((line, i) => (
        <span key={i} className="block">{renderLine(line, `l${i}`)}</span>
      ))}
    </span>
  );
}

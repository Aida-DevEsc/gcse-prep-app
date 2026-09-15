import type { ReactNode } from 'react';

/** Renders **bold** spans within a line. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>
      : part,
  );
}

/**
 * Lightweight formatter for topic explanations: blank lines separate paragraphs, lines starting
 * with "•" or "1." become list items, a paragraph that is only **bold** becomes a heading, and
 * **bold** is supported inline.
 */
export default function RichText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        const isHeading = lines.length === 1 && /^\*\*[^*]+\*\*$/.test(lines[0]);
        if (isHeading) {
          return <h4 key={bi} className="font-bold text-slate-800 mt-5 mb-2">{lines[0].slice(2, -2)}</h4>;
        }
        const listLine = (l: string) => /^(•|-|\d+\.)\s/.test(l);
        const intro = lines.filter(l => !listLine(l));
        const items = lines.filter(listLine);
        return (
          <div key={bi} className="mb-4">
            {intro.map((l, i) => (
              <p key={i} className="text-slate-700 leading-relaxed mb-1">{inline(l)}</p>
            ))}
            {items.length > 0 && (
              <ul className="space-y-1 mt-1">
                {items.map((l, i) => (
                  <li key={i} className="text-slate-700 leading-relaxed flex gap-2">
                    <span className="text-indigo-400 shrink-0">{/^\d+\./.test(l) ? l.match(/^\d+\./)![0] : '•'}</span>
                    <span>{inline(l.replace(/^(•|-|\d+\.)\s/, ''))}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
}

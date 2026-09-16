// Reports patch entries where the correct option (first) still stands out, and overall stats.
import { readFileSync } from 'node:fs';
let n = 0, longest = 0;
for (const f of process.argv.slice(2)) {
  for (const [id, list] of Object.entries(JSON.parse(readFileSync(f, 'utf8')))) {
    n++;
    const [c, ...d] = list.map(s => s.length);
    const next = Math.max(...d);
    if (c >= next) longest++;
    if (c > next && (c - next >= 4 || c >= next * 1.1)) console.log('STILL STANDS OUT', id, c, next);
    if (new Set(list).size !== 4) console.log('DUPLICATE', id);
  }
}
console.log(`${n} entries, correct is (joint) longest in ${n ? Math.round((100 * longest) / n) : 0}%`);

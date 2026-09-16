/**
 * Marking for Spanish listening, dictation, translation and writing practice.
 * Only type imports, so scripts/check-spanish.ts can run it directly with Node.
 */
import type { ListeningQuestion, TranslationSentence, WritingTask } from '../data/spanishSkills';

export function stripAccents(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Lower case, no punctuation, single spaces. Keeps accents unless `loose` is set. */
export function normaliseText(text: string, loose = false): string {
  const t = text.toLowerCase().replace(/[¿¡.,;:!?"“”«»()'’-]/g, ' ').replace(/\s+/g, ' ').trim();
  return loose ? stripAccents(t) : t;
}

const containsPhrase = (haystack: string, phrase: string) => ` ${haystack} `.includes(` ${phrase} `);

// ------------------------------------------------------------------ listening

export function markListening(q: ListeningQuestion, input: string | undefined): boolean {
  if (input === undefined || input === '') return false;
  if (q.type === 'choice') return Number(input) === q.correct;
  const answer = normaliseText(input, true);
  return q.groups.every(group => group.some(k => answer.includes(stripAccents(k.toLowerCase()))));
}

// ------------------------------------------------------------------ dictation

export interface WordCheck {
  word: string;
  status: 'right' | 'accent' | 'wrong' | 'missing';
}

export interface DictationResult {
  marks: number;
  max: number;
  words: WordCheck[];
  extra: number;
}

/** Word-by-word comparison: 2 marks for a perfect sentence, 1 if at least three quarters of the words are right. */
export function markDictation(target: string, input: string): DictationResult {
  const want = normaliseText(target).split(' ');
  const got = normaliseText(input).split(' ').filter(Boolean);
  const loose = (w: string) => stripAccents(w);

  // Longest common subsequence on accent-free words, so one missed word doesn't shift everything after it.
  const n = want.length;
  const m = got.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = loose(want[i]) === loose(got[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const words: WordCheck[] = [];
  let i = 0;
  let j = 0;
  let used = 0;
  while (i < n) {
    if (j < m && loose(want[i]) === loose(got[j])) {
      words.push({ word: want[i], status: want[i] === got[j] ? 'right' : 'accent' });
      i++; j++; used++;
    } else if (j < m && dp[i][j + 1] >= dp[i + 1][j]) {
      j++;
    } else {
      words.push({ word: want[i], status: m === 0 ? 'missing' : 'wrong' });
      i++;
    }
  }
  const right = words.filter(w => w.status === 'right').length;
  const nearly = words.filter(w => w.status === 'accent').length;
  const extra = m - used;
  let marks = 0;
  if (right === n && extra === 0) marks = 2;
  else if (right + nearly * 0.5 >= n * 0.75) marks = 1;
  return { marks, max: 2, words, extra };
}

// ------------------------------------------------------------------ translation

export interface TranslationResult {
  marks: number;
  max: number;
  missing: string[];
  accentSlip: boolean;
}

/** 2 marks when every chunk is there, 1 when at least half are. Missing accents cost nothing here but are flagged. */
export function markTranslation(sentence: TranslationSentence, input: string): TranslationResult {
  const loose = normaliseText(input, true);
  const exact = normaliseText(input);
  const missing: string[] = [];
  let accentSlip = false;
  for (const chunk of sentence.chunks) {
    const hit = chunk.find(v => containsPhrase(loose, stripAccents(v)));
    if (!hit) {
      missing.push(chunk[0]);
      continue;
    }
    // Is it spelt with the right accents? Compare against the model sentence's spelling of this chunk.
    const modelWords = normaliseText(sentence.model).split(' ');
    const accented = modelWords.filter(w => stripAccents(w) !== w && stripAccents(hit).split(' ').includes(stripAccents(w)));
    if (accented.some(w => !containsPhrase(exact, w))) accentSlip = true;
  }
  const found = sentence.chunks.length - missing.length;
  const marks = missing.length === 0 ? 2 : found * 2 >= sentence.chunks.length ? 1 : 0;
  return { marks, max: 2, missing, accentSlip };
}

// ------------------------------------------------------------------ writing coach

const PAST_WORDS = new Set(['fui', 'fue', 'fuimos', 'fueron', 'fuiste', 'hice', 'hizo', 'hicimos', 'hicieron', 'tuve', 'tuvo', 'tuvimos', 'estuve', 'estuvo', 'estuvimos', 'pude', 'pudo', 'vi', 'vio', 'vimos', 'puse', 'dije', 'dijo', 'era', 'eras', 'eramos', 'eran', 'iba', 'ibas', 'ibamos', 'iban', 'habia', 'hubo', 'conoci', 'conocimos']);
const NOT_PAST = new Set(['triste', 'existe', 'insiste', 'consiste', 'chiste', 'contraste', 'acaba', 'lava']);
const NOT_VERBS_IA = new Set(['día', 'días', 'tía', 'tías', 'policía', 'energía', 'biología', 'geografía', 'tecnología', 'alegría', 'compañía', 'fotografía', 'lotería', 'panadería', 'librería', 'cafetería', 'economía', 'mayoría', 'categoría', 'batería', 'sandía', 'garantía', 'psicología', 'ortografía', 'ingeniería', 'melodía', 'frutería', 'carnicería', 'pescadería', 'zapatería', 'peluquería', 'joyería', 'mía', 'mías', 'vía', 'guía', 'todavía']);
const NOT_VERBS_ACCENT = new Set(['qué', 'café', 'mamá', 'papá', 'sofá', 'está', 'más', 'él', 'sí', 'tú', 'mí', 'aquí', 'allí', 'así', 'ahí', 'bebé', 'menú', 'rubí', 'esquí', 'olé', 'dominó']);

/** Lower-case words with accents kept (JavaScript's \b doesn't count accented letters as word characters). */
function wordsOf(text: string): string[] {
  return text.toLowerCase().match(/\p{L}+/gu) || [];
}

function hasPast(words: string[], plain: string): boolean {
  if (/\b(he|has|ha|hemos|han) [a-z]+(ado|ido)\b/.test(plain)) return true;
  return words.some(w => {
    const bare = stripAccents(w);
    if (PAST_WORDS.has(bare)) return true;
    if (NOT_PAST.has(bare)) return false;
    if (bare.length > 5 && /(aste|aron|ieron|iste|abamos|aban|abas)$/.test(bare)) return true;
    if (bare.length > 4 && /aba$/.test(bare)) return true;
    if (w.length > 2 && /(é|ó|í|ió)$/.test(w) && !NOT_VERBS_ACCENT.has(w)) return true;
    return /ía(s|mos|n)?$/.test(w) && !NOT_VERBS_IA.has(w) && !/ría(s|mos|n)?$/.test(w);
  });
}

function hasFuture(words: string[], plain: string): boolean {
  if (/\b(voy|vas|va|vamos|van) a [a-z]+(ar|er|ir)\b/.test(plain)) return true;
  if (/\b(quiero|espero|pienso|queremos|esperamos) [a-z]+(ar|er|ir)\b/.test(plain)) return true;
  return words.some(w => w.length > 3 && /(ré|rás|rá|remos|rán)$/.test(w));
}

function hasConditional(words: string[]): boolean {
  return words.some(w => /ría(s|mos|n)?$/.test(w) && !NOT_VERBS_IA.has(w));
}

/** Evaluative words: each different one counts as an opinion. */
const EVALUATIVE = ['genial', 'divertido', 'divertida', 'aburrido', 'aburrida', 'interesante', 'fascinante', 'increible', 'inolvidable', 'fatal', 'estupendo', 'estupenda', 'horrible', 'fantastico', 'fantastica', 'emocionante', 'precioso', 'preciosa', 'util', 'utiles', 'peligroso', 'bomba'];
const OPINIONS = ['me gusta', 'me gustan', 'me encanta', 'me encantan', 'odio', 'prefiero', 'creo que', 'pienso que', 'en mi opinion', 'me parece', 'lo mejor', 'lo peor', 'me interesa', 'no me gusta', 'me chifla', 'me flipa', 'me molesta', 'me preocupa', 'lo que mas'];
const CONNECTIVES = ['porque', 'ya que', 'pero', 'sin embargo', 'ademas', 'aunque', 'tambien', 'por eso', 'asi que', 'mientras', 'cuando', 'entonces', 'luego', 'primero', 'finalmente', 'por un lado', 'por otro lado', 'no obstante', 'a pesar de', 'por ejemplo', 'despues'];

/** Tested against accent-free text. */
const COMPLEX = [
  { label: 'si + tuviera/pudiera… (if I had / could)', re: /\bsi (tuviera|pudiera|fuera|hubiera|ganara|viviera|tuviese|pudiese)\b/ },
  { label: 'subjunctive (espero que / es importante que / para que / ojalá / cuando + future)', re: /\b(espero que|es importante que|es esencial que|es necesario que|para que|ojala|quiero que|no creo que|cuando (sea|tenga|termine|vaya|pueda))\b/ },
  { label: 'lo + adjective (lo mejor / lo peor / lo más …)', re: /\blo (mejor|peor|mas|bueno|malo|importante|dificil)\b/ },
  { label: 'infinitive phrases (después de / antes de / sin / al + infinitive)', re: /\b(despues de|antes de|sin|al) [a-z]+(ar|er|ir)\b/ },
  { label: 'time expressions (hace … que / llevo … / acabo de / desde hace)', re: /\b(hace [a-z0-9]+ (anos|meses|semanas|dias|horas) que|llevo [a-z0-9]+ (anos|meses|semanas|dias|horas)|acabo de|acabamos de|desde hace)\b/ },
  { label: 'relative clauses (lo que / donde)', re: /\b(lo que|donde)\b/ },
];

/** Common words typed without their accent or ñ. */
const NEEDS_ACCENT = new Set(['tambien', 'despues', 'ademas', 'dificil', 'facil', 'musica', 'informatica', 'ingles', 'pelicula', 'peliculas', 'sabado', 'miercoles', 'examenes', 'jovenes', 'telefono', 'movil', 'arbol', 'pais', 'rapido', 'ultimo', 'proximo', 'numero', 'matematicas', 'fisica', 'quimica', 'tecnologia', 'biologia', 'geografia', 'dia', 'espana', 'ano', 'anos', 'nino', 'nina', 'manana', 'pequeno', 'pequena', 'companero', 'companera', 'montana', 'aqui', 'alli', 'asi']);

export interface WritingReport {
  words: number;
  targetWords: number;
  bullets: { bullet: string; covered: boolean; tenseOk: boolean; tense?: string }[];
  tenses: { past: boolean; present: boolean; future: boolean; conditional: boolean };
  opinions: string[];
  connectives: string[];
  complex: string[];
  accentWarnings: string[];
  /** 0–100 estimate of how well the piece hits the task and shows range. */
  score: number;
  band: string;
  tips: string[];
}


export function analyseWriting(task: WritingTask, raw: string): WritingReport {
  const tokens = wordsOf(raw);
  const plain = normaliseText(raw, true);
  const words = tokens.length;

  const tenses = {
    past: hasPast(tokens, plain),
    present: /\b(soy|es|son|estoy|esta|estan|tengo|tiene|hay|vivo|juego|hago|voy|como|me gusta|me encanta|prefiero|creo|pienso)\b/.test(plain),
    future: hasFuture(tokens, plain),
    conditional: hasConditional(tokens),
  };

  const bullets = task.bullets.map(b => {
    const covered = b.keywords.some(k => plain.includes(stripAccents(k)));
    const tenseOk = !b.tense || tenses[b.tense];
    return { bullet: b.en, covered, tenseOk, tense: b.tense };
  });

  const opinions = [...OPINIONS, ...EVALUATIVE].filter(o => containsPhrase(plain, o));
  const connectives = CONNECTIVES.filter(c => containsPhrase(plain, c));
  const complex = COMPLEX.filter(c => c.re.test(plain)).map(c => c.label);
  // si + present, then a future verb ("Si hace sol, iremos…"). Checked on the accented text.
  if (/(^|[^\p{L}])si\s[^.!?]{2,60}?[\s,]\p{L}+(ré|rás|rá|remos|rán)(?!\p{L})/u.test(raw.toLowerCase())) complex.push('si + present + future (si llueve, iré…)');
  const accentWarnings = Array.from(new Set(tokens.filter(w => NEEDS_ACCENT.has(w) || /[a-z]cion$/.test(w))));

  // Scoring: task coverage 40, length 15, range 45.
  const coverage = bullets.filter(b => b.covered && b.tenseOk).length / bullets.length;
  const lengthRatio = Math.min(1, words / task.targetWords);
  const tenseCount = Object.values(tenses).filter(Boolean).length;
  const long = task.kind === '150';
  const need = { opinions: long ? 4 : 2, connectives: long ? 5 : 3, complex: long ? 3 : 1 };
  const range =
    Math.min(1, tenseCount / 3) * 15 +
    Math.min(1, opinions.length / need.opinions) * 10 +
    Math.min(1, connectives.length / need.connectives) * 10 +
    Math.min(1, complex.length / need.complex) * 10;
  // Short pieces can't show the range examiners want, so scale down anything under 80% of the target length.
  const lengthFactor = Math.min(1, words / (task.targetWords * 0.8));
  let score = Math.round((coverage * 40 + lengthRatio * 15 + range) * lengthFactor);
  if (words > task.targetWords * 1.6) score = Math.max(0, score - 5);

  const band = score >= 85 ? 'Grade 8–9 range' : score >= 70 ? 'Grade 7 range' : score >= 55 ? 'Grade 5–6 range' : score >= 35 ? 'Grade 4 range' : 'Keep building';

  const tips: string[] = [];
  bullets.filter(b => !b.covered).forEach(b => tips.push(`Write something about “${b.bullet}” — every bullet point must be covered.`));
  bullets.filter(b => b.covered && !b.tenseOk).forEach(b => tips.push(`“${b.bullet}” needs the ${b.tense} tense.`));
  if (words < task.targetWords * 0.8) tips.push(`Aim for about ${task.targetWords} words — you have ${words}.`);
  if (words > task.targetWords * 1.6) tips.push('Much longer than asked — examiners reward quality, and long answers make more mistakes.');
  if (tenseCount < 3) tips.push('Use at least three time frames: past, present and future (or conditional).');
  if (opinions.length < need.opinions) tips.push('Give more opinions (me encanta, creo que, lo mejor es…) and justify them.');
  if (connectives.length < need.connectives) tips.push('Link ideas with connectives: porque, sin embargo, además, aunque, por eso.');
  if (complex.length < need.complex) tips.push('Add a complex structure for top grades, e.g. “Si tuviera tiempo, viajaría…” or “Espero que…”.');
  if (accentWarnings.length) tips.push(`Check accents: ${accentWarnings.slice(0, 6).join(', ')}.`);

  return { words, targetWords: task.targetWords, bullets, tenses, opinions, connectives, complex, accentWarnings, score, band, tips };
}

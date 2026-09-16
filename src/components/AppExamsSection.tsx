import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { appExamSets, getAppExamPapersForSubject } from '../data/appExams';
import { gradeFromBoundaries, percent, latestAttemptsByPaper, formatMinutes } from '../utils/pastPapers';

function gradeClass(grade: string): string {
  if (['9', '8', '7'].includes(grade)) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (['6', '5'].includes(grade)) return 'bg-amber-100 text-amber-800 border-amber-300';
  return 'bg-red-100 text-red-700 border-red-300';
}

/** Exam papers she sits inside the app, marked automatically. */
export default function AppExamsSection({ subjectId }: { subjectId: string }) {
  const { state } = useApp();
  const papers = getAppExamPapersForSubject(subjectId);
  if (papers.length === 0) return null;

  const latest = latestAttemptsByPaper(state.pastPaperAttempts.filter(a => a.qualificationId === 'app'));
  const sets = appExamSets.filter(s => papers.some(p => p.setId === s.id));

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-4 md:p-5 text-white">
      <h3 className="font-bold text-lg">🖥️ Sit a full exam in the app</h3>
      <p className="text-sm text-indigo-100 mb-4">
        Timed like the real thing and marked the moment you finish, with an estimated grade, worked solutions and your weak topics
        added to your priorities. Written for this app in the same style as AQA’s papers.
      </p>
      <div className="space-y-3">
        {sets.map(set => {
          const setPapers = papers.filter(p => p.setId === set.id);
          const done = setPapers.every(p => latest.has(p.id));
          const setMarks = setPapers.reduce((s, p) => s + (latest.get(p.id)?.marks || 0), 0);
          const setMax = setPapers.reduce((s, p) => s + p.maxMarks, 0);
          const setGrade = done ? gradeFromBoundaries(setMarks, set.totalBoundaries, set.grades) : null;
          return (
            <div key={set.id} className="bg-white rounded-lg p-3 text-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <p className="font-semibold">{set.label}</p>
                {setGrade ? (
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    {setMarks}/{setMax}
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${gradeClass(setGrade.grade)}`}>Grade {setGrade.grade}</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Sit both papers for an overall grade</span>
                )}
              </div>
              <div className="space-y-2">
                {setPapers.map(paper => {
                  const attempt = latest.get(paper.id);
                  const draft = state.examDrafts?.[paper.id];
                  const grade = attempt ? gradeFromBoundaries(attempt.marks, paper.boundaries, paper.grades) : null;
                  return (
                    <div key={paper.id} className="flex flex-wrap items-center gap-2 border border-slate-100 rounded-lg p-2.5">
                      <div className="flex-1 min-w-[160px]">
                        <p className="text-sm font-semibold">{paper.calculator ? '🧮' : '✏️'} {paper.title}</p>
                        <p className="text-[11px] text-slate-400">{paper.maxMarks} marks · {formatMinutes(paper.minutes)}</p>
                      </div>
                      {attempt && grade && (
                        <span className="flex items-center gap-2 text-sm">
                          {attempt.marks}/{attempt.maxMarks} ({percent(attempt.marks, attempt.maxMarks)}%)
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${gradeClass(grade.grade)}`}>Grade {grade.grade}</span>
                        </span>
                      )}
                      {attempt && (
                        <Link to={`/subject/${subjectId}/exam/${paper.id}?review=${attempt.id}`} className="text-xs px-3 py-1.5 rounded-md border border-slate-300 text-slate-600 no-underline hover:bg-slate-50">
                          Review
                        </Link>
                      )}
                      <Link to={`/subject/${subjectId}/exam/${paper.id}`} className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white font-semibold no-underline hover:bg-indigo-700">
                        {draft ? 'Resume' : attempt ? 'Sit again' : 'Start'}
                      </Link>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">{set.boundaryNote}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

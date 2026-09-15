import type { Subject } from '../types';
import { mathsSubject } from './maths';
import { biologySubject } from './biology';
import { chemistrySubject } from './chemistry';
import { physicsSubject } from './physics';
import { historySubject } from './history';
import { englishSubject } from './english';
import { unitSections } from './examInfo';

// Section order follows the order sections first appear in unitSections (Paper 1 before Paper 2, etc.).
const sectionOrder = Array.from(new Set(Object.values(unitSections)));

/** Tag each unit with its exam paper and list units paper by paper. */
function withExamSections(subject: Subject): Subject {
  const units = subject.units.map(u => ({ ...u, examSection: unitSections[u.id] }));
  const rank = (section?: string) => (section ? sectionOrder.indexOf(section) : Number.MAX_SAFE_INTEGER);
  const ordered = units
    .map((u, i) => ({ u, i }))
    .sort((a, b) => rank(a.u.examSection) - rank(b.u.examSection) || a.i - b.i)
    .map(({ u }) => u);
  return { ...subject, units: ordered };
}

const subjects: Subject[] = [
  mathsSubject,
  biologySubject,
  chemistrySubject,
  physicsSubject,
  historySubject,
  englishSubject,
].map(withExamSections);

export function getAllSubjects(): Subject[] {
  return subjects;
}

export function getSubjectById(id: string): Subject | undefined {
  return subjects.find(s => s.id === id);
}

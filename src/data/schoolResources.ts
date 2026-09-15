// Resources from The Purbeck School "GCSE Revision and Independent Study Booklet" (Autumn 2023-24).
// Staff email addresses and school logins from the booklet are deliberately left out because this
// site is public — students should use the contact details the school gives them directly.
// Links were checked in September 2026; the school revision page moved since the booklet was printed.

export interface ResourceLink {
  label: string;
  url?: string;
  note?: string;
}

export interface ResourceBlock {
  title?: string;
  assessment?: string[];
  mustDo?: string[];
  extra?: string[];
}

export interface SubjectResources {
  subjectId: string;
  blocks: ResourceBlock[];
  links: ResourceLink[];
  help: string[];
}

export const BOOKLET_SOURCE = 'The Purbeck School GCSE Revision and Independent Study Booklet (Autumn Term 2023-24)';

export const generalAdvice = {
  headline: 'Study for at least one hour every day, and complete home learning to a high standard every week. If there is no home learning set, do the "Every week" and "Extra" activities for each subject.',
  basics: [
    'Find a quiet place where you can revise without being interrupted.',
    'Be organised: cover all of your subjects, not just the ones you enjoy. A revision timetable helps.',
    'Be realistic: plan revision for the times of day that actually work for you.',
    'Be active: reading notes or having a book open is not revision. Use mind maps, revision cards and past papers.',
    'Test yourself, and ask family and friends to test you.',
    'Know the structure of each paper and how the mark scheme works, so you know what questions you will be asked and how to answer them.',
  ],
  notEffective: ['Highlighting texts', 'Re-reading', 'Summarising notes'],
  notEffectiveWhy: 'These feel productive because they are low-stress, but they do not make you think hard, so they do little for your memory.',
  effective: ['Creating flashcards', 'Past exam papers', 'Self-quizzing using your knowledge organisers'],
  effectiveWhy: 'We remember things by thinking hard and recalling them from memory. Get feedback on every practice test so you can improve.',
  topTips: [
    { name: 'Spaced practice', detail: 'Short, frequent review sessions spread over a long period. Mix old content in with new.' },
    { name: 'Retrieval practice', detail: 'Past papers, question-and-answer flashcards, Look–Cover–Write–Check, and mind maps that link ideas.' },
    { name: 'Mindset', detail: 'Engage in every lesson, plan time at home to revise, learn from mistakes, and work hard.' },
    { name: 'Support', detail: 'Ask for a quiet study space at home, ask the Nest for help with exam anxiety, and ask teachers about gaps in your knowledge.' },
    { name: 'Attendance', detail: 'Every lesson counts: poor attendance creates gaps in your knowledge.' },
  ],
  learningScientists: [
    { name: 'Elaboration', detail: 'Explain ideas in detail, asking how and why.' },
    { name: 'Retrieval practice', detail: 'Practise remembering what you have been taught.' },
    { name: 'Spaced practice', detail: 'Spread your studying out over time.' },
    { name: 'Dual coding', detail: 'Combine pictures and words.' },
    { name: 'Interleaving', detail: 'Switch between topics as you study.' },
    { name: 'Concrete examples', detail: 'Use specific examples to understand abstract ideas.' },
  ],
  planning: {
    termTime: 'During term time, fit revision around school work: smaller amounts are more effective. The booklet suggests up to 2 hours a night as four 30-minute slots between 3.30 and 7.30pm, leaving time for family and relaxing.',
    holidays: 'At weekends and in the holidays, split the day into a morning block (9.00–12.00) and an afternoon block (2.00–5.00), in 30-minute slots.',
  },
  schoolSupport: [
    'Study Plus: every Tuesday–Thursday, 3.10–4.10pm in the café.',
    'Subject revision videos are on the school website (Exams and Revision page).',
  ],
  links: [
    { label: 'School Exams and Revision page', url: 'https://www.purbeck.dorset.sch.uk/key-information/exams-and-revision', note: 'Revision guidance, videos, and exam information' },
  ] as ResourceLink[],
};

const AQA_SCIENCE_NOTE = 'Past papers and mark schemes — marking your own answers teaches you how to word them';

export const subjectResources: SubjectResources[] = [
  {
    subjectId: 'maths',
    blocks: [{
      assessment: ['Three papers: Paper 1 (non-calculator), Papers 2 and 3 (calculator).'],
      mustDo: ['Revise for your weekly knowledge quiz.', 'Complete all Sparx Maths tasks set by your teacher.', 'Complete GCSE practice exam papers under timed conditions.'],
      extra: [
        'Extra Sparx Maths tasks from the Independent Learning, Target or XP Boost sections.',
        'Revise and improve your End of Unit Key Question Assessment.',
        'Use Exam Practice Workbooks for topic-specific exam questions.',
        'Use flashcards to learn the important mathematical knowledge and skills.',
      ],
    }],
    links: [
      { label: 'Sparx Maths', url: 'https://www.sparxmaths.uk', note: 'Log in with your school account' },
    ],
    help: ['Your Maths teacher.', 'Study Plus (Tuesday–Thursday, 3.10–4.10pm, café).', 'Maths Support Sessions: every lunchtime in room M13.'],
  },
  {
    subjectId: 'biology',
    blocks: [{
      assessment: [
        'Paper 1 (B1–B9: Cell Biology, Organisation, Infection and Response, Bioenergetics): 100 marks, 50%, 1h 45m.',
        'Paper 2 (B10–B18: Homeostasis and Response; Inheritance, Variation and Evolution; Ecology): 100 marks, 50%, 1h 45m.',
        'Both papers include required-practical questions: multiple choice, structured, short answer and open response.',
      ],
      mustDo: ['Seneca home learning (fortnightly).', 'A 6-mark exam question (fortnightly).'],
      extra: [
        'Revise with the CGP revision guide "AQA GCSE Biology".',
        'Use the Science Online Learning Guide (S12 Students area on Teams).',
        'Watch the revision videos and use the workbooks on Free Science Lessons.',
        'Practise past paper questions and self-mark them with the mark schemes.',
      ],
    }],
    links: [
      { label: 'Seneca Learning', url: 'https://app.senecalearning.com' },
      { label: 'Free Science Lessons', url: 'https://www.freesciencelessons.co.uk', note: 'Videos and workbooks for every topic' },
      { label: 'AQA Biology past papers', url: 'https://www.aqa.org.uk/subjects/science/gcse/biology-8461/assessment-resources', note: AQA_SCIENCE_NOTE },
    ],
    help: ['Your Biology teacher.', 'Mrs Robinson (Head of Biology).', 'Seneca support sessions: Thursday after school in S9.'],
  },
  {
    subjectId: 'chemistry',
    blocks: [{
      assessment: [
        'Paper 1 (C1 Atomic Structure, C2 Periodic Table, C3 Structure and Bonding, C4 Calculations, C5 Chemical Changes, C6 Electrolysis, C7 Energy Changes): 100 marks, 50%, 1h 45m.',
        'Paper 2 (C8 Rates and Equilibria, C9 Crude Oil, C10 Organic Reactions, C11 Polymers, C12 Chemical Analysis, C13 Earth\'s Atmosphere, C14 Earth\'s Resources, C15 Using Earth\'s Resources): 100 marks, 50%, 1h 45m.',
        'Paper 2 can also include C1–C4, the fundamentals of GCSE Chemistry.',
      ],
      mustDo: ['Seneca home learning (fortnightly).', 'Past paper question booklet (weekly).'],
      extra: [
        'Use the Science Online Learning Guide (S12 Students area on Teams).',
        'Revise with the CGP revision guide "AQA GCSE Chemistry".',
        'Watch the revision videos and use the workbooks on Free Science Lessons.',
        'Practise past paper questions and self-mark them with the mark schemes.',
      ],
    }],
    links: [
      { label: 'Seneca Learning', url: 'https://app.senecalearning.com' },
      { label: 'Free Science Lessons', url: 'https://www.freesciencelessons.co.uk', note: 'Videos and workbooks for every topic' },
      { label: 'AQA Chemistry past papers', url: 'https://www.aqa.org.uk/subjects/science/gcse/chemistry-8462/assessment-resources', note: AQA_SCIENCE_NOTE },
    ],
    help: ['Your Chemistry teacher.', 'Mr Foyle (Head of Chemistry).', 'Seneca support sessions: Tuesday–Thursday after school.', 'Chemistry support sessions: Tuesday after school.'],
  },
  {
    subjectId: 'physics',
    blocks: [{
      assessment: [
        'Paper 1 (P1 Conservation and Dissipation of Energy, P2 Energy Transfer by Heating, P3 Energy Resources, P4 Electric Circuits, P5 Electricity in the Home, P6 Molecules and Matter, P7 Radioactivity): 100 marks, 50%, 1h 45m.',
        'Paper 2 (P8 Forces in Balance, P9 Motion, P10 Force and Motion, P11 Force and Pressure, P12 Wave Properties, P13 Electromagnetic Waves, P14 Light, P15 Electromagnetism, P16 Space): 100 marks, 50%, 1h 45m.',
        'Paper 2 can also include P1–P7, the fundamentals of GCSE Physics.',
      ],
      mustDo: ['Seneca home learning (fortnightly).', 'Past paper question booklet (weekly).'],
      extra: [
        'Use the Science Online Learning Guide (S12 Students area on Teams).',
        'Revise with the CGP revision guide "AQA GCSE Physics".',
        'Watch the revision videos and use the workbooks on Free Science Lessons.',
        'Practise past paper questions and self-mark them with the mark schemes.',
      ],
    }],
    links: [
      { label: 'Seneca Learning', url: 'https://app.senecalearning.com' },
      { label: 'Free Science Lessons', url: 'https://www.freesciencelessons.co.uk', note: 'Videos and workbooks for every topic' },
      { label: 'AQA Physics past papers', url: 'https://www.aqa.org.uk/subjects/science/gcse/physics-8463/assessment-resources', note: AQA_SCIENCE_NOTE },
    ],
    help: ['Your Physics teacher.', 'Mr Nicolaides (Head of Physics).', 'Seneca support sessions after school.'],
  },
  {
    subjectId: 'history',
    blocks: [{
      assessment: ['Four exam papers: Germany 1919–39 (1 hour), Health and Medicine 500–now (1h 15m), USA 1929–2000 (45 minutes), Elizabethan England (1 hour).'],
      mustDo: [
        'Revise from your Knowledge Organiser booklet.',
        'Highlight each section of the booklet once you have revised it, so you can see your progress.',
        'You will be tested on different sections of the booklet each week. Copies (including an easier "modified" version) are on Teams.',
      ],
      extra: [
        'Read your purple book and review the practice questions and model answers.',
        'Complete new practice exam questions (on Teams).',
        'Study past papers and model answers (on Teams).',
        'Get "My Revision Notes: WJEC Eduqas GCSE (9–1) History" for extra knowledge, practice and model answers.',
      ],
    }],
    links: [
      { label: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize', note: 'GCSE History resources' },
      { label: 'BBC Teach', url: 'https://www.bbc.co.uk/teach', note: 'History videos' },
    ],
    help: ['Your History teacher.', 'Mr Rainsley (Head of History).'],
  },
  {
    subjectId: 'english',
    blocks: [
      {
        title: 'English Language',
        assessment: [
          'Paper 1: Explorations in Creative Reading and Writing.',
          'Paper 2: Writers\' Viewpoints and Perspectives.',
          'Each paper has a reading section and a writing section, worth 40 marks each. There is also a speaking assessment (non-exam).',
        ],
        mustDo: ['Use your knowledge organiser to memorise, for Questions 1–5/6 on both papers: what each question assesses, how many marks it is worth, and how long you have.'],
        extra: [
          'Paper 1: open a novel on any page, choose a paragraph with little speech, and explain how the writer uses language to create effects. Use terminology.',
          'Paper 1: choose 4 or 5 paragraphs and explain how the writer has structured them and the effect on the reader.',
          'Paper 1: write a side of descriptive writing, then highlight and label every language feature you used.',
          'Paper 2: pick an article from the Guardian Comment is Free section. Summarise the writer\'s viewpoint, explain how their language influences the reader, and list the explicit and the implicit information.',
          'Ask your teacher for a past paper, do it at home under timed conditions, then go through it with your teacher.',
        ],
      },
      {
        title: 'English Literature',
        assessment: [
          'Paper 1: Shakespeare and the 19th-century novel.',
          'Paper 2: Modern texts and poetry.',
          'Know these texts really well: An Inspector Calls, the Conflict Poetry, Romeo and Juliet, and The Sign of Four.',
        ],
        mustDo: [
          'Spend 45 minutes re-reading one of your texts (plot, characters, key events).',
          'Draw a timeline of the key events in one of your texts.',
          'Memorise 5 key quotations from each text.',
          'Make a mind map of the context of each text.',
          'Spend 45 minutes reading a study guide for a set text and writing up notes on anything new.',
          'Spend 45 minutes self-quizzing with your knowledge organiser using Look–Cover–Write–Check.',
          'Make a mind map for each character.',
        ],
        extra: [
          'Write down everything you remember about a text, compare it with the knowledge organiser, and research the gaps.',
          'Analyse five key quotations: why they matter, their effect on readers, and the terminology.',
          'Build a list of subject terminology with definitions (e.g. simile).',
          'Make prompt cards from each knowledge organiser: topic on the front, information on the back.',
          'Memorise key quotations from 15 poems and your set texts.',
          'Spend 45 minutes on an essay: "Explain how [writer] presents the character of [character] in [text]."',
          'Or: "Explain how [writer] presents the theme of [theme] in [text]."',
          'Or: "Compare how [two poems] present the theme of conflict" (or power).',
        ],
      },
    ],
    links: [
      { label: 'Guardian — Comment is Free', url: 'https://www.theguardian.com/uk/commentisfree', note: 'Opinion articles for Paper 2 practice' },
    ],
    help: ['Your English teacher.', 'Study Plus (Tuesday–Thursday, 3.10–4.10pm, café).'],
  },
  {
    subjectId: 'computerscience',
    blocks: [{
      assessment: [
        'Paper 1 (50%): Computer Systems — 80 marks.',
        'Paper 2 (50%): Computational thinking, algorithms and programming — 80 marks. A big part of this paper tests your Python programming.',
      ],
      mustDo: [
        'Keep your Revision Plan up to date, so you know you have covered everything.',
        'Attempt a range of Advanced Questions on Smart Revise, and correct any you get wrong.',
        'Work on Python programming tasks using the Time 2 Code examples; ask your teacher for more when you finish.',
      ],
      extra: [
        'Mind map a whole topic from a blank page.',
        'Check it against the specification to find your weak areas.',
        'Practise past OCR exam papers.',
      ],
    }],
    links: [
      { label: 'Smart Revise', url: 'https://smartrevise.online', note: 'Log in with your school account' },
      { label: 'OCR J277 past papers', url: 'https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/assessment/' },
    ],
    help: ['Your Computer Science teacher.', 'After-school or lunchtime sessions can be arranged for specific problems.'],
  },
  {
    subjectId: 'spanish',
    blocks: [{
      assessment: ['Four skills, 25% each: Listening, Speaking, Reading and Writing, all at Foundation or Higher tier. See the exam card on the Spanish page for this year\'s paper details.'],
      mustDo: [
        'Revise for your weekly vocabulary quiz or homework sheet.',
        'Complete the weekly Language Gym activities.',
        'Learn your Speaking Booklet answers.',
        'Learn your Set Writing Expressions for the writing paper.',
      ],
      extra: [
        'Use the Language Gym game room for topics or grammar points you feel less confident with.',
        'Do timed writing tasks under exam conditions and give them to your teacher for feedback.',
        'Use Exam Practice Workbooks for topic-specific questions (the school recommends the CGP GCSE AQA Complete Revision and Practice guide).',
      ],
    }],
    links: [
      { label: 'Language Gym', url: 'https://www.language-gym.com', note: 'Log in with your school account' },
      { label: 'BBC Bitesize — GCSE Modern Foreign Languages', url: 'https://www.bbc.co.uk/bitesize/subjects/zhsvr82' },
    ],
    help: ['Your Spanish teacher.', 'Study and Revision sessions (see the club timetables).'],
  },
];

export function getSubjectResources(subjectId: string): SubjectResources | undefined {
  return subjectResources.find(r => r.subjectId === subjectId);
}

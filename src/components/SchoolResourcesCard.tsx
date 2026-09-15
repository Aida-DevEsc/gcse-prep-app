import { useState } from 'react';
import { getSubjectResources, generalAdvice, BOOKLET_SOURCE } from '../data/schoolResources';
import type { ResourceLink } from '../data/schoolResources';

type Tab = 'week' | 'extra' | 'links' | 'help' | 'revise';

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-slate-700">
          <span className="text-emerald-500 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Links({ links }: { links: ResourceLink[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {links.map(link => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-slate-200 rounded-lg p-3 hover:border-emerald-300 hover:bg-emerald-50 no-underline"
        >
          <p className="text-sm font-semibold text-slate-700">{link.label} ↗</p>
          {link.note && <p className="text-xs text-slate-500 mt-0.5">{link.note}</p>}
        </a>
      ))}
    </div>
  );
}

/** The school's revision booklet guidance for one subject, plus its general "how to revise" advice. */
export default function SchoolResourcesCard({ subjectId, subjectName }: { subjectId: string; subjectName: string }) {
  const resources = getSubjectResources(subjectId);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('week');
  if (!resources) return null;

  const multiBlock = resources.blocks.length > 1;
  const mustDoCount = resources.blocks.reduce((n, b) => n + (b.mustDo?.length || 0), 0);
  const tabs: { key: Tab; label: string }[] = [
    { key: 'week', label: '✅ Every week' },
    { key: 'extra', label: '➕ Extra' },
    { key: 'links', label: '🔗 Links' },
    { key: 'help', label: '🙋 Help' },
    { key: 'revise', label: '🧠 How to revise' },
  ];

  return (
    <div className="bg-white border border-emerald-200 rounded-xl mb-6 overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-emerald-50">
        <span className="min-w-0">
          <span className="text-sm font-semibold text-emerald-800 block">📚 School resources for {subjectName}</span>
          <span className="text-xs text-emerald-700/80 block truncate">
            {mustDoCount} weekly must-do{mustDoCount === 1 ? '' : 's'} · {resources.links.length} link{resources.links.length === 1 ? '' : 's'} · where to get help
          </span>
        </span>
        <span className="text-emerald-600 text-xs shrink-0">{open ? '▲ Hide' : '▼ Show'}</span>
      </button>

      {open && (
        <div className="p-4">
          <div className="flex flex-wrap gap-1 mb-4">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                  tab === t.key ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {(tab === 'week' || tab === 'extra') && (
            <div className="space-y-4">
              {resources.blocks.map((block, i) => {
                const items = tab === 'week' ? block.mustDo : block.extra;
                if (!items?.length) return null;
                return (
                  <div key={i}>
                    {multiBlock && block.title && <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{block.title}</h4>}
                    <List items={items} />
                  </div>
                );
              })}
              {tab === 'week' && resources.blocks.some(b => b.assessment?.length) && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-xs font-semibold text-slate-500">How the school describes the exams</summary>
                  <div className="mt-2 space-y-3">
                    {resources.blocks.map((block, i) => block.assessment?.length ? (
                      <div key={i}>
                        {multiBlock && block.title && <p className="text-xs font-semibold text-slate-500 mb-1">{block.title}</p>}
                        <List items={block.assessment} />
                      </div>
                    ) : null)}
                  </div>
                </details>
              )}
            </div>
          )}

          {tab === 'links' && <Links links={resources.links} />}

          {tab === 'help' && (
            <div className="space-y-3">
              <List items={resources.help} />
              <p className="text-xs text-slate-400">Staff contact details are in the school booklet and on Teams — they are not published here.</p>
            </div>
          )}

          {tab === 'revise' && (
            <div className="space-y-5 text-sm">
              <p className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-indigo-800">{generalAdvice.headline}</p>

              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Before you start</h4>
                <List items={generalAdvice.basics} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="border border-red-200 bg-red-50 rounded-lg p-3">
                  <p className="font-semibold text-red-700 mb-1">✗ Doesn't work well</p>
                  <p className="text-slate-700">{generalAdvice.notEffective.join(' · ')}</p>
                  <p className="text-xs text-slate-500 mt-1">{generalAdvice.notEffectiveWhy}</p>
                </div>
                <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-3">
                  <p className="font-semibold text-emerald-700 mb-1">✓ Works: practice testing</p>
                  <p className="text-slate-700">{generalAdvice.effective.join(' · ')}</p>
                  <p className="text-xs text-slate-500 mt-1">{generalAdvice.effectiveWhy}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Top revision tips</h4>
                <div className="space-y-1.5">
                  {generalAdvice.topTips.map(t => (
                    <p key={t.name} className="text-slate-700"><strong className="text-slate-800">{t.name}:</strong> {t.detail}</p>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Six strategies from The Learning Scientists</h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {generalAdvice.learningScientists.map((s, i) => (
                    <div key={s.name} className="bg-slate-50 rounded-lg p-2.5">
                      <p className="font-semibold text-slate-700">{i + 1}. {s.name}</p>
                      <p className="text-xs text-slate-500">{s.detail}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">In this app: flashcards and practice questions are retrieval practice, and the study plan spaces and interleaves your subjects.</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Planning your revision</h4>
                <List items={[generalAdvice.planning.termTime, generalAdvice.planning.holidays]} />
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-2">School support</h4>
                <List items={generalAdvice.schoolSupport} />
                <div className="mt-2"><Links links={generalAdvice.links} /></div>
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-4">Source: {BOOKLET_SOURCE}.</p>
        </div>
      )}
    </div>
  );
}

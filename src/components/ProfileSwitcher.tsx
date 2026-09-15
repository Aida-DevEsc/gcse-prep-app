import { useState, useRef, useEffect } from 'react';
import { useProfiles } from '../context/ProfileContext';

const AVATAR_CHOICES = ['🎓', '🦊', '🐼', '🦁', '🐨', '🦉', '🐯', '🚀', '⚡', '🌟', '🔥', '🎯'];

export default function ProfileSwitcher({ align = 'right' }: { align?: 'left' | 'right' }) {
  const { profiles, activeProfile, switchProfile, addProfile, renameProfile, removeProfile } = useProfiles();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(AVATAR_CHOICES[0]);
  const [newYear, setNewYear] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
        setEditingId(null);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) renameProfile(id, { name: editName.trim() });
    setEditingId(null);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    addProfile(newName.trim(), newAvatar, newYear.trim() || undefined);
    setNewName('');
    setNewYear('');
    setNewAvatar(AVATAR_CHOICES[0]);
    setCreating(false);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
      >
        <span className="text-xl leading-none">{activeProfile.avatar}</span>
        <span className="text-sm font-medium text-slate-700 hidden sm:inline max-w-[100px] truncate">{activeProfile.name}</span>
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden`}>
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Profiles</p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {profiles.map(p => (
              <div
                key={p.id}
                className={`flex items-center gap-2 px-3 py-2 hover:bg-slate-50 ${p.id === activeProfile.id ? 'bg-indigo-50' : ''}`}
              >
                {editingId === p.id ? (
                  <>
                    <span className="text-lg">{p.avatar}</span>
                    <input
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit(p.id)}
                      className="flex-1 text-sm border border-slate-300 rounded px-2 py-1 outline-none focus:border-indigo-400"
                    />
                    <button onClick={() => saveEdit(p.id)} className="text-emerald-600 text-xs font-semibold">Save</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { switchProfile(p.id); setOpen(false); }}
                      className="flex-1 flex items-center gap-2 text-left"
                    >
                      <span className="text-lg">{p.avatar}</span>
                      <span className="text-sm text-slate-700 truncate">{p.name}</span>
                      {p.yearGroup && <span className="text-[10px] text-slate-400">{p.yearGroup}</span>}
                      {p.id === activeProfile.id && <span className="ml-auto text-indigo-500 text-xs">✓</span>}
                    </button>
                    <button
                      onClick={() => startEdit(p.id, p.name)}
                      className="text-slate-300 hover:text-slate-500 p-1"
                      title="Rename"
                    >
                      ✏️
                    </button>
                    {profiles.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete profile "${p.name}"? This removes all its saved progress and cannot be undone.`)) {
                            removeProfile(p.id);
                          }
                        }}
                        className="text-slate-300 hover:text-red-500 p-1"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100">
            {creating ? (
              <div className="p-3 space-y-2">
                <input
                  autoFocus
                  placeholder="Name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 outline-none focus:border-indigo-400"
                />
                <input
                  placeholder="Year group (optional, e.g. Y10)"
                  value={newYear}
                  onChange={e => setNewYear(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded px-2 py-1.5 outline-none focus:border-indigo-400"
                />
                <div className="flex flex-wrap gap-1">
                  {AVATAR_CHOICES.map(a => (
                    <button
                      key={a}
                      onClick={() => setNewAvatar(a)}
                      className={`text-lg w-8 h-8 rounded-lg flex items-center justify-center ${
                        newAvatar === a ? 'bg-indigo-100 ring-2 ring-indigo-400' : 'hover:bg-slate-100'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className="flex-1 py-1.5 bg-indigo-600 text-white text-sm rounded-lg font-medium disabled:opacity-40"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setCreating(false)}
                    className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="w-full px-3 py-2.5 text-sm text-indigo-600 font-medium hover:bg-indigo-50 text-left"
              >
                + Add profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

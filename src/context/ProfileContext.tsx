import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Profile } from '../types';
import {
  ensureProfilesInitialised,
  createProfile as createProfileStorage,
  updateProfile as updateProfileStorage,
  deleteProfile as deleteProfileStorage,
  setActiveProfileId,
} from '../utils/storage';

interface ProfileContextType {
  profiles: Profile[];
  activeProfile: Profile;
  justMigrated: boolean;
  dismissMigrationNotice: () => void;
  switchProfile: (id: string) => void;
  addProfile: (name: string, avatar: string, yearGroup?: string) => void;
  renameProfile: (id: string, patch: Partial<Omit<Profile, 'id' | 'createdAt'>>) => void;
  removeProfile: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

function initOnce() {
  return ensureProfilesInitialised();
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [init] = useState(initOnce);
  const [justMigrated, setJustMigrated] = useState(init.migrated);
  const [profiles, setProfiles] = useState(init.profiles);
  const [activeId, setActiveId] = useState(init.activeId);

  const switchProfile = (id: string) => {
    setActiveProfileId(id);
    setActiveId(id);
  };

  const addProfile = (name: string, avatar: string, yearGroup?: string) => {
    const p = createProfileStorage(name, avatar, yearGroup);
    setProfiles(prev => [...prev, p]);
    setActiveProfileId(p.id);
    setActiveId(p.id);
  };

  const renameProfile = (id: string, patch: Partial<Omit<Profile, 'id' | 'createdAt'>>) => {
    updateProfileStorage(id, patch);
    setProfiles(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
  };

  const removeProfile = (id: string) => {
    deleteProfileStorage(id);
    const remaining = profiles.filter(p => p.id !== id);

    if (remaining.length === 0) {
      // Storage will lazily create a fresh default profile next time it's read.
      const fresh = ensureProfilesInitialised();
      setProfiles(fresh.profiles);
      setActiveId(fresh.activeId);
      return;
    }

    setProfiles(remaining);
    if (activeId === id) {
      switchProfile(remaining[0].id);
    }
  };

  const activeProfile = profiles.find(p => p.id === activeId) || profiles[0];
  if (!activeProfile) return null;

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        justMigrated,
        dismissMigrationNotice: () => setJustMigrated(false),
        switchProfile,
        addProfile,
        renameProfile,
        removeProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfiles() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfiles must be used within ProfileProvider');
  return ctx;
}

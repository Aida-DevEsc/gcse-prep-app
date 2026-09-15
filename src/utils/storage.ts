import type { UserState, Profile, StudyPlan } from '../types';

// Legacy single-user key (pre-profiles). Never deleted — kept as a safety-net backup.
const LEGACY_STATE_KEY = 'aceprep-gcse-state';

const PROFILES_KEY = 'aceprep-profiles';
const ACTIVE_PROFILE_KEY = 'aceprep-active-profile';
const stateKeyFor = (profileId: string) => `aceprep-gcse-state-${profileId}`;

export function getDefaultStudyPlan(): StudyPlan {
  return [
    { day: 'Mon', subjectId: null, minutes: 30 },
    { day: 'Tue', subjectId: null, minutes: 30 },
    { day: 'Wed', subjectId: null, minutes: 30 },
    { day: 'Thu', subjectId: null, minutes: 30 },
    { day: 'Fri', subjectId: null, minutes: 30 },
    { day: 'Sat', subjectId: null, minutes: 45 },
    { day: 'Sun', subjectId: null, minutes: 0 },
  ];
}

export function getDefaultState(): UserState {
  return {
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    topicProgress: {},
    checkpointResults: [],
    diagnosticResults: [],
    badges: getDefaultBadges(),
    dailyChallenges: {},
    savedVideos: {},
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    studyPlan: getDefaultStudyPlan(),
  };
}

// ---------- Per-profile state ----------

export function loadState(profileId: string): UserState {
  try {
    const saved = localStorage.getItem(stateKeyFor(profileId));
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...getDefaultState(), ...parsed, studyPlan: parsed.studyPlan?.length ? parsed.studyPlan : getDefaultStudyPlan() };
    }
  } catch { /* ignore */ }
  return getDefaultState();
}

export function saveState(profileId: string, state: UserState): void {
  try {
    localStorage.setItem(stateKeyFor(profileId), JSON.stringify(state));
  } catch { /* ignore */ }
}

// ---------- Profiles ----------

function makeProfileId(): string {
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadProfiles(): Profile[] {
  try {
    const saved = localStorage.getItem(PROFILES_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return [];
}

export function saveProfiles(profiles: Profile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch { /* ignore */ }
}

export function getActiveProfileId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
  } catch {
    return null;
  }
}

export function setActiveProfileId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  } catch { /* ignore */ }
}

/**
 * Ensures profiles exist. If this is the very first time profiles are being introduced
 * and legacy single-user progress exists, migrate it into a new profile so nothing is lost.
 * Safe to call multiple times — it's a no-op once profiles already exist.
 * Returns { profiles, activeId, migrated } so callers can show a one-time notice.
 */
export function ensureProfilesInitialised(): { profiles: Profile[]; activeId: string; migrated: boolean } {
  let profiles = loadProfiles();
  let migrated = false;

  if (profiles.length === 0) {
    const legacyRaw = (() => {
      try {
        return localStorage.getItem(LEGACY_STATE_KEY);
      } catch {
        return null;
      }
    })();

    const newProfile: Profile = {
      id: makeProfileId(),
      name: legacyRaw ? 'My Progress' : 'Player 1',
      avatar: '🎓',
      createdAt: new Date().toISOString(),
    };

    if (legacyRaw) {
      // Carry the existing single-user progress over untouched.
      try {
        localStorage.setItem(stateKeyFor(newProfile.id), legacyRaw);
        migrated = true;
      } catch { /* ignore */ }
    }

    profiles = [newProfile];
    saveProfiles(profiles);
    setActiveProfileId(newProfile.id);
    return { profiles, activeId: newProfile.id, migrated };
  }

  let activeId = getActiveProfileId();
  if (!activeId || !profiles.some(p => p.id === activeId)) {
    activeId = profiles[0].id;
    setActiveProfileId(activeId);
  }

  return { profiles, activeId, migrated: false };
}

export function createProfile(name: string, avatar: string, yearGroup?: string): Profile {
  const profiles = loadProfiles();
  const profile: Profile = {
    id: makeProfileId(),
    name: name.trim() || `Profile ${profiles.length + 1}`,
    avatar,
    yearGroup,
    createdAt: new Date().toISOString(),
  };
  saveProfiles([...profiles, profile]);
  return profile;
}

export function updateProfile(id: string, patch: Partial<Omit<Profile, 'id' | 'createdAt'>>): void {
  const profiles = loadProfiles().map(p => (p.id === id ? { ...p, ...patch } : p));
  saveProfiles(profiles);
}

export function deleteProfile(id: string): void {
  const profiles = loadProfiles().filter(p => p.id !== id);
  saveProfiles(profiles);
  try {
    localStorage.removeItem(stateKeyFor(id));
  } catch { /* ignore */ }
}

function getDefaultBadges() {
  return [
    { id: 'first-steps', name: 'First Steps', description: 'Complete your first topic', icon: '👣', earned: false },
    { id: 'quiz-whiz', name: 'Quiz Whiz', description: 'Answer 50 questions correctly', icon: '🧠', earned: false },
    { id: 'streak-3', name: 'On a Roll', description: '3-day streak', icon: '🔥', earned: false },
    { id: 'streak-7', name: 'Streak Star', description: '7-day streak', icon: '⭐', earned: false },
    { id: 'streak-30', name: 'Daily Devotion', description: '30-day streak', icon: '💎', earned: false },
    { id: 'checkpoint-90', name: 'Checkpoint Champion', description: 'Score 90%+ on a checkpoint', icon: '🏆', earned: false },
    { id: 'subject-master', name: 'Subject Master', description: '100% mastery in any subject', icon: '👑', earned: false },
    { id: 'science-triple', name: 'Science Triple Threat', description: 'Complete all three sciences', icon: '🔬', earned: false },
    { id: 'daily-10', name: 'Challenge Accepted', description: 'Complete 10 daily challenges', icon: '🎯', earned: false },
    { id: 'xp-1000', name: 'XP Hunter', description: 'Earn 1000 XP', icon: '💰', earned: false },
    { id: 'xp-5000', name: 'XP Master', description: 'Earn 5000 XP', icon: '🌟', earned: false },
    { id: 'perfect-quiz', name: 'Perfect Score', description: 'Get 100% on any quiz', icon: '💯', earned: false },
    { id: 'flashcard-fan', name: 'Flashcard Fan', description: 'Review 100 flashcards', icon: '📇', earned: false },
    { id: 'video-scholar', name: 'Video Scholar', description: 'Write 10 video summaries', icon: '🎬', earned: false },
    { id: 'all-diagnostics', name: 'Fully Diagnosed', description: 'Complete all 6 diagnostic tests', icon: '🩺', earned: false },
    { id: 'level-10', name: 'Level 10', description: 'Reach level 10', icon: '🎖️', earned: false },
    { id: 'level-25', name: 'Level 25', description: 'Reach level 25', icon: '🏅', earned: false },
  ];
}

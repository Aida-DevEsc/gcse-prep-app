import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { UserState, TopicProgress, CheckpointResult, DiagnosticResult, Badge, YouTubeVideo, StudyPlan, StudyPlanDay, PastPaperAttempt } from '../types';
import { loadState, saveState } from '../utils/storage';
import { calculateLevel, XP_REWARDS } from '../utils/xp';

type Action =
  | { type: 'ADD_XP'; amount: number }
  | { type: 'UPDATE_STREAK' }
  | { type: 'SET_TOPIC_PROGRESS'; topicId: string; progress: Partial<TopicProgress> }
  | { type: 'ADD_CHECKPOINT_RESULT'; result: CheckpointResult }
  | { type: 'ADD_DIAGNOSTIC_RESULT'; result: DiagnosticResult }
  | { type: 'EARN_BADGE'; badgeId: string }
  | { type: 'ANSWER_DAILY_CHALLENGE'; date: string; correct: boolean; questionId: string }
  | { type: 'SAVE_VIDEO'; topicId: string; video: YouTubeVideo }
  | { type: 'REMOVE_VIDEO'; topicId: string; videoId: string }
  | { type: 'SAVE_VIDEO_SUMMARY'; topicId: string; videoId: string; summary: string }
  | { type: 'ANSWER_QUESTION'; correct: boolean }
  | { type: 'SET_STUDY_PLAN'; plan: StudyPlan }
  | { type: 'UPDATE_STUDY_PLAN_DAY'; day: StudyPlanDay['day']; patch: Partial<StudyPlanDay> }
  | { type: 'ADD_PAST_PAPER_ATTEMPT'; attempt: PastPaperAttempt }
  | { type: 'DELETE_PAST_PAPER_ATTEMPT'; id: string }
  | { type: 'RESET_STATE'; profileId: string };

function reducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case 'ADD_XP': {
      const newXp = state.xp + action.amount;
      return { ...state, xp: newXp, level: calculateLevel(newXp) };
    }
    case 'UPDATE_STREAK': {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let newStreak = state.currentStreak;
      if (state.lastActiveDate === today) return state;
      if (state.lastActiveDate === yesterday) {
        newStreak = state.currentStreak + 1;
      } else if (state.lastActiveDate !== today) {
        newStreak = 1;
      }
      return {
        ...state,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, state.longestStreak),
        lastActiveDate: today,
      };
    }
    case 'SET_TOPIC_PROGRESS': {
      const existing = state.topicProgress[action.topicId] || {
        topicId: action.topicId,
        questionsAttempted: 0,
        questionsCorrect: 0,
        masteryPercent: 0,
        flashcardsReviewed: false,
        explanationRead: false,
        videoSummaries: {},
        lastAttempted: '',
      };
      const updated = { ...existing, ...action.progress, lastAttempted: new Date().toISOString() };
      if (updated.questionsAttempted > 0) {
        updated.masteryPercent = Math.round((updated.questionsCorrect / updated.questionsAttempted) * 100);
      }
      return {
        ...state,
        topicProgress: { ...state.topicProgress, [action.topicId]: updated },
      };
    }
    case 'ADD_CHECKPOINT_RESULT':
      return { ...state, checkpointResults: [...state.checkpointResults, action.result] };
    case 'ADD_DIAGNOSTIC_RESULT': {
      // Diagnostics can be taken one exam paper at a time, so merge each new section's topic
      // scores into the subject's existing record (a retaken topic replaces its old score).
      const existing = state.diagnosticResults.find(r => r.subjectId === action.result.subjectId);
      const others = state.diagnosticResults.filter(r => r.subjectId !== action.result.subjectId);
      const topicScores = { ...(existing?.topicScores || {}), ...action.result.topicScores };
      const entries = Object.entries(topicScores);
      const correct = entries.reduce((sum, [, s]) => sum + s.correct, 0);
      const total = entries.reduce((sum, [, s]) => sum + s.total, 0);
      const merged: DiagnosticResult = {
        subjectId: action.result.subjectId,
        date: action.result.date,
        score: total > 0 ? Math.round((correct / total) * 100) : 0,
        totalQuestions: total,
        topicScores,
        weakTopics: entries.filter(([, s]) => s.correct / s.total < 1).map(([id]) => id),
        strongTopics: entries.filter(([, s]) => s.correct === s.total).map(([id]) => id),
        sectionsCompleted: Array.from(new Set([...(existing?.sectionsCompleted || []), ...(action.result.sectionsCompleted || [])])),
      };
      return { ...state, diagnosticResults: [...others, merged] };
    }
    case 'EARN_BADGE':
      return {
        ...state,
        badges: state.badges.map((b: Badge) =>
          b.id === action.badgeId ? { ...b, earned: true, earnedDate: new Date().toISOString() } : b
        ),
      };
    case 'ANSWER_DAILY_CHALLENGE': {
      const xpGain = XP_REWARDS.DAILY_CHALLENGE + (action.correct ? XP_REWARDS.DAILY_CHALLENGE_CORRECT : 0);
      const newXp = state.xp + xpGain;
      return {
        ...state,
        xp: newXp,
        level: calculateLevel(newXp),
        dailyChallenges: {
          ...state.dailyChallenges,
          [action.date]: {
            date: action.date,
            question: { id: action.questionId } as any,
            answered: true,
            correct: action.correct,
          },
        },
      };
    }
    case 'SAVE_VIDEO': {
      const existing2 = state.savedVideos[action.topicId] || [];
      if (existing2.some(v => v.videoId === action.video.videoId)) return state;
      return {
        ...state,
        savedVideos: { ...state.savedVideos, [action.topicId]: [...existing2, action.video] },
      };
    }
    case 'REMOVE_VIDEO': {
      const vids = (state.savedVideos[action.topicId] || []).filter(v => v.videoId !== action.videoId);
      return {
        ...state,
        savedVideos: { ...state.savedVideos, [action.topicId]: vids },
      };
    }
    case 'SAVE_VIDEO_SUMMARY': {
      const tp = state.topicProgress[action.topicId] || {
        topicId: action.topicId, questionsAttempted: 0, questionsCorrect: 0,
        masteryPercent: 0, flashcardsReviewed: false, explanationRead: false,
        videoSummaries: {}, lastAttempted: '',
      };
      return {
        ...state,
        topicProgress: {
          ...state.topicProgress,
          [action.topicId]: {
            ...tp,
            videoSummaries: { ...tp.videoSummaries, [action.videoId]: action.summary },
          },
        },
      };
    }
    case 'ANSWER_QUESTION':
      return {
        ...state,
        totalQuestionsAnswered: state.totalQuestionsAnswered + 1,
        totalCorrectAnswers: state.totalCorrectAnswers + (action.correct ? 1 : 0),
      };
    case 'SET_STUDY_PLAN':
      return { ...state, studyPlan: action.plan, studyPlanUpdatedAt: new Date().toISOString() };
    case 'UPDATE_STUDY_PLAN_DAY':
      return {
        ...state,
        studyPlan: state.studyPlan.map(d => (d.day === action.day ? { ...d, ...action.patch } : d)),
        studyPlanUpdatedAt: new Date().toISOString(),
      };
    case 'ADD_PAST_PAPER_ATTEMPT': {
      const newXp = state.xp + XP_REWARDS.PAST_PAPER_MARKED;
      return {
        ...state,
        xp: newXp,
        level: calculateLevel(newXp),
        pastPaperAttempts: [...state.pastPaperAttempts, action.attempt],
      };
    }
    case 'DELETE_PAST_PAPER_ATTEMPT':
      return { ...state, pastPaperAttempts: state.pastPaperAttempts.filter(a => a.id !== action.id) };
    case 'RESET_STATE':
      return loadState(action.profileId);
    default:
      return state;
  }
}

interface AppContextType {
  state: UserState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

/**
 * Holds the currently active profile's progress. Mount this with `key={profileId}`
 * from the parent so switching profiles cleanly resets to that profile's own state.
 */
export function AppProvider({ profileId, children }: { profileId: string; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, profileId, loadState);

  useEffect(() => {
    saveState(profileId, state);
  }, [profileId, state]);

  useEffect(() => {
    dispatch({ type: 'UPDATE_STREAK' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

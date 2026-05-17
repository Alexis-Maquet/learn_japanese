import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrainingSession } from '@/types';

export interface KanjiStat {
  seen: number;
  correct: number;
  lastSeen: number;
}

export interface SessionRecord {
  id: string;
  date: number;
  listName: string;
  listIds: string[];
  score: number;
  total: number;
  durationMs: number;
}

interface StatsStore {
  kanjiStats: Record<string, KanjiStat>;
  sessions: SessionRecord[];
  recordSession: (session: TrainingSession) => void;
  clearStats: () => void;
}

export const useStatsStore = create<StatsStore>()(
  persist(
    (set) => ({
      kanjiStats: {},
      sessions: [],

      recordSession: (session) => {
        const now = Date.now();
        set((state) => {
          const kanjiStats = { ...state.kanjiStats };

          for (const card of session.cards) {
            if (!card.answered) continue;
            const prev = kanjiStats[card.kanji] ?? { seen: 0, correct: 0, lastSeen: 0 };
            kanjiStats[card.kanji] = {
              seen: prev.seen + 1,
              correct: prev.correct + (card.correct ? 1 : 0),
              lastSeen: now,
            };
          }

          const record: SessionRecord = {
            id: session.id,
            date: session.startedAt,
            listName: session.listName,
            listIds: session.listIds,
            score: session.cards.filter((c) => c.correct).length,
            total: session.cards.length,
            durationMs: (session.completedAt ?? now) - session.startedAt,
          };

          return {
            kanjiStats,
            sessions: [record, ...state.sessions].slice(0, 200),
          };
        });
      },

      clearStats: () => set({ kanjiStats: {}, sessions: [] }),
    }),
    { name: 'kanji-training-stats' }
  )
);

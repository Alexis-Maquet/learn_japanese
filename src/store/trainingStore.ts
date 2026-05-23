import { create } from 'zustand';
import type { TrainingSession, TrainingCard, KanjiDetails } from '@/types';
import { logger } from '@/utils/logger';

const PAUSED_KEY = 'training_paused_session';

interface TrainingStore {
  session: TrainingSession | null;
  startSession: (listIds: string[], listName: string, kanjis: KanjiDetails[]) => void;
  answerCard: (correct: boolean, selectedAnswer?: string) => void;
  nextCard: () => void;
  prevCard: () => void;
  pauseSession: () => void;
  resumePausedSession: () => boolean;
  endSession: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const useTrainingStore = create<TrainingStore>((set, get) => ({
  session: null,

  pauseSession: () => {
    const { session } = get();
    if (session) {
      localStorage.setItem(PAUSED_KEY, JSON.stringify(session));
      logger.info('trainingStore', `Session mise en pause : "${session.listName}"`, { sessionId: session.id });
      set({ session: null });
    }
  },

  resumePausedSession: () => {
    const raw = localStorage.getItem(PAUSED_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw) as TrainingSession;
    localStorage.removeItem(PAUSED_KEY);
    logger.info('trainingStore', `Session reprise : "${session.listName}"`, { sessionId: session.id });
    set({ session });
    return true;
  },

  startSession: (listIds, listName, kanjis) => {
    localStorage.removeItem(PAUSED_KEY);
    const cards: TrainingCard[] = shuffle(kanjis).map((d) => ({
      kanji: d.kanji,
      details: d,
      answered: false,
      correct: null,
    }));

    const session: TrainingSession = {
      id: crypto.randomUUID(),
      listIds,
      listName,
      cards,
      currentIndex: 0,
      startedAt: Date.now(),
    };

    logger.info('trainingStore', `Session démarrée : "${listName}"`, {
      sessionId: session.id,
      cardCount: cards.length,
    });

    set({ session });
  },

  answerCard: (correct, selectedAnswer) => {
    const { session } = get();
    if (session) {
      const card = session.cards[session.currentIndex];
      logger.debug('trainingStore', `Réponse [${correct ? 'correcte' : 'incorrecte'}]`, {
        kanji: card.kanji,
        selectedAnswer,
      });
    }
    set((s) => {
      if (!s.session) return s;
      const cards = [...s.session.cards];
      cards[s.session.currentIndex] = { ...cards[s.session.currentIndex], answered: true, correct, selectedAnswer };
      return { session: { ...s.session, cards } };
    });
  },

  nextCard: () => {
    const { session } = get();
    set((s) => {
      if (!s.session) return s;
      const next = s.session.currentIndex + 1;
      if (next >= s.session.cards.length) {
        return { session: { ...s.session, completedAt: Date.now(), currentIndex: next } };
      }
      return { session: { ...s.session, currentIndex: next } };
    });
    if (session) {
      const next = session.currentIndex + 1;
      if (next >= session.cards.length) {
        const correct = session.cards.filter((c) => c.correct).length;
        logger.info('trainingStore', `Session terminée : "${session.listName}"`, {
          sessionId: session.id,
          score: `${correct}/${session.cards.length}`,
          durationMs: Date.now() - session.startedAt,
        });
      }
    }
  },

  prevCard: () =>
    set((s) => {
      if (!s.session) return s;
      return { session: { ...s.session, currentIndex: Math.max(0, s.session.currentIndex - 1) } };
    }),

  endSession: () => {
    const { session } = get();
    if (session) logger.info('trainingStore', `Session abandonnée : "${session.listName}"`, { sessionId: session.id });
    localStorage.removeItem(PAUSED_KEY);
    set({ session: null });
  },
}));

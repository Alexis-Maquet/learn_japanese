import { create } from 'zustand';
import type { TrainingSession, TrainingCard, TrainingMode, ReadingType, KanjiDetails } from '../types';
import { toRomaji } from '../utils/romaji';
import { logger } from '../utils/logger';

interface TrainingStore {
  session: TrainingSession | null;
  startSession: (listId: string, listName: string, kanjis: KanjiDetails[], mode: TrainingMode, readingType: ReadingType) => void;
  answerCard: (correct: boolean, selectedAnswer?: string) => void;
  nextCard: () => void;
  prevCard: () => void;
  endSession: () => void;
  generateChoices: (card: TrainingCard) => string[];
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

  startSession: (listId, listName, kanjis, mode, readingType) => {
    const cards: TrainingCard[] = shuffle(kanjis).map((d) => ({
      kanji: d.kanji,
      details: d,
      answered: false,
      correct: null,
    }));

    const session = {
      id: crypto.randomUUID(),
      listId,
      listName,
      mode,
      readingType,
      cards,
      currentIndex: 0,
      startedAt: Date.now(),
    };

    logger.info('trainingStore', `Session démarrée : "${listName}"`, {
      sessionId: session.id,
      mode,
      readingType,
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
    set({ session: null });
  },

  generateChoices: (card) => {
    const { session } = get();
    if (!session) return [];

    const readings = session.readingType === 'on' ? card.details.on_readings : card.details.kun_readings;
    const correctReading = readings[0];
    if (!correctReading) return [];

    const correct = toRomaji(correctReading);

    const allCards = session.cards.filter((c) => c.kanji !== card.kanji);
    const distractors = shuffle(allCards)
      .slice(0, 10)
      .flatMap((c) => {
        const r = session.readingType === 'on' ? c.details.on_readings : c.details.kun_readings;
        return r.slice(0, 1);
      })
      .map((r) => toRomaji(r))
      .filter((r) => r && r !== correct);

    const unique = Array.from(new Set(distractors)).slice(0, 3);
    while (unique.length < 3) unique.push('---');

    return shuffle([correct, ...unique]);
  },
}));

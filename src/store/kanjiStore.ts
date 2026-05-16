import { create } from 'zustand';
import type { KanjiDetails, FilterState } from '../types';
import { fetchKanjiByJlpt, fetchKanjiDetails } from '../utils/api';
import { logger } from '../utils/logger';

interface KanjiStore {
  kanjiByLevel: Record<string, string[]>;
  details: Record<string, KanjiDetails>;
  loading: boolean;
  error: string | null;
  filters: FilterState;
  currentPage: number;

  loadKanjiForLevel: (level: string) => Promise<void>;
  loadAllLevels: () => Promise<void>;
  loadDetails: (kanji: string) => Promise<KanjiDetails>;
  setFilters: (filters: Partial<FilterState>) => void;
  setPage: (page: number) => void;
  getFilteredKanji: () => string[];
}

export const useKanjiStore = create<KanjiStore>((set, get) => ({
  kanjiByLevel: {},
  details: {},
  loading: false,
  error: null,
  filters: { jlpt: [], domains: [], search: '' },
  currentPage: 1,

  loadKanjiForLevel: async (level) => {
    const { kanjiByLevel } = get();
    if (kanjiByLevel[level]) return;
    try {
      const kanjis = await fetchKanjiByJlpt(level);
      logger.info('kanjiStore', `Kanjis chargés pour ${level}`, { count: kanjis.length });
      set((s) => ({ kanjiByLevel: { ...s.kanjiByLevel, [level]: kanjis } }));
    } catch (e) {
      logger.error('kanjiStore', `Échec chargement kanjis ${level}`, e);
      set({ error: `Impossible de charger les kanjis ${level}` });
    }
  },

  loadAllLevels: async () => {
    logger.info('kanjiStore', 'Chargement de tous les niveaux JLPT');
    set({ loading: true, error: null });
    try {
      await Promise.all(['N5', 'N4', 'N3', 'N2', 'N1'].map((l) => get().loadKanjiForLevel(l)));
      logger.info('kanjiStore', 'Tous les niveaux chargés');
    } finally {
      set({ loading: false });
    }
  },

  loadDetails: async (kanji) => {
    const { details } = get();
    if (details[kanji]) return details[kanji];
    logger.debug('kanjiStore', `Chargement détails pour ${kanji}`);
    const d = await fetchKanjiDetails(kanji);
    set((s) => ({ details: { ...s.details, [kanji]: d } }));
    return d;
  },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters }, currentPage: 1 })),

  setPage: (page) => set({ currentPage: page }),

  getFilteredKanji: () => {
    const { kanjiByLevel, filters } = get();

    const levelsToShow = filters.jlpt.length > 0 ? filters.jlpt : ['N5', 'N4', 'N3', 'N2', 'N1'];
    const seen = new Set<string>();
    const result: string[] = [];

    for (const level of levelsToShow) {
      for (const k of kanjiByLevel[level] ?? []) {
        if (!seen.has(k)) {
          seen.add(k);
          result.push(k);
        }
      }
    }

    if (filters.search) {
      const s = filters.search.trim();
      return result.filter((k) => k === s || k.includes(s));
    }

    return result;
  },
}));

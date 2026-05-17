import { create } from 'zustand';
import type { KanjiDetails, KanjiWord, FilterState } from '@/types';
import { fetchKanjiByJlpt, fetchKanjiNoJlpt, fetchKanjiByFrequency, fetchKanjiDetails, fetchKanjiWords, searchKanjiInDb } from '@/utils/api';
import { logger } from '@/utils/logger';

const FREQUENCY_GROUPS: Record<string, number> = {
  top100: 100,
  top500: 500,
  top1000: 1000,
  top2000: 2000,
};

interface KanjiStore {
  kanjiByLevel: Record<string, string[]>;
  kanjiByFrequency: Record<string, string[]>;
  details: Record<string, KanjiDetails>;
  kanjiWords: Record<string, KanjiWord[]>;
  loading: boolean;
  error: string | null;
  filters: FilterState;
  currentPage: number;

  loadKanjiForLevel: (level: string) => Promise<void>;
  loadAllLevels: () => Promise<void>;
  loadFrequencyGroups: () => Promise<void>;
  loadDetails: (kanji: string) => Promise<KanjiDetails>;
  loadWords: (kanji: string) => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  setPage: (page: number) => void;
  getFilteredKanji: () => string[];
}

export const useKanjiStore = create<KanjiStore>((set, get) => ({
  kanjiByLevel: {},
  kanjiByFrequency: {},
  details: {},
  kanjiWords: {},
  loading: false,
  error: null,
  filters: { jlpt: [], domains: [], search: '', lists: [] },
  currentPage: 1,

  loadKanjiForLevel: async (level) => {
    const { kanjiByLevel } = get();
    if (kanjiByLevel[level]) return;
    try {
      const kanjis = level === 'none'
        ? await fetchKanjiNoJlpt()
        : await fetchKanjiByJlpt(level);
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
      await Promise.all(['N5', 'N4', 'N3', 'N2', 'N1', 'none'].map((l) => get().loadKanjiForLevel(l)));
      logger.info('kanjiStore', 'Tous les niveaux chargés');
    } finally {
      set({ loading: false });
    }
  },

  loadFrequencyGroups: async () => {
    const { kanjiByFrequency } = get();
    const missing = Object.keys(FREQUENCY_GROUPS).filter((k) => !kanjiByFrequency[k]);
    if (missing.length === 0) return;
    logger.info('kanjiStore', 'Chargement des groupes de fréquence');
    try {
      await Promise.all(
        missing.map(async (key) => {
          const kanjis = await fetchKanjiByFrequency(FREQUENCY_GROUPS[key]);
          set((s) => ({ kanjiByFrequency: { ...s.kanjiByFrequency, [key]: kanjis } }));
        })
      );
      logger.info('kanjiStore', 'Groupes de fréquence chargés');
    } catch (e) {
      logger.error('kanjiStore', 'Échec chargement groupes de fréquence', e);
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

  loadWords: async (kanji) => {
    const { kanjiWords } = get();
    if (kanjiWords[kanji]) return;
    const words = await fetchKanjiWords(kanji);
    set((s) => ({ kanjiWords: { ...s.kanjiWords, [kanji]: words } }));
  },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters }, currentPage: 1 })),

  setPage: (page) => set({ currentPage: page }),

  getFilteredKanji: () => {
    const { kanjiByLevel, filters } = get();

    const levelsToShow = filters.jlpt.length > 0 ? filters.jlpt : ['N5', 'N4', 'N3', 'N2', 'N1'];
    const seen = new Set<string>();
    const pool: string[] = [];

    for (const level of levelsToShow) {
      for (const k of kanjiByLevel[level] ?? []) {
        if (!seen.has(k)) { seen.add(k); pool.push(k); }
      }
    }

    if (!filters.search.trim()) return pool;

    const matches = searchKanjiInDb(filters.search.trim());
    return pool.filter((k) => matches.has(k));
  },
}));

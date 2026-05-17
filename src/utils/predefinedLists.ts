import type { KanjiList } from '@/types';

export interface PredefinedListConfig {
  id: string;
  name: string;
  description: string;
  type: 'jlpt' | 'frequency';
  color: string;
  badge: string;
}

export const JLPT_PREDEFINED: PredefinedListConfig[] = [
  { id: 'jlpt-N5', name: 'JLPT N5', description: 'Les kanjis essentiels du niveau débutant', type: 'jlpt', color: 'border-green-500 text-green-400', badge: 'N5' },
  { id: 'jlpt-N4', name: 'JLPT N4', description: 'Kanjis élémentaires pour la vie quotidienne', type: 'jlpt', color: 'border-blue-500 text-blue-400', badge: 'N4' },
  { id: 'jlpt-N3', name: 'JLPT N3', description: 'Niveau intermédiaire, textes courants', type: 'jlpt', color: 'border-yellow-500 text-yellow-400', badge: 'N3' },
  { id: 'jlpt-N2', name: 'JLPT N2', description: 'Niveau avancé, journaux et littérature', type: 'jlpt', color: 'border-orange-500 text-orange-400', badge: 'N2' },
  { id: 'jlpt-N1', name: 'JLPT N1', description: 'Niveau expert, textes complexes', type: 'jlpt', color: 'border-red-500 text-red-400', badge: 'N1' },
];

export const FREQ_PREDEFINED: PredefinedListConfig[] = [
  { id: 'freq-100', name: 'Top 100', description: 'Les 100 kanjis les plus fréquents (presse)', type: 'frequency', color: 'border-amber-400 text-amber-300', badge: '🔥' },
  { id: 'freq-500', name: 'Top 500', description: 'Les 500 kanjis les plus fréquents', type: 'frequency', color: 'border-amber-500 text-amber-400', badge: '⚡' },
  { id: 'freq-1000', name: 'Top 1 000', description: 'Les 1 000 kanjis les plus fréquents', type: 'frequency', color: 'border-amber-600 text-amber-500', badge: '📰' },
  { id: 'freq-2000', name: 'Top 2 000', description: 'Les 2 000 kanjis les plus fréquents', type: 'frequency', color: 'border-amber-700 text-amber-600', badge: '📚' },
];

export const ALL_PREDEFINED = [...JLPT_PREDEFINED, ...FREQ_PREDEFINED];

const JLPT_KEY_MAP: Record<string, string> = {
  'jlpt-N5': 'N5', 'jlpt-N4': 'N4', 'jlpt-N3': 'N3', 'jlpt-N2': 'N2', 'jlpt-N1': 'N1',
};

const FREQ_KEY_MAP: Record<string, string> = {
  'freq-100': 'top100', 'freq-500': 'top500', 'freq-1000': 'top1000', 'freq-2000': 'top2000',
};

export function resolvePredefinedKanjis(
  id: string,
  kanjiByLevel: Record<string, string[]>,
  kanjiByFrequency: Record<string, string[]>,
): string[] | null {
  const level = JLPT_KEY_MAP[id];
  if (level) return kanjiByLevel[level] ?? null;

  const freqKey = FREQ_KEY_MAP[id];
  if (freqKey) return kanjiByFrequency[freqKey] ?? null;

  return null;
}

export function isPredefinedId(id: string): boolean {
  return ALL_PREDEFINED.some((c) => c.id === id);
}

export function buildPredefinedList(id: string, kanjis: string[]): KanjiList {
  const config = ALL_PREDEFINED.find((c) => c.id === id)!;
  return {
    id,
    name: config.name,
    description: config.description,
    kanjis,
    createdAt: 0,
    updatedAt: 0,
  };
}

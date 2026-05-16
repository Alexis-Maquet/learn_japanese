export interface KanjiDetails {
  kanji: string;
  grade: number | null;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  jlpt: number | null;
  unicode: string;
  heisig_en: string;
}

export interface KanjiEntry {
  character: string;
  jlpt: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | null;
  details?: KanjiDetails;
  domains?: string[];
}

export interface KanjiList {
  id: string;
  name: string;
  description: string;
  kanjis: string[];
  createdAt: number;
  updatedAt: number;
}

export type TrainingMode = 'flashcard' | 'multiple-choice' | 'writing';

export type ReadingType = 'on' | 'kun';

export interface TrainingCard {
  kanji: string;
  details: KanjiDetails;
  answered: boolean;
  correct: boolean | null;
  selectedAnswer?: string;
}

export interface TrainingSession {
  id: string;
  listId: string;
  listName: string;
  mode: TrainingMode;
  readingType: ReadingType;
  cards: TrainingCard[];
  currentIndex: number;
  startedAt: number;
  completedAt?: number;
}

export interface FilterState {
  jlpt: string[];
  domains: string[];
  search: string;
}

export const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;

export const DOMAINS = [
  'Nombres',
  'Nature',
  'Corps humain',
  'Famille & Personnes',
  'Animaux',
  'Nourriture & Boissons',
  'Lieux & Bâtiments',
  'Temps & Saisons',
  'Couleurs',
  'Transport',
  'Éducation & Langue',
  'Travail & Commerce',
  'Émotions & État',
  'Actions & Mouvements',
] as const;

export type Domain = (typeof DOMAINS)[number];

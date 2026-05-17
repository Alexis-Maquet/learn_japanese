import type { KanjiDetails, KanjiWord } from '@/types';
import { logger } from '@/utils/logger';

interface KanjiApiEntry {
  kanji: string;
  grade: number | null;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  jlpt: number | null;
  unicode: string;
  heisig_en: string | null;
  freq_mainichi_shinbun: number | null;
}

interface KanjiApiData {
  kanjis: Record<string, KanjiApiEntry>;
}

let dbPromise: Promise<KanjiApiData> | null = null;
let dbCache: KanjiApiData | null = null;

function loadDb(): Promise<KanjiApiData> {
  if (!dbPromise) {
    logger.info('api', 'Chargement de kanjiapi_full.json');
    dbPromise = fetch(`${import.meta.env.BASE_URL}kanjiapi_full.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Impossible de charger kanjiapi_full.json: ${res.status}`);
        return res.json() as Promise<KanjiApiData>;
      })
      .then((data) => {
        dbCache = data;
        logger.info('api', 'kanjiapi_full.json chargé', { count: Object.keys(data.kanjis).length });
        return data;
      });
  }
  return dbPromise;
}

export function searchKanjiInDb(query: string): Set<string> {
  if (!dbCache) return new Set();
  const q = query.toLowerCase();
  const result = new Set<string>();
  for (const entry of Object.values(dbCache.kanjis)) {
    if (
      entry.kanji.includes(query) ||
      entry.meanings.some((m) => m.toLowerCase().includes(q))
    ) {
      result.add(entry.kanji);
    }
  }
  return result;
}

function toKanjiDetails(entry: KanjiApiEntry): KanjiDetails {
  return {
    kanji: entry.kanji,
    grade: entry.grade,
    stroke_count: entry.stroke_count,
    meanings: entry.meanings,
    kun_readings: entry.kun_readings,
    on_readings: entry.on_readings,
    name_readings: entry.name_readings,
    jlpt: entry.jlpt,
    unicode: entry.unicode,
    heisig_en: entry.heisig_en ?? '',
    freq_mainichi_shinbun: entry.freq_mainichi_shinbun ?? null,
  };
}

export async function fetchKanjiByJlpt(level: string): Promise<string[]> {
  const db = await loadDb();
  const num = parseInt(level.replace(/[^0-9]/g, ''), 10);
  return Object.values(db.kanjis)
    .filter((e) => e.jlpt === num)
    .map((e) => e.kanji);
}

export async function fetchKanjiNoJlpt(): Promise<string[]> {
  const db = await loadDb();
  return Object.values(db.kanjis)
    .filter((e) => e.jlpt === null)
    .map((e) => e.kanji);
}

export async function fetchKanjiDetails(kanji: string): Promise<KanjiDetails> {
  const db = await loadDb();
  const entry = db.kanjis[kanji];
  if (!entry) throw new Error(`Kanji introuvable: ${kanji}`);
  return toKanjiDetails(entry);
}

export async function fetchJoyoKanji(): Promise<string[]> {
  const db = await loadDb();
  return Object.values(db.kanjis)
    .filter((e) => e.grade !== null)
    .map((e) => e.kanji);
}

export async function fetchKanjiByFrequency(maxRank: number): Promise<string[]> {
  const db = await loadDb();
  return Object.values(db.kanjis)
    .filter((e) => e.freq_mainichi_shinbun !== null && e.freq_mainichi_shinbun <= maxRank)
    .sort((a, b) => (a.freq_mainichi_shinbun ?? 0) - (b.freq_mainichi_shinbun ?? 0))
    .map((e) => e.kanji);
}

interface WordEntry { w: string; r: string; m: string }
interface WordsData { [kanji: string]: WordEntry[] }

let wordsDbPromise: Promise<WordsData> | null = null;

function loadWordsDb(): Promise<WordsData> {
  if (!wordsDbPromise) {
    wordsDbPromise = fetch(`${import.meta.env.BASE_URL}kanji_words.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Impossible de charger kanji_words.json: ${res.status}`);
        return res.json() as Promise<WordsData>;
      });
  }
  return wordsDbPromise;
}

export async function fetchKanjiWords(kanji: string): Promise<KanjiWord[]> {
  const db = await loadWordsDb();
  return (db[kanji] ?? []).map((e) => ({ word: e.w, reading: e.r, meaning: e.m }));
}

export function getKanjiVGUrl(kanji: string): string {
  const codePoint = kanji.codePointAt(0)!;
  const hex = codePoint.toString(16).padStart(5, '0');
  return `${import.meta.env.BASE_URL}svg/${hex}.svg`;
}

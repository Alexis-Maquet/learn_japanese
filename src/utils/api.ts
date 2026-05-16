import type { KanjiDetails } from '../types';
import { logger } from './logger';

const BASE_URL = 'https://kanjiapi.dev/v1';

const cache = new Map<string, unknown>();

async function fetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    logger.debug('api', 'Cache hit', url);
    return cache.get(url) as T;
  }
  logger.info('api', 'Fetch', url);
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`API error: ${res.status}`);
    logger.error('api', 'Fetch failed', { url, status: res.status });
    throw err;
  }
  const data = await res.json();
  cache.set(url, data);
  return data;
}

export async function fetchKanjiByJlpt(level: string): Promise<string[]> {
  const num = level.replace(/[^0-9]/g, '');
  return fetchWithCache<string[]>(`${BASE_URL}/kanji/jlpt-${num}`);
}

export async function fetchKanjiDetails(kanji: string): Promise<KanjiDetails> {
  return fetchWithCache<KanjiDetails>(`${BASE_URL}/kanji/${encodeURIComponent(kanji)}`);
}

export async function fetchJoyoKanji(): Promise<string[]> {
  return fetchWithCache<string[]>(`${BASE_URL}/kanji/joyo`);
}

export function getKanjiVGUrl(kanji: string): string {
  const codePoint = kanji.codePointAt(0)!;
  const hex = codePoint.toString(16).padStart(5, '0');
  return `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;
}

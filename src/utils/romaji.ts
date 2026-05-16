import * as wanakana from 'wanakana';

export function toRomaji(reading: string): string {
  return wanakana.toRomaji(reading);
}

export function toHiragana(text: string): string {
  return wanakana.toHiragana(text);
}

export function isKana(text: string): boolean {
  return wanakana.isKana(text);
}

export function normalizeAnswer(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, '');
}

export function checkAnswer(input: string, readings: string[]): boolean {
  const normalized = normalizeAnswer(input);
  return readings.some((r) => {
    const romaji = normalizeAnswer(toRomaji(r));
    const hiragana = normalizeAnswer(toHiragana(input));
    return normalized === romaji || hiragana === normalizeAnswer(r) || normalized === normalizeAnswer(r);
  });
}

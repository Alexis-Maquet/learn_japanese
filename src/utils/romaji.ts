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

export function stripOkurigana(reading: string): string {
  return reading.split('.')[0];
}

export function fullReading(reading: string): string {
  return reading.replace('.', '');
}

export function checkAnswer(input: string, readings: string[]): boolean {
  const normalized = normalizeAnswer(input);
  const hiragana = normalizeAnswer(toHiragana(input));
  return readings.some((r) => {
    const clean = r.replace(/^-|-$/g, '');
    const stripped = stripOkurigana(clean);
    const full = fullReading(clean);
    return (
      normalized === normalizeAnswer(toRomaji(stripped)) ||
      normalized === normalizeAnswer(toRomaji(full)) ||
      hiragana === normalizeAnswer(stripped) ||
      hiragana === normalizeAnswer(full) ||
      normalized === normalizeAnswer(stripped) ||
      normalized === normalizeAnswer(full)
    );
  });
}

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

// « nn » ou « n' » saisis pour ん : kann → kan (nn suivi d'une voyelle reste n + n : konnichi)
function normalizeN(input: string): string {
  return input.replace(/nn(?![aiueoy])/gi, 'n');
}

function matchesReadings(input: string, readings: string[]): boolean {
  const normalized = normalizeAnswer(input);
  const hiragana = normalizeAnswer(toHiragana(input));
  return readings.some((r) => {
    const clean = r.replace(/^-|-$/g, '');
    const stripped = stripOkurigana(clean);
    const full = fullReading(clean);
    return (
      normalized === normalizeAnswer(toRomaji(stripped)) ||
      normalized === normalizeAnswer(toRomaji(full)) ||
      // les lectures on'yomi sont en katakana : on compare aussi en hiragana (かん pour カン)
      hiragana === normalizeAnswer(toHiragana(stripped)) ||
      hiragana === normalizeAnswer(toHiragana(full)) ||
      normalized === normalizeAnswer(stripped) ||
      normalized === normalizeAnswer(full)
    );
  });
}

export function checkAnswer(input: string, readings: string[]): boolean {
  return [...new Set([input, normalizeN(input)])].some((v) => matchesReadings(v, readings));
}

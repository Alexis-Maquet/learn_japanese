const KANJI_RE = /[一-鿿㐀-䶿豈-﫿]/g;
const KANJI_WORD_RE = /[一-鿿㐀-䶿豈-﫿]+/g;

export function extractKanji(text: string): string[] {
  const matches = text.match(KANJI_RE) ?? [];
  return [...new Set(matches)];
}

export function extractKanjiWords(text: string): string[] {
  const matches = text.match(KANJI_WORD_RE) ?? [];
  return [...new Set(matches)];
}

export function highlightKanjiInText(text: string): Array<{ text: string; isKanji: boolean }> {
  const result: Array<{ text: string; isKanji: boolean }> = [];
  let current = '';
  let inKanji = false;

  for (const char of text) {
    const isKanji = KANJI_RE.test(char);
    KANJI_RE.lastIndex = 0;

    if (isKanji !== inKanji) {
      if (current) result.push({ text: current, isKanji: inKanji });
      current = char;
      inKanji = isKanji;
    } else {
      current += char;
    }
  }
  if (current) result.push({ text: current, isKanji: inKanji });

  return result;
}

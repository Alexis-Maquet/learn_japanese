import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SentenceExercise } from '@/types';

export type SupportedMediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

const DAILY_LIMIT = 1500;
interface DailyUsage { date: string; count: number; }
function today(): string { return new Date().toISOString().slice(0, 10); }

export function trackApiCall(): void {
  const d = today();
  const raw = localStorage.getItem('gemini_daily_usage');
  const prev: DailyUsage = raw ? JSON.parse(raw) : { date: d, count: 0 };
  const count = prev.date === d ? prev.count + 1 : 1;
  localStorage.setItem('gemini_daily_usage', JSON.stringify({ date: d, count }));
}

export function getRemainingCalls(): number {
  const raw = localStorage.getItem('gemini_daily_usage');
  if (!raw) return DAILY_LIMIT;
  const usage: DailyUsage = JSON.parse(raw);
  if (usage.date !== today()) return DAILY_LIMIT;
  return Math.max(0, DAILY_LIMIT - usage.count);
}

// Preference order: best quality first, then fallbacks
const MODEL_PREFERENCE = [
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
];

let cachedModel: string | null = null;

async function pickModel(apiKey: string): Promise<string> {
  if (cachedModel) return cachedModel;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
  if (!res.ok) return MODEL_PREFERENCE[0];

  const data = await res.json();
  const available = new Set<string>(
    (data.models ?? [])
      .filter((m: { supportedGenerationMethods?: string[] }) =>
        m.supportedGenerationMethods?.includes('generateContent')
      )
      .map((m: { name: string }) => m.name.replace('models/', ''))
  );

  for (const m of MODEL_PREFERENCE) {
    if (available.has(m)) {
      cachedModel = m;
      return m;
    }
  }

  // Last resort: first model supporting generateContent
  const first = (data.models ?? []).find(
    (m: { supportedGenerationMethods?: string[] }) =>
      m.supportedGenerationMethods?.includes('generateContent')
  );
  cachedModel = first?.name?.replace('models/', '') ?? MODEL_PREFERENCE[0];
  return cachedModel!;
}

export async function extractTextWithGemini(
  apiKey: string,
  imageBase64: string,
  mediaType: SupportedMediaType
): Promise<string> {
  const modelName = await pickModel(apiKey);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const result = await model.generateContent([
    { inlineData: { mimeType: mediaType, data: imageBase64 } },
    'Extrait tout le texte japonais (kanji, hiragana, katakana) présent dans cette image. Réponds uniquement avec le texte extrait.',
  ]);

  trackApiCall();
  return result.response.text().trim();
}

export async function getWordDefinition(
  apiKey: string,
  word: string
): Promise<{ reading: string; meaning: string } | null> {
  try {
    const modelName = await pickModel(apiKey);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(
      `Donne la lecture en hiragana et la signification en français du mot japonais "${word}". Réponds uniquement avec ce JSON sans markdown: {"reading":"...","meaning":"..."}`
    );
    trackApiCall();
    const text = result.response.text().trim();
    const match = text.match(/\{[\s\S]*?\}/);
    if (!match) return null;
    return JSON.parse(match[0]) as { reading: string; meaning: string };
  } catch {
    return null;
  }
}

export async function generateSentenceExercises(
  apiKey: string,
  targetKanjis: string[],
  count: number,
): Promise<SentenceExercise[]> {
  const shuffled = [...targetKanjis].sort(() => Math.random() - 0.5);
  const perGroup = Math.min(4, Math.max(1, Math.ceil(shuffled.length / count)));
  const kanjiGroups = Array.from({ length: count }, (_, i) =>
    Array.from({ length: perGroup }, (_, j) => shuffled[(i * perGroup + j) % shuffled.length])
      .filter((k, idx, arr) => arr.indexOf(k) === idx)
  );

  const modelName = await pickModel(apiKey);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const groupsDesc = kanjiGroups
    .map((g, i) => `Phrase ${i + 1} : ${g.join('、')} (isTarget=true pour les mots contenant ces kanjis : ${g.join('')})`)
    .join('\n');

  const prompt = `Tu es un professeur de japonais. Génère exactement ${count} phrases japonaises courtes et naturelles (5 à 12 mots chacune). Varie les structures grammaticales et les sujets entre les phrases. Pour chaque phrase, utilise au moins un des kanjis indiqués.

Répartition des kanjis par phrase :
${groupsDesc}

Pour chaque phrase, découpe-la en mots. Pour chaque mot fournis :
- text : mot tel qu'il apparaît
- reading : lecture en hiragana (katakana pour mots d'origine étrangère)
- meaning : traduction française (3 mots max)
- isTarget : true uniquement si le mot contient les kanjis assignés à cette phrase

Pour chaque mot avec isTarget=true, ajoute également :
- keywords : 4 à 7 mots-clés français minuscules validant une réponse correcte (synonymes inclus)
- options : exactement 4 traductions françaises courtes — la BONNE réponse en première position, puis 3 leurres plausibles

Réponds UNIQUEMENT avec ce JSON sans markdown ni backticks :
{"exercises":[{"sentence":"...","words":[{"text":"...","reading":"...","meaning":"...","isTarget":false},{"text":"...","reading":"...","meaning":"...","isTarget":true,"keywords":["..."],"options":["correcte","leurre1","leurre2","leurre3"]}]}]}`;

  const result = await model.generateContent(prompt);
  trackApiCall();
  const text = result.response.text().trim();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return [];

  const data = JSON.parse(match[0]) as { exercises: SentenceExercise[] };
  if (!Array.isArray(data.exercises)) return [];

  return data.exercises
    .filter(ex => Array.isArray(ex.words) && ex.words.some(w => w.isTarget))
    .map(ex => ({
      sentence: ex.sentence,
      words: ex.words.map(w => {
        if (!w.isTarget || !w.options || w.options.length < 2) return w;
        const correct = w.options[0];
        const shuffledOpts = [...w.options].sort(() => Math.random() - 0.5);
        return { ...w, options: shuffledOpts, correctOption: correct };
      }),
    }));
}

export function getApiKey(): string | null {
  return localStorage.getItem('gemini_api_key');
}

export function saveApiKey(key: string): void {
  cachedModel = null; // reset model cache on key change
  localStorage.setItem('gemini_api_key', key.trim());
}

export function clearApiKey(): void {
  cachedModel = null;
  localStorage.removeItem('gemini_api_key');
}

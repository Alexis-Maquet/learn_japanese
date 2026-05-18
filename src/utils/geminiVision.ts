import { GoogleGenerativeAI } from '@google/generative-ai';

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

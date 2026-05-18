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

export async function extractTextWithGemini(
  apiKey: string,
  imageBase64: string,
  mediaType: SupportedMediaType
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
  localStorage.setItem('gemini_api_key', key.trim());
}

export function clearApiKey(): void {
  localStorage.removeItem('gemini_api_key');
}

import Anthropic from '@anthropic-ai/sdk';

export type SupportedMediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

export async function extractTextWithClaude(
  apiKey: string,
  imageBase64: string,
  mediaType: SupportedMediaType
): Promise<string> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'Tu es un expert en langue japonaise. Extrait uniquement le texte japonais présent dans les images, sans explication ni commentaire.',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: imageBase64 },
          },
          {
            type: 'text',
            text: 'Extrait tout le texte japonais (kanji, hiragana, katakana) présent dans cette image. Réponds uniquement avec le texte extrait.',
          },
        ],
      },
    ],
  });

  const block = response.content[0];
  return block.type === 'text' ? block.text.trim() : '';
}

export function getApiKey(): string | null {
  return localStorage.getItem('claude_api_key');
}

export function saveApiKey(key: string): void {
  localStorage.setItem('claude_api_key', key.trim());
}

export function clearApiKey(): void {
  localStorage.removeItem('claude_api_key');
}

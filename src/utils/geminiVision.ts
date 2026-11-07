import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SentenceExercise } from '@/types';
import { readJson } from '@/utils/safeStorage';

export type SupportedMediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

const DAILY_LIMIT = 1500;
interface DailyUsage { date: string; count: number; }
function today(): string { return new Date().toISOString().slice(0, 10); }

function isDailyUsage(v: unknown): v is DailyUsage {
  return typeof v === 'object' && v !== null
    && typeof (v as DailyUsage).date === 'string' && typeof (v as DailyUsage).count === 'number';
}

export function trackApiCall(): void {
  const d = today();
  const prev = readJson('gemini_daily_usage', isDailyUsage) ?? { date: d, count: 0 };
  const count = prev.date === d ? prev.count + 1 : 1;
  try {
    localStorage.setItem('gemini_daily_usage', JSON.stringify({ date: d, count }));
  } catch {
    // stockage plein ou refusé : le compteur local est perdu, l'appel a déjà eu lieu
  }
}

export function getRemainingCalls(): number {
  const usage = readJson('gemini_daily_usage', isDailyUsage);
  if (!usage || usage.date !== today()) return DAILY_LIMIT;
  return Math.max(0, DAILY_LIMIT - usage.count);
}

// Preference order: best quality first, then fallbacks
// Modèles stables d'abord ; un modèle « preview » ne sert qu'en dernier recours (il peut disparaître sans préavis)
const MODEL_PREFERENCE = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-2.5-flash-preview-05-20',
];

let cachedModel: string | null = null;

async function pickModel(apiKey: string): Promise<string> {
  if (cachedModel) return cachedModel;

  // La clé passe dans l'en-tête, pas dans l'URL : une URL se retrouve dans les historiques et les journaux
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
    headers: { 'x-goog-api-key': apiKey },
  });
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

const SENTENCE_THEMES = [
  'restaurant / repas au restaurant',
  'école / cours en classe',
  'transports en commun / train / bus',
  'météo / saisons / climate',
  'famille / vie à la maison',
  'shopping / magasins / vêtements',
  'sport / gym / entraînement',
  'musique / concert / chanter',
  'voyage / tourisme / visiter',
  'travail / bureau / collègues',
  'santé / médecin / médicaments',
  'animaux domestiques / chats / chiens',
  'fêtes / célébrations / anniversaire',
  'cuisine / préparer à manger / recette',
  'technologie / smartphone / internet',
  'cinéma / film / regarder une série',
  'lecture / bibliothèque / livres',
  'jardinage / plantes / fleurs',
  'amis / rencontres / sortir ensemble',
  'projets futurs / rêves / ambitions',
  'photos / souvenirs / album',
  'montagne / randonnée / camping',
  'mer / plage / natation',
  'quartier / voisinage / rue',
  'marché / épicerie / courses',
  'parc / promenade / pique-nique',
  'café / thé / boissons',
  'art / musée / exposition',
  'jeux vidéo / console / jouer',
  'nuit / sommeil / rêves',
  'matin / réveil / routine du matin',
  'week-end / vacances / repos',
  'argent / budget / économies',
  'courrier / lettre / message',
  'université / études / examens',
  'cadeau / surprise / fête',
  'hôtel / hébergement / voyage',
  'gare / aéroport / départ / arrivée',
  'printemps / fleurs de cerisier / hanami',
  'automne / feuilles colorées / koyo',
  'neige / hiver / manteau',
  'été / chaleur / plein air',
  'soirée / dîner en famille',
  'petit-déjeuner / matin calme',
  'pêche / rivière / lac',
  'temple / sanctuaire / visite culturelle',
  'manga / anime / bande dessinée',
  'arts martiaux / judo / kendo',
];

const SENTENCE_STRUCTURES = [
  'question avec か (ex. 〜ですか / 〜ますか)',
  'négation (ません / ない / じゃない)',
  'passé (ました / でした / た)',
  'demande ou permission avec て (〜てください / 〜てもいいですか)',
  'désir (〜たいです)',
  'comparaison (AはBより〜 / 一番)',
  'raison (〜から / 〜ので)',
  'contraste (〜のに / 〜けど)',
  'proposition relative avant un nom (V / adj + N)',
  'capacité (〜ことができます / 〜られます)',
  'habitude ou fréquence (毎日 / いつも / 〜ことがあります)',
  'action en cours ou état (〜ています)',
  'projet ou intention (〜つもりです / 〜予定です)',
  'conseil ou obligation (〜たほうがいい / 〜なければなりません)',
  'enchaînement d\'actions (〜て、〜ます)',
  'hypothèse (〜たら / 〜ば)',
  'après ou avant une action (〜てから / 〜前に / 〜あとで)',
  'opinion (〜と思います / 〜でしょう)',
];

const SENTENCE_SUBJECTS = [
  '友達', '先生', '母', '父', '弟', '妹', '同僚', '店員', '隣の人', '子供',
  '田中さん', '佐藤さん', 'わたし', '私たち', '祖母', '彼女', '学生', 'お客さん',
];

export async function generateSentenceExercises(
  apiKey: string,
  targetKanjis: string[],
  count: number,
): Promise<SentenceExercise[]> {
  const shuffled = [...targetKanjis].sort(() => Math.random() - 0.5);
  // Deux kanjis au maximum par phrase : au-delà, Gemini produit des phrases forcées et peu naturelles
  const perGroup = Math.min(2, Math.max(1, Math.ceil(shuffled.length / count)));
  const kanjiGroups = Array.from({ length: count }, (_, i) =>
    Array.from({ length: perGroup }, (_, j) => shuffled[(i * perGroup + j) % shuffled.length])
      .filter((k, idx, arr) => arr.indexOf(k) === idx)
  );

  // Thème, structure grammaticale et sujet tirés au sort pour chaque phrase :
  // c'est ce qui empêche Gemini de retomber sur les mêmes phrases types
  const shuffledThemes = [...SENTENCE_THEMES].sort(() => Math.random() - 0.5);
  const shuffledStructures = [...SENTENCE_STRUCTURES].sort(() => Math.random() - 0.5);
  const shuffledSubjects = [...SENTENCE_SUBJECTS].sort(() => Math.random() - 0.5);
  const assignedThemes = kanjiGroups.map((_, i) => shuffledThemes[i % shuffledThemes.length]);
  const assignedStructures = kanjiGroups.map((_, i) => shuffledStructures[i % shuffledStructures.length]);
  const assignedSubjects = kanjiGroups.map((_, i) => shuffledSubjects[i % shuffledSubjects.length]);

  const modelName = await pickModel(apiKey);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    // Température plus haute que la valeur par défaut pour éviter que les phrases se ressemblent
    generationConfig: { temperature: 1.2, topP: 0.95 },
  });

  const groupsDesc = kanjiGroups
    .map((g, i) => `Phrase ${i + 1} :
  - thème imposé : ${assignedThemes[i]}
  - structure imposée : ${assignedStructures[i]}
  - sujet suggéré : ${assignedSubjects[i]} (ignorer si le sens ne s'y prête pas)
  - kanjis : ${g.join('、')} (isTarget=true pour les mots contenant ces kanjis : ${g.join('')})`)
    .join('\n');

  const prompt = `Tu es un professeur de japonais qui écrit des phrases d'exercice que des Japonais diraient vraiment.

Génère exactement ${count} phrases japonaises de 5 à 12 mots chacune.

Règles de naturel :
- Chaque phrase doit être quelque chose qu'on entend dans la vie courante : pas de phrase de manuel artificielle (ex. « これは本です » répété, « 私は学生です » à chaque fois).
- Registre poli (です / ます) par défaut, sauf si la structure imposée demande autre chose.
- Si un kanji est rare ou peu naturel dans une phrase, choisis un mot courant qui le contient.
- Ne force jamais le kanji dans une construction bancale : une phrase simple et correcte vaut mieux qu'une phrase tordue.

Règles de variété (appliquer sur l'ensemble des phrases) :
- Ne commence pas plus d'une phrase par 私は. Varie les sujets : personnes, lieux, objets, moments de la journée.
- Ne réutilise pas le même verbe, le même nom ou la même particule de fin dans deux phrases.
- Respecte la structure grammaticale imposée à chaque phrase, et le thème imposé.

Consignes par phrase :
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
{"exercises":[{"sentence":"...","translation":"traduction française complète de la phrase","words":[{"text":"...","reading":"...","meaning":"...","isTarget":false},{"text":"...","reading":"...","meaning":"...","isTarget":true,"keywords":["..."],"options":["correcte","leurre1","leurre2","leurre3"]}]}]}`;

  const result = await model.generateContent(prompt);
  trackApiCall();
  const text = result.response.text().trim();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return [];

  const data = JSON.parse(match[0]) as { exercises: SentenceExercise[] };
  if (!Array.isArray(data.exercises)) return [];

  return normalizeSentenceExercises(data.exercises);
}

/**
 * Valide la réponse de Gemini. Un mot cible doit pouvoir être répondu dans les deux modes
 * (au moins 2 options pour le QCM, au moins un mot-clé pour la saisie libre). Sinon le mot est
 * dégradé en mot ordinaire ; une phrase sans aucun mot cible exploitable est écartée.
 */
export function normalizeSentenceExercises(exercises: SentenceExercise[]): SentenceExercise[] {
  const isTextList = (v: unknown): v is string[] =>
    Array.isArray(v) && v.length > 0 && v.every(x => typeof x === 'string' && x.trim() !== '');

  return exercises
    .filter(ex => typeof ex.sentence === 'string' && ex.sentence.trim() !== '' && Array.isArray(ex.words))
    .map(ex => ({
      sentence: ex.sentence,
      translation: ex.translation ?? '',
      words: ex.words.map(w => {
        if (!w.isTarget) return w;
        if (!isTextList(w.options) || w.options.length < 2 || !isTextList(w.keywords)) {
          return { ...w, isTarget: false, options: undefined, keywords: undefined };
        }
        const correct = w.options[0];
        const shuffledOpts = [...w.options].sort(() => Math.random() - 0.5);
        return { ...w, options: shuffledOpts, correctOption: correct };
      }),
    }))
    .filter(ex => ex.words.some(w => w.isTarget));
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

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SentenceExercise, ConjugationExercise } from '@/types';

const CONJUGATION_RULES: { chapterNum: number; form: string; label: string; rule: string }[] = [
  { chapterNum: 3, form: 'ます形', label: '〜ます / 〜ません', rule: 'Présent poli. G1: く→きます む→みます ぬ→にます ぶ→びます う→います つ→ちます る→ります す→します. G2: る→ます. する→します くる→きます' },
  { chapterNum: 3, form: 'ます形', label: '〜ませんか', rule: 'Invitation. Stem ます + ませんか' },
  { chapterNum: 4, form: 'ます形', label: '〜ました / 〜ませんでした', rule: 'Passé poli. Stem ます + ました (affirmatif) / ませんでした (négatif)' },
  { chapterNum: 5, form: 'ます形', label: '〜ましょう / 〜ましょうか', rule: 'Suggestion ou offre. Stem ます + ましょう / ましょうか' },
  { chapterNum: 6, form: 'て形', label: 'Formation て', rule: 'く→いて ぐ→いで す→して つ/る/う→って ぬ/ぶ/む→んで. G2: る→て. いく→いって する→して くる→きて' },
  { chapterNum: 6, form: 'て形', label: '〜てください', rule: 'Demande polie. Forme て + ください' },
  { chapterNum: 6, form: 'て形', label: '〜てもいいです', rule: 'Permission. Forme て + もいいです' },
  { chapterNum: 6, form: 'て形', label: '〜てはいけません', rule: 'Interdiction. Forme て + はいけません' },
  { chapterNum: 7, form: 'て形', label: '〜ています', rule: 'Progressif ou état résultant. Forme て + います' },
  { chapterNum: 7, form: 'て形', label: 'い-adj くて / な-adj で', rule: 'Enchaînement descriptif. い-adj: い→くて. な-adj/N: + で' },
  { chapterNum: 7, form: 'ます幹', label: 'V-stem に 行く/来る', rule: 'But du déplacement. Stem ます + に + verbe de mouvement' },
  { chapterNum: 8, form: 'ない形', label: '〜ないでください', rule: 'Négation request. G1: く→かない む→まない ぬ→なない ぶ→ばない う→わない つ→たない る→らない す→さない. G2: る→ない. する→しない くる→こない. + でください' },
  { chapterNum: 8, form: '辞書形', label: 'V の が 好き / 上手', rule: 'Nominalisation verbale. Forme dict. + の が + adjectif' },
  { chapterNum: 8, form: '短縮形', label: '〜と思います', rule: 'Opinion. Forme courte (dict./ない/た/なかった) + と思います' },
  { chapterNum: 9, form: 'た形', label: '〜たことがあります', rule: 'Expérience passée. G1: く→いた ぐ→いだ す→した つ/る/う→った ぬ/ぶ/む→んだ. G2: る→た. する→した くる→きた. + ことがあります' },
  { chapterNum: 9, form: 'た形', label: '〜たり〜たりします', rule: 'Liste non exhaustive. Forme た + り (pour chaque verbe) + します' },
  { chapterNum: 9, form: '短縮形', label: 'V/Adj (forme courte) + Nom', rule: 'Proposition relative. Forme courte (dict./た/ない/なかった) placée avant le nom' },
  { chapterNum: 10, form: '辞書形 / ない形', label: '〜つもりです', rule: 'Intention. Forme dict. + つもりです (affirmatif). ない形 + つもりです (négatif)' },
  { chapterNum: 10, form: 'く形 / に形', label: 'Adj + なる', rule: 'Devenir. い-adj: い→く + なる. な-adj: に + なる. N: N + になる' },
  { chapterNum: 11, form: 'ます幹', label: '〜たいです', rule: 'Désir. Stem ます + たいです (se conjugue comme un い-adj)' },
  { chapterNum: 11, form: 'た形', label: '〜たことがあります', rule: 'Expérience de vie. Forme た + ことがあります / ことがありません' },
  { chapterNum: 12, form: 'ます幹', label: '〜すぎる', rule: 'Excès. Stem ます (verbe) + すぎる. い-adj: い→すぎる. な-adj: +すぎる' },
  { chapterNum: 12, form: 'た形 / ない形', label: '〜ほうがいいです', rule: 'Conseil. Forme た + ほうがいいです (agir). ない形 + ほうがいいです (ne pas agir)' },
  { chapterNum: 12, form: 'ない形', label: '〜なければいけません', rule: 'Obligation. ない形 → ない→なければ + いけません' },
];

export const CONJUGATION_CHAPTERS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

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

  const shuffledThemes = [...SENTENCE_THEMES].sort(() => Math.random() - 0.5);
  const assignedThemes = kanjiGroups.map((_, i) => shuffledThemes[i % shuffledThemes.length]);

  const modelName = await pickModel(apiKey);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const groupsDesc = kanjiGroups
    .map((g, i) => `Phrase ${i + 1} [thème imposé : ${assignedThemes[i]}] : kanjis ${g.join('、')} (isTarget=true pour les mots contenant ces kanjis : ${g.join('')})`)
    .join('\n');

  const prompt = `Tu es un professeur de japonais. Génère exactement ${count} phrases japonaises courtes et naturelles (5 à 12 mots chacune). Chaque phrase doit impérativement respecter son thème imposé. Varie les structures grammaticales entre les phrases. Pour chaque phrase, utilise au moins un des kanjis indiqués.

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
{"exercises":[{"sentence":"...","translation":"traduction française complète de la phrase","words":[{"text":"...","reading":"...","meaning":"...","isTarget":false},{"text":"...","reading":"...","meaning":"...","isTarget":true,"keywords":["..."],"options":["correcte","leurre1","leurre2","leurre3"]}]}]}`;

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
      translation: ex.translation ?? '',
      words: ex.words.map(w => {
        if (!w.isTarget || !w.options || w.options.length < 2) return w;
        const correct = w.options[0];
        const shuffledOpts = [...w.options].sort(() => Math.random() - 0.5);
        return { ...w, options: shuffledOpts, correctOption: correct };
      }),
    }));
}

export async function generateConjugationExercises(
  apiKey: string,
  selectedChapters: number[],
  count: number,
): Promise<ConjugationExercise[]> {
  const rules = CONJUGATION_RULES.filter(r => selectedChapters.includes(r.chapterNum));
  if (rules.length === 0) return [];

  const rulesText = rules
    .map((r, i) => `${i + 1}. [${r.form}] ${r.label} — ${r.rule}`)
    .join('\n');

  const prompt = `Tu es un professeur de japonais Genki I. Génère exactement ${count} exercices de conjugaison variés de niveau N5/N4.

Règles disponibles (varie-les de façon équilibrée) :
${rulesText}

Pour chaque exercice :
- Choisis un verbe ou adjectif japonais courant (N5/N4), varié entre G1, G2, する/くる et adjectifs い/な
- Fournis la forme de base (辞書形) et sa conjugaison selon la règle choisie
- Génère 3 leurres plausibles (vraies formes japonaises mais d'autres conjugaisons)
- Le hint explique la règle de formation en une ligne concise
- Le context est une courte phrase française décrivant l'usage de la forme demandée (ex : "pour formuler une demande polie") — ne révèle PAS la forme japonaise ni le pattern

JSON attendu (sans markdown ni backticks) :
{"exercises":[{"baseForm":"食べる","baseReading":"たべる","baseMeaning":"manger","targetForm":"て形","grammarPoint":"〜てください","context":"pour formuler une demande polie","correctAnswer":"食べて","options":["食べて","食べた","食べない","食べます"],"hint":"G2 : enlever る → 食べ + て"}]}

⚠ options[0] doit TOUJOURS être la bonne réponse (correctAnswer).
⚠ Génère exactement ${count} exercices.
⚠ Réponds UNIQUEMENT avec le JSON, sans texte avant ni après.`;

  const modelName = await pickModel(apiKey);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  trackApiCall();

  const text = result.response.text().trim();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return [];

  const data = JSON.parse(match[0]) as { exercises: ConjugationExercise[] };
  if (!Array.isArray(data.exercises)) return [];

  return data.exercises
    .filter(ex => ex.baseForm && ex.correctAnswer && Array.isArray(ex.options) && ex.options.length >= 2 && ex.context)
    .map(ex => {
      const correct = ex.options[0];
      const shuffled = [...ex.options].sort(() => Math.random() - 0.5);
      return { ...ex, options: shuffled, correctAnswer: correct };
    });
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

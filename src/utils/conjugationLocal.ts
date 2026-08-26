import type { ConjugationExercise } from '@/types';

type WordType = 'g1' | 'g2' | 'suru' | 'i-adj' | 'na-adj' | 'noun';

interface WordEntry {
  baseForm: string;
  baseReading: string;
  baseMeaning: string;
  type: WordType;
}

export const LOCAL_WORD_LIST: WordEntry[] = [
  // G1
  { baseForm: '書く', baseReading: 'かく', baseMeaning: 'écrire', type: 'g1' },
  { baseForm: '聞く', baseReading: 'きく', baseMeaning: 'écouter', type: 'g1' },
  { baseForm: '泳ぐ', baseReading: 'およぐ', baseMeaning: 'nager', type: 'g1' },
  { baseForm: '話す', baseReading: 'はなす', baseMeaning: 'parler', type: 'g1' },
  { baseForm: '待つ', baseReading: 'まつ', baseMeaning: 'attendre', type: 'g1' },
  { baseForm: '遊ぶ', baseReading: 'あそぶ', baseMeaning: 'jouer', type: 'g1' },
  { baseForm: '帰る', baseReading: 'かえる', baseMeaning: 'rentrer', type: 'g1' },
  { baseForm: '乗る', baseReading: 'のる', baseMeaning: 'monter dans', type: 'g1' },
  { baseForm: '走る', baseReading: 'はしる', baseMeaning: 'courir', type: 'g1' },
  { baseForm: '作る', baseReading: 'つくる', baseMeaning: 'faire/créer', type: 'g1' },
  { baseForm: '歌う', baseReading: 'うたう', baseMeaning: 'chanter', type: 'g1' },
  { baseForm: '買う', baseReading: 'かう', baseMeaning: 'acheter', type: 'g1' },
  { baseForm: '洗う', baseReading: 'あらう', baseMeaning: 'laver', type: 'g1' },
  { baseForm: '会う', baseReading: 'あう', baseMeaning: 'rencontrer', type: 'g1' },
  { baseForm: '使う', baseReading: 'つかう', baseMeaning: 'utiliser', type: 'g1' },
  { baseForm: '習う', baseReading: 'ならう', baseMeaning: 'apprendre', type: 'g1' },
  { baseForm: '急ぐ', baseReading: 'いそぐ', baseMeaning: 'se dépêcher', type: 'g1' },
  { baseForm: '消す', baseReading: 'けす', baseMeaning: 'éteindre', type: 'g1' },
  { baseForm: '出す', baseReading: 'だす', baseMeaning: 'envoyer/sortir', type: 'g1' },
  { baseForm: '押す', baseReading: 'おす', baseMeaning: 'pousser', type: 'g1' },
  { baseForm: '貸す', baseReading: 'かす', baseMeaning: 'prêter', type: 'g1' },
  { baseForm: '立つ', baseReading: 'たつ', baseMeaning: 'se lever', type: 'g1' },
  { baseForm: '勝つ', baseReading: 'かつ', baseMeaning: 'gagner', type: 'g1' },
  { baseForm: '持つ', baseReading: 'もつ', baseMeaning: 'tenir/avoir', type: 'g1' },
  { baseForm: '送る', baseReading: 'おくる', baseMeaning: 'envoyer', type: 'g1' },
  { baseForm: '取る', baseReading: 'とる', baseMeaning: 'prendre', type: 'g1' },
  { baseForm: '頑張る', baseReading: 'がんばる', baseMeaning: 'persévérer', type: 'g1' },
  { baseForm: '売る', baseReading: 'うる', baseMeaning: 'vendre', type: 'g1' },
  { baseForm: '知る', baseReading: 'しる', baseMeaning: 'savoir', type: 'g1' },
  { baseForm: '切る', baseReading: 'きる', baseMeaning: 'couper', type: 'g1' },
  { baseForm: '通る', baseReading: 'とおる', baseMeaning: 'passer par', type: 'g1' },
  { baseForm: '終わる', baseReading: 'おわる', baseMeaning: 'finir', type: 'g1' },
  { baseForm: '泣く', baseReading: 'なく', baseMeaning: 'pleurer', type: 'g1' },
  { baseForm: '笑う', baseReading: 'わらう', baseMeaning: 'rire', type: 'g1' },
  { baseForm: '働く', baseReading: 'はたらく', baseMeaning: 'travailler', type: 'g1' },
  { baseForm: '歩く', baseReading: 'あるく', baseMeaning: 'marcher', type: 'g1' },
  { baseForm: '引く', baseReading: 'ひく', baseMeaning: 'tirer', type: 'g1' },
  { baseForm: '起こす', baseReading: 'おこす', baseMeaning: 'réveiller', type: 'g1' },
  { baseForm: '困る', baseReading: 'こまる', baseMeaning: 'être gêné', type: 'g1' },
  { baseForm: '始まる', baseReading: 'はじまる', baseMeaning: 'commencer', type: 'g1' },
  // G2
  { baseForm: '起きる', baseReading: 'おきる', baseMeaning: 'se lever', type: 'g2' },
  { baseForm: '寝る', baseReading: 'ねる', baseMeaning: 'dormir', type: 'g2' },
  { baseForm: '教える', baseReading: 'おしえる', baseMeaning: 'enseigner', type: 'g2' },
  { baseForm: '覚える', baseReading: 'おぼえる', baseMeaning: 'mémoriser', type: 'g2' },
  { baseForm: '忘れる', baseReading: 'わすれる', baseMeaning: 'oublier', type: 'g2' },
  { baseForm: '借りる', baseReading: 'かりる', baseMeaning: 'emprunter', type: 'g2' },
  { baseForm: '着る', baseReading: 'きる', baseMeaning: 'porter (vêtement)', type: 'g2' },
  { baseForm: '降りる', baseReading: 'おりる', baseMeaning: 'descendre', type: 'g2' },
  { baseForm: '閉める', baseReading: 'しめる', baseMeaning: 'fermer', type: 'g2' },
  { baseForm: '開ける', baseReading: 'あける', baseMeaning: 'ouvrir', type: 'g2' },
  { baseForm: '見せる', baseReading: 'みせる', baseMeaning: 'montrer', type: 'g2' },
  { baseForm: '疲れる', baseReading: 'つかれる', baseMeaning: 'se fatiguer', type: 'g2' },
  { baseForm: '調べる', baseReading: 'しらべる', baseMeaning: 'rechercher', type: 'g2' },
  { baseForm: '答える', baseReading: 'こたえる', baseMeaning: 'répondre', type: 'g2' },
  { baseForm: '続ける', baseReading: 'つづける', baseMeaning: 'continuer', type: 'g2' },
  { baseForm: '集める', baseReading: 'あつめる', baseMeaning: 'collecter', type: 'g2' },
  { baseForm: '決める', baseReading: 'きめる', baseMeaning: 'décider', type: 'g2' },
  { baseForm: 'あげる', baseReading: 'あげる', baseMeaning: 'donner', type: 'g2' },
  { baseForm: '生まれる', baseReading: 'うまれる', baseMeaning: 'naître', type: 'g2' },
  { baseForm: '考える', baseReading: 'かんがえる', baseMeaning: 'réfléchir', type: 'g2' },
  { baseForm: '食べる', baseReading: 'たべる', baseMeaning: 'manger', type: 'g2' },
  { baseForm: '見る', baseReading: 'みる', baseMeaning: 'voir/regarder', type: 'g2' },
  // する
  { baseForm: '運動する', baseReading: 'うんどうする', baseMeaning: 'faire du sport', type: 'suru' },
  { baseForm: '掃除する', baseReading: 'そうじする', baseMeaning: 'nettoyer', type: 'suru' },
  { baseForm: '料理する', baseReading: 'りょうりする', baseMeaning: 'cuisiner', type: 'suru' },
  { baseForm: '散歩する', baseReading: 'さんぽする', baseMeaning: 'se promener', type: 'suru' },
  { baseForm: '旅行する', baseReading: 'りょこうする', baseMeaning: 'voyager', type: 'suru' },
  { baseForm: '練習する', baseReading: 'れんしゅうする', baseMeaning: 'pratiquer', type: 'suru' },
  { baseForm: '説明する', baseReading: 'せつめいする', baseMeaning: 'expliquer', type: 'suru' },
  { baseForm: '電話する', baseReading: 'でんわする', baseMeaning: 'téléphoner', type: 'suru' },
  { baseForm: '心配する', baseReading: 'しんぱいする', baseMeaning: "s'inquiéter", type: 'suru' },
  { baseForm: '紹介する', baseReading: 'しょうかいする', baseMeaning: 'présenter', type: 'suru' },
  { baseForm: '準備する', baseReading: 'じゅんびする', baseMeaning: 'préparer', type: 'suru' },
  { baseForm: '相談する', baseReading: 'そうだんする', baseMeaning: 'consulter', type: 'suru' },
  { baseForm: '確認する', baseReading: 'かくにんする', baseMeaning: 'vérifier', type: 'suru' },
  { baseForm: '参加する', baseReading: 'さんかする', baseMeaning: 'participer', type: 'suru' },
  { baseForm: '勉強する', baseReading: 'べんきょうする', baseMeaning: 'étudier', type: 'suru' },
  { baseForm: '結婚する', baseReading: 'けっこんする', baseMeaning: 'se marier', type: 'suru' },
  { baseForm: '卒業する', baseReading: 'そつぎょうする', baseMeaning: 'être diplômé', type: 'suru' },
  // い-adj
  { baseForm: '難しい', baseReading: 'むずかしい', baseMeaning: 'difficile', type: 'i-adj' },
  { baseForm: 'やさしい', baseReading: 'やさしい', baseMeaning: 'gentil/facile', type: 'i-adj' },
  { baseForm: 'おいしい', baseReading: 'おいしい', baseMeaning: 'délicieux', type: 'i-adj' },
  { baseForm: 'たのしい', baseReading: 'たのしい', baseMeaning: 'amusant', type: 'i-adj' },
  { baseForm: 'いそがしい', baseReading: 'いそがしい', baseMeaning: 'occupé', type: 'i-adj' },
  { baseForm: 'さびしい', baseReading: 'さびしい', baseMeaning: 'solitaire', type: 'i-adj' },
  { baseForm: 'こわい', baseReading: 'こわい', baseMeaning: 'effrayant', type: 'i-adj' },
  { baseForm: 'うれしい', baseReading: 'うれしい', baseMeaning: 'heureux', type: 'i-adj' },
  { baseForm: 'かなしい', baseReading: 'かなしい', baseMeaning: 'triste', type: 'i-adj' },
  { baseForm: 'ねむい', baseReading: 'ねむい', baseMeaning: 'somnolent', type: 'i-adj' },
  { baseForm: 'あぶない', baseReading: 'あぶない', baseMeaning: 'dangereux', type: 'i-adj' },
  { baseForm: 'おもしろい', baseReading: 'おもしろい', baseMeaning: 'intéressant', type: 'i-adj' },
  { baseForm: 'かわいい', baseReading: 'かわいい', baseMeaning: 'mignon', type: 'i-adj' },
  { baseForm: '高い', baseReading: 'たかい', baseMeaning: 'cher/haut', type: 'i-adj' },
  { baseForm: '安い', baseReading: 'やすい', baseMeaning: 'bon marché', type: 'i-adj' },
  { baseForm: '暑い', baseReading: 'あつい', baseMeaning: 'chaud (temps)', type: 'i-adj' },
  { baseForm: '寒い', baseReading: 'さむい', baseMeaning: 'froid', type: 'i-adj' },
  // な-adj (stored WITH な)
  { baseForm: '元気な', baseReading: 'げんきな', baseMeaning: 'en forme', type: 'na-adj' },
  { baseForm: '親切な', baseReading: 'しんせつな', baseMeaning: 'gentil', type: 'na-adj' },
  { baseForm: '便利な', baseReading: 'べんりな', baseMeaning: 'pratique', type: 'na-adj' },
  { baseForm: '大切な', baseReading: 'たいせつな', baseMeaning: 'important', type: 'na-adj' },
  { baseForm: '有名な', baseReading: 'ゆうめいな', baseMeaning: 'célèbre', type: 'na-adj' },
  { baseForm: '特別な', baseReading: 'とくべつな', baseMeaning: 'spécial', type: 'na-adj' },
  { baseForm: '安全な', baseReading: 'あんぜんな', baseMeaning: 'sûr', type: 'na-adj' },
  { baseForm: '静かな', baseReading: 'しずかな', baseMeaning: 'calme', type: 'na-adj' },
  { baseForm: 'にぎやかな', baseReading: 'にぎやかな', baseMeaning: 'animé', type: 'na-adj' },
  { baseForm: 'まじめな', baseReading: 'まじめな', baseMeaning: 'sérieux', type: 'na-adj' },
  { baseForm: '大変な', baseReading: 'たいへんな', baseMeaning: 'difficile/pénible', type: 'na-adj' },
  { baseForm: '正直な', baseReading: 'しょうじきな', baseMeaning: 'honnête', type: 'na-adj' },
  { baseForm: '複雑な', baseReading: 'ふくざつな', baseMeaning: 'complexe', type: 'na-adj' },
  { baseForm: '必要な', baseReading: 'ひつような', baseMeaning: 'nécessaire', type: 'na-adj' },
  // Nouns (for copula exercises)
  { baseForm: '学生', baseReading: 'がくせい', baseMeaning: 'étudiant', type: 'noun' },
  { baseForm: '先生', baseReading: 'せんせい', baseMeaning: 'professeur', type: 'noun' },
  { baseForm: '医者', baseReading: 'いしゃ', baseMeaning: 'médecin', type: 'noun' },
  { baseForm: '会社員', baseReading: 'かいしゃいん', baseMeaning: 'employé de bureau', type: 'noun' },
  { baseForm: '友達', baseReading: 'ともだち', baseMeaning: 'ami', type: 'noun' },
  { baseForm: '日本人', baseReading: 'にほんじん', baseMeaning: 'Japonais', type: 'noun' },
  { baseForm: '子供', baseReading: 'こども', baseMeaning: 'enfant', type: 'noun' },
  { baseForm: '大人', baseReading: 'おとな', baseMeaning: 'adulte', type: 'noun' },
];

// ── Conjugation helpers ───────────────────────────────────────────────────────

function tf(w: WordEntry, remove: number, suffix: string): { kanji: string; kana: string } {
  const kj = remove > 0 ? w.baseForm.slice(0, -remove) : w.baseForm;
  const kn = remove > 0 ? w.baseReading.slice(0, -remove) : w.baseReading;
  return { kanji: kj + suffix, kana: kn + suffix };
}

function lk(w: WordEntry): string { return w.baseReading.slice(-1); }

const G1_MASU: Record<string, string> = { 'く':'き','ぐ':'ぎ','す':'し','つ':'ち','ぬ':'に','ぶ':'び','む':'み','う':'い','る':'り' };
const G1_TE:   Record<string, string> = { 'く':'いて','ぐ':'いで','す':'して','つ':'って','る':'って','う':'って','ぬ':'んで','ぶ':'んで','む':'んで' };
const G1_TA:   Record<string, string> = { 'く':'いた','ぐ':'いだ','す':'した','つ':'った','る':'った','う':'った','ぬ':'んだ','ぶ':'んだ','む':'んだ' };
const G1_NAI:  Record<string, string> = { 'く':'かない','ぐ':'がない','す':'さない','つ':'たない','ぬ':'なない','ぶ':'ばない','む':'まない','う':'わない','る':'らない' };
const G1_POT:  Record<string, string> = { 'く':'ける','ぐ':'げる','す':'せる','つ':'てる','ぬ':'ねる','ぶ':'べる','む':'める','う':'える','る':'れる' };
const G1_PASS: Record<string, string> = { 'く':'かれる','ぐ':'がれる','す':'される','つ':'たれる','ぬ':'なれる','ぶ':'ばれる','む':'まれる','う':'われる','る':'られる' };
const G1_CAUS: Record<string, string> = { 'く':'かせる','ぐ':'がせる','す':'させる','つ':'たせる','ぬ':'なせる','ぶ':'ばせる','む':'ませる','う':'わせる','る':'らせる' };
const G1_VOL:  Record<string, string> = { 'く':'こう','ぐ':'ごう','す':'そう','つ':'とう','ぬ':'のう','ぶ':'ぼう','む':'もう','う':'おう','る':'ろう' };
const G1_BA:   Record<string, string> = { 'く':'けば','ぐ':'げば','す':'せば','つ':'てば','ぬ':'ねば','ぶ':'べば','む':'めば','う':'えば','る':'れば' };

function masuStem(w: WordEntry): { kanji: string; kana: string } | null {
  if (w.type === 'g1') { const s = G1_MASU[lk(w)]; return s ? tf(w, 1, s) : null; }
  if (w.type === 'g2') return tf(w, 1, '');
  if (w.type === 'suru') return tf(w, 2, 'し');
  return null;
}

function teForm(w: WordEntry): { kanji: string; kana: string } | null {
  if (w.type === 'g1') {
    if (w.baseReading === 'いく') return tf(w, 1, 'って');
    const s = G1_TE[lk(w)]; return s ? tf(w, 1, s) : null;
  }
  if (w.type === 'g2') return tf(w, 1, 'て');
  if (w.type === 'suru') return tf(w, 2, 'して');
  return null;
}

function naiForm(w: WordEntry): { kanji: string; kana: string } | null {
  if (w.type === 'g1') { const s = G1_NAI[lk(w)]; return s ? tf(w, 1, s) : null; }
  if (w.type === 'g2') return tf(w, 1, 'ない');
  if (w.type === 'suru') return tf(w, 2, 'しない');
  return null;
}

function taForm(w: WordEntry): { kanji: string; kana: string } | null {
  if (w.type === 'g1') {
    if (w.baseReading === 'いく') return tf(w, 1, 'った');
    const s = G1_TA[lk(w)]; return s ? tf(w, 1, s) : null;
  }
  if (w.type === 'g2') return tf(w, 1, 'た');
  if (w.type === 'suru') return tf(w, 2, 'した');
  return null;
}

function potential(w: WordEntry): { kanji: string; kana: string } | null {
  if (w.type === 'g1') { const s = G1_POT[lk(w)]; return s ? tf(w, 1, s) : null; }
  if (w.type === 'g2') return tf(w, 1, 'られる');
  if (w.type === 'suru') return tf(w, 2, 'できる');
  return null;
}

function passiveForm(w: WordEntry): { kanji: string; kana: string } | null {
  if (w.type === 'g1') { const s = G1_PASS[lk(w)]; return s ? tf(w, 1, s) : null; }
  if (w.type === 'g2') return tf(w, 1, 'られる');
  if (w.type === 'suru') return tf(w, 2, 'される');
  return null;
}

function causativeForm(w: WordEntry): { kanji: string; kana: string } | null {
  if (w.type === 'g1') { const s = G1_CAUS[lk(w)]; return s ? tf(w, 1, s) : null; }
  if (w.type === 'g2') return tf(w, 1, 'させる');
  if (w.type === 'suru') return tf(w, 2, 'させる');
  return null;
}

function volitionalForm(w: WordEntry): { kanji: string; kana: string } | null {
  if (w.type === 'g1') { const s = G1_VOL[lk(w)]; return s ? tf(w, 1, s) : null; }
  if (w.type === 'g2') return tf(w, 1, 'よう');
  if (w.type === 'suru') return tf(w, 2, 'しよう');
  return null;
}

function baForm(w: WordEntry): { kanji: string; kana: string } | null {
  if (w.type === 'g1') { const s = G1_BA[lk(w)]; return s ? tf(w, 1, s) : null; }
  if (w.type === 'g2') return tf(w, 1, 'れば');
  if (w.type === 'suru') return tf(w, 2, 'すれば');
  return null;
}

// ── Category definitions ──────────────────────────────────────────────────────

export interface GrammarCategory {
  id: string;
  nameFR: string;
  nameJP: string;
  level: string;
  freq: number;
}

export const GRAMMAR_CATEGORIES: GrammarCategory[] = [
  { id: 'verb-base',    nameFR: 'Formes verbales',         nameJP: '動詞の基本形',  level: 'N5',    freq: 98 },
  { id: 'aspect',       nameFR: 'Aspect et état',          nameJP: 'アスペクト',    level: 'N4',    freq: 93 },
  { id: 'giving',       nameFR: 'Don et réception',        nameJP: '授受表現',      level: 'N4',    freq: 88 },
  { id: 'desire',       nameFR: 'Désir et volonté',        nameJP: '希望・意志',    level: 'N5–N4', freq: 90 },
  { id: 'permission',   nameFR: 'Permission et obligation', nameJP: '許可・義務',   level: 'N5–N4', freq: 94 },
  { id: 'potential',    nameFR: 'Potentiel',               nameJP: '可能形',        level: 'N4',    freq: 91 },
  { id: 'passive-caus', nameFR: 'Passif et causatif',      nameJP: '受け身・使役',  level: 'N3',    freq: 73 },
  { id: 'conditional',  nameFR: 'Conditionnel',            nameJP: '条件表現',      level: 'N4–N3', freq: 79 },
  { id: 'purpose',      nameFR: 'But et destination',      nameJP: '目的・方向',    level: 'N5–N3', freq: 86 },
  { id: 'time-seq',     nameFR: 'Temps et séquence',       nameJP: '時間・順序',    level: 'N5–N4', freq: 94 },
  { id: 'intention',    nameFR: 'Intention et plan',       nameJP: '意図・計画',    level: 'N4–N3', freq: 83 },
  { id: 'conjecture',   nameFR: 'Conjecture et apparence', nameJP: '推量・様態',    level: 'N4–N3', freq: 81 },
  { id: 'quotation',    nameFR: 'Citation et pensée',      nameJP: '引用・思考',    level: 'N4',    freq: 89 },
  { id: 'cause',        nameFR: 'Cause et liaison',        nameJP: '原因・逆接',    level: 'N5–N3', freq: 93 },
  { id: 'i-adj',        nameFR: 'Adjectifs en い',         nameJP: 'い形容詞',      level: 'N5',    freq: 97 },
  { id: 'na-adj',       nameFR: 'Adjectifs en な',         nameJP: 'な形容詞',      level: 'N5',    freq: 95 },
  { id: 'copula',       nameFR: 'Noms et copule',          nameJP: '名詞・コピュラ', level: 'N5',   freq: 98 },
  { id: 'comparison',   nameFR: 'Comparaison',             nameJP: '比較表現',      level: 'N4',    freq: 76 },
  { id: 'nominalizer',  nameFR: 'Nominalisation',          nameJP: '名詞化',        level: 'N4–N3', freq: 80 },
];

// ── Template type ─────────────────────────────────────────────────────────────

type Pair = { kanji: string; kana: string };

interface Template {
  categoryId: string;
  targetForm: string;
  grammarPoint: string;
  applicable: (w: WordEntry) => boolean;
  generate: (w: WordEntry) => Pair | null;
  ctx: (w: WordEntry) => string;
  hint: (w: WordEntry, ans: Pair) => string;
}

const isVerb = (w: WordEntry) => w.type === 'g1' || w.type === 'g2' || w.type === 'suru';
const isI    = (w: WordEntry) => w.type === 'i-adj';
const isNa   = (w: WordEntry) => w.type === 'na-adj';
const isNoun = (w: WordEntry) => w.type === 'noun';

// Helpers for hint text
function hMasu(w: WordEntry): string {
  if (w.type === 'g1') return `G1 ${lk(w)}→${G1_MASU[lk(w)]} + ます`;
  if (w.type === 'g2') return 'G2 る→(stem) + ます';
  return 'する→します';
}
function hTe(w: WordEntry): string {
  if (w.type === 'g1') return `G1 ${lk(w)}→${G1_TE[lk(w)]}`;
  if (w.type === 'g2') return 'G2 る→て';
  return 'する→して';
}
function hNai(w: WordEntry): string {
  if (w.type === 'g1') return `G1 ${lk(w)}→${G1_NAI[lk(w)]}`;
  if (w.type === 'g2') return 'G2 る→ない';
  return 'する→しない';
}
function hTa(w: WordEntry): string {
  if (w.type === 'g1') return `G1 ${lk(w)}→${G1_TA[lk(w)]}`;
  if (w.type === 'g2') return 'G2 る→た';
  return 'する→した';
}

// ── Templates ─────────────────────────────────────────────────────────────────

const TEMPLATES: Template[] = [

  // ── CATEGORY: verb-base ───────────────────────────────────────────────────

  { categoryId:'verb-base', targetForm:'ます形', grammarPoint:'〜ます',
    applicable: isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji:s.kanji+'ます', kana:s.kana+'ます' } : null; },
    ctx: w => `pour exprimer "${w.baseMeaning}" de façon polie (présent affirmatif)`,
    hint: (w, a) => `${hMasu(w)} : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'verb-base', targetForm:'ません形', grammarPoint:'〜ません',
    applicable: isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji:s.kanji+'ません', kana:s.kana+'ません' } : null; },
    ctx: w => `pour nier poliment "${w.baseMeaning}" au présent`,
    hint: (w, a) => `${hMasu(w)} + ません : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'verb-base', targetForm:'ました形', grammarPoint:'〜ました',
    applicable: isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji:s.kanji+'ました', kana:s.kana+'ました' } : null; },
    ctx: w => `pour dire qu'on a "${w.baseMeaning}" (passé poli)`,
    hint: (w, a) => `${hMasu(w)} + ました : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'verb-base', targetForm:'ませんでした形', grammarPoint:'〜ませんでした',
    applicable: isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji:s.kanji+'ませんでした', kana:s.kana+'ませんでした' } : null; },
    ctx: w => `pour nier qu'on a "${w.baseMeaning}" (passé poli négatif)`,
    hint: (w, a) => `${hMasu(w)} + ませんでした : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'verb-base', targetForm:'て形', grammarPoint:'〜て',
    applicable: isVerb,
    generate: w => teForm(w),
    ctx: w => `forme て de "${w.baseForm}" (base pour constructions verbales)`,
    hint: (w, a) => `${hTe(w)} : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'verb-base', targetForm:'ない形', grammarPoint:'〜ない',
    applicable: isVerb,
    generate: w => naiForm(w),
    ctx: w => `forme négative courte (plain) de "${w.baseForm}"`,
    hint: (w, a) => `${hNai(w)} : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'verb-base', targetForm:'た形', grammarPoint:'〜た',
    applicable: isVerb,
    generate: w => taForm(w),
    ctx: w => `forme passé plain (ta-form) de "${w.baseForm}"`,
    hint: (w, a) => `${hTa(w)} : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'verb-base', targetForm:'なかった形', grammarPoint:'〜なかった',
    applicable: isVerb,
    generate: w => { const n = naiForm(w); return n ? { kanji:n.kanji.slice(0,-2)+'なかった', kana:n.kana.slice(0,-2)+'なかった' } : null; },
    ctx: w => `pour nier "${w.baseMeaning}" au passé (plain négatif passé)`,
    hint: (w, a) => `${hNai(w)} → ない→なかった : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'verb-base', targetForm:'て形', grammarPoint:'〜てから',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'から', kana:t.kana+'から' } : null; },
    ctx: w => `pour dire "après avoir ${w.baseMeaning}…" (séquence stricte)`,
    hint: (w, a) => `${hTe(w)} + から : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: aspect ──────────────────────────────────────────────────────

  { categoryId:'aspect', targetForm:'て形', grammarPoint:'〜ています',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'います', kana:t.kana+'います' } : null; },
    ctx: w => `pour dire qu'on est en train de "${w.baseMeaning}" (progressif)`,
    hint: (w, a) => `${hTe(w)} + います : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'aspect', targetForm:'て形', grammarPoint:'〜ていました',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'いました', kana:t.kana+'いました' } : null; },
    ctx: w => `pour dire qu'on était en train de "${w.baseMeaning}" (progressif passé)`,
    hint: (w, a) => `${hTe(w)} + いました : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'aspect', targetForm:'て形', grammarPoint:'〜てある',
    applicable: w => isVerb(w) && w.type !== 'suru',
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'あります', kana:t.kana+'あります' } : null; },
    ctx: w => `pour indiquer que quelque chose a été "${w.baseMeaning}" (état résultant)`,
    hint: (w, a) => `${hTe(w)} + あります (verbe transitif seulement) : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'aspect', targetForm:'て形', grammarPoint:'〜ておく',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'おきます', kana:t.kana+'おきます' } : null; },
    ctx: w => `pour faire "${w.baseMeaning}" à l'avance / préparer`,
    hint: (w, a) => `${hTe(w)} + おきます : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'aspect', targetForm:'て形', grammarPoint:'〜てしまう',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'しまいます', kana:t.kana+'しまいます' } : null; },
    ctx: w => `pour exprimer une complétion (souvent avec regret) de "${w.baseMeaning}"`,
    hint: (w, a) => `${hTe(w)} + しまいます : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'aspect', targetForm:'て形', grammarPoint:'〜てみる',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'みます', kana:t.kana+'みます' } : null; },
    ctx: w => `pour essayer de "${w.baseMeaning}" (pour voir comment ça se passe)`,
    hint: (w, a) => `${hTe(w)} + みます : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'aspect', targetForm:'て形', grammarPoint:'〜てくる',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'きます', kana:t.kana+'きます' } : null; },
    ctx: w => `pour exprimer un changement vers soi / un début progressif de "${w.baseMeaning}"`,
    hint: (w, a) => `${hTe(w)} + きます : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'aspect', targetForm:'て形', grammarPoint:'〜ていく',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'いきます', kana:t.kana+'いきます' } : null; },
    ctx: w => `pour exprimer une continuation / un changement s'éloignant de "${w.baseMeaning}"`,
    hint: (w, a) => `${hTe(w)} + いきます : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: giving ──────────────────────────────────────────────────────

  { categoryId:'giving', targetForm:'て形', grammarPoint:'〜てあげる',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'あげます', kana:t.kana+'あげます' } : null; },
    ctx: w => `pour dire qu'on fait "${w.baseMeaning}" pour quelqu'un (sortant)`,
    hint: (w, a) => `${hTe(w)} + あげます : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'giving', targetForm:'て形', grammarPoint:'〜てくれる',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'くれます', kana:t.kana+'くれます' } : null; },
    ctx: w => `pour dire que quelqu'un fait "${w.baseMeaning}" pour moi/nous`,
    hint: (w, a) => `${hTe(w)} + くれます : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'giving', targetForm:'て形', grammarPoint:'〜てもらう',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'もらいます', kana:t.kana+'もらいます' } : null; },
    ctx: w => `pour dire qu'on reçoit l'action de "${w.baseMeaning}" de quelqu'un`,
    hint: (w, a) => `${hTe(w)} + もらいます : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: desire ──────────────────────────────────────────────────────

  { categoryId:'desire', targetForm:'ます幹', grammarPoint:'〜たいです',
    applicable: isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji:s.kanji+'たいです', kana:s.kana+'たいです' } : null; },
    ctx: w => `pour exprimer l'envie de "${w.baseMeaning}" (1ère personne)`,
    hint: (w, a) => `${hMasu(w)} + たいです : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'desire', targetForm:'ます幹', grammarPoint:'〜たがっています',
    applicable: isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji:s.kanji+'たがっています', kana:s.kana+'たがっています' } : null; },
    ctx: w => `pour exprimer que quelqu'un d'autre veut "${w.baseMeaning}" (3ème personne)`,
    hint: (w, a) => `${hMasu(w)} + たがっています : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'desire', targetForm:'意向形', grammarPoint:'〜よう / 〜ましょう',
    applicable: isVerb,
    generate: w => { const v = volitionalForm(w); return v ? { kanji:v.kanji, kana:v.kana } : null; },
    ctx: w => `forme volitionnelle de "${w.baseForm}" (plain — intention ou suggestion)`,
    hint: (w, a) => {
      if (w.type === 'g1') return `G1 ${lk(w)}→${G1_VOL[lk(w)]} : ${w.baseForm} → ${a.kanji}`;
      if (w.type === 'g2') return `G2 る→よう : ${w.baseForm} → ${a.kanji}`;
      return `する→しよう : ${w.baseForm} → ${a.kanji}`;
    } },

  // ── CATEGORY: permission ──────────────────────────────────────────────────

  { categoryId:'permission', targetForm:'て形', grammarPoint:'〜てください',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'ください', kana:t.kana+'ください' } : null; },
    ctx: w => `pour demander poliment de "${w.baseMeaning}"`,
    hint: (w, a) => `${hTe(w)} + ください : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'permission', targetForm:'て形', grammarPoint:'〜てもいいです',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'もいいです', kana:t.kana+'もいいです' } : null; },
    ctx: w => `pour demander/donner la permission de "${w.baseMeaning}"`,
    hint: (w, a) => `${hTe(w)} + もいいです : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'permission', targetForm:'て形', grammarPoint:'〜てはいけません',
    applicable: isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji:t.kanji+'はいけません', kana:t.kana+'はいけません' } : null; },
    ctx: w => `pour interdire de "${w.baseMeaning}"`,
    hint: (w, a) => `${hTe(w)} + はいけません : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'permission', targetForm:'ない形', grammarPoint:'〜なければいけません',
    applicable: isVerb,
    generate: w => { const n = naiForm(w); return n ? { kanji:n.kanji.slice(0,-1)+'ければいけません', kana:n.kana.slice(0,-1)+'ければいけません' } : null; },
    ctx: w => `pour exprimer l'obligation de "${w.baseMeaning}" (il faut)`,
    hint: (w, a) => `${hNai(w)} → ない→なければいけません : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'permission', targetForm:'ない形', grammarPoint:'〜なくてもいいです',
    applicable: isVerb,
    generate: w => { const n = naiForm(w); return n ? { kanji:n.kanji.slice(0,-1)+'くてもいいです', kana:n.kana.slice(0,-1)+'くてもいいです' } : null; },
    ctx: w => `pour dire qu'il n'est pas nécessaire de "${w.baseMeaning}"`,
    hint: (w, a) => `${hNai(w)} → ない→なくてもいいです : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'permission', targetForm:'ない形', grammarPoint:'〜ないでください',
    applicable: isVerb,
    generate: w => { const n = naiForm(w); return n ? { kanji:n.kanji+'でください', kana:n.kana+'でください' } : null; },
    ctx: w => `pour demander de ne pas "${w.baseMeaning}"`,
    hint: (w, a) => `${hNai(w)} + でください : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: potential ───────────────────────────────────────────────────

  { categoryId:'potential', targetForm:'可能形', grammarPoint:'可能形 (potentiel)',
    applicable: w => isVerb(w) && !['困る','始まる'].includes(w.baseForm),
    generate: w => { const p = potential(w); return p ? { kanji:p.kanji.slice(0,-1)+'ます', kana:p.kana.slice(0,-1)+'ます' } : null; },
    ctx: w => `pour dire qu'on peut "${w.baseMeaning}" (forme potentielle)`,
    hint: (w, a) => {
      if (w.type === 'g1') return `G1 ${lk(w)}→${G1_POT[lk(w)]?.slice(0,-1)}ます : ${w.baseForm} → ${a.kanji}`;
      if (w.type === 'g2') return `G2 る→られます : ${w.baseForm} → ${a.kanji}`;
      return `する→できます : ${w.baseForm} → ${a.kanji}`;
    } },

  { categoryId:'potential', targetForm:'辞書形', grammarPoint:'〜ことができます',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'ことができます', kana:w.baseReading+'ことができます' }),
    ctx: w => `pour exprimer la capacité de "${w.baseMeaning}" (construction nominale)`,
    hint: (w, a) => `辞書形 + ことができます : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: passive-caus ────────────────────────────────────────────────

  { categoryId:'passive-caus', targetForm:'受け身形', grammarPoint:'〜られる (passif)',
    applicable: isVerb,
    generate: w => { const p = passiveForm(w); return p ? { kanji:p.kanji.slice(0,-1)+'ます', kana:p.kana.slice(0,-1)+'ます' } : null; },
    ctx: w => `forme passive de "${w.baseForm}" (sujet reçoit l'action)`,
    hint: (w, a) => {
      if (w.type === 'g1') return `G1 ${lk(w)}→${G1_PASS[lk(w)]?.slice(0,-1)}ます : ${w.baseForm} → ${a.kanji}`;
      if (w.type === 'g2') return `G2 る→られます (passif) : ${w.baseForm} → ${a.kanji}`;
      return `する→されます : ${w.baseForm} → ${a.kanji}`;
    } },

  { categoryId:'passive-caus', targetForm:'使役形', grammarPoint:'〜させる (causatif)',
    applicable: isVerb,
    generate: w => { const c = causativeForm(w); return c ? { kanji:c.kanji.slice(0,-1)+'ます', kana:c.kana.slice(0,-1)+'ます' } : null; },
    ctx: w => `forme causative de "${w.baseForm}" (faire faire à quelqu'un)`,
    hint: (w, a) => {
      if (w.type === 'g1') return `G1 ${lk(w)}→${G1_CAUS[lk(w)]?.slice(0,-1)}ます : ${w.baseForm} → ${a.kanji}`;
      if (w.type === 'g2') return `G2 る→させます : ${w.baseForm} → ${a.kanji}`;
      return `する→させます : ${w.baseForm} → ${a.kanji}`;
    } },

  { categoryId:'passive-caus', targetForm:'使役受け身形', grammarPoint:'〜させられる (causatif-passif)',
    applicable: w => isVerb(w) && w.type !== 'suru',
    generate: w => {
      const c = causativeForm(w);
      if (!c) return null;
      // causative ends in せる/させる → remove る, add られます
      return { kanji:c.kanji.slice(0,-1)+'られます', kana:c.kana.slice(0,-1)+'られます' };
    },
    ctx: w => `causatif-passif de "${w.baseForm}" (être forcé de faire)`,
    hint: (w, a) => `使役形 (${w.type==='g1'?`${lk(w)}→させ`:'させ'}) + られます : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: conditional ─────────────────────────────────────────────────

  { categoryId:'conditional', targetForm:'ば形', grammarPoint:'〜ば (conditionnel)',
    applicable: isVerb,
    generate: w => baForm(w),
    ctx: w => `forme conditionnelle ば de "${w.baseForm}" (si… alors)`,
    hint: (w, a) => {
      if (w.type === 'g1') return `G1 ${lk(w)}→${G1_BA[lk(w)]} : ${w.baseForm} → ${a.kanji}`;
      if (w.type === 'g2') return `G2 る→れば : ${w.baseForm} → ${a.kanji}`;
      return `する→すれば : ${w.baseForm} → ${a.kanji}`;
    } },

  { categoryId:'conditional', targetForm:'た形', grammarPoint:'〜たら (conditionnel)',
    applicable: isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji:t.kanji+'ら', kana:t.kana+'ら' } : null; },
    ctx: w => `conditionnel たら de "${w.baseForm}" (quand / si [événement se produit])`,
    hint: (w, a) => `${hTa(w)} + ら : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'conditional', targetForm:'辞書形', grammarPoint:'〜と (conditionnel naturel)',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'と', kana:w.baseReading+'と' }),
    ctx: w => `conditionnel と de "${w.baseForm}" (résultat naturel/automatique)`,
    hint: (w, a) => `辞書形 + と : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'conditional', targetForm:'辞書形', grammarPoint:'〜なら (conditionnel topical)',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'なら', kana:w.baseReading+'なら' }),
    ctx: w => `conditionnel なら de "${w.baseForm}" (si c'est le cas que…)`,
    hint: (w, a) => `辞書形 + なら : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: purpose ─────────────────────────────────────────────────────

  { categoryId:'purpose', targetForm:'ます幹', grammarPoint:'V-stem に行く',
    applicable: isVerb,
    generate: w => {
      if (w.type === 'suru') return { kanji:w.baseForm.slice(0,-2)+'に行きます', kana:w.baseReading.slice(0,-2)+'にいきます' };
      const s = masuStem(w);
      return s ? { kanji:s.kanji+'に行きます', kana:s.kana+'にいきます' } : null;
    },
    ctx: w => `pour exprimer le but d'un déplacement (aller pour "${w.baseMeaning}")`,
    hint: (w, a) => w.type==='suru'
      ? `する verbe : retirer する, ajouter に行きます → ${a.kanji}`
      : `${hMasu(w)} → stem + に行きます : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'purpose', targetForm:'辞書形', grammarPoint:'〜ために',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'ために', kana:w.baseReading+'ために' }),
    ctx: w => `pour exprimer le but de "${w.baseMeaning}" (dans le but de)`,
    hint: (w, a) => `辞書形 + ために : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'purpose', targetForm:'可能形', grammarPoint:'〜ように',
    applicable: w => isVerb(w) && !['困る','始まる'].includes(w.baseForm),
    generate: w => { const p = potential(w); return p ? { kanji:p.kanji+'ように', kana:p.kana+'ように' } : null; },
    ctx: w => `pour exprimer un but progressif (pour pouvoir "${w.baseMeaning}")`,
    hint: (w, a) => `可能形 + ように : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: time-seq ────────────────────────────────────────────────────

  { categoryId:'time-seq', targetForm:'辞書形', grammarPoint:'〜前に',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'前に', kana:w.baseReading+'まえに' }),
    ctx: w => `pour dire "avant de ${w.baseMeaning}"`,
    hint: (w, a) => `辞書形 + 前に : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'time-seq', targetForm:'た形', grammarPoint:'〜た後で',
    applicable: isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji:t.kanji+'後で', kana:t.kana+'あとで' } : null; },
    ctx: w => `pour dire "après avoir ${w.baseMeaning}"`,
    hint: (w, a) => `${hTa(w)} + 後で : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'time-seq', targetForm:'ます幹', grammarPoint:'〜ながら',
    applicable: isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji:s.kanji+'ながら', kana:s.kana+'ながら' } : null; },
    ctx: w => `pour dire "tout en ${w.baseMeaning}" (deux actions simultanées)`,
    hint: (w, a) => `${hMasu(w)} + ながら : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'time-seq', targetForm:'た形', grammarPoint:'〜たり〜たりします',
    applicable: isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji:t.kanji+'り', kana:t.kana+'り' } : null; },
    ctx: w => `forme たり de "${w.baseForm}" (pour une liste non exhaustive d'actions)`,
    hint: (w, a) => `${hTa(w)} + り → [V]たり[V]たりします : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'time-seq', targetForm:'辞書形', grammarPoint:'〜とき',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'とき', kana:w.baseReading+'とき' }),
    ctx: w => `pour exprimer "au moment de / quand on ${w.baseMeaning}" (avant l'action)`,
    hint: (w, a) => `辞書形 + とき (avant l'action) : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'time-seq', targetForm:'た形', grammarPoint:'〜たとき',
    applicable: isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji:t.kanji+'とき', kana:t.kana+'とき' } : null; },
    ctx: w => `pour exprimer "quand on a ${w.baseMeaning}" (après l'action)`,
    hint: (w, a) => `${hTa(w)} + とき (après l'action) : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'time-seq', targetForm:'辞書形', grammarPoint:'〜までに',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'までに', kana:w.baseReading+'までに' }),
    ctx: w => `pour exprimer une deadline (avant de "${w.baseMeaning}")`,
    hint: (w, a) => `辞書形 + までに : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: intention ───────────────────────────────────────────────────

  { categoryId:'intention', targetForm:'辞書形', grammarPoint:'〜つもりです',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'つもりです', kana:w.baseReading+'つもりです' }),
    ctx: w => `pour exprimer l'intention de "${w.baseMeaning}"`,
    hint: (w, a) => `辞書形 + つもりです : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'intention', targetForm:'辞書形', grammarPoint:'〜予定です',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'予定です', kana:w.baseReading+'よていです' }),
    ctx: w => `pour dire que "${w.baseMeaning}" est prévu / planifié`,
    hint: (w, a) => `辞書形 + 予定です : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'intention', targetForm:'辞書形', grammarPoint:'〜ことにします',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'ことにします', kana:w.baseReading+'ことにします' }),
    ctx: w => `pour exprimer qu'on décide de "${w.baseMeaning}"`,
    hint: (w, a) => `辞書形 + ことにします : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'intention', targetForm:'辞書形', grammarPoint:'〜ことになりました',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'ことになりました', kana:w.baseReading+'ことになりました' }),
    ctx: w => `pour dire qu'il a été décidé (par les circonstances) de "${w.baseMeaning}"`,
    hint: (w, a) => `辞書形 + ことになりました : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'intention', targetForm:'可能形', grammarPoint:'〜ようになりました',
    applicable: w => isVerb(w) && !['困る','始まる'].includes(w.baseForm),
    generate: w => { const p = potential(w); return p ? { kanji:p.kanji+'ようになりました', kana:p.kana+'ようになりました' } : null; },
    ctx: w => `pour exprimer qu'on est maintenant capable de "${w.baseMeaning}" (changement)`,
    hint: (w, a) => `可能形 + ようになりました : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'intention', targetForm:'辞書形', grammarPoint:'〜ようにします',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'ようにします', kana:w.baseReading+'ようにします' }),
    ctx: w => `pour exprimer l'effort d'essayer de "${w.baseMeaning}"`,
    hint: (w, a) => `辞書形 + ようにします : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: conjecture ──────────────────────────────────────────────────

  { categoryId:'conjecture', targetForm:'辞書形', grammarPoint:'〜かもしれません',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'かもしれません', kana:w.baseReading+'かもしれません' }),
    ctx: w => `pour exprimer qu'on pense peut-être "${w.baseMeaning}"`,
    hint: (w, a) => `辞書形 + かもしれません : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'conjecture', targetForm:'辞書形', grammarPoint:'〜でしょう',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'でしょう', kana:w.baseReading+'でしょう' }),
    ctx: w => `pour exprimer une probabilité de "${w.baseMeaning}" (probablement)`,
    hint: (w, a) => `辞書形 + でしょう : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'conjecture', targetForm:'辞書形', grammarPoint:'〜はずです',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'はずです', kana:w.baseReading+'はずです' }),
    ctx: w => `pour exprimer ce qui devrait être le cas (censé "${w.baseMeaning}")`,
    hint: (w, a) => `辞書形 + はずです : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'conjecture', targetForm:'ます幹', grammarPoint:'〜そうです (様態)',
    applicable: isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji:s.kanji+'そうです', kana:s.kana+'そうです' } : null; },
    ctx: w => `pour décrire une apparence directe (on dirait que "${w.baseMeaning}")`,
    hint: (w, a) => `${hMasu(w)} + そうです : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'conjecture', targetForm:'辞書形', grammarPoint:'〜そうです (伝聞)',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'そうです', kana:w.baseReading+'そうです' }),
    ctx: w => `pour rapporter ce qu'on a entendu dire (j'ai entendu que "${w.baseMeaning}")`,
    hint: (w, a) => `辞書形 + そうです (ouï-dire) : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'conjecture', targetForm:'辞書形', grammarPoint:'〜らしいです',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'らしいです', kana:w.baseReading+'らしいです' }),
    ctx: w => `pour dire "il paraît que ${w.baseMeaning}" (apparemment)`,
    hint: (w, a) => `辞書形 + らしいです : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'conjecture', targetForm:'辞書形', grammarPoint:'〜ようです',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'ようです', kana:w.baseReading+'ようです' }),
    ctx: w => `pour dire "il semble que ${w.baseMeaning}" (inférence)`,
    hint: (w, a) => `辞書形 + ようです : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: quotation ───────────────────────────────────────────────────

  { categoryId:'quotation', targetForm:'辞書形', grammarPoint:'〜と思います',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'と思います', kana:w.baseReading+'とおもいます' }),
    ctx: w => `pour dire "je pense que ${w.baseMeaning}"`,
    hint: (w, a) => `辞書形 + と思います : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'quotation', targetForm:'辞書形', grammarPoint:'〜と言いました',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'と言いました', kana:w.baseReading+'といいました' }),
    ctx: w => `pour rapporter qu'on a dit que "${w.baseMeaning}"`,
    hint: (w, a) => `辞書形 + と言いました : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'quotation', targetForm:'辞書形', grammarPoint:'〜と聞きました',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'と聞きました', kana:w.baseReading+'とききました' }),
    ctx: w => `pour dire "j'ai entendu dire que ${w.baseMeaning}"`,
    hint: (w, a) => `辞書形 + と聞きました : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: cause ───────────────────────────────────────────────────────

  { categoryId:'cause', targetForm:'た形', grammarPoint:'〜から',
    applicable: isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji:t.kanji+'から', kana:t.kana+'から' } : null; },
    ctx: w => `pour donner la raison de "${w.baseMeaning}" (parce que — subjectif)`,
    hint: (w, a) => `${hTa(w)} + から : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'cause', targetForm:'た形', grammarPoint:'〜ので',
    applicable: isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji:t.kanji+'ので', kana:t.kana+'ので' } : null; },
    ctx: w => `pour donner la raison de "${w.baseMeaning}" (parce que — objectif/poli)`,
    hint: (w, a) => `${hTa(w)} + ので : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'cause', targetForm:'た形', grammarPoint:'〜のに',
    applicable: isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji:t.kanji+'のに', kana:t.kana+'のに' } : null; },
    ctx: w => `pour exprimer une déception malgré "${w.baseMeaning}" (bien que / pourtant)`,
    hint: (w, a) => `${hTa(w)} + のに (concession) : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'cause', targetForm:'た形', grammarPoint:'〜けど',
    applicable: isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji:t.kanji+'けど', kana:t.kana+'けど' } : null; },
    ctx: w => `pour introduire une nuance "mais" après "${w.baseMeaning}"`,
    hint: (w, a) => `${hTa(w)} + けど : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'cause', targetForm:'ます幹', grammarPoint:'〜すぎる',
    applicable: isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji:s.kanji+'すぎます', kana:s.kana+'すぎます' } : null; },
    ctx: w => `pour dire qu'on "${w.baseMeaning}" trop`,
    hint: (w, a) => `${hMasu(w)} + すぎます : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: i-adj ───────────────────────────────────────────────────────

  { categoryId:'i-adj', targetForm:'い-adj', grammarPoint:'い-adj (présent aff.)',
    applicable: isI,
    generate: w => ({ kanji:w.baseForm, kana:w.baseReading }),
    ctx: w => `forme de base de l'adjectif "${w.baseMeaning}" au présent affirmatif`,
    hint: (_, a) => `い-adj : forme de dictionnaire → ${a.kanji}` },

  { categoryId:'i-adj', targetForm:'くない形', grammarPoint:'い-adj くない',
    applicable: isI,
    generate: w => tf(w, 1, 'くない'),
    ctx: w => `forme négative de l'adjectif "${w.baseMeaning}"`,
    hint: (w, a) => `い-adj い→くない : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'i-adj', targetForm:'かった形', grammarPoint:'い-adj かった',
    applicable: isI,
    generate: w => tf(w, 1, 'かった'),
    ctx: w => `forme passée de l'adjectif "${w.baseMeaning}"`,
    hint: (w, a) => `い-adj い→かった : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'i-adj', targetForm:'くなかった形', grammarPoint:'い-adj くなかった',
    applicable: isI,
    generate: w => tf(w, 1, 'くなかった'),
    ctx: w => `forme passée négative de l'adjectif "${w.baseMeaning}"`,
    hint: (w, a) => `い-adj い→くなかった : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'i-adj', targetForm:'くて形', grammarPoint:'い-adj + くて',
    applicable: isI,
    generate: w => tf(w, 1, 'くて'),
    ctx: w => `pour enchaîner une description (adjectif "${w.baseMeaning}")`,
    hint: (w, a) => `い-adj い→くて : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'i-adj', targetForm:'く形', grammarPoint:'い-adj + く (adverbe)',
    applicable: isI,
    generate: w => tf(w, 1, 'く'),
    ctx: w => `forme adverbiale de l'adjectif "${w.baseMeaning}"`,
    hint: (w, a) => `い-adj い→く : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'i-adj', targetForm:'くなります', grammarPoint:'い-adj + くなる',
    applicable: isI,
    generate: w => tf(w, 1, 'くなります'),
    ctx: w => `pour dire que ça devient "${w.baseMeaning}"`,
    hint: (w, a) => `い-adj い→くなります : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'i-adj', targetForm:'そうです', grammarPoint:'い-adj + そうです',
    applicable: isI,
    generate: w => tf(w, 1, 'そうです'),
    ctx: w => `pour dire que ça a l'air "${w.baseMeaning}" (apparence directe)`,
    hint: (w, a) => `い-adj い→そうです : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'i-adj', targetForm:'すぎます', grammarPoint:'い-adj + すぎる',
    applicable: isI,
    generate: w => tf(w, 1, 'すぎます'),
    ctx: w => `pour dire que c'est trop "${w.baseMeaning}"`,
    hint: (w, a) => `い-adj い→すぎます : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: na-adj ──────────────────────────────────────────────────────

  { categoryId:'na-adj', targetForm:'な-adj (présent aff.)', grammarPoint:'な-adj + です',
    applicable: isNa,
    generate: w => tf(w, 1, 'です'),
    ctx: w => `forme polie de l'adjectif "${w.baseMeaning}" au présent affirmatif`,
    hint: (w, a) => `な-adj な→ + です : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'na-adj', targetForm:'ではありません', grammarPoint:'な-adj + ではありません',
    applicable: isNa,
    generate: w => tf(w, 1, 'ではありません'),
    ctx: w => `forme négative polie de l'adjectif "${w.baseMeaning}"`,
    hint: (w, a) => `な-adj な→ + ではありません : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'na-adj', targetForm:'でした', grammarPoint:'な-adj + でした',
    applicable: isNa,
    generate: w => tf(w, 1, 'でした'),
    ctx: w => `forme passée polie de l'adjectif "${w.baseMeaning}"`,
    hint: (w, a) => `な-adj な→ + でした : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'na-adj', targetForm:'ではありませんでした', grammarPoint:'な-adj + ではありませんでした',
    applicable: isNa,
    generate: w => tf(w, 1, 'ではありませんでした'),
    ctx: w => `forme passée négative de l'adjectif "${w.baseMeaning}"`,
    hint: (w, a) => `な-adj な→ + ではありませんでした : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'na-adj', targetForm:'で形', grammarPoint:'な-adj + で',
    applicable: isNa,
    generate: w => tf(w, 1, 'で'),
    ctx: w => `pour enchaîner une description (adjectif "${w.baseMeaning}")`,
    hint: (w, a) => `な-adj な→で : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'na-adj', targetForm:'に形', grammarPoint:'な-adj + に (adverbe)',
    applicable: isNa,
    generate: w => tf(w, 1, 'に'),
    ctx: w => `forme adverbiale de l'adjectif "${w.baseMeaning}"`,
    hint: (w, a) => `な-adj な→に : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'na-adj', targetForm:'になります', grammarPoint:'な-adj + になる',
    applicable: isNa,
    generate: w => tf(w, 1, 'になります'),
    ctx: w => `pour dire que ça devient "${w.baseMeaning}"`,
    hint: (w, a) => `な-adj な→になります : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'na-adj', targetForm:'そうです', grammarPoint:'な-adj + そうです',
    applicable: isNa,
    generate: w => tf(w, 1, 'そうです'),
    ctx: w => `pour dire que ça a l'air "${w.baseMeaning}" (apparence directe)`,
    hint: (w, a) => `な-adj な→そうです : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'na-adj', targetForm:'すぎます', grammarPoint:'な-adj + すぎる',
    applicable: isNa,
    generate: w => tf(w, 1, 'すぎます'),
    ctx: w => `pour dire que c'est trop "${w.baseMeaning}"`,
    hint: (w, a) => `な-adj な→すぎます : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: copula ──────────────────────────────────────────────────────

  { categoryId:'copula', targetForm:'N + です', grammarPoint:'〜です (présent aff.)',
    applicable: isNoun,
    generate: w => ({ kanji:w.baseForm+'です', kana:w.baseReading+'です' }),
    ctx: w => `pour dire "c'est un(e) ${w.baseMeaning}" (présent affirmatif poli)`,
    hint: (w, a) => `nom + です : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'copula', targetForm:'N + ではありません', grammarPoint:'〜ではありません',
    applicable: isNoun,
    generate: w => ({ kanji:w.baseForm+'ではありません', kana:w.baseReading+'ではありません' }),
    ctx: w => `pour nier "c'est un(e) ${w.baseMeaning}" au présent`,
    hint: (w, a) => `nom + ではありません : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'copula', targetForm:'N + でした', grammarPoint:'〜でした (passé aff.)',
    applicable: isNoun,
    generate: w => ({ kanji:w.baseForm+'でした', kana:w.baseReading+'でした' }),
    ctx: w => `pour dire "c'était un(e) ${w.baseMeaning}" (passé)`,
    hint: (w, a) => `nom + でした : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'copula', targetForm:'N + ではありませんでした', grammarPoint:'〜ではありませんでした',
    applicable: isNoun,
    generate: w => ({ kanji:w.baseForm+'ではありませんでした', kana:w.baseReading+'ではありませんでした' }),
    ctx: w => `pour nier qu'on était un(e) "${w.baseMeaning}" au passé`,
    hint: (w, a) => `nom + ではありませんでした : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'copula', targetForm:'N + になります', grammarPoint:'〜になる',
    applicable: isNoun,
    generate: w => ({ kanji:w.baseForm+'になります', kana:w.baseReading+'になります' }),
    ctx: w => `pour dire "devenir un(e) ${w.baseMeaning}"`,
    hint: (w, a) => `nom + になります : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: comparison ──────────────────────────────────────────────────

  { categoryId:'comparison', targetForm:'より〜', grammarPoint:'AはBより〜',
    applicable: isI,
    generate: w => tf(w, 0, 'より高いです'),  // dummy — overridden below
    ctx: w => `pour construire la comparaison "A est plus ${w.baseMeaning} que B"`,
    hint: (w, a) => `AはBより[adj] : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'comparison', targetForm:'のほうが〜', grammarPoint:'〜のほうが〜より〜',
    applicable: isI,
    generate: w => ({ kanji:'AのほうがBより'+w.baseForm, kana:'AのほうがBより'+w.baseReading }),
    ctx: w => `pour dire "A est plus ${w.baseMeaning} que B" (construction のほうが)`,
    hint: (w, a) => `AのほうがBより + adj : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'comparison', targetForm:'一番', grammarPoint:'〜の中で一番〜',
    applicable: w => isI(w) || isNa(w),
    generate: w => ({ kanji:'この中で一番'+w.baseForm, kana:'このなかでいちばん'+w.baseReading }),
    ctx: w => `pour dire "le/la plus ${w.baseMeaning} parmi…"`,
    hint: (w, a) => `の中で一番 + adj : ${w.baseForm} → ${a.kanji}` },

  // ── CATEGORY: nominalizer ─────────────────────────────────────────────────

  { categoryId:'nominalizer', targetForm:'こと', grammarPoint:'〜こと (nominalisation)',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'ことが好きです', kana:w.baseReading+'ことがすきです' }),
    ctx: w => `pour nominaliser "${w.baseMeaning}" (こと — abstrait/conceptuel)`,
    hint: (w, a) => `辞書形 + ことが好きです : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'nominalizer', targetForm:'の', grammarPoint:'〜の (nominalisation concrète)',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'のが好きです', kana:w.baseReading+'のがすきです' }),
    ctx: w => `pour nominaliser "${w.baseMeaning}" (の — concret/observable)`,
    hint: (w, a) => `辞書形 + のが好きです : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'nominalizer', targetForm:'た形', grammarPoint:'〜たことがあります (expérience)',
    applicable: isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji:t.kanji+'ことがあります', kana:t.kana+'ことがあります' } : null; },
    ctx: w => `pour dire qu'on a déjà "${w.baseMeaning}" (expérience passée)`,
    hint: (w, a) => `${hTa(w)} + ことがあります : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'nominalizer', targetForm:'辞書形', grammarPoint:'〜ことがあります (habitude)',
    applicable: isVerb,
    generate: w => ({ kanji:w.baseForm+'ことがあります', kana:w.baseReading+'ことがあります' }),
    ctx: w => `pour dire qu'il arrive parfois de "${w.baseMeaning}"`,
    hint: (w, a) => `辞書形 + ことがあります : ${w.baseForm} → ${a.kanji}` },

  { categoryId:'nominalizer', targetForm:'た形', grammarPoint:'〜たほうがいいです',
    applicable: isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji:t.kanji+'ほうがいいです', kana:t.kana+'ほうがいいです' } : null; },
    ctx: w => `pour conseiller de "${w.baseMeaning}" (il vaut mieux)`,
    hint: (w, a) => `${hTa(w)} + ほうがいいです : ${w.baseForm} → ${a.kanji}` },

];

// Fix comparison templates (dummy override for the first one)
const cmpIdx = TEMPLATES.findIndex(t => t.categoryId === 'comparison' && t.grammarPoint === 'AはBより〜');
if (cmpIdx >= 0) {
  TEMPLATES[cmpIdx] = {
    ...TEMPLATES[cmpIdx],
    generate: w => ({ kanji:'AはBより'+w.baseForm, kana:'AはBより'+w.baseReading }),
  };
}

// ── Category frequency map ────────────────────────────────────────────────────

const CATEGORY_FREQ: Record<string, number> = Object.fromEntries(
  GRAMMAR_CATEGORIES.map(c => [c.id, c.freq])
);

// ── Utilities ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function getFamily(t: Template): string {
  if (t.categoryId === 'i-adj') return 'i-adj';
  if (t.categoryId === 'na-adj') return 'na-adj';
  if (t.categoryId === 'copula') return 'copula';
  if (t.categoryId === 'comparison') return 'comparison';
  const tf = t.targetForm;
  if (tf === 'ます形' || tf === 'ません形' || tf === 'ました形' || tf === 'ませんでした形' || tf === 'ます幹') return 'masu';
  if (tf === 'て形') return 'te';
  if (tf === 'ない形' || tf === 'なかった形') return 'nai';
  if (tf === 'た形') return 'ta';
  if (tf === '辞書形' || tf === '可能形' || tf.startsWith('N +')) return t.categoryId;
  return t.categoryId + ':' + tf;
}

function weightedPick(weights: number[]): number | null {
  const total = weights.reduce((s, w) => s + w, 0);
  if (total === 0) return null;
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) return i; }
  for (let i = weights.length - 1; i >= 0; i--) { if (weights[i] > 0) return i; }
  return null;
}

// ── Main generator ────────────────────────────────────────────────────────────

export function generateConjugationExercisesLocal(
  selectedCategories: string[],
  count: number,
): ConjugationExercise[] {
  const templates = TEMPLATES.filter(t => selectedCategories.includes(t.categoryId));
  if (templates.length === 0) return [];

  type FamEntry = { t: Template; freq: number };
  const byFamily = new Map<string, FamEntry[]>();
  for (const t of templates) {
    const fam = getFamily(t);
    if (!byFamily.has(fam)) byFamily.set(fam, []);
    byFamily.get(fam)!.push({ t, freq: CATEGORY_FREQ[t.categoryId] ?? 80 });
  }

  const families = [...byFamily.values()];
  const famBaseWeights = families.map(
    fam => fam.reduce((s, e) => s + e.freq, 0) / fam.length,
  );

  const poolMap = new Map<Template, { words: WordEntry[]; idx: number }>();
  for (const fam of families)
    for (const { t } of fam) {
      const words = LOCAL_WORD_LIST.filter(w => t.applicable(w) && t.generate(w) !== null);
      shuffle(words);
      poolMap.set(t, { words, idx: 0 });
    }

  const usedPairs = new Set<string>();
  const exercises: ConjugationExercise[] = [];

  while (exercises.length < count) {
    const famWeights = families.map((fam, fi) =>
      fam.some(({ t }) => { const p = poolMap.get(t)!; return p.idx < p.words.length; })
        ? famBaseWeights[fi] : 0,
    );
    const fi = weightedPick(famWeights);
    if (fi === null) break;

    const fam = families[fi];
    const tWeights = fam.map(({ t, freq }) => {
      const p = poolMap.get(t)!;
      return p.idx < p.words.length ? freq : 0;
    });
    const ti = weightedPick(tWeights);
    if (ti === null) continue;

    const { t } = fam[ti];
    const pool = poolMap.get(t)!;
    while (pool.idx < pool.words.length) {
      const w = pool.words[pool.idx++];
      const key = `${w.baseForm}|${t.grammarPoint}`;
      if (usedPairs.has(key)) continue;
      const ans = t.generate(w);
      if (!ans) continue;
      usedPairs.add(key);
      exercises.push({
        baseForm: w.baseForm,
        baseReading: w.baseReading,
        baseMeaning: w.baseMeaning,
        targetForm: t.targetForm,
        grammarPoint: t.grammarPoint,
        context: t.ctx(w),
        correctAnswer: ans.kanji,
        correctAnswerKana: ans.kana,
        hint: t.hint(w, ans),
      });
      break;
    }
  }

  shuffle(exercises);
  return exercises;
}

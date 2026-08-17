import type { ConjugationExercise } from '@/types';

type WordType = 'g1' | 'g2' | 'suru' | 'i-adj' | 'na-adj';

interface WordEntry {
  baseForm: string;
  baseReading: string;
  baseMeaning: string;
  type: WordType;
}

export const LOCAL_WORD_LIST: WordEntry[] = [
  // G1 (40)
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
  { baseForm: '困る', baseReading: 'こまる', baseMeaning: 'être gêné', type: 'g1' },
  { baseForm: '頑張る', baseReading: 'がんばる', baseMeaning: 'persévérer', type: 'g1' },
  { baseForm: '売る', baseReading: 'うる', baseMeaning: 'vendre', type: 'g1' },
  { baseForm: '知る', baseReading: 'しる', baseMeaning: 'savoir', type: 'g1' },
  { baseForm: '切る', baseReading: 'きる', baseMeaning: 'couper', type: 'g1' },
  { baseForm: '通る', baseReading: 'とおる', baseMeaning: 'passer par', type: 'g1' },
  { baseForm: '始まる', baseReading: 'はじまる', baseMeaning: 'commencer', type: 'g1' },
  { baseForm: '終わる', baseReading: 'おわる', baseMeaning: 'finir', type: 'g1' },
  { baseForm: '泣く', baseReading: 'なく', baseMeaning: 'pleurer', type: 'g1' },
  { baseForm: '笑う', baseReading: 'わらう', baseMeaning: 'rire', type: 'g1' },
  { baseForm: '働く', baseReading: 'はたらく', baseMeaning: 'travailler', type: 'g1' },
  { baseForm: '歩く', baseReading: 'あるく', baseMeaning: 'marcher', type: 'g1' },
  { baseForm: '引く', baseReading: 'ひく', baseMeaning: 'tirer', type: 'g1' },
  { baseForm: '起こす', baseReading: 'おこす', baseMeaning: 'réveiller', type: 'g1' },
  // G2 (20)
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
  // する (15)
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
  // い-adj (13)
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
  // な-adj (12) — stored WITH な
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

// ── Hint builders ─────────────────────────────────────────────────────────────

function hMasu(w: WordEntry, full: string): string {
  if (w.type === 'g1') return `G1 ${lk(w)}→${G1_MASU[lk(w)]} : ${w.baseForm} → ${full}`;
  if (w.type === 'g2') return `G2 る→(stem) + ます : ${w.baseForm} → ${full}`;
  return `する→します : ${w.baseForm} → ${full}`;
}
function hTe(w: WordEntry, full: string): string {
  if (w.type === 'g1') return `G1 ${lk(w)}→${G1_TE[lk(w)]} : ${w.baseForm} → ${full}`;
  if (w.type === 'g2') return `G2 る→て : ${w.baseForm} → ${full}`;
  return `する→して : ${w.baseForm} → ${full}`;
}
function hNai(w: WordEntry, full: string): string {
  if (w.type === 'g1') return `G1 ${lk(w)}→${G1_NAI[lk(w)]} : ${w.baseForm} → ${full}`;
  if (w.type === 'g2') return `G2 る→ない : ${w.baseForm} → ${full}`;
  return `する→しない : ${w.baseForm} → ${full}`;
}
function hTa(w: WordEntry, full: string): string {
  if (w.type === 'g1') return `G1 ${lk(w)}→${G1_TA[lk(w)]} : ${w.baseForm} → ${full}`;
  if (w.type === 'g2') return `G2 る→た : ${w.baseForm} → ${full}`;
  return `する→した : ${w.baseForm} → ${full}`;
}
function hPot(w: WordEntry, full: string): string {
  if (w.type === 'g1') return `G1 ${lk(w)}→${G1_POT[lk(w)]} : ${w.baseForm} → ${full}`;
  if (w.type === 'g2') return `G2 る→られる : ${w.baseForm} → ${full}`;
  return `する→できる : ${w.baseForm} → ${full}`;
}

// ── Exercise templates ────────────────────────────────────────────────────────

type Pair = { kanji: string; kana: string };

interface Template {
  chapter: number;
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

const TEMPLATES: Template[] = [
  // Ch. 3 — ます形
  { chapter:3, targetForm:'ます形', grammarPoint:'〜ます', applicable:isVerb,
    generate: w => { const s = masuStem(w); return s ? tf(w, w.type==='suru'?2:1, (w.type==='g1'?G1_MASU[lk(w)]??'':w.type==='g2'?'':'し') + 'ます') : null; },
    ctx: w => `pour exprimer "${w.baseMeaning}" de façon polie (présent)`,
    hint: (w, a) => hMasu(w, a.kanji) },
  { chapter:3, targetForm:'ます形', grammarPoint:'〜ません', applicable:isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji: s.kanji+'ません', kana: s.kana+'ません' } : null; },
    ctx: w => `pour nier poliment "${w.baseMeaning}" au présent`,
    hint: (w, a) => hMasu(w, a.kanji) + ' + ません' },
  { chapter:3, targetForm:'ます形', grammarPoint:'〜ませんか', applicable:isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji: s.kanji+'ませんか', kana: s.kana+'ませんか' } : null; },
    ctx: w => `pour inviter quelqu'un à "${w.baseMeaning}" poliment`,
    hint: (w, a) => hMasu(w, a.kanji) + ' + ませんか' },
  // Ch. 4 — ました
  { chapter:4, targetForm:'ます形', grammarPoint:'〜ました', applicable:isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji: s.kanji+'ました', kana: s.kana+'ました' } : null; },
    ctx: w => `pour dire qu'on a "${w.baseMeaning}" (passé poli)`,
    hint: (w, a) => hMasu(w, a.kanji) + ' + ました' },
  { chapter:4, targetForm:'ます形', grammarPoint:'〜ませんでした', applicable:isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji: s.kanji+'ませんでした', kana: s.kana+'ませんでした' } : null; },
    ctx: w => `pour nier qu'on a "${w.baseMeaning}" (passé poli négatif)`,
    hint: (w, a) => hMasu(w, a.kanji) + ' + ませんでした' },
  // Ch. 5 — ましょう
  { chapter:5, targetForm:'ます形', grammarPoint:'〜ましょう', applicable:isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji: s.kanji+'ましょう', kana: s.kana+'ましょう' } : null; },
    ctx: w => `pour proposer de "${w.baseMeaning}" ensemble`,
    hint: (w, a) => hMasu(w, a.kanji) + ' + ましょう' },
  // Ch. 6 — て形
  { chapter:6, targetForm:'て形', grammarPoint:'〜て', applicable:isVerb,
    generate: w => teForm(w),
    ctx: w => `forme て de "${w.baseForm}" (base pour constructions verbales)`,
    hint: (w, a) => hTe(w, a.kanji) },
  { chapter:6, targetForm:'て形', grammarPoint:'〜てください', applicable:isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji: t.kanji+'ください', kana: t.kana+'ください' } : null; },
    ctx: w => `pour demander poliment de "${w.baseMeaning}"`,
    hint: (w, a) => hTe(w, a.kanji) + ' + ください' },
  { chapter:6, targetForm:'て形', grammarPoint:'〜てもいいです', applicable:isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji: t.kanji+'もいいです', kana: t.kana+'もいいです' } : null; },
    ctx: w => `pour demander la permission de "${w.baseMeaning}"`,
    hint: (w, a) => hTe(w, a.kanji) + ' + もいいです' },
  { chapter:6, targetForm:'て形', grammarPoint:'〜てはいけません', applicable:isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji: t.kanji+'はいけません', kana: t.kana+'はいけません' } : null; },
    ctx: w => `pour interdire de "${w.baseMeaning}"`,
    hint: (w, a) => hTe(w, a.kanji) + ' + はいけません' },
  // Ch. 7
  { chapter:7, targetForm:'て形', grammarPoint:'〜ています', applicable:isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji: t.kanji+'います', kana: t.kana+'います' } : null; },
    ctx: w => `pour dire qu'on est en train de "${w.baseMeaning}"`,
    hint: (w, a) => hTe(w, a.kanji) + ' + います' },
  { chapter:7, targetForm:'い-adj くて', grammarPoint:'い-adj + くて', applicable:isI,
    generate: w => tf(w, 1, 'くて'),
    ctx: w => `pour enchaîner une description (adjectif "${w.baseMeaning}")`,
    hint: (_, a) => `い-adj い→くて : ${a.kanji}` },
  { chapter:7, targetForm:'な-adj で', grammarPoint:'な-adj + で', applicable:isNa,
    generate: w => tf(w, 1, 'で'),
    ctx: w => `pour enchaîner une description (adjectif "${w.baseMeaning}")`,
    hint: (_, a) => `な-adj な→で : ${a.kanji}` },
  { chapter:7, targetForm:'ます幹', grammarPoint:'V-stem に行く', applicable:isVerb,
    generate: w => {
      if (w.type === 'suru') {
        // する verbs: use the noun part directly (運動に行きます, not 運動しに行きます)
        return { kanji: w.baseForm.slice(0, -2)+'に行きます', kana: w.baseReading.slice(0, -2)+'にいきます' };
      }
      const s = masuStem(w);
      return s ? { kanji: s.kanji+'に行きます', kana: s.kana+'にいきます' } : null;
    },
    ctx: w => `pour exprimer le but d'un déplacement (aller pour "${w.baseMeaning}")`,
    hint: (w, a) => w.type === 'suru'
      ? `する verbe : retirer する, ajouter に行きます → ${a.kanji}`
      : hMasu(w, a.kanji) + ' → stem + に行きます' },
  // Ch. 8
  { chapter:8, targetForm:'ない形', grammarPoint:'〜ない', applicable:isVerb,
    generate: w => naiForm(w),
    ctx: w => `forme négative courte (plain) de "${w.baseForm}"`,
    hint: (w, a) => hNai(w, a.kanji) },
  { chapter:8, targetForm:'ない形', grammarPoint:'〜ないでください', applicable:isVerb,
    generate: w => { const n = naiForm(w); return n ? { kanji: n.kanji+'でください', kana: n.kana+'でください' } : null; },
    ctx: w => `pour demander de ne pas "${w.baseMeaning}"`,
    hint: (w, a) => hNai(w, a.kanji) + ' + でください' },
  // Ch. 9
  { chapter:9, targetForm:'た形', grammarPoint:'〜たことがあります', applicable:isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji: t.kanji+'ことがあります', kana: t.kana+'ことがあります' } : null; },
    ctx: w => `pour dire qu'on a déjà "${w.baseMeaning}" (expérience)`,
    hint: (w, a) => hTa(w, a.kanji) + ' + ことがあります' },
  { chapter:9, targetForm:'た形', grammarPoint:'〜たり〜たりします', applicable:isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji: t.kanji+'り', kana: t.kana+'り' } : null; },
    ctx: w => `forme たり de "${w.baseForm}" (liste non exhaustive)`,
    hint: (w, a) => hTa(w, a.kanji) + ' + り → [V]たり[V]たりします' },
  // Ch. 10
  { chapter:10, targetForm:'辞書形', grammarPoint:'〜つもりです', applicable:isVerb,
    generate: w => ({ kanji: w.baseForm+'つもりです', kana: w.baseReading+'つもりです' }),
    ctx: w => `pour exprimer l'intention de "${w.baseMeaning}"`,
    hint: (w, a) => `辞書形 + つもりです : ${w.baseForm} → ${a.kanji}` },
  { chapter:10, targetForm:'く形', grammarPoint:'い-adj + くなる', applicable:isI,
    generate: w => tf(w, 1, 'くなります'),
    ctx: w => `pour dire que ça devient "${w.baseMeaning}"`,
    hint: (w, a) => `い-adj い→くなります : ${w.baseForm} → ${a.kanji}` },
  { chapter:10, targetForm:'に形', grammarPoint:'な-adj + になる', applicable:isNa,
    generate: w => tf(w, 1, 'になります'),
    ctx: w => `pour dire que ça devient "${w.baseMeaning}"`,
    hint: (w, a) => `な-adj な→になります : ${w.baseForm} → ${a.kanji}` },
  // Ch. 11
  { chapter:11, targetForm:'ます幹', grammarPoint:'〜たいです', applicable:isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji: s.kanji+'たいです', kana: s.kana+'たいです' } : null; },
    ctx: w => `pour exprimer l'envie de "${w.baseMeaning}"`,
    hint: (w, a) => hMasu(w, a.kanji) + ' + たいです' },
  // Ch. 12
  { chapter:12, targetForm:'ます幹', grammarPoint:'〜すぎる (verbe)', applicable:isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji: s.kanji+'すぎる', kana: s.kana+'すぎる' } : null; },
    ctx: w => `pour dire qu'on "${w.baseMeaning}" trop`,
    hint: (w, a) => hMasu(w, a.kanji) + ' + すぎる' },
  { chapter:12, targetForm:'すぎる', grammarPoint:'〜すぎる (い-adj)', applicable:isI,
    generate: w => tf(w, 1, 'すぎる'),
    ctx: w => `pour dire que c'est trop "${w.baseMeaning}"`,
    hint: (w, a) => `い-adj い→すぎる : ${w.baseForm} → ${a.kanji}` },
  { chapter:12, targetForm:'すぎる', grammarPoint:'〜すぎる (な-adj)', applicable:isNa,
    generate: w => tf(w, 1, 'すぎる'),
    ctx: w => `pour dire que c'est trop "${w.baseMeaning}"`,
    hint: (w, a) => `な-adj な→すぎる : ${w.baseForm} → ${a.kanji}` },
  { chapter:12, targetForm:'た形', grammarPoint:'〜たほうがいいです', applicable:isVerb,
    generate: w => { const t = taForm(w); return t ? { kanji: t.kanji+'ほうがいいです', kana: t.kana+'ほうがいいです' } : null; },
    ctx: w => `pour conseiller de "${w.baseMeaning}" (il vaut mieux)`,
    hint: (w, a) => hTa(w, a.kanji) + ' + ほうがいいです' },
  { chapter:12, targetForm:'ない形', grammarPoint:'〜ないほうがいいです', applicable:isVerb,
    generate: w => { const n = naiForm(w); return n ? { kanji: n.kanji+'ほうがいいです', kana: n.kana+'ほうがいいです' } : null; },
    ctx: w => `pour conseiller de ne pas "${w.baseMeaning}"`,
    hint: (w, a) => hNai(w, a.kanji) + ' + ほうがいいです' },
  { chapter:12, targetForm:'ない形', grammarPoint:'〜なければいけません', applicable:isVerb,
    generate: w => {
      const n = naiForm(w);
      if (!n) return null;
      // ない → なければ: remove い, add ければいけません
      return { kanji: n.kanji.slice(0, -1)+'ければいけません', kana: n.kana.slice(0, -1)+'ければいけません' };
    },
    ctx: w => `pour exprimer l'obligation de "${w.baseMeaning}"`,
    hint: (w, a) => hNai(w, a.kanji) + ' → ない→なければいけません' },
  // Ch. 13
  { chapter:13, targetForm:'可能形', grammarPoint:'可能形 (potentiel)',
    // Exclude intransitive state verbs whose potential form is semantically odd
    applicable: w => isVerb(w) && !['困る','始まる','帰る'].includes(w.baseForm),
    generate: w => potential(w),
    ctx: w => `pour dire qu'on peut "${w.baseMeaning}"`,
    hint: (w, a) => hPot(w, a.kanji) },
  { chapter:13, targetForm:'ます幹', grammarPoint:'〜そうです (verbe)', applicable:isVerb,
    generate: w => { const s = masuStem(w); return s ? { kanji: s.kanji+'そうです', kana: s.kana+'そうです' } : null; },
    ctx: w => `pour décrire une apparence (on dirait que "${w.baseMeaning}")`,
    hint: (w, a) => hMasu(w, a.kanji) + ' + そうです' },
  { chapter:13, targetForm:'そうです', grammarPoint:'〜そうです (い-adj)', applicable:isI,
    generate: w => tf(w, 1, 'そうです'),
    ctx: w => `pour décrire une apparence (ça a l'air "${w.baseMeaning}")`,
    hint: (w, a) => `い-adj い→そうです : ${w.baseForm} → ${a.kanji}` },
  { chapter:13, targetForm:'そうです', grammarPoint:'〜そうです (な-adj)', applicable:isNa,
    generate: w => tf(w, 1, 'そうです'),
    ctx: w => `pour décrire une apparence (ça a l'air "${w.baseMeaning}")`,
    hint: (w, a) => `な-adj な→そうです : ${w.baseForm} → ${a.kanji}` },
  { chapter:13, targetForm:'て形', grammarPoint:'〜てみる', applicable:isVerb,
    generate: w => { const t = teForm(w); return t ? { kanji: t.kanji+'みます', kana: t.kana+'みます' } : null; },
    ctx: w => `pour essayer de "${w.baseMeaning}" (pour voir)`,
    hint: (w, a) => hTe(w, a.kanji) + ' + みます (essai)' },
];

// Fix the ます generate for ch.3 which was over-complex — rewrite cleaner:
// (The ch.3 ます template above had an inlined formula; let's patch it via override index 0)
TEMPLATES[0] = {
  ...TEMPLATES[0],
  generate: (w) => {
    const s = masuStem(w);
    return s ? { kanji: s.kanji + 'ます', kana: s.kana + 'ます' } : null;
  },
};

// ── Main generator ────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function generateConjugationExercisesLocal(
  selectedChapters: number[],
  count: number,
): ConjugationExercise[] {
  const templates = TEMPLATES.filter(t => selectedChapters.includes(t.chapter));
  if (templates.length === 0) return [];

  // Shuffle templates so the round-robin order is random each session
  const shuffledTemplates = [...templates];
  shuffle(shuffledTemplates);

  // For each template, pre-build a shuffled list of applicable words
  const pools = shuffledTemplates.map(t => {
    const words = LOCAL_WORD_LIST.filter(w => t.applicable(w) && t.generate(w) !== null);
    shuffle(words);
    return { t, words, idx: 0 };
  });

  // Round-robin: one exercise per template per round until count is reached.
  // This guarantees each grammar pattern appears roughly the same number of times.
  const exercises: ConjugationExercise[] = [];
  const usedPairs = new Set<string>(); // `${baseForm}|${grammarPoint}`

  outer: while (exercises.length < count) {
    let anyProgress = false;
    for (const pool of pools) {
      if (exercises.length >= count) break outer;
      while (pool.idx < pool.words.length) {
        const w = pool.words[pool.idx++];
        const key = `${w.baseForm}|${pool.t.grammarPoint}`;
        if (usedPairs.has(key)) continue;
        const ans = pool.t.generate(w);
        if (!ans) continue;
        usedPairs.add(key);
        anyProgress = true;
        exercises.push({
          baseForm: w.baseForm,
          baseReading: w.baseReading,
          baseMeaning: w.baseMeaning,
          targetForm: pool.t.targetForm,
          grammarPoint: pool.t.grammarPoint,
          context: pool.t.ctx(w),
          correctAnswer: ans.kanji,
          correctAnswerKana: ans.kana,
          hint: pool.t.hint(w, ans),
        });
        break;
      }
    }
    if (!anyProgress) break;
  }

  // Final shuffle so the round-robin grouping isn't visible to the learner
  shuffle(exercises);
  return exercises;
}

import { toHiragana } from 'wanakana';
import type { ConjugationExercise } from '@/types';

// La particule は se tape « wa » en romaji : on accepte aussi cette variante,
// uniquement là où は est une particule dans les modèles connus (〜ては…, 〜では…)
function withWaParticle(answer: string): string {
  return answer.replace(/([てで])は(?=いけません|ありません)/g, '$1わ');
}

function variants(answer: string): string[] {
  const compact = answer.replace(/\s+/g, '');
  return [...new Set([compact, withWaParticle(compact)])];
}

export function checkConjugationAnswer(input: string, exercise: ConjugationExercise): boolean {
  // NFKC : les lettres latines pleine chasse (ＡＢＣ, ｋａｎ) deviennent des lettres normales
  const cleaned = input.normalize('NFKC').trim();
  if (!cleaned) return false;
  const compact = cleaned.replace(/\s+/g, '');
  // Saisie mixte acceptée : le champ est pré-rempli avec la forme de base en kanji,
  // l'élève peut y ajouter du romaji (難しいdesu → 難しいです)
  const converted = toHiragana(compact.toLowerCase());
  const expected = [...variants(exercise.correctAnswer), ...variants(exercise.correctAnswerKana)];
  return expected.includes(compact) || expected.includes(converted);
}

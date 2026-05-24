import { useState, useEffect } from 'react';
import type { SentenceExercise, SentenceAnswerMode } from '@/types';

interface Props {
  exercise: SentenceExercise;
  mode: SentenceAnswerMode;
  onResult: (correct: number, total: number) => void;
  onNext: () => void;
  isLastExercise?: boolean;
}

function normalizeText(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function checkFreeText(answer: string, keywords: string[]): boolean {
  const norm = normalizeText(answer);
  return keywords.some(kw => norm.includes(normalizeText(kw)));
}

export function SentenceExercise({ exercise, mode, onResult, onNext, isLastExercise = false }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null);
  const [revealedReadings, setRevealedReadings] = useState<Set<number>>(new Set());

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setTooltipIdx(null);
    setRevealedReadings(new Set());
  }, [exercise.sentence]);

  const targetWords = exercise.words
    .map((w, i) => ({ ...w, index: i }))
    .filter(w => w.isTarget);

  const checkAnswer = (wordIdx: number): boolean => {
    const word = exercise.words[wordIdx];
    const answer = answers[wordIdx] ?? '';
    if (mode === 'mcq') return answer === word.correctOption;
    return checkFreeText(answer, word.keywords ?? []);
  };

  const canSubmit = !submitted && targetWords.every(w => (answers[w.index] ?? '').trim());

  const handleSubmit = () => {
    if (!canSubmit) return;
    const correct = targetWords.filter(w => checkAnswer(w.index)).length;
    setSubmitted(true);
    onResult(correct, targetWords.length);
  };

  const activeTooltipWord = tooltipIdx !== null ? exercise.words[tooltipIdx] : null;

  return (
    <div className="space-y-5">
      {/* Sentence display */}
      <div className="card p-4 space-y-3">
        <p className="text-xs text-gray-500">Touchez un mot pour sa prononciation et son sens</p>
        <div className="flex flex-wrap gap-0.5 leading-relaxed">
          {exercise.words.map((word, i) => (
            <button
              key={i}
              onClick={() => setTooltipIdx(tooltipIdx === i ? null : i)}
              className={[
                'kanji-char text-xl px-0.5 rounded transition-colors',
                submitted && word.isTarget
                  ? checkAnswer(i) ? 'text-green-400' : 'text-red-400'
                  : word.isTarget
                  ? 'text-yellow-300 underline decoration-yellow-500/40 underline-offset-4'
                  : 'text-white hover:text-gray-400',
                tooltipIdx === i ? 'bg-[#21262d]' : '',
              ].filter(Boolean).join(' ')}
            >
              {word.text}
            </button>
          ))}
        </div>

        {/* Full translation after submission */}
        {submitted && exercise.translation && (
          <p className="text-sm text-gray-300 italic border-t border-[#30363d] pt-2">{exercise.translation}</p>
        )}

        {/* Inline tooltip */}
        {activeTooltipWord && (
          <div className="border-t border-[#30363d] pt-2 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm">
            <span className="kanji-char text-base text-white">{activeTooltipWord.text}</span>
            {(!activeTooltipWord.isTarget || submitted) && (
              <>
                <span className="text-gray-400">{activeTooltipWord.reading}</span>
                <span className="text-gray-300">{activeTooltipWord.meaning}</span>
              </>
            )}
            {activeTooltipWord.isTarget && !submitted && (
              <span className="text-yellow-600 text-xs">mot cible — définition masquée</span>
            )}
          </div>
        )}
      </div>

      {/* Answer section */}
      <div className="space-y-3">
        <p className="text-xs text-gray-500 text-center">
          {targetWords.length} mot{targetWords.length > 1 ? 's' : ''} à traduire
          {mode === 'free' && <span className="ml-1">(texte libre)</span>}
        </p>

        {targetWords.map(({ index }) => {
          const word = exercise.words[index];
          const ans = answers[index] ?? '';
          const correct = submitted ? checkAnswer(index) : null;

          return (
            <div
              key={index}
              className={`card p-3 space-y-2 ${
                submitted
                  ? correct ? 'border-green-800/60' : 'border-red-800/60'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="kanji-char text-lg text-yellow-300">{word.text}</span>
                {revealedReadings.has(index) ? (
                  <span className="text-gray-500 text-xs">{word.reading}</span>
                ) : (
                  <button
                    onClick={() => setRevealedReadings(r => new Set([...r, index]))}
                    className="text-xs text-gray-600 hover:text-gray-400 border border-[#30363d] rounded px-1.5 py-0.5 transition-colors"
                  >
                    読み
                  </button>
                )}
                {submitted && (
                  <span className={`ml-auto text-sm font-medium ${correct ? 'text-green-400' : 'text-red-400'}`}>
                    {correct ? '✓' : `✗ — ${word.meaning}`}
                  </span>
                )}
              </div>

              {mode === 'free' ? (
                <input
                  type="text"
                  value={ans}
                  disabled={submitted}
                  placeholder="Traduction en français…"
                  onChange={e => setAnswers(a => ({ ...a, [index]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter' && canSubmit) handleSubmit(); }}
                  className={`w-full px-3 py-2 rounded-lg border bg-[#161b22] text-white placeholder-gray-600 outline-none text-sm transition-colors disabled:cursor-default ${
                    submitted
                      ? correct ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'
                      : 'border-[#30363d] focus:border-japan-red'
                  }`}
                />
              ) : (
                <div className="space-y-1.5">
                  {(word.options ?? []).map((opt, oi) => (
                    <label
                      key={oi}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                        submitted
                          ? opt === word.correctOption
                            ? 'border-green-600/60 bg-green-900/10'
                            : ans === opt
                            ? 'border-red-600/60 bg-red-900/10'
                            : 'border-[#21262d] opacity-40'
                          : ans === opt
                          ? 'border-japan-red bg-japan-red/10'
                          : 'border-[#30363d] hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`word-${index}`}
                        value={opt}
                        checked={ans === opt}
                        disabled={submitted}
                        onChange={() => setAnswers(a => ({ ...a, [index]: opt }))}
                        className="accent-red-600 shrink-0"
                      />
                      <span className="text-sm text-gray-200">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action button */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn-primary w-full disabled:opacity-40"
        >
          Vérifier
        </button>
      ) : (
        <button onClick={onNext} className="btn-primary w-full">
          {isLastExercise ? 'Voir les résultats →' : 'Phrase suivante →'}
        </button>
      )}
    </div>
  );
}

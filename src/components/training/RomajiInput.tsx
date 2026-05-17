import { useState, useEffect, useRef } from 'react';
import type { TrainingCard } from '@/types';
import { checkAnswer, toRomaji } from '@/utils/romaji';

interface Props {
  card: TrainingCard;
  onAnswer: (correct: boolean, selected: string) => void;
  onNext: () => void;
}

export function RomajiInput({ card, onAnswer, onNext }: Props) {
  const allReadings = [...card.details.on_readings, ...card.details.kun_readings];

  const [inputs, setInputs] = useState<string[]>(() => new Array(allReadings.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const readings = [...card.details.on_readings, ...card.details.kun_readings];
    setInputs(new Array(readings.length).fill(''));
    setSubmitted(false);
    setSessionCorrect(false);
    firstRef.current?.focus();
  }, [card.kanji]);

  const nonEmpty = inputs.filter((v) => v.trim());
  const canSubmit = nonEmpty.length > 0 && !submitted;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const allValid = nonEmpty.every((input) => checkAnswer(input, allReadings));
    setSessionCorrect(allValid);
    setSubmitted(true);
    onAnswer(allValid, nonEmpty.join(', '));
  };

  const inputState = (value: string): 'idle' | 'correct' | 'wrong' => {
    if (!submitted || !value.trim()) return 'idle';
    return checkAnswer(value, allReadings) ? 'correct' : 'wrong';
  };

  const inputClass = (value: string) => {
    const s = inputState(value);
    const base = 'w-full px-4 py-2.5 rounded-lg border bg-[#161b22] text-white placeholder-gray-600 outline-none transition-colors disabled:cursor-default text-sm';
    if (s === 'correct') return `${base} border-green-500 bg-green-900/10`;
    if (s === 'wrong') return `${base} border-red-500 bg-red-900/10`;
    return `${base} border-[#30363d] focus:border-japan-red`;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Kanji card */}
      <div className="w-56 h-56 flex flex-col items-center justify-center bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl">
        <span className="kanji-char text-8xl text-white select-none">{card.kanji}</span>
        <p className="text-xs text-gray-500 mt-2 px-3 text-center">{card.details.meanings.slice(0, 2).join(', ')}</p>
      </div>

      {/* Input fields */}
      <div className="w-full max-w-sm space-y-2">
        <p className="text-xs text-gray-500 text-center">
          {allReadings.length} prononciation{allReadings.length > 1 ? 's' : ''} — au moins une requise, toutes doivent être correctes
        </p>
        {inputs.map((value, i) => (
          <div key={i} className="relative">
            <input
              ref={i === 0 ? firstRef : undefined}
              type="text"
              value={value}
              placeholder={`Prononciation ${i + 1} en romaji…`}
              disabled={submitted}
              className={inputClass(value)}
              onChange={(e) => {
                const next = [...inputs];
                next[i] = e.target.value;
                setInputs(next);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (!submitted) handleSubmit();
                  else onNext();
                }
              }}
            />
            {submitted && value.trim() && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                {inputState(value) === 'correct' ? '✓' : '✗'}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Correction panel */}
      {submitted && (
        <div className={`card p-4 text-sm w-full max-w-sm space-y-2 ${sessionCorrect ? 'border-green-800/60' : 'border-red-800/60'}`}>
          <p className={`font-semibold ${sessionCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {sessionCorrect ? '✓ Correct !' : '✗ Incorrect'}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            {allReadings.map((r, i) => (
              <span key={i} className="text-gray-300">
                <span className="kanji-char">{r}</span>
                <span className="text-gray-500 ml-1 text-xs">{toRomaji(r)}</span>
              </span>
            ))}
          </div>
          <p className="text-gray-500 text-xs">{card.details.meanings.slice(0, 3).join(', ')}</p>
        </div>
      )}

      {/* Action button */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn-primary w-full max-w-sm disabled:opacity-40"
        >
          Vérifier
        </button>
      ) : (
        <button onClick={onNext} className="btn-primary w-full max-w-sm">
          Suivant →
        </button>
      )}
    </div>
  );
}

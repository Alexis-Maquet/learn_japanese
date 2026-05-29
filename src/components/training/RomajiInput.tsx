import { useState, useEffect, useRef } from 'react';
import type { TrainingCard } from '@/types';
import { checkAnswer, toRomaji, stripOkurigana } from '@/utils/romaji';
import { KanjiDetailModal } from '@/components/scan/KanjiDetailModal';
import { playCorrect } from '@/utils/sound';

interface Props {
  card: TrainingCard;
  onAnswer: (correct: boolean, selected: string) => void;
  onNext: () => void;
  isLastCard?: boolean;
}

function deduplicateReadings(readings: string[]): string[] {
  const seenStems = new Set<string>();
  const seenFull = new Set<string>();
  return readings.filter((r) => {
    const clean = r.replace(/^-|-$/g, '');
    const stem = clean.split('.')[0];
    const full = clean.replace('.', '');
    if (seenStems.has(stem) || seenFull.has(full)) return false;
    seenStems.add(stem);
    seenFull.add(full);
    return true;
  });
}

function buildReadings(on: string[], kun: string[]): string[] {
  const filteredOn = deduplicateReadings(on.filter((r) => !r.startsWith('-'))).slice(0, 3);
  const filteredKun = deduplicateReadings(kun.filter((r) => !r.startsWith('-'))).slice(0, 3);
  return [...filteredOn, ...filteredKun].slice(0, 4);
}

export function RomajiInput({ card, onAnswer, onNext, isLastCard = false }: Props) {
  const displayReadings = buildReadings(card.details.on_readings, card.details.kun_readings);
  const allValidReadings = [
    ...card.details.on_readings.filter((r) => !r.startsWith('-')),
    ...card.details.kun_readings.filter((r) => !r.startsWith('-')),
  ];

  const [inputs, setInputs] = useState<string[]>(() => new Array(displayReadings.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(false);
  const [showKanjiModal, setShowKanjiModal] = useState(false);
  const [revealedPronunciation, setRevealedPronunciation] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const readings = buildReadings(card.details.on_readings, card.details.kun_readings);
    setInputs(new Array(readings.length).fill(''));
    setSubmitted(false);
    setSessionCorrect(false);
    setShowKanjiModal(false);
    setRevealedPronunciation(false);
    firstRef.current?.focus();
  }, [card.kanji]);

  useEffect(() => {
    if (!submitted) return;
    // Delay focus to avoid Enter key from submission triggering an immediate click
    const t = setTimeout(() => nextRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [submitted]);

  const nonEmpty = inputs.filter((v) => v.trim());
  const canSubmit = nonEmpty.length > 0 && !submitted;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const allValid = nonEmpty.every((input) => checkAnswer(input, allValidReadings));
    if (allValid) playCorrect();
    setSessionCorrect(allValid);
    setSubmitted(true);
    onAnswer(allValid, nonEmpty.join(', '));
  };

  const correctionReadings = deduplicateReadings(allValidReadings);

  const inputState = (value: string): 'idle' | 'correct' | 'wrong' => {
    if (!submitted || !value.trim()) return 'idle';
    return checkAnswer(value, allValidReadings) ? 'correct' : 'wrong';
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
      <button
        onClick={() => !submitted && setRevealedPronunciation(true)}
        className="w-56 h-56 flex flex-col items-center justify-center bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl cursor-pointer hover:border-gray-500 transition-colors"
      >
        <span className="kanji-char text-8xl text-white select-none">{card.kanji}</span>
        {revealedPronunciation ? (
          <p className="text-xs text-gray-400 mt-2 px-3 text-center">{card.details.meanings.slice(0, 3).join(', ')}</p>
        ) : (
          <p className="text-xs text-gray-600 mt-2">Appuyer pour la signification</p>
        )}
      </button>

      {/* Input fields */}
      <div className="w-full max-w-sm space-y-2">
        <p className="text-xs text-gray-500 text-center">
          {displayReadings.length} prononciation{displayReadings.length > 1 ? 's' : ''} — au moins une requise, toutes doivent être correctes
        </p>
        {inputs.map((value, i) => (
          <div key={i} className="relative">
            <input
              ref={i === 0 ? firstRef : undefined}
              type="text"
              value={value}
              placeholder={`Prononciation ${i + 1} en romaji…`}
              disabled={submitted}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
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
            {correctionReadings.map((r, i) => (
              <span key={i} className="text-gray-300">
                <span className="kanji-char">{stripOkurigana(r)}</span>
                <span className="text-gray-500 ml-1 text-xs">{toRomaji(stripOkurigana(r))}</span>
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
        <div className="w-full max-w-sm flex gap-2">
          <button onClick={() => setShowKanjiModal(true)} className="btn-secondary flex-1">
            Fiche
          </button>
          <button ref={nextRef} onClick={onNext} className="btn-primary flex-1">
            {isLastCard ? 'Résultats →' : 'Suivant →'}
          </button>
        </div>
      )}

      {showKanjiModal && (
        <KanjiDetailModal kanji={card.kanji} onClose={() => setShowKanjiModal(false)} />
      )}
    </div>
  );
}

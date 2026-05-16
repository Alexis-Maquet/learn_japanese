import { useState } from 'react';
import type { TrainingCard, ReadingType } from '../../types';
import { toRomaji } from '../../utils/romaji';

interface Props {
  card: TrainingCard;
  readingType: ReadingType;
  onAnswer: (correct: boolean) => void;
}

export function FlashCard({ card, readingType, onAnswer }: Props) {
  const [revealed, setRevealed] = useState(false);

  const readings = readingType === 'on' ? card.details.on_readings : card.details.kun_readings;
  const fallbackReadings = readingType === 'on' ? card.details.kun_readings : card.details.on_readings;
  const activeReadings = readings.length > 0 ? readings : fallbackReadings;

  const handleReveal = () => setRevealed(true);

  const handleAnswer = (correct: boolean) => {
    setRevealed(false);
    onAnswer(correct);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="w-64 h-64 flex items-center justify-center bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl cursor-pointer group"
        onClick={!revealed ? handleReveal : undefined}
      >
        <span className="kanji-char text-9xl text-white group-hover:text-japan-red transition-colors select-none">
          {card.kanji}
        </span>
      </div>

      {!revealed ? (
        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">
            Quelle est la lecture {readingType === 'on' ? 'on-yomi (音読み)' : 'kun-yomi (訓読み)'} ?
          </p>
          <button onClick={handleReveal} className="btn-primary px-6">
            Révéler la lecture
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="card p-4 min-w-[240px]">
            <p className="text-sm text-gray-500 mb-2">
              {readingType === 'on' ? '音読み (On-yomi)' : '訓読み (Kun-yomi)'}
            </p>
            {activeReadings.length > 0 ? (
              <div className="space-y-1">
                {activeReadings.map((r, i) => (
                  <div key={i} className="flex items-center justify-center gap-3">
                    <span className="text-xl text-white font-medium kanji-char">{r}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-japan-red font-medium">{toRomaji(r)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">Aucune lecture {readingType === 'on' ? 'on-yomi' : 'kun-yomi'}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">{card.details.meanings.slice(0, 3).join(', ')}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-2 rounded-lg border border-red-700 bg-red-900/20 text-red-300 hover:bg-red-900/40 transition-all text-sm font-medium"
            >
              ✗ Je ne savais pas
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-2 rounded-lg border border-green-700 bg-green-900/20 text-green-300 hover:bg-green-900/40 transition-all text-sm font-medium"
            >
              ✓ Je savais
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

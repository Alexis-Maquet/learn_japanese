import { useState } from 'react';
import type { TrainingCard, ReadingType } from '../../types';
import { toRomaji } from '../../utils/romaji';
import { useTrainingStore } from '../../store/trainingStore';

interface Props {
  card: TrainingCard;
  readingType: ReadingType;
  onAnswer: (correct: boolean, selected: string) => void;
}

export function MultipleChoice({ card, readingType, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const generateChoices = useTrainingStore((s) => s.generateChoices);

  const choices = generateChoices(card);

  const readings = readingType === 'on' ? card.details.on_readings : card.details.kun_readings;
  const fallback = readingType === 'on' ? card.details.kun_readings : card.details.on_readings;
  const activeReadings = readings.length > 0 ? readings : fallback;
  const correctRomaji = toRomaji(activeReadings[0] ?? '');

  const handleSelect = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    setTimeout(() => {
      onAnswer(choice === correctRomaji, choice);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-64 h-64 flex flex-col items-center justify-center bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl">
        <span className="kanji-char text-9xl text-white select-none">{card.kanji}</span>
        <p className="text-xs text-gray-500 mt-2">
          {readingType === 'on' ? 'On-yomi (音読み)' : 'Kun-yomi (訓読み)'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {choices.map((choice, i) => {
          const isCorrect = choice === correctRomaji;
          const isSelected = selected === choice;

          let cls = 'p-3 rounded-lg border text-sm font-medium transition-all text-center ';
          if (!selected) {
            cls += 'border-[#30363d] text-gray-200 hover:border-japan-red hover:bg-japan-red/10 cursor-pointer';
          } else if (isCorrect) {
            cls += 'border-green-600 bg-green-900/30 text-green-300';
          } else if (isSelected) {
            cls += 'border-red-600 bg-red-900/30 text-red-300';
          } else {
            cls += 'border-[#30363d] text-gray-500 opacity-50';
          }

          return (
            <button key={i} onClick={() => handleSelect(choice)} className={cls} disabled={!!selected}>
              {choice === '---' ? '—' : choice}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="card p-3 text-center text-sm text-gray-400">
          <span className="text-white kanji-char">{activeReadings.join('、')}</span>
          {' → '}
          <span className="text-japan-red">{correctRomaji}</span>
          {' — '}
          {card.details.meanings.slice(0, 2).join(', ')}
        </div>
      )}
    </div>
  );
}

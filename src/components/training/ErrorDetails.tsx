import { Link } from 'react-router-dom';
import type { TrainingCard } from '@/types';
import { expectedReadings, stripOkurigana, toRomaji } from '@/utils/romaji';

interface Props {
  cards: TrainingCard[];
}

// Récapitulatif des erreurs d'une session de prononciation : pour chaque kanji raté,
// ce qui a été saisi (prononciations et signification) et ce qui était attendu
export function ErrorDetails({ cards }: Props) {
  if (cards.length === 0) return null;

  return (
    <div className="card p-5 text-left space-y-4">
      <h2 className="text-sm font-semibold text-white">Détail des erreurs</h2>

      {cards.map((card) => {
        const { answer, details } = card;
        const readings = expectedReadings(details.on_readings, details.kun_readings);

        return (
          <div key={card.kanji} className="rounded-lg bg-japan-dark border border-japan-border p-4 space-y-3">
            <Link
              to={`/kanji/${encodeURIComponent(card.kanji)}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              title="Voir la fiche du kanji"
            >
              <span className="kanji-char text-4xl text-red-300 leading-none">{card.kanji}</span>
              <span className="text-xs text-gray-500">Voir la fiche →</span>
            </Link>

            {/* Prononciations */}
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Prononciations</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-500 text-xs">Saisi :</span>
                {answer && answer.readings.length > 0 ? (
                  answer.readings.map((r, i) => (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded border text-xs ${
                        r.correct
                          ? 'border-green-700 bg-green-900/20 text-green-300'
                          : 'border-red-700 bg-red-900/20 text-red-300 line-through'
                      }`}
                    >
                      {r.value} {r.correct ? '✓' : '✗'}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-600 italic">non enregistré</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="text-gray-500 text-xs">Attendu :</span>
                {readings.map(({ reading, type }) => (
                  <span key={reading} className="text-gray-300">
                    <span className="text-gray-600 text-xs mr-1">{type}</span>
                    <span className="kanji-char">{stripOkurigana(reading.replace(/^-|-$/g, ''))}</span>
                    <span className="text-gray-500 ml-1 text-xs">{toRomaji(stripOkurigana(reading.replace(/^-|-$/g, '')))}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Signification */}
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Signification</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-500 text-xs">Saisi :</span>
                {answer ? (
                  <span
                    className={`px-2 py-0.5 rounded border text-xs ${
                      answer.meaningCorrect
                        ? 'border-green-700 bg-green-900/20 text-green-300'
                        : 'border-red-700 bg-red-900/20 text-red-300 line-through'
                    }`}
                  >
                    {answer.meaning} {answer.meaningCorrect ? '✓' : '✗'}
                  </span>
                ) : (
                  <span className="text-xs text-gray-600 italic">non enregistré</span>
                )}
              </div>
              <p className="text-sm text-gray-300">
                <span className="text-gray-500 text-xs mr-2">Attendu :</span>
                {details.meanings.slice(0, 4).join(', ')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

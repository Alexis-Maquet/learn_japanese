import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { TrainingCard } from '@/types';
import { expectedReadings, stripOkurigana, toRomaji } from '@/utils/romaji';

interface Props {
  cards: TrainingCard[];
}

// Au-delà de ce nombre d'erreurs, les blocs sont repliés au départ pour que la page reste courte
const OPEN_BY_DEFAULT_MAX = 3;

function Verdict({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`px-2 py-0.5 rounded border text-xs whitespace-nowrap ${
        ok ? 'border-green-700 bg-green-900/20 text-green-300' : 'border-red-700 bg-red-900/20 text-red-300'
      }`}
    >
      {label} {ok ? '✓' : '✗'}
    </span>
  );
}

// Récapitulatif des erreurs d'une session de prononciation : pour chaque kanji raté,
// ce qui a été saisi (prononciations et signification) et ce qui était attendu
export function ErrorDetails({ cards }: Props) {
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(cards.length <= OPEN_BY_DEFAULT_MAX ? cards.map((c) => c.kanji) : []),
  );

  if (cards.length === 0) return null;

  const allOpen = open.size === cards.length;
  const toggle = (kanji: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(kanji)) next.delete(kanji);
      else next.add(kanji);
      return next;
    });

  return (
    <div className="card p-5 text-left space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">Détail des erreurs</h2>
        {cards.length > 1 && (
          <button
            onClick={() => setOpen(allOpen ? new Set() : new Set(cards.map((c) => c.kanji)))}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            {allOpen ? 'Tout replier' : 'Tout déplier'}
          </button>
        )}
      </div>

      {cards.map((card) => {
        const { answer, details } = card;
        const readings = expectedReadings(details.on_readings, details.kun_readings);
        const isOpen = open.has(card.kanji);
        const panelId = `error-detail-${card.kanji}`;

        return (
          <div key={card.kanji} className="rounded-lg bg-japan-dark border border-japan-border">
            {/* En-tête : kanji et verdict en une ligne, toujours visible */}
            <button
              onClick={() => toggle(card.kanji)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center gap-3 p-3 text-left"
            >
              <span className="kanji-char text-3xl text-red-300 leading-none">{card.kanji}</span>
              <span className="flex-1 flex flex-wrap gap-1.5">
                {answer ? (
                  <>
                    <Verdict label="Prononciations" ok={answer.readings.every((r) => r.correct)} />
                    <Verdict label="Signification" ok={answer.meaningCorrect} />
                  </>
                ) : (
                  <span className="text-xs text-gray-600 italic">Détail non enregistré</span>
                )}
              </span>
              <span className="text-gray-500 text-xs shrink-0" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div id={panelId} className="px-4 pb-4 space-y-3 border-t border-japan-border pt-3">
                <Link
                  to={`/kanji/${encodeURIComponent(card.kanji)}`}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Voir la fiche du kanji →
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
            )}
          </div>
        );
      })}
    </div>
  );
}

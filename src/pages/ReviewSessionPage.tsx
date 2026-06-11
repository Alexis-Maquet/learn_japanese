import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useKanjiStore } from '@/store/kanjiStore';
import { useStatsStore } from '@/store/statsStore';
import { toRomaji, stripOkurigana } from '@/utils/romaji';

interface SessionState {
  kanjis: string[];
  listName: string;
}

function dedup(readings: string[]): string[] {
  const seen = new Set<string>();
  return readings.filter(r => {
    const key = r.replace(/^-|-$/g, '').split('.')[0];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function rateColor(rate: number): string {
  if (rate >= 0.8) return 'text-green-400';
  if (rate >= 0.5) return 'text-yellow-400';
  return 'text-red-400';
}

export function ReviewSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SessionState | null;

  const details = useKanjiStore((s) => s.details);
  const kanjiStats = useStatsStore((s) => s.kanjiStats);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  if (!state) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 text-center text-gray-400">
        Aucune session en cours.{' '}
        <Link to="/training" className="text-japan-red hover:underline">Retour à l'entraînement</Link>
      </div>
    );
  }

  const { kanjis, listName } = state;

  if (showSummary) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 text-center">
        <div className="card p-8 space-y-4">
          <div className="text-5xl">📖</div>
          <h1 className="text-2xl font-bold text-white">Révision terminée !</h1>
          <p className="text-gray-300">{kanjis.length} kanji{kanjis.length > 1 ? 's' : ''} révisés</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/training')} className="btn-secondary flex-1">Retour</button>
          <button onClick={() => { setCurrentIndex(0); setShowSummary(false); }} className="btn-primary flex-1">Recommencer</button>
        </div>
      </div>
    );
  }

  const kanji = kanjis[currentIndex];
  const detail = details[kanji];
  const stat = kanjiStats[kanji];
  const rate = stat && stat.seen > 0 ? stat.correct / stat.seen : null;

  const onReadings = dedup((detail?.on_readings ?? []).filter(r => !r.startsWith('-')));
  const kunReadings = dedup((detail?.kun_readings ?? []).filter(r => !r.startsWith('-')));

  const handleNext = () => {
    if (currentIndex + 1 >= kanjis.length) setShowSummary(true);
    else setCurrentIndex(i => i + 1);
  };

  const handlePrev = () => setCurrentIndex(i => Math.max(0, i - 1));

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="truncate max-w-[200px]" title={listName}>{listName}</span>
          <span>Kanji {currentIndex + 1} / {kanjis.length}</span>
        </div>
        <div className="w-full bg-[#21262d] rounded-full h-2">
          <div
            className="bg-japan-red h-2 rounded-full transition-all"
            style={{ width: `${(currentIndex / kanjis.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Kanji card */}
      <div className="card p-6 space-y-5">
        {/* Kanji + success rate */}
        <div className="flex items-start justify-between">
          <span className="kanji-char text-8xl text-white leading-none">{kanji}</span>
          {rate !== null && (
            <div className="text-right">
              <p className={`text-2xl font-bold ${rateColor(rate)}`}>{Math.round(rate * 100)}%</p>
              <p className="text-xs text-gray-500">{stat.correct}/{stat.seen} correctes</p>
            </div>
          )}
        </div>

        {/* Meaning */}
        {detail && (
          <p className="text-gray-300 text-sm">{detail.meanings.slice(0, 4).join(', ')}</p>
        )}

        {/* Readings */}
        {detail && (
          <div className="space-y-3 border-t border-[#30363d] pt-4">
            {onReadings.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider">On-yomi</p>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {onReadings.map((r, i) => {
                    const clean = r.replace(/^-|-$/g, '');
                    const stem = stripOkurigana(clean);
                    return (
                      <span key={i} className="text-sm">
                        <span className="kanji-char text-white">{stem}</span>
                        <span className="text-gray-500 ml-1.5 text-xs">{toRomaji(stem)}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {kunReadings.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Kun-yomi</p>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {kunReadings.map((r, i) => {
                    const clean = r.replace(/^-|-$/g, '');
                    const stem = stripOkurigana(clean);
                    return (
                      <span key={i} className="text-sm">
                        <span className="kanji-char text-white">{stem}</span>
                        <span className="text-gray-500 ml-1.5 text-xs">{toRomaji(stem)}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="btn-secondary flex-1 disabled:opacity-30"
        >
          ← Précédent
        </button>
        <button onClick={handleNext} className="btn-primary flex-1">
          {currentIndex + 1 >= kanjis.length ? 'Terminer →' : 'Suivant →'}
        </button>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTrainingStore } from '@/store/trainingStore';
import { useStatsStore } from '@/store/statsStore';
import { RomajiInput } from '@/components/training/RomajiInput';

function pct(correct: number, total: number) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function TrainingSessionPage() {
  const { session, answerCard, nextCard, endSession } = useTrainingStore();
  const { kanjiStats, sessions, recordSession } = useStatsStore();
  const navigate = useNavigate();

  const isComplete = !!session && session.currentIndex >= session.cards.length;

  // Record once when session completes (guard against duplicate via session.id check)
  const alreadyRecorded = sessions.some((s) => s.id === session?.id);
  useEffect(() => {
    if (isComplete && session && !alreadyRecorded) {
      recordSession(session);
    }
  }, [isComplete, alreadyRecorded]);

  if (!session) return (
    <div className="max-w-xl mx-auto px-4 py-6 text-center text-gray-400">
      Aucune session en cours.{' '}
      <Link to="/training" className="text-japan-red hover:underline">Retour à l'entraînement</Link>
    </div>
  );

  const card = session.cards[session.currentIndex];
  const correct = session.cards.filter((c) => c.answered && c.correct).length;
  const total = session.cards.filter((c) => c.answered).length;

  if (isComplete) {
    const score = session.cards.filter((c) => c.correct).length;
    const scorePct = pct(score, session.cards.length);

    // Global stats from previous sessions (excluding current)
    const pastSessions = sessions.filter((s) => s.id !== session.id);
    const globalAvg = pastSessions.length > 0
      ? Math.round(pastSessions.reduce((acc, s) => acc + pct(s.score, s.total), 0) / pastSessions.length)
      : null;
    const bestScore = pastSessions.length > 0
      ? Math.max(...pastSessions.map((s) => pct(s.score, s.total)))
      : null;

    const failedCards = session.cards.filter((c) => !c.correct);

    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 text-center">
        <div className="card p-8 space-y-5">
          <div className="text-5xl">{scorePct >= 80 ? '🎉' : scorePct >= 50 ? '👍' : '📚'}</div>
          <h1 className="text-2xl font-bold text-white">Session terminée !</h1>

          <div className="text-5xl font-bold" style={{ color: scorePct >= 80 ? '#22c55e' : scorePct >= 50 ? '#eab308' : '#ef4444' }}>
            {scorePct}%
          </div>

          <p className="text-gray-300">
            {score} / {session.cards.length} kanjis réussis
          </p>

          <div className="grid grid-cols-3 gap-4 text-center pt-2">
            <div>
              <p className="text-2xl font-bold text-green-400">{score}</p>
              <p className="text-xs text-gray-500">Réussis</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{session.cards.length - score}</p>
              <p className="text-xs text-gray-500">Ratés</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-300">{session.cards.length}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>

          {/* Historical comparison */}
          {(globalAvg !== null || bestScore !== null) && (
            <div className="border-t border-[#30363d] pt-4 flex justify-center gap-8 text-xs text-gray-500">
              {globalAvg !== null && (
                <div className="text-center">
                  <p className={`text-base font-bold ${globalAvg >= 80 ? 'text-green-400' : globalAvg >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {globalAvg}%
                  </p>
                  <p>Votre moyenne</p>
                </div>
              )}
              {bestScore !== null && (
                <div className="text-center">
                  <p className={`text-base font-bold ${bestScore >= 80 ? 'text-green-400' : bestScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {bestScore}%
                  </p>
                  <p>Votre meilleur</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Kanjis to review with per-kanji stats */}
        {failedCards.length > 0 && (
          <div className="card p-5 text-left space-y-3">
            <h2 className="text-sm font-semibold text-white">Kanjis à retravailler</h2>
            <div className="flex flex-wrap gap-3">
              {failedCards.map((c) => {
                const stat = kanjiStats[c.kanji];
                const rate = stat ? pct(stat.correct, stat.seen) : null;
                return (
                  <Link
                    key={c.kanji}
                    to={`/kanji/${encodeURIComponent(c.kanji)}`}
                    className="flex flex-col items-center gap-0.5 p-2 rounded-lg hover:bg-[#21262d] transition-colors"
                    title={c.details.meanings[0]}
                  >
                    <span className="kanji-char text-2xl text-red-300">{c.kanji}</span>
                    {rate !== null && (
                      <span className={`text-xs font-medium ${rate >= 80 ? 'text-green-400' : rate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {rate}%
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
            <p className="text-xs text-gray-600">Cliquez sur un kanji pour voir sa fiche détaillée.</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => {
              endSession();
              navigate('/training', { state: { preselected: session.listIds } });
            }}
            className="btn-secondary flex-1"
          >
            Recommencer
          </button>
          <button onClick={() => { endSession(); navigate('/training'); }} className="btn-primary flex-1">
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="truncate max-w-[200px]" title={session.listName}>{session.listName}</span>
          <span>{session.currentIndex + 1} / {session.cards.length}</span>
        </div>
        <div className="w-full bg-[#21262d] rounded-full h-2">
          <div
            className="bg-japan-red h-2 rounded-full transition-all"
            style={{ width: `${(session.currentIndex / session.cards.length) * 100}%` }}
          />
        </div>
        {total > 0 && (
          <div className="flex gap-4 text-xs">
            <span className="text-green-400">✓ {correct}</span>
            <span className="text-red-400">✗ {total - correct}</span>
          </div>
        )}
      </div>

      {/* Card */}
      <div className="flex items-center justify-center py-4">
        {card && (
          <RomajiInput
            card={card}
            onAnswer={(c, selected) => answerCard(c, selected)}
            onNext={nextCard}
          />
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => { endSession(); navigate('/training'); }}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Abandonner la session
        </button>
      </div>
    </div>
  );
}

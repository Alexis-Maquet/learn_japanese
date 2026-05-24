import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { generateSentenceExercises, getApiKey } from '@/utils/geminiVision';
import { SentenceExercise as SentenceExerciseComponent } from '@/components/training/SentenceExercise';
import type { SentenceExercise, SentenceAnswerMode } from '@/types';

interface SessionState {
  kanjis: string[];
  listName: string;
  mode: SentenceAnswerMode;
  count: number;
}

export function SentenceSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SessionState | null;

  const [exercises, setExercises] = useState<SentenceExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [showSummary, setShowSummary] = useState(false);

  const apiKey = getApiKey();
  const count = state?.count ?? 10;

  useEffect(() => {
    if (!state || !apiKey) return;
    generateSentenceExercises(apiKey, state.kanjis, count)
      .then(exs => {
        if (exs.length === 0) setError('Impossible de générer les phrases. Vérifiez votre connexion et réessayez.');
        else setExercises(exs);
      })
      .catch(() => setError('Impossible de générer les phrases. Vérifiez votre connexion et réessayez.'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 text-center text-gray-400">
        Aucune session en cours.{' '}
        <Link to="/training" className="text-japan-red hover:underline">Retour à l'entraînement</Link>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 text-center space-y-3">
        <p className="text-gray-400">Clé API Gemini requise pour cet exercice.</p>
        <Link to="/scan" className="text-japan-red hover:underline text-sm">
          Configurer la clé dans Scanner →
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 flex flex-col items-center justify-center gap-4" style={{ minHeight: '60vh' }}>
        <div className="w-10 h-10 border-2 border-japan-red border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Génération de {count} phrases…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 text-center space-y-4">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={() => navigate('/training')} className="btn-secondary text-sm">
          Retour
        </button>
      </div>
    );
  }

  const handleResult = (correct: number, total: number) => {
    setStats(s => ({ correct: s.correct + correct, total: s.total + total }));
  };

  const handleNext = () => {
    if (currentIndex + 1 >= exercises.length) {
      setShowSummary(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  if (showSummary) {
    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 text-center">
        <div className="card p-8 space-y-5">
          <div className="text-5xl">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚'}</div>
          <h1 className="text-2xl font-bold text-white">Session terminée !</h1>
          <div
            className="text-5xl font-bold"
            style={{ color: pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444' }}
          >
            {pct}%
          </div>
          <p className="text-gray-300">
            {stats.correct} / {stats.total} mots réussis
          </p>
          <p className="text-gray-500 text-sm">
            {exercises.length} phrase{exercises.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/training')} className="btn-secondary flex-1">
            Retour
          </button>
          <button onClick={() => navigate(0)} className="btn-primary flex-1">
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  const exercise = exercises[currentIndex];

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="truncate max-w-[200px]" title={state.listName}>{state.listName}</span>
          <span>Phrase {currentIndex + 1} / {exercises.length}</span>
        </div>
        <div className="w-full bg-[#21262d] rounded-full h-2">
          <div
            className="bg-japan-red h-2 rounded-full transition-all"
            style={{ width: `${(currentIndex / exercises.length) * 100}%` }}
          />
        </div>
        {stats.total > 0 && (
          <div className="flex gap-4 text-xs">
            <span className="text-green-400">✓ {stats.correct}</span>
            <span className="text-red-400">✗ {stats.total - stats.correct}</span>
          </div>
        )}
      </div>

      {/* Exercise */}
      {exercise && (
        <SentenceExerciseComponent
          exercise={exercise}
          mode={state.mode}
          onResult={handleResult}
          onNext={handleNext}
          isLastExercise={currentIndex === exercises.length - 1}
        />
      )}

      {/* Footer */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => setShowSummary(true)}
          disabled={stats.total === 0}
          className="text-xs text-gray-600 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Terminer la session
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { generateSentenceExercise, getApiKey } from '@/utils/geminiVision';
import { SentenceExercise as SentenceExerciseComponent } from '@/components/training/SentenceExercise';
import type { SentenceExercise, SentenceAnswerMode } from '@/types';

const MAX_EXERCISES = 10;

interface SessionState {
  kanjis: string[];
  listName: string;
  mode: SentenceAnswerMode;
}

export function SentenceSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SessionState | null;

  const [exercise, setExercise] = useState<SentenceExercise | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0, exercises: 0 });
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const apiKey = getApiKey();

  const generateNext = useCallback(async () => {
    if (!state || !apiKey) return;
    setExercise(null);
    setLoading(true);
    setError(null);
    try {
      const ex = await generateSentenceExercise(apiKey, state.kanjis);
      if (!ex) throw new Error('Réponse invalide');
      setExercise(ex);
    } catch {
      setError('Impossible de générer la phrase. Vérifiez votre connexion et réessayez.');
    } finally {
      setLoading(false);
    }
  }, [state, apiKey]);

  useEffect(() => {
    generateNext();
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

  const handleResult = (correct: number, total: number) => {
    setStats(s => ({ correct: s.correct + correct, total: s.total + total, exercises: s.exercises + 1 }));
  };

  const handleNext = () => {
    const completed = exercisesCompleted + 1;
    setExercisesCompleted(completed);
    if (completed >= MAX_EXERCISES) {
      setShowSummary(true);
    } else {
      generateNext();
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
            {stats.exercises} phrase{stats.exercises > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/training')} className="btn-secondary flex-1">
            Retour
          </button>
          <button
            onClick={() => {
              setStats({ correct: 0, total: 0, exercises: 0 });
              setExercisesCompleted(0);
              setShowSummary(false);
              generateNext();
            }}
            className="btn-primary flex-1"
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="truncate max-w-[200px]" title={state.listName}>{state.listName}</span>
          <span>Phrase {exercisesCompleted + 1} / {MAX_EXERCISES}</span>
        </div>
        <div className="w-full bg-[#21262d] rounded-full h-2">
          <div
            className="bg-japan-red h-2 rounded-full transition-all"
            style={{ width: `${(exercisesCompleted / MAX_EXERCISES) * 100}%` }}
          />
        </div>
        {stats.exercises > 0 && (
          <div className="flex gap-4 text-xs">
            <span className="text-green-400">✓ {stats.correct}</span>
            <span className="text-red-400">✗ {stats.total - stats.correct}</span>
          </div>
        )}
      </div>

      {/* Content */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-2 border-japan-red border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Génération de la phrase…</p>
        </div>
      )}

      {error && !loading && (
        <div className="card p-6 text-center space-y-3">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={generateNext} className="btn-secondary text-sm">
            Réessayer
          </button>
        </div>
      )}

      {exercise && !loading && (
        <SentenceExerciseComponent
          exercise={exercise}
          mode={state.mode}
          onResult={handleResult}
          onNext={handleNext}
          isLastExercise={exercisesCompleted === MAX_EXERCISES - 1}
        />
      )}

      {/* Footer */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => setShowSummary(true)}
          disabled={stats.exercises === 0}
          className="text-xs text-gray-600 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Terminer la session
        </button>
      </div>
    </div>
  );
}

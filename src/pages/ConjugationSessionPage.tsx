import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { generateConjugationExercises, getApiKey } from '@/utils/geminiVision';
import type { ConjugationExercise } from '@/types';

interface SessionState {
  chapters: number[];
  count: number;
}


export function ConjugationSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SessionState | null;

  const [exercises, setExercises] = useState<ConjugationExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const apiKey = getApiKey();
  const count = state?.count ?? 10;

  useEffect(() => {
    if (!state || !apiKey) return;
    generateConjugationExercises(apiKey, state.chapters, count)
      .then(exs => {
        if (exs.length === 0) setError('Impossible de générer les exercices. Vérifiez votre connexion et réessayez.');
        else setExercises(exs);
      })
      .catch(() => setError('Impossible de générer les exercices. Vérifiez votre connexion et réessayez.'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exercise = exercises[currentIndex];
  const answered = selected !== null;

  const handleSelect = useCallback((option: string) => {
    if (answered || !exercise) return;
    setSelected(option);
    if (option === exercise.correctAnswer) setCorrectCount(c => c + 1);
  }, [answered, exercise]);

  const handleNext = useCallback(() => {
    setSelected(null);
    if (currentIndex + 1 >= exercises.length) {
      setShowSummary(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
  }, [currentIndex, exercises.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && answered) handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answered, handleNext]);

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
        <p className="text-gray-400 text-sm">Génération de {count} exercices…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 text-center space-y-4">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={() => navigate('/training')} className="btn-secondary text-sm">Retour</button>
      </div>
    );
  }

  if (showSummary) {
    const pct = exercises.length > 0 ? Math.round((correctCount / exercises.length) * 100) : 0;
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
          <p className="text-gray-300">{correctCount} / {exercises.length} bonnes réponses</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/training')} className="btn-secondary flex-1">Retour</button>
          <button onClick={() => navigate(0)} className="btn-primary flex-1">Recommencer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Conjugaison</span>
          <span>Question {currentIndex + 1} / {exercises.length}</span>
        </div>
        <div className="w-full bg-[#21262d] rounded-full h-2">
          <div
            className="bg-japan-red h-2 rounded-full transition-all"
            style={{ width: `${(currentIndex / exercises.length) * 100}%` }}
          />
        </div>
        {currentIndex > 0 && (
          <div className="flex gap-4 text-xs">
            <span className="text-green-400">✓ {correctCount}</span>
            <span className="text-red-400">✗ {currentIndex - correctCount}</span>
          </div>
        )}
      </div>

      {/* Exercise card */}
      {exercise && (
        <div className="card p-6 space-y-5">
          {/* Base form */}
          <div className="text-center space-y-1.5 py-2">
            <div className="kanji-char text-5xl text-white leading-tight">{exercise.baseForm}</div>
            <div className="text-gray-400 text-sm">{exercise.baseReading} • {exercise.baseMeaning}</div>
          </div>

          {/* Prompt */}
          <div className="text-center space-y-1">
            <p className="text-gray-300 text-sm">Conjuguez ce verbe pour…</p>
            <p className="text-white font-semibold text-base">{exercise.context}</p>
          </div>

          {/* Options 2×2 */}
          <div className="grid grid-cols-2 gap-2">
            {exercise.options.map((option) => {
              const isSelected = selected === option;
              const isCorrect = option === exercise.correctAnswer;
              let cls = 'py-3 px-3 rounded-lg border kanji-char text-base transition-all text-center ';
              if (!answered) {
                cls += 'border-[#30363d] text-gray-200 hover:border-gray-400 hover:bg-[#21262d] cursor-pointer';
              } else if (isCorrect) {
                cls += 'border-green-500 bg-green-500/10 text-green-300 cursor-default';
              } else if (isSelected) {
                cls += 'border-red-500 bg-red-500/10 text-red-300 cursor-default';
              } else {
                cls += 'border-[#30363d] text-gray-600 cursor-default';
              }
              return (
                <button key={option} onClick={() => handleSelect(option)} disabled={answered} className={cls}>
                  {answered && isCorrect && <span className="text-green-400 text-xs mr-1">✓</span>}
                  {answered && isSelected && !isCorrect && <span className="text-red-400 text-xs mr-1">✗</span>}
                  {option}
                </button>
              );
            })}
          </div>

          {/* Hint revealed after answer */}
          {answered && (
            <div className="rounded-lg bg-[#161b22] border border-[#30363d] px-4 py-3 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="kanji-char text-xs text-gray-400 bg-[#0d1117] border border-[#30363d] rounded px-2 py-0.5">
                  {exercise.targetForm}
                </span>
                <span className="kanji-char text-xs text-gray-500">{exercise.grammarPoint}</span>
              </div>
              <p className="text-xs text-gray-600 uppercase tracking-wider mt-1">Règle</p>
              <p className="text-sm text-gray-300">{exercise.hint}</p>
            </div>
          )}

          {/* Next */}
          {answered && (
            <button onClick={handleNext} className="btn-primary w-full">
              {currentIndex + 1 >= exercises.length ? 'Voir les résultats' : 'Suivant →'}
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-center">
        <button
          onClick={() => setShowSummary(true)}
          disabled={currentIndex === 0 && !answered}
          className="text-xs text-gray-600 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Terminer la session
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toHiragana } from 'wanakana';
import { generateConjugationExercisesLocal } from '@/utils/conjugationLocal';
import type { ConjugationExercise } from '@/types';

interface SessionState {
  chapters: number[];
  count: number;
}

function checkAnswer(input: string, exercise: ConjugationExercise): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  const normalized = toHiragana(trimmed.toLowerCase()).replace(/\s+/g, '');
  const kana = exercise.correctAnswerKana.replace(/\s+/g, '');
  return (
    trimmed === exercise.correctAnswer ||
    trimmed === kana ||
    normalized === kana
  );
}

export function ConjugationSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SessionState | null;

  const [exercises, setExercises] = useState<ConjugationExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{ exercise: ConjugationExercise; userAnswer: string }>>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const count = state?.count ?? 10;

  useEffect(() => {
    if (!state) return;
    const exs = generateConjugationExercisesLocal(state.chapters, count);
    if (exs.length === 0) setError('Impossible de générer les exercices. Vérifiez les chapitres sélectionnés.');
    else setExercises(exs);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Always keep focus on the input so Enter works for both submit and advance
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex, submitted]);

  const exercise = exercises[currentIndex];

  const handleSubmit = useCallback(() => {
    if (submitted || !exercise || !inputValue.trim()) return;
    const correct = checkAnswer(inputValue, exercise);
    setSubmitted(true);
    setIsCorrect(correct);
    if (correct) {
      setCorrectCount(c => c + 1);
    } else {
      setWrongAnswers(wa => [...wa, { exercise, userAnswer: inputValue.trim() }]);
    }
  }, [submitted, exercise, inputValue]);

  const handleNext = useCallback(() => {
    setInputValue('');
    setSubmitted(false);
    setIsCorrect(null);
    setShowHint(false);
    if (currentIndex + 1 >= exercises.length) {
      setShowSummary(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
  }, [currentIndex, exercises.length]);

  if (!state) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 text-center text-gray-400">
        Aucune session en cours.{' '}
        <Link to="/training" className="text-japan-red hover:underline">Retour à l'entraînement</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 flex flex-col items-center justify-center gap-4" style={{ minHeight: '60vh' }}>
        <div className="w-10 h-10 border-2 border-japan-red border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Préparation de {count} exercices…</p>
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
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="card p-8 space-y-5 text-center">
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

        {wrongAnswers.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Erreurs à revoir ({wrongAnswers.length})
            </p>
            {wrongAnswers.map((wa, i) => (
              <div key={i} className="card p-4 space-y-2.5">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="kanji-char text-xl text-white">{wa.exercise.baseForm}</span>
                  <span className="text-gray-500 text-xs">{wa.exercise.baseReading} • {wa.exercise.baseMeaning}</span>
                </div>
                <p className="text-xs text-gray-500">{wa.exercise.context}</p>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="kanji-char text-red-400 line-through">{wa.userAnswer}</span>
                  <span className="text-gray-600">→</span>
                  <span className="kanji-char text-green-400 font-medium">{wa.exercise.correctAnswer}</span>
                  {wa.exercise.correctAnswerKana !== wa.exercise.correctAnswer && (
                    <span className="text-gray-500 text-xs">({wa.exercise.correctAnswerKana})</span>
                  )}
                </div>
                <div className="rounded bg-[#0d1117] px-3 py-2 text-xs text-gray-400">
                  <span className="kanji-char text-yellow-400/70 mr-2">{wa.exercise.grammarPoint}</span>
                  {wa.exercise.hint}
                </div>
              </div>
            ))}
          </div>
        )}

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
          <div className="text-center space-y-2">
            <p className="text-gray-300 text-sm">Transformez ce mot pour…</p>
            <p className="text-white font-semibold text-base">{exercise.context}</p>
          </div>

          {/* Hint toggle (before answering) */}
          {!submitted && (
            <div className="space-y-1.5">
              <button
                onClick={() => setShowHint(v => !v)}
                className="w-full text-xs text-gray-500 hover:text-yellow-400 border border-dashed border-[#30363d] hover:border-yellow-500/40 rounded-lg py-1.5 transition-colors"
              >
                {showHint ? 'Masquer l\'indice' : 'Voir un indice'}
              </button>
              {showHint && (
                <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/20 px-4 py-2.5">
                  <span className="kanji-char text-xs text-yellow-400/70 bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-0.5 inline-block">
                    {exercise.grammarPoint}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Free text input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => { if (!submitted) setInputValue(e.target.value); }}
                onKeyDown={e => {
                  if (e.key !== 'Enter') return;
                  if (!submitted) handleSubmit();
                  else handleNext();
                }}
                readOnly={submitted}
                placeholder="たべて ou tabete…"
                className={[
                  'flex-1 px-4 py-3 rounded-lg border bg-[#0d1117] kanji-char text-lg text-white placeholder:text-gray-600 outline-none transition-colors',
                  !submitted
                    ? 'border-[#30363d] focus:border-gray-400'
                    : isCorrect
                      ? 'border-green-500 bg-green-500/5 text-green-300 cursor-default'
                      : 'border-red-500 bg-red-500/5 text-red-300 cursor-default',
                ].join(' ')}
              />
              {!submitted && (
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim()}
                  className="btn-primary px-5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  →
                </button>
              )}
            </div>

            {submitted && (
              <div className={`flex items-center gap-2 text-sm px-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? (
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span>✓ Bonne réponse !</span>
                    <span className="kanji-char text-white font-medium">{exercise.correctAnswer}</span>
                    {exercise.correctAnswerKana !== exercise.correctAnswer && (
                      <span className="text-gray-400">({exercise.correctAnswerKana})</span>
                    )}
                  </span>
                ) : (
                  <span>
                    ✗ Réponse correcte :{' '}
                    <span className="kanji-char text-white font-medium">{exercise.correctAnswer}</span>
                    {exercise.correctAnswerKana !== exercise.correctAnswer && (
                      <span className="text-gray-500"> ({exercise.correctAnswerKana})</span>
                    )}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Hint revealed after answer */}
          {submitted && (
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
          {submitted && (
            <button ref={nextBtnRef} onClick={handleNext} className="btn-primary w-full">
              {currentIndex + 1 >= exercises.length ? 'Voir les résultats' : 'Suivant →'}
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-center">
        <button
          onClick={() => setShowSummary(true)}
          disabled={currentIndex === 0 && !submitted}
          className="text-xs text-gray-600 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Terminer la session
        </button>
      </div>
    </div>
  );
}

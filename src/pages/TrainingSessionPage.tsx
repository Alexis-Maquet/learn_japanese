import { useNavigate, Link } from 'react-router-dom';
import { useTrainingStore } from '../store/trainingStore';
import { FlashCard } from '../components/training/FlashCard';
import { MultipleChoice } from '../components/training/MultipleChoice';

export function TrainingSessionPage() {
  const { session, answerCard, nextCard, endSession } = useTrainingStore();
  const navigate = useNavigate();

  if (!session) return (
    <div className="max-w-xl mx-auto px-4 py-6 text-center text-gray-400">
      Aucune session en cours.{' '}
      <Link to="/lists" className="text-japan-red hover:underline">Retour aux listes</Link>
    </div>
  );

  const isComplete = session.currentIndex >= session.cards.length;
  const card = session.cards[session.currentIndex];

  const correct = session.cards.filter((c) => c.answered && c.correct).length;
  const total = session.cards.filter((c) => c.answered).length;

  if (isComplete) {
    const score = session.cards.filter((c) => c.correct).length;
    const pct = Math.round((score / session.cards.length) * 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 text-center">
        <div className="card p-8 space-y-5">
          <div className="text-5xl">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚'}</div>
          <h1 className="text-2xl font-bold text-white">Session terminée !</h1>

          <div className="text-5xl font-bold" style={{ color: pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444' }}>
            {pct}%
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
        </div>

        {/* Review of missed */}
        {session.cards.filter((c) => !c.correct).length > 0 && (
          <div className="card p-5 text-left space-y-3">
            <h2 className="text-sm font-semibold text-white">Kanjis à retravailler</h2>
            <div className="flex flex-wrap gap-2">
              {session.cards.filter((c) => !c.correct).map((c) => (
                <Link
                  key={c.kanji}
                  to={`/kanji/${encodeURIComponent(c.kanji)}`}
                  className="kanji-char text-2xl text-red-300 hover:text-japan-red transition-colors"
                  title={c.details.meanings[0]}
                >
                  {c.kanji}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => { endSession(); navigate(`/training/${session.listId}`); }}
            className="btn-secondary flex-1"
          >
            Recommencer
          </button>
          <button onClick={() => { endSession(); navigate('/lists'); }} className="btn-primary flex-1">
            Retour aux listes
          </button>
        </div>
      </div>
    );
  }

  const handleAnswer = (correct: boolean, selected?: string) => {
    answerCard(correct, selected);
    setTimeout(nextCard, selected !== undefined ? 900 : 0);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{session.listName}</span>
          <span>{session.currentIndex + 1} / {session.cards.length}</span>
        </div>
        <div className="w-full bg-[#21262d] rounded-full h-2">
          <div
            className="bg-japan-red h-2 rounded-full transition-all"
            style={{ width: `${((session.currentIndex) / session.cards.length) * 100}%` }}
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
        {card && session.mode === 'flashcard' && (
          <FlashCard
            card={card}
            readingType={session.readingType}
            onAnswer={(correct) => {
              answerCard(correct);
              nextCard();
            }}
          />
        )}
        {card && session.mode === 'multiple-choice' && (
          <MultipleChoice
            card={card}
            readingType={session.readingType}
            onAnswer={(correct, selected) => handleAnswer(correct, selected)}
          />
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => { endSession(); navigate('/lists'); }}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Abandonner la session
        </button>
      </div>
    </div>
  );
}

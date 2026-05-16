import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useListStore } from '../store/listStore';
import { useKanjiStore } from '../store/kanjiStore';
import { useTrainingStore } from '../store/trainingStore';
import type { TrainingMode, ReadingType } from '../types';

const MODES: { value: TrainingMode; label: string; desc: string; icon: string }[] = [
  { value: 'flashcard', label: 'Flash Cards', desc: 'Voyez le kanji, révélez la lecture à votre rythme', icon: '🃏' },
  { value: 'multiple-choice', label: 'QCM', desc: 'Choisissez la bonne lecture parmi 4 options', icon: '🎯' },
];

const READING_TYPES: { value: ReadingType; label: string; desc: string }[] = [
  { value: 'on', label: 'On-yomi 音読み', desc: 'Lecture sino-japonaise (katakana)' },
  { value: 'kun', label: 'Kun-yomi 訓読み', desc: 'Lecture japonaise native (hiragana)' },
];

export function TrainingSetupPage() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const list = useListStore((s) => s.getList(listId ?? ''));
  const { loadDetails, details } = useKanjiStore();
  const startSession = useTrainingStore((s) => s.startSession);

  const [mode, setMode] = useState<TrainingMode>('flashcard');
  const [readingType, setReadingType] = useState<ReadingType>('on');
  const [loading, setLoading] = useState(false);

  if (!list) return (
    <div className="max-w-xl mx-auto px-4 py-6 text-center text-gray-400">
      Liste introuvable.{' '}
      <Link to="/lists" className="text-japan-red hover:underline">Retour</Link>
    </div>
  );

  const handleStart = async () => {
    setLoading(true);
    try {
      await Promise.all(list.kanjis.map((k) => loadDetails(k)));
      const kanjisDetails = list.kanjis.map((k) => details[k]).filter(Boolean) as typeof details[string][];
      startSession(list.id, list.name, kanjisDetails, mode, readingType);
      navigate(`/training/${list.id}/session`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <Link to="/lists" className="text-sm text-gray-500 hover:text-white transition-colors">
        ← Mes listes
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Configurer l'entraînement</h1>
        <p className="text-gray-400 text-sm">
          Liste : <span className="text-white font-medium">{list.name}</span>
          {' · '}{list.kanjis.length} kanji
        </p>
      </div>

      {/* Mode */}
      <div className="card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Mode d'entraînement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`p-4 rounded-xl border text-left transition-all ${
                mode === m.value
                  ? 'border-japan-red bg-japan-red/10 text-white'
                  : 'border-[#30363d] text-gray-400 hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-2">{m.icon}</div>
              <div className="font-medium">{m.label}</div>
              <div className="text-xs mt-1 text-gray-500">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reading type */}
      <div className="card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Type de lecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {READING_TYPES.map((r) => (
            <button
              key={r.value}
              onClick={() => setReadingType(r.value)}
              className={`p-4 rounded-xl border text-left transition-all ${
                readingType === r.value
                  ? 'border-japan-red bg-japan-red/10 text-white'
                  : 'border-[#30363d] text-gray-400 hover:border-gray-500'
              }`}
            >
              <div className="font-medium kanji-char">{r.label}</div>
              <div className="text-xs mt-1 text-gray-500">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={loading}
        className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Chargement des kanjis...
          </>
        ) : (
          '▶ Commencer l\'entraînement'
        )}
      </button>
    </div>
  );
}

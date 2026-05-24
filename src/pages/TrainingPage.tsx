import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useListStore } from '@/store/listStore';
import { useKanjiStore } from '@/store/kanjiStore';
import { useTrainingStore } from '@/store/trainingStore';
import { JLPT_PREDEFINED, FREQ_PREDEFINED, ALL_PREDEFINED, resolvePredefinedKanjis } from '@/utils/predefinedLists';
import { getApiKey } from '@/utils/geminiVision';
import type { SentenceAnswerMode } from '@/types';

interface ListRowProps {
  id: string;
  name: string;
  description: string;
  count: number | undefined;
  badge?: string;
  badgeColor?: string;
  borderColor?: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

function ListRow({ id, name, description, count, badge, badgeColor, borderColor, isSelected, onToggle }: ListRowProps) {
  const available = count !== undefined && count > 0;
  return (
    <button
      onClick={() => available && onToggle(id)}
      disabled={!available}
      className={[
        'w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3',
        borderColor ? `border-l-4 ${borderColor}` : 'border-[#30363d]',
        isSelected ? 'ring-1 ring-japan-red bg-japan-red/10' : available ? 'hover:border-gray-500' : '',
        !available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
        isSelected ? 'bg-japan-red border-japan-red' : 'border-gray-600'
      }`}>
        {isSelected && <span className="text-white text-[9px] font-bold leading-none">✓</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {badge && <span className={`text-xs font-bold ${badgeColor ?? 'text-gray-400'}`}>{badge}</span>}
          <span className="font-medium text-white text-sm">{name}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
      </div>
      <span className="text-xs text-gray-600 shrink-0">
        {count === undefined ? '…' : count === 0 ? 'Vide' : `${count} kanjis`}
      </span>
    </button>
  );
}

export function TrainingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const lists = useListStore((s) => s.lists);
  const { kanjiByLevel, kanjiByFrequency, loadAllLevels, loadFrequencyGroups, loadDetails, details } = useKanjiStore();
  const { startSession, resumePausedSession } = useTrainingStore();

  const [trainingType, setTrainingType] = useState<'romaji' | 'sentence'>('romaji');
  const [sentenceMode, setSentenceMode] = useState<SentenceAnswerMode>('mcq');
  const [sentenceCount, setSentenceCount] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [pausedInfo, setPausedInfo] = useState<{ listName: string; progress: number; total: number } | null>(() => {
    const raw = localStorage.getItem('training_paused_session');
    if (!raw) return null;
    const s = JSON.parse(raw);
    return { listName: s.listName, progress: s.currentIndex, total: s.cards.length };
  });

  useEffect(() => {
    loadAllLevels();
    loadFrequencyGroups();
  }, [loadAllLevels, loadFrequencyGroups]);

  // Preselect from navigation state (e.g. from ListDetailPage)
  useEffect(() => {
    const state = location.state as { preselected?: string | string[] } | null;
    if (state?.preselected) {
      const ids = Array.isArray(state.preselected) ? state.preselected : [state.preselected];
      setSelected(new Set(ids));
    }
  }, []);

  const toggle = (id: string) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const getKanjisForId = (id: string): string[] => {
    if (JLPT_PREDEFINED.some((c) => c.id === id) || FREQ_PREDEFINED.some((c) => c.id === id)) {
      return resolvePredefinedKanjis(id, kanjiByLevel, kanjiByFrequency) ?? [];
    }
    return lists.find((l) => l.id === id)?.kanjis ?? [];
  };

  const resolveSelectedKanjis = (): string[] => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const id of selected) {
      for (const k of getKanjisForId(id)) {
        if (!seen.has(k)) { seen.add(k); result.push(k); }
      }
    }
    return result;
  };

  const totalKanjis = resolveSelectedKanjis().length;

  const buildListName = () =>
    Array.from(selected)
      .map((id) => ALL_PREDEFINED.find((c) => c.id === id)?.name ?? lists.find((l) => l.id === id)?.name)
      .filter(Boolean)
      .join(', ');

  const handleResume = () => {
    resumePausedSession();
    setPausedInfo(null);
    navigate('/training/session');
  };

  const handleDiscardPaused = () => {
    localStorage.removeItem('training_paused_session');
    setPausedInfo(null);
  };

  const hasApiKey = !!getApiKey();

  const handleStartSentence = () => {
    const kanjis = resolveSelectedKanjis();
    if (kanjis.length === 0) return;
    navigate('/training/sentence-session', {
      state: { kanjis, listName: buildListName(), mode: sentenceMode, count: sentenceCount },
    });
  };

  const handleStart = async () => {
    const kanjis = resolveSelectedKanjis();
    if (kanjis.length === 0 || loading) return;
    setLoading(true);
    try {
      await Promise.all(kanjis.map((k) => loadDetails(k)));
      const kanjisDetails = kanjis.map((k) => details[k]).filter(Boolean) as typeof details[string][];
      startSession(Array.from(selected), buildListName(), kanjisDetails);
      navigate('/training/session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-white">Entraînement</h1>
        <p className="text-gray-400 text-sm mt-1">
          Sélectionnez une ou plusieurs listes, puis commencez. On-yomi et kun-yomi sont tous les deux demandés.
        </p>
      </div>

      {/* Training type selector */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => setTrainingType('romaji')}
            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
              trainingType === 'romaji'
                ? 'border-japan-red bg-japan-red/10 text-white'
                : 'border-[#30363d] text-gray-400 hover:border-gray-500'
            }`}
          >
            Prononciation
          </button>
          <button
            onClick={() => setTrainingType('sentence')}
            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
              trainingType === 'sentence'
                ? 'border-japan-red bg-japan-red/10 text-white'
                : 'border-[#30363d] text-gray-400 hover:border-gray-500'
            }`}
          >
            Compréhension de phrases
          </button>
        </div>

        {trainingType === 'sentence' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Format des réponses</p>
              <div className="flex gap-2">
                {(['mcq', 'free'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSentenceMode(m)}
                    className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-medium transition-colors ${
                      sentenceMode === m
                        ? 'border-japan-red bg-japan-red/10 text-white'
                        : 'border-[#30363d] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {m === 'mcq' ? 'QCM (4 choix)' : 'Texte libre'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Nombre de questions</p>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSentenceCount(n)}
                    className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-medium transition-colors ${
                      sentenceCount === n
                        ? 'border-japan-red bg-japan-red/10 text-white'
                        : 'border-[#30363d] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            {!hasApiKey && (
              <p className="text-xs text-yellow-600">
                Clé API Gemini requise —{' '}
                <Link to="/scan" className="underline hover:text-yellow-400">configurer dans Scanner</Link>
              </p>
            )}
          </div>
        )}
      </div>

      {trainingType === 'romaji' && pausedInfo && (
        <div className="card p-4 border-yellow-600/50 bg-yellow-900/10 flex items-center gap-3">
          <span className="text-yellow-400 text-xl shrink-0">⏸</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{pausedInfo.listName}</p>
            <p className="text-xs text-gray-400">{pausedInfo.progress} / {pausedInfo.total} kanjis effectués</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={handleResume} className="btn-primary text-sm py-1.5 px-3">Reprendre</button>
            <button onClick={handleDiscardPaused} className="text-xs text-gray-600 hover:text-red-400 transition-colors px-1">✕</button>
          </div>
        </div>
      )}

      {/* User lists */}
      {lists.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mes listes</h2>
          <div className="space-y-2">
            {lists.map((list) => (
              <ListRow
                key={list.id}
                id={list.id}
                name={list.name}
                description={list.description || `${list.kanjis.length} kanji`}
                count={list.kanjis.length}
                isSelected={selected.has(list.id)}
                onToggle={toggle}
              />
            ))}
          </div>
        </section>
      )}

      {/* JLPT predefined */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Par niveau JLPT</h2>
        <div className="space-y-2">
          {JLPT_PREDEFINED.map((cfg) => {
            const kanjis = resolvePredefinedKanjis(cfg.id, kanjiByLevel, kanjiByFrequency);
            const [borderColor, badgeColor] = cfg.color.split(' ');
            return (
              <ListRow
                key={cfg.id}
                id={cfg.id}
                name={cfg.name}
                description={cfg.description}
                count={kanjis?.length}
                badge={cfg.badge}
                badgeColor={badgeColor}
                borderColor={borderColor}
                isSelected={selected.has(cfg.id)}
                onToggle={toggle}
              />
            );
          })}
        </div>
      </section>

      {/* Frequency predefined */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Par fréquence (presse écrite)</h2>
        <div className="space-y-2">
          {FREQ_PREDEFINED.map((cfg) => {
            const kanjis = resolvePredefinedKanjis(cfg.id, kanjiByLevel, kanjiByFrequency);
            const [borderColor] = cfg.color.split(' ');
            return (
              <ListRow
                key={cfg.id}
                id={cfg.id}
                name={cfg.name}
                description={cfg.description}
                count={kanjis?.length}
                badge={cfg.badge}
                borderColor={borderColor}
                isSelected={selected.has(cfg.id)}
                onToggle={toggle}
              />
            );
          })}
        </div>
      </section>

      {/* User lists fallback when empty */}
      {lists.length === 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mes listes</h2>
          <div className="card p-6 text-center space-y-2">
            <p className="text-gray-400 text-sm">Aucune liste personnalisée.</p>
            <Link to="/lists" className="text-japan-red text-sm hover:underline">
              Créer une liste →
            </Link>
          </div>
        </section>
      )}

      {/* Sticky start button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0d1117]/90 backdrop-blur border-t border-[#21262d]">
        <div className="max-w-2xl mx-auto">
          {trainingType === 'romaji' ? (
            <button
              onClick={handleStart}
              disabled={totalKanjis === 0 || loading}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Chargement…
                </>
              ) : totalKanjis > 0 ? (
                `▶ Commencer — ${totalKanjis} kanji${totalKanjis > 1 ? 's' : ''}`
              ) : (
                'Sélectionnez au moins une liste'
              )}
            </button>
          ) : (
            <button
              onClick={handleStartSentence}
              disabled={totalKanjis === 0 || !hasApiKey}
              className="btn-primary w-full py-3 text-base disabled:opacity-40"
            >
              {!hasApiKey
                ? 'Clé API Gemini requise'
                : totalKanjis > 0
                ? `▶ Commencer — phrases (${totalKanjis} kanjis)`
                : 'Sélectionnez au moins une liste'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useListStore } from '@/store/listStore';
import { useKanjiStore } from '@/store/kanjiStore';
import { useTrainingStore } from '@/store/trainingStore';
import { useStatsStore } from '@/store/statsStore';
import { JLPT_PREDEFINED, FREQ_PREDEFINED, ALL_PREDEFINED, resolvePredefinedKanjis } from '@/utils/predefinedLists';
import { getApiKey, saveApiKey, clearApiKey, CONJUGATION_CHAPTERS } from '@/utils/geminiVision';
import type { SentenceAnswerMode } from '@/types';

const CHAPTER_LABELS: Record<number, string> = {
  3: 'L3 ます形', 4: 'L4 〜ました', 5: 'L5 ましょう',
  6: 'L6 て形', 7: 'L7 〜ている', 8: 'L8 plain',
  9: 'L9 た形', 10: 'L10 つもり', 11: 'L11 たい', 12: 'L12 すぎる',
  13: 'L13 可能形',
};

const CHAPTER_FREQ: Record<number, number> = {
  3: 98, 4: 95, 5: 72, 6: 99, 7: 97,
  8: 96, 9: 94, 10: 68, 11: 82, 12: 74, 13: 88,
};

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
  const kanjiStats = useStatsStore((s) => s.kanjiStats);
  const { startSession, resumePausedSession } = useTrainingStore();

  const [trainingType, setTrainingType] = useState<'romaji' | 'review' | 'sentence' | 'conjugation'>('romaji');
  const [sentenceMode, setSentenceMode] = useState<SentenceAnswerMode>('mcq');
  const [sentenceCount, setSentenceCount] = useState(10);
  const [conjugationCount, setConjugationCount] = useState(10);
  const [selectedChapters, setSelectedChapters] = useState<Set<number>>(new Set(CONJUGATION_CHAPTERS));
  const [reviewCount, setReviewCount] = useState(20);
  const [hasApiKey, setHasApiKey] = useState(!!getApiKey());
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [editingApiKey, setEditingApiKey] = useState(false);
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

  const reviewableKanjis = resolveSelectedKanjis()
    .filter(k => (kanjiStats[k]?.seen ?? 0) > 0)
    .sort((a, b) => {
      const rateA = (kanjiStats[a]?.correct ?? 0) / (kanjiStats[a]?.seen ?? 1);
      const rateB = (kanjiStats[b]?.correct ?? 0) / (kanjiStats[b]?.seen ?? 1);
      if (rateA !== rateB) return rateA - rateB;
      return (kanjiStats[a]?.lastSeen ?? 0) - (kanjiStats[b]?.lastSeen ?? 0);
    });

  const effectiveReviewCount = Math.min(reviewCount, reviewableKanjis.length);

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

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) return;
    saveApiKey(trimmed);
    setHasApiKey(true);
    setApiKeyInput('');
    setEditingApiKey(false);
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setHasApiKey(false);
    setEditingApiKey(false);
    setApiKeyInput('');
  };

  const toggleChapter = (n: number) => setSelectedChapters(prev => {
    const next = new Set(prev);
    if (next.has(n)) next.delete(n); else next.add(n);
    return next;
  });

  const handleStartConjugation = () => {
    navigate('/training/conjugation-session', {
      state: { chapters: Array.from(selectedChapters), count: conjugationCount },
    });
  };

  const handleStartSentence = () => {
    const kanjis = resolveSelectedKanjis();
    if (kanjis.length === 0) return;
    navigate('/training/sentence-session', {
      state: { kanjis, listName: buildListName(), mode: sentenceMode, count: sentenceCount },
    });
  };

  const handleStart = async () => {
    const kanjis = trainingType === 'review'
      ? reviewableKanjis.slice(0, effectiveReviewCount)
      : resolveSelectedKanjis();
    if (kanjis.length === 0 || loading) return;
    setLoading(true);
    try {
      await Promise.all(kanjis.map((k) => loadDetails(k)));
      if (trainingType === 'review') {
        navigate('/training/review-session', {
          state: { kanjis, listName: buildListName() },
        });
      } else {
        const freshDetails = useKanjiStore.getState().details;
        const kanjisDetails = kanjis.map((k) => freshDetails[k]).filter(Boolean) as typeof details[string][];
        startSession(Array.from(selected), buildListName(), kanjisDetails);
        navigate('/training/session');
      }
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
        <div className="grid grid-cols-2 gap-2">
          {([
            ['romaji', 'Prononciation'],
            ['review', 'Révision'],
            ['sentence', 'Phrases'],
            ['conjugation', 'Conjugaison'],
          ] as const).map(([type, label]) => (
            <button
              key={type}
              onClick={() => setTrainingType(type)}
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                trainingType === type
                  ? 'border-japan-red bg-japan-red/10 text-white'
                  : 'border-[#30363d] text-gray-400 hover:border-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {trainingType === 'review' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Nombre de kanjis à réviser</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReviewCount(c => Math.max(1, c - 5))}
                  className="w-9 h-9 rounded-lg border border-[#30363d] text-gray-400 hover:border-gray-500 hover:text-white transition-colors text-lg font-medium shrink-0"
                >−</button>
                <input
                  type="number"
                  min={1}
                  value={reviewCount}
                  onChange={e => setReviewCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#161b22] text-white text-sm text-center outline-none focus:border-japan-red"
                />
                <button
                  onClick={() => setReviewCount(c => c + 5)}
                  className="w-9 h-9 rounded-lg border border-[#30363d] text-gray-400 hover:border-gray-500 hover:text-white transition-colors text-lg font-medium shrink-0"
                >+</button>
              </div>
            </div>
            {totalKanjis > 0 && (
              <div className="px-3 py-2 rounded-lg bg-[#161b22] border border-[#30363d] text-xs text-gray-400 space-y-0.5">
                <p>
                  <span className="text-white font-medium">{reviewableKanjis.length}</span> kanjis entraînés sur {totalKanjis} sélectionnés
                </p>
                {reviewableKanjis.length > 0 && (
                  <p>
                    Les <span className="text-white font-medium">{effectiveReviewCount}</span> moins maîtrisés seront présentés dans l'ordre du plus difficile
                  </p>
                )}
                {reviewableKanjis.length === 0 && (
                  <p className="text-yellow-600">Aucun kanji entraîné dans cette sélection — commencez par le mode Prononciation.</p>
                )}
              </div>
            )}
          </div>
        )}

        {trainingType === 'conjugation' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Chapitres Genki I</p>
              <div className="flex flex-wrap gap-1.5">
                {CONJUGATION_CHAPTERS.map(n => {
                  const freq = CHAPTER_FREQ[n];
                  const freqColor = freq >= 90 ? 'text-green-400' : freq >= 75 ? 'text-yellow-400' : 'text-orange-400';
                  return (
                    <button
                      key={n}
                      onClick={() => toggleChapter(n)}
                      className={`px-2.5 py-1 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
                        selectedChapters.has(n)
                          ? 'border-japan-red bg-japan-red/10 text-white'
                          : 'border-[#30363d] text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {CHAPTER_LABELS[n]}
                      <span className={`font-mono font-semibold ${freqColor} opacity-80`}>{freq}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Nombre de questions (1–70)</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConjugationCount(c => Math.max(1, c - 5))}
                  className="w-9 h-9 rounded-lg border border-[#30363d] text-gray-400 hover:border-gray-500 hover:text-white transition-colors text-lg font-medium shrink-0"
                >−</button>
                <input
                  type="number"
                  min={1}
                  max={70}
                  value={conjugationCount}
                  onChange={e => setConjugationCount(Math.min(70, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#161b22] text-white text-sm text-center outline-none focus:border-japan-red"
                />
                <button
                  onClick={() => setConjugationCount(c => Math.min(70, c + 5))}
                  className="w-9 h-9 rounded-lg border border-[#30363d] text-gray-400 hover:border-gray-500 hover:text-white transition-colors text-lg font-medium shrink-0"
                >+</button>
              </div>
            </div>
          </div>
        )}

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
              <p className="text-xs text-gray-500">Nombre de questions (1–100)</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSentenceCount(c => Math.max(1, c - 5))}
                  className="w-9 h-9 rounded-lg border border-[#30363d] text-gray-400 hover:border-gray-500 hover:text-white transition-colors text-lg font-medium shrink-0"
                >−</button>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={sentenceCount}
                  onChange={e => setSentenceCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#161b22] text-white text-sm text-center outline-none focus:border-japan-red"
                />
                <button
                  onClick={() => setSentenceCount(c => Math.min(100, c + 5))}
                  className="w-9 h-9 rounded-lg border border-[#30363d] text-gray-400 hover:border-gray-500 hover:text-white transition-colors text-lg font-medium shrink-0"
                >+</button>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500">Clé API Gemini</p>
              {hasApiKey && !editingApiKey ? (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#161b22]">
                  <span className="text-xs text-green-400">✓ Clé configurée</span>
                  <div className="flex gap-3">
                    <button onClick={() => setEditingApiKey(true)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Modifier</button>
                    <button onClick={handleClearApiKey} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Supprimer</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSaveApiKey(); }}
                    placeholder="AIza…"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#30363d] bg-[#161b22] text-white text-sm outline-none focus:border-japan-red placeholder-gray-600"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!apiKeyInput.trim()}
                    className="btn-primary text-sm py-1.5 px-3 disabled:opacity-40"
                  >
                    Enregistrer
                  </button>
                  {editingApiKey && (
                    <button onClick={() => { setEditingApiKey(false); setApiKeyInput(''); }} className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-1">
                      Annuler
                    </button>
                  )}
                </div>
              )}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Obtenir une clé sur Google AI Studio →
              </a>
            </div>
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
      {trainingType !== 'conjugation' && lists.length > 0 && (
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

      {trainingType !== 'conjugation' && <>
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
      </>}

      {/* User lists fallback when empty */}
      {trainingType !== 'conjugation' && lists.length === 0 && (
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
          {trainingType === 'romaji' || trainingType === 'review' ? (
            <button
              onClick={handleStart}
              disabled={(trainingType === 'review' ? effectiveReviewCount === 0 : totalKanjis === 0) || loading}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Chargement…
                </>
              ) : trainingType === 'review' ? (
                effectiveReviewCount > 0
                  ? `▶ Réviser — ${effectiveReviewCount} kanji${effectiveReviewCount > 1 ? 's' : ''}`
                  : totalKanjis === 0 ? 'Sélectionnez au moins une liste' : 'Aucun kanji entraîné dans cette sélection'
              ) : totalKanjis > 0 ? (
                `▶ Commencer — ${totalKanjis} kanji${totalKanjis > 1 ? 's' : ''}`
              ) : (
                'Sélectionnez au moins une liste'
              )}
            </button>
          ) : trainingType === 'sentence' ? (
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
          ) : (
            <button
              onClick={handleStartConjugation}
              disabled={selectedChapters.size === 0}
              className="btn-primary w-full py-3 text-base disabled:opacity-40"
            >
              {selectedChapters.size > 0
                ? `▶ Commencer — ${conjugationCount} exercice${conjugationCount > 1 ? 's' : ''}`
                : 'Sélectionnez au moins un chapitre'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

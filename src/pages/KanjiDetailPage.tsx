import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import { useKanjiStore } from '@/store/kanjiStore';
import { useStatsStore } from '@/store/statsStore';
import { StrokeOrder } from '@/components/kanji/StrokeOrder';
import { JlptBadge } from '@/components/kanji/JlptBadge';
import { SpeakButton } from '@/components/kanji/SpeakButton';
import { AddToListModal } from '@/components/lists/AddToListModal';
import { jlptNumericToLabel, getDomainsForKanji } from '@/utils/domains';
import { toRomaji } from '@/utils/romaji';

export function KanjiDetailPage() {
  const { kanji } = useParams<{ kanji: string }>();
  const { details, kanjiWords, loadDetails, loadWords } = useKanjiStore();
  const allKanji = useKanjiStore(useShallow((s) => s.getFilteredKanji()));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAddToList, setShowAddToList] = useState(false);

  const char = kanji ? decodeURIComponent(kanji) : '';
  const kanjiStat = useStatsStore((s) => s.kanjiStats[char]);
  const d = details[char];
  const words = kanjiWords[char] ?? [];

  const idx = allKanji.indexOf(char);
  const prevKanji = idx > 0 ? allKanji[idx - 1] : null;
  const nextKanji = idx < allKanji.length - 1 ? allKanji[idx + 1] : null;

  useEffect(() => {
    if (!char) return;
    setLoading(true);
    Promise.all([loadDetails(char), loadWords(char)]).finally(() => setLoading(false));
  }, [char, loadDetails, loadWords]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft' && prevKanji) navigate(`/kanji/${encodeURIComponent(prevKanji)}`);
      if (e.key === 'ArrowRight' && nextKanji) navigate(`/kanji/${encodeURIComponent(nextKanji)}`);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prevKanji, nextKanji, navigate]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-2 border-japan-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!d) return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-center text-gray-400">
      Kanji introuvable.
    </div>
  );

  const jlpt = jlptNumericToLabel(d.jlpt);
  const domains = getDomainsForKanji(d.meanings);

  function freqLabel(rank: number | null): string | null {
    if (!rank) return null;
    if (rank <= 100) return 'Top 100';
    if (rank <= 500) return 'Top 500';
    if (rank <= 1000) return 'Top 1 000';
    if (rank <= 2000) return 'Top 2 000';
    return null;
  }
  const freq = d.freq_mainichi_shinbun;
  const freqTier = freqLabel(freq);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Navigation bar */}
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1">
          ← Retour à la liste
        </Link>

        <div className="flex items-center gap-2">
          {idx >= 0 && (
            <span className="text-xs text-gray-600">
              {idx + 1} / {allKanji.length}
            </span>
          )}
          <button
            onClick={() => prevKanji && navigate(`/kanji/${encodeURIComponent(prevKanji)}`)}
            disabled={!prevKanji}
            className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-30"
            title="Kanji précédent (←)"
          >
            ← Préc.
          </button>
          <button
            onClick={() => nextKanji && navigate(`/kanji/${encodeURIComponent(nextKanji)}`)}
            disabled={!nextKanji}
            className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-30"
            title="Kanji suivant (→)"
          >
            Suiv. →
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex flex-col items-center gap-3 min-w-[120px]">
            <span className="kanji-char text-8xl text-white leading-none">{char}</span>
            <JlptBadge level={jlpt} />
            <p className="text-xs text-gray-500">{d.stroke_count} trait{d.stroke_count > 1 ? 's' : ''}</p>
            {d.grade && <p className="text-xs text-gray-500">Classe {d.grade}</p>}
            {freq && (
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-xs text-amber-400 font-medium">#{freq}</p>
                {freqTier && <p className="text-xs text-amber-400/70">{freqTier}</p>}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            {/* Meanings */}
            <div>
              <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Significations</h2>
              <div className="flex flex-wrap gap-2">
                {d.meanings.map((m, i) => (
                  <span key={i} className="bg-[#21262d] border border-[#30363d] text-gray-200 px-3 py-1 rounded-full text-sm">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Readings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                  音読み — On-yomi (Sinojap.)
                </h2>
                {d.on_readings.length > 0 ? (
                  <div className="space-y-1.5">
                    {d.on_readings.map((r, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="kanji-char text-lg text-blue-300 font-medium min-w-[60px]">{r}</span>
                        <span className="text-gray-500 text-sm flex-1">{toRomaji(r)}</span>
                        <SpeakButton text={r} />
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-600 text-sm italic">Aucune lecture on-yomi</p>}
              </div>

              <div>
                <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                  訓読み — Kun-yomi (Japonais nat.)
                </h2>
                {d.kun_readings.length > 0 ? (
                  <div className="space-y-1.5">
                    {d.kun_readings.map((r, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="kanji-char text-lg text-green-300 font-medium min-w-[80px]">{r}</span>
                        <span className="text-gray-500 text-sm flex-1">{toRomaji(r)}</span>
                        <SpeakButton text={r} />
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-600 text-sm italic">Aucune lecture kun-yomi</p>}
              </div>
            </div>

            {/* Domains */}
            {domains.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Domaines</h2>
                <div className="flex flex-wrap gap-1.5">
                  {domains.map((dom) => (
                    <span key={dom} className="text-xs px-2 py-0.5 rounded-md bg-japan-red/10 border border-japan-red/30 text-red-300">
                      {dom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setShowAddToList(true)} className="btn-primary text-sm flex items-center gap-2">
              <span>+ Ajouter à une liste</span>
            </button>
          </div>
        </div>
      </div>

      {/* Example words */}
      {words.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Exemples de mots</h2>
          <div className="space-y-2">
            {words.map((w, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="kanji-char text-lg text-white font-medium w-16 shrink-0">{w.word}</span>
                <span className="kanji-char text-base text-gray-400 w-28 shrink-0">{w.reading}</span>
                <span className="text-gray-500 text-sm flex-1 truncate">{w.meaning}</span>
                <SpeakButton text={w.word} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Name readings */}
      {d.name_readings.length > 0 && (
        <div className="card p-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-medium">
            名乗り — Lectures de noms propres
          </h2>
          <div className="flex flex-wrap gap-3">
            {d.name_readings.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="kanji-char text-purple-300">{r}</span>
                <span className="text-gray-500">{toRomaji(r)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Training stats */}
      {kanjiStat && (
        <div className="card p-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-medium">Entraînement</h2>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className={`text-xl font-bold ${
                Math.round(kanjiStat.correct / kanjiStat.seen * 100) >= 80 ? 'text-green-400'
                : Math.round(kanjiStat.correct / kanjiStat.seen * 100) >= 50 ? 'text-yellow-400'
                : 'text-red-400'
              }`}>
                {Math.round(kanjiStat.correct / kanjiStat.seen * 100)}%
              </p>
              <p className="text-xs text-gray-500">Réussite</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-300">{kanjiStat.seen}</p>
              <p className="text-xs text-gray-500">Passage{kanjiStat.seen > 1 ? 's' : ''}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-400">{kanjiStat.correct}</p>
              <p className="text-xs text-gray-500">Réussi{kanjiStat.correct > 1 ? 's' : ''}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-red-400">{kanjiStat.seen - kanjiStat.correct}</p>
              <p className="text-xs text-gray-500">Raté{kanjiStat.seen - kanjiStat.correct > 1 ? 's' : ''}</p>
            </div>
            <div className="ml-auto">
              <Link to="/training" className="text-xs text-japan-red hover:underline">
                S'entraîner →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stroke Order */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Ordre des traits</h2>
        <StrokeOrder kanji={char} />
      </div>

      {/* Heisig */}
      {d.heisig_en && (
        <div className="card p-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
            Mot-clé Heisig
          </h2>
          <p className="text-gray-200 italic">"{d.heisig_en}"</p>
        </div>
      )}

      {showAddToList && <AddToListModal kanjis={[char]} onClose={() => setShowAddToList(false)} />}
    </div>
  );
}

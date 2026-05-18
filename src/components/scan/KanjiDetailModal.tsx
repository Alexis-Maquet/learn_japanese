import { useEffect, useState } from 'react';
import { useKanjiStore } from '@/store/kanjiStore';
import { JlptBadge } from '@/components/kanji/JlptBadge';
import { SpeakButton } from '@/components/kanji/SpeakButton';
import { StrokeOrder } from '@/components/kanji/StrokeOrder';
import { AddToListModal } from '@/components/lists/AddToListModal';
import { jlptNumericToLabel } from '@/utils/domains';
import { toRomaji } from '@/utils/romaji';

interface Props {
  kanji: string;
  onClose: () => void;
}

export function KanjiDetailModal({ kanji, onClose }: Props) {
  const { details, kanjiWords, loadDetails, loadWords } = useKanjiStore();
  const [loading, setLoading] = useState(false);
  const [showAddToList, setShowAddToList] = useState(false);

  const d = details[kanji];
  const words = kanjiWords[kanji] ?? [];

  useEffect(() => {
    setLoading(true);
    Promise.all([loadDetails(kanji), loadWords(kanji)]).finally(() => setLoading(false));
  }, [kanji, loadDetails, loadWords]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const jlpt = d ? jlptNumericToLabel(d.jlpt) : null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1117] border border-[#30363d] rounded-xl w-full max-w-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#30363d]">
          <div className="flex items-center gap-4">
            <span className="kanji-char text-5xl text-white leading-none">{kanji}</span>
            <div className="space-y-1">
              <JlptBadge level={jlpt} />
              {d && <p className="text-xs text-gray-500">{d.stroke_count} trait{d.stroke_count > 1 ? 's' : ''}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-2xl leading-none px-2"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {loading && !d ? (
          <div className="p-10 flex justify-center">
            <div className="w-8 h-8 border-2 border-japan-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : d ? (
          <div className="p-5 space-y-5">
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
                <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">On-yomi</h2>
                {d.on_readings.length > 0 ? (
                  <div className="space-y-1.5">
                    {d.on_readings.map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="kanji-char text-base text-blue-300 min-w-[64px]">{r}</span>
                        <span className="text-gray-500 text-sm flex-1">{toRomaji(r)}</span>
                        <SpeakButton text={r} />
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-600 text-sm italic">—</p>}
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Kun-yomi</h2>
                {d.kun_readings.length > 0 ? (
                  <div className="space-y-1.5">
                    {d.kun_readings.map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="kanji-char text-base text-green-300 min-w-[80px]">{r}</span>
                        <span className="text-gray-500 text-sm flex-1">{toRomaji(r)}</span>
                        <SpeakButton text={r} />
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-600 text-sm italic">—</p>}
              </div>
            </div>

            {/* Example words */}
            {words.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Exemples de mots</h2>
                <div className="space-y-1.5">
                  {words.slice(0, 8).map((w, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="kanji-char text-base text-white w-16 shrink-0">{w.word}</span>
                      <span className="kanji-char text-sm text-gray-400 w-24 shrink-0">{w.reading}</span>
                      <span className="text-gray-500 text-sm flex-1 truncate">{w.meaning}</span>
                      <SpeakButton text={w.word} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stroke order */}
            <div>
              <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">Ordre des traits</h2>
              <StrokeOrder kanji={kanji} />
            </div>

            {/* Actions */}
            <button onClick={() => setShowAddToList(true)} className="btn-primary text-sm">
              + Ajouter à une liste
            </button>
          </div>
        ) : null}

        {showAddToList && <AddToListModal kanjis={[kanji]} onClose={() => setShowAddToList(false)} />}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useKanjiStore } from '@/store/kanjiStore';
import { JlptBadge } from '@/components/kanji/JlptBadge';
import { AddToListModal } from '@/components/lists/AddToListModal';
import { jlptNumericToLabel } from '@/utils/domains';
import type { KanjiDetails } from '@/types';

interface KanjiCardInlineProps {
  kanji: string;
}

function KanjiCardInline({ kanji }: KanjiCardInlineProps) {
  const { details, loadDetails } = useKanjiStore();
  const d: KanjiDetails | undefined = details[kanji];

  useEffect(() => {
    loadDetails(kanji);
  }, [kanji, loadDetails]);

  const jlpt = d ? jlptNumericToLabel(d.jlpt) : null;

  return (
    <Link
      to={`/kanji/${encodeURIComponent(kanji)}`}
      className="card p-4 flex flex-col items-center gap-2 hover:border-japan-red hover:shadow-japan-red/10 transition-all group cursor-pointer"
    >
      <span className="text-5xl kanji-char leading-none text-white group-hover:text-japan-red transition-colors">
        {kanji}
      </span>
      <JlptBadge level={jlpt} />
      {d ? (
        <>
          <p className="text-xs text-gray-400 text-center line-clamp-2 leading-relaxed">
            {d.meanings.slice(0, 3).join(', ')}
          </p>
          <div className="w-full space-y-0.5">
            {d.on_readings.length > 0 && (
              <p className="text-xs text-center">
                <span className="text-gray-500">音: </span>
                <span className="text-blue-300">{d.on_readings.slice(0, 2).join('、')}</span>
              </p>
            )}
            {d.kun_readings.length > 0 && (
              <p className="text-xs text-center">
                <span className="text-gray-500">訓: </span>
                <span className="text-green-300">{d.kun_readings.slice(0, 2).join('、')}</span>
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="w-full space-y-1">
          <div className="h-3 bg-[#21262d] rounded animate-pulse" />
          <div className="h-3 bg-[#21262d] rounded animate-pulse w-3/4 mx-auto" />
        </div>
      )}
      <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors mt-1">
        Voir détails →
      </span>
    </Link>
  );
}

interface Props {
  kanjis: string[];
}

export function KanjiAnalysis({ kanjis }: Props) {
  const [showAddToList, setShowAddToList] = useState(false);

  if (kanjis.length === 0) {
    return (
      <p className="text-gray-500 text-sm italic">Aucun kanji détecté dans ce texte.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          <span className="text-white font-semibold">{kanjis.length}</span> kanji{kanjis.length > 1 ? 's' : ''} détecté{kanjis.length > 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setShowAddToList(true)}
          className="btn-secondary text-xs flex items-center gap-1.5"
        >
          <span>+</span>
          <span>Ajouter à une liste</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {kanjis.map((k) => (
          <KanjiCardInline key={k} kanji={k} />
        ))}
      </div>

      {showAddToList && (
        <AddToListModal kanjis={kanjis} onClose={() => setShowAddToList(false)} />
      )}
    </div>
  );
}

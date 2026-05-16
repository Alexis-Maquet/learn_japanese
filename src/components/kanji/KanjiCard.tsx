import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useKanjiStore } from '../../store/kanjiStore';
import { jlptNumericToLabel, getDomainsForKanji } from '../../utils/domains';
import { JlptBadge } from './JlptBadge';
import { useListStore } from '../../store/listStore';

interface Props {
  kanji: string;
  jlptLevel?: string | null;
  listId?: string;
}

export function KanjiCard({ kanji, jlptLevel, listId }: Props) {
  const { details, loadDetails, filters } = useKanjiStore();
  const { addKanjiToList, removeKanjiFromList, lists } = useListStore();
  const d = details[kanji];

  useEffect(() => {
    loadDetails(kanji);
  }, [kanji, loadDetails]);

  const jlpt = d ? jlptNumericToLabel(d.jlpt) : (jlptLevel ?? null);
  const domains = d ? getDomainsForKanji(d.meanings) : [];

  // Domain filter
  if (filters.domains.length > 0 && d && !filters.domains.some((fd) => domains.includes(fd as never))) {
    return null;
  }

  return (
    <Link
      to={`/kanji/${encodeURIComponent(kanji)}`}
      className="card p-4 flex flex-col items-center gap-2 hover:border-japan-red transition-all hover:shadow-lg hover:shadow-japan-red/10 group cursor-pointer"
    >
      <div className="text-5xl kanji-char text-white group-hover:text-japan-red transition-colors leading-none">
        {kanji}
      </div>

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

      {listId && (
        <button
          onClick={(e) => {
            e.preventDefault();
            const inList = lists.find((l) => l.id === listId)?.kanjis.includes(kanji);
            if (inList) removeKanjiFromList(listId, kanji);
            else addKanjiToList(listId, kanji);
          }}
          className="text-xs text-gray-500 hover:text-white mt-1"
        >
          ✕ Retirer
        </button>
      )}
    </Link>
  );
}

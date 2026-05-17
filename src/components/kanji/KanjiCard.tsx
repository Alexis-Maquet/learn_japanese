import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useKanjiStore } from '@/store/kanjiStore';
import { jlptNumericToLabel, getDomainsForKanji } from '@/utils/domains';
import { JlptBadge } from '@/components/kanji/JlptBadge';
import { useListStore } from '@/store/listStore';

interface Props {
  kanji: string;
  jlptLevel?: string | null;
  listId?: string;
  selected?: boolean;
  onSelect?: (kanji: string) => void;
}

export function KanjiCard({ kanji, jlptLevel, listId, selected, onSelect }: Props) {
  const { details, loadDetails, filters } = useKanjiStore();
  const { addKanjiToList, removeKanjiFromList, lists } = useListStore();
  const d = details[kanji];

  useEffect(() => {
    loadDetails(kanji);
  }, [kanji, loadDetails]);

  const jlpt = d ? jlptNumericToLabel(d.jlpt) : (jlptLevel ?? null);
  const domains = d ? getDomainsForKanji(d.meanings) : [];

  if (filters.domains.length > 0 && d && !filters.domains.some((fd) => domains.includes(fd as never))) {
    return null;
  }

  const cardContent = (
    <>
      {onSelect && (
        <div className={`absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          selected ? 'bg-japan-red border-japan-red' : 'border-gray-500 bg-transparent'
        }`}>
          {selected && <span className="text-white text-xs leading-none">✓</span>}
        </div>
      )}

      <div className={`text-5xl kanji-char leading-none transition-colors ${
        selected ? 'text-japan-red' : 'text-white group-hover:text-japan-red'
      }`}>
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
    </>
  );

  const className = `relative card p-4 flex flex-col items-center gap-2 transition-all hover:shadow-lg group cursor-pointer ${
    selected
      ? 'border-japan-red shadow-japan-red/20'
      : 'hover:border-japan-red hover:shadow-japan-red/10'
  }`;

  if (onSelect) {
    return (
      <div className={className} onClick={() => onSelect(kanji)}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link to={`/kanji/${encodeURIComponent(kanji)}`} className={className}>
      {cardContent}
    </Link>
  );
}

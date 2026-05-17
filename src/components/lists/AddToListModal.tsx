import { useState } from 'react';
import { useListStore } from '@/store/listStore';
import { CreateListModal } from '@/components/lists/CreateListModal';

interface Props {
  kanjis: string[];
  onClose: () => void;
}

export function AddToListModal({ kanjis, onClose }: Props) {
  const { lists, addKanjiToList, addKanjisToList, removeKanjiFromList, isKanjiInList } = useListStore();
  const [showCreate, setShowCreate] = useState(false);

  const isSingle = kanjis.length === 1;
  const kanji = kanjis[0];

  if (showCreate) return <CreateListModal onClose={() => setShowCreate(false)} />;

  const title = isSingle
    ? <span>Ajouter <span className="text-japan-red kanji-char text-2xl">{kanji}</span> à une liste</span>
    : <span>Ajouter <span className="text-japan-red font-bold">{kanjis.length} kanjis</span> à une liste</span>;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
        </div>

        {!isSingle && (
          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
            {kanjis.map((k) => (
              <span key={k} className="kanji-char text-lg text-gray-300">{k}</span>
            ))}
          </div>
        )}

        {lists.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            Aucune liste créée. Créez une liste d'abord.
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {lists.map((list) => {
              if (isSingle) {
                const inList = isKanjiInList(list.id, kanji);
                return (
                  <button
                    key={list.id}
                    onClick={() => inList ? removeKanjiFromList(list.id, kanji) : addKanjiToList(list.id, kanji)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-sm ${
                      inList
                        ? 'bg-japan-red/20 border-japan-red text-white'
                        : 'border-[#30363d] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium">{list.name}</p>
                      <p className="text-xs text-gray-500">{list.kanjis.length} kanji</p>
                    </div>
                    <span>{inList ? '✓ Retiré' : '+ Ajouter'}</span>
                  </button>
                );
              }

              const alreadyIn = kanjis.filter((k) => list.kanjis.includes(k)).length;
              const allIn = alreadyIn === kanjis.length;
              return (
                <button
                  key={list.id}
                  onClick={() => { if (!allIn) addKanjisToList(list.id, kanjis); }}
                  disabled={allIn}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-sm ${
                    allIn
                      ? 'bg-japan-red/20 border-japan-red text-white opacity-60 cursor-default'
                      : 'border-[#30363d] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-medium">{list.name}</p>
                    <p className="text-xs text-gray-500">
                      {list.kanjis.length} kanji
                      {alreadyIn > 0 && !allIn && ` · ${alreadyIn}/${kanjis.length} déjà présents`}
                    </p>
                  </div>
                  <span>{allIn ? '✓ Tous présents' : `+ Ajouter ${kanjis.length - alreadyIn}`}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex justify-between items-center pt-1">
          <button onClick={() => setShowCreate(true)} className="text-sm text-japan-red hover:text-red-400">
            + Nouvelle liste
          </button>
          <button onClick={onClose} className="btn-secondary text-sm">Fermer</button>
        </div>
      </div>
    </div>
  );
}

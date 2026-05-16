import { useState } from 'react';
import { useListStore } from '../../store/listStore';
import { CreateListModal } from './CreateListModal';

interface Props {
  kanji: string;
  onClose: () => void;
}

export function AddToListModal({ kanji, onClose }: Props) {
  const { lists, addKanjiToList, removeKanjiFromList, isKanjiInList } = useListStore();
  const [showCreate, setShowCreate] = useState(false);

  if (showCreate) return <CreateListModal onClose={() => setShowCreate(false)} />;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Ajouter <span className="text-japan-red kanji-char text-2xl">{kanji}</span> à une liste
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
        </div>

        {lists.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            Aucune liste créée. Créez une liste d'abord.
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {lists.map((list) => {
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

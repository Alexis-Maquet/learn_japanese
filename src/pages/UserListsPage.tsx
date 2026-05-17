import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useListStore } from '@/store/listStore';
import { CreateListModal } from '@/components/lists/CreateListModal';

export function UserListsPage() {
  const { lists, deleteList } = useListStore();
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteList(id);
    setConfirmDelete(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes listes de Kanjis</h1>
          <p className="text-gray-400 text-sm mt-1">
            {lists.length} liste{lists.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          + Nouvelle liste
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="card p-12 text-center space-y-4">
          <div className="text-5xl">📋</div>
          <h2 className="text-lg font-medium text-white">Aucune liste pour le moment</h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Créez des listes personnalisées pour organiser vos kanjis et vous entraîner dessus.
          </p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            Créer ma première liste
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lists.map((list) => (
            <div key={list.id} className="card p-5 space-y-3 hover:border-gray-500 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-white truncate">{list.name}</h2>
                  {list.description && (
                    <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">{list.description}</p>
                  )}
                </div>
                <button
                  onClick={() => setConfirmDelete(list.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors text-sm shrink-0"
                  title="Supprimer"
                >
                  🗑
                </button>
              </div>

              {/* Kanji preview */}
              <div className="flex flex-wrap gap-1 min-h-[32px]">
                {list.kanjis.slice(0, 20).map((k) => (
                  <Link
                    key={k}
                    to={`/kanji/${encodeURIComponent(k)}`}
                    className="kanji-char text-xl text-gray-300 hover:text-japan-red transition-colors"
                    title={k}
                  >
                    {k}
                  </Link>
                ))}
                {list.kanjis.length > 20 && (
                  <span className="text-gray-500 text-sm self-center">+{list.kanjis.length - 20}</span>
                )}
                {list.kanjis.length === 0 && (
                  <span className="text-gray-600 text-sm italic">Liste vide</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-gray-500">
                  {list.kanjis.length} kanji · Modifié {new Date(list.updatedAt).toLocaleDateString('fr-FR')}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/lists/${list.id}`}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Voir →
                  </Link>
                  {list.kanjis.length > 0 && (
                    <Link
                      to={`/training/${list.id}`}
                      className="text-xs text-japan-red hover:text-red-400 transition-colors font-medium"
                    >
                      ✏️ S'entraîner
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreateListModal onClose={() => setShowCreate(false)} />}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-sm space-y-4">
            <h2 className="font-semibold text-white">Supprimer cette liste ?</h2>
            <p className="text-sm text-gray-400">Cette action est irréversible.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-sm">
                Annuler
              </button>
              <button onClick={() => handleDelete(confirmDelete)} className="btn-primary text-sm bg-red-700 hover:bg-red-800">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

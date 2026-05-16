import { Link } from 'react-router-dom';
import { useListStore } from '../store/listStore';

export function TrainingPage() {
  const lists = useListStore((s) => s.lists);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Entraînement</h1>
        <p className="text-gray-400 text-sm mt-1">
          Choisissez une liste pour commencer une session d'entraînement.
        </p>
      </div>

      {lists.length === 0 ? (
        <div className="card p-12 text-center space-y-4">
          <div className="text-5xl">✏️</div>
          <h2 className="text-lg font-medium text-white">Aucune liste disponible</h2>
          <p className="text-gray-400 text-sm">
            Créez une liste de kanjis depuis la page de référence ou depuis vos listes.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="btn-secondary text-sm">Parcourir les kanjis</Link>
            <Link to="/lists" className="btn-primary text-sm">Mes listes</Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {lists.map((list) => (
            <div key={list.id} className="card p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-white">{list.name}</h2>
                {list.description && (
                  <p className="text-sm text-gray-400 mt-0.5">{list.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{list.kanjis.length} kanji</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {list.kanjis.slice(0, 15).map((k) => (
                    <span key={k} className="kanji-char text-lg text-gray-400">{k}</span>
                  ))}
                  {list.kanjis.length > 15 && (
                    <span className="text-gray-600 text-sm self-end">+{list.kanjis.length - 15}</span>
                  )}
                </div>
              </div>

              {list.kanjis.length > 0 ? (
                <Link
                  to={`/training/${list.id}`}
                  className="btn-primary text-sm shrink-0"
                >
                  ▶ S'entraîner
                </Link>
              ) : (
                <span className="text-xs text-gray-600 shrink-0">Liste vide</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

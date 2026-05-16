import { useParams, Link } from 'react-router-dom';
import { useListStore } from '../store/listStore';
import { KanjiCard } from '../components/kanji/KanjiCard';

export function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getList, removeKanjiFromList } = useListStore();

  const list = getList(id ?? '');

  if (!list) return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-400">
      Liste introuvable.{' '}
      <Link to="/lists" className="text-japan-red hover:underline">Retour aux listes</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/lists" className="text-sm text-gray-500 hover:text-white transition-colors">
          ← Mes listes
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{list.name}</h1>
          {list.description && <p className="text-gray-400 text-sm mt-1">{list.description}</p>}
          <p className="text-gray-500 text-xs mt-1">{list.kanjis.length} kanji</p>
        </div>
        {list.kanjis.length > 0 && (
          <Link
            to={`/training/${list.id}`}
            className="btn-primary flex items-center gap-2 self-start"
          >
            ✏️ S'entraîner sur cette liste
          </Link>
        )}
      </div>

      {list.kanjis.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <p className="text-gray-400">Cette liste est vide.</p>
          <Link to="/" className="text-japan-red text-sm hover:underline">
            Parcourir les kanjis →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-3">
          {list.kanjis.map((k) => (
            <div key={k} className="relative group">
              <KanjiCard kanji={k} />
              <button
                onClick={() => removeKanjiFromList(list.id, k)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-700 rounded-full text-white text-xs hidden group-hover:flex items-center justify-center hover:bg-red-600"
                title="Retirer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

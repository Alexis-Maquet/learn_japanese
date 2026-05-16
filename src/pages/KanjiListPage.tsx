import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useKanjiStore } from '../store/kanjiStore';
import { FilterBar } from '../components/filters/FilterBar';
import { KanjiCard } from '../components/kanji/KanjiCard';

const PAGE_SIZE = 60;

export function KanjiListPage() {
  const { kanjiByLevel, loadAllLevels, loading, error, currentPage, setPage } = useKanjiStore();

  useEffect(() => { loadAllLevels(); }, [loadAllLevels]);

  const allKanji = useKanjiStore(useShallow((s) => s.getFilteredKanji()));

  const levelMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const [level, kanjis] of Object.entries(kanjiByLevel)) {
      for (const k of kanjis) if (!m[k]) m[k] = level;
    }
    return m;
  }, [kanjiByLevel]);

  const totalPages = Math.ceil(allKanji.length / PAGE_SIZE);
  const pageKanji = allKanji.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const loaded = Object.keys(kanjiByLevel).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Référence Kanji</h1>
          <p className="text-gray-400 text-sm mt-1">
            {allKanji.length} kanji
            {loaded < 5 ? ` (chargement ${loaded}/5 niveaux...)` : ''}
          </p>
        </div>
        {loading && (
          <div className="w-6 h-6 border-2 border-japan-red border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="space-y-4">
          <FilterBar />
          <div className="card p-4 text-xs text-gray-500 space-y-1">
            <p className="font-medium text-gray-400">Légende des niveaux</p>
            {['N5', 'N4', 'N3', 'N2', 'N1'].map((l) => (
              <div key={l} className="flex justify-between">
                <span>{l}</span>
                <span>{kanjiByLevel[l]?.length ?? '…'} kanjis</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="space-y-4">
          {pageKanji.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-16">
              Aucun kanji ne correspond aux filtres sélectionnés.
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3">
            {pageKanji.map((k) => (
              <KanjiCard key={k} kanji={k} jlptLevel={levelMap[k] ?? null} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40"
              >
                ← Préc.
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 9) page = i + 1;
                  else if (currentPage <= 5) page = i + 1;
                  else if (currentPage >= totalPages - 4) page = totalPages - 8 + i;
                  else page = currentPage - 4 + i;
                  return (
                    <button
                      key={page}
                      onClick={() => setPage(page)}
                      className={`w-8 h-8 rounded text-sm transition-colors ${
                        page === currentPage
                          ? 'bg-japan-red text-white'
                          : 'bg-[#21262d] text-gray-400 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40"
              >
                Suiv. →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

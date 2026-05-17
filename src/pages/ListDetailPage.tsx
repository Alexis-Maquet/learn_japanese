import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useListStore } from '@/store/listStore';
import { useKanjiStore } from '@/store/kanjiStore';
import { KanjiCard } from '@/components/kanji/KanjiCard';
import { searchKanjiInDb } from '@/utils/api';
import { getDomainsForKanji } from '@/utils/domains';
import { JLPT_LEVELS, DOMAINS } from '@/types';
import type { Domain } from '@/types';

const JLPT_COLORS: Record<string, string> = {
  N5: 'border-green-600 data-[active=true]:bg-green-900 data-[active=true]:border-green-500 data-[active=true]:text-green-300',
  N4: 'border-blue-600 data-[active=true]:bg-blue-900 data-[active=true]:border-blue-500 data-[active=true]:text-blue-300',
  N3: 'border-yellow-600 data-[active=true]:bg-yellow-900 data-[active=true]:border-yellow-500 data-[active=true]:text-yellow-300',
  N2: 'border-orange-600 data-[active=true]:bg-orange-900 data-[active=true]:border-orange-500 data-[active=true]:text-orange-300',
  N1: 'border-red-600 data-[active=true]:bg-red-900 data-[active=true]:border-red-500 data-[active=true]:text-red-300',
};

export function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getList, removeKanjiFromList } = useListStore();
  const { kanjiByLevel, details, loadAllLevels, loadDetails } = useKanjiStore();

  const list = getList(id ?? '');

  const [search, setSearch] = useState('');
  const [jlpt, setJlpt] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);

  useEffect(() => { loadAllLevels(); }, [loadAllLevels]);

  useEffect(() => {
    if (!list) return;
    list.kanjis.forEach((k) => loadDetails(k));
  }, [list?.id]);

  // JLPT reverse map
  const jlptMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const [level, kanjis] of Object.entries(kanjiByLevel)) {
      for (const k of kanjis) if (!m[k]) m[k] = level;
    }
    return m;
  }, [kanjiByLevel]);

  const filteredKanjis = useMemo(() => {
    if (!list) return [];
    let result = list.kanjis;

    if (search.trim()) {
      const matches = searchKanjiInDb(search.trim());
      result = result.filter((k) => matches.has(k));
    }

    if (jlpt.length > 0) {
      result = result.filter((k) => jlpt.includes(jlptMap[k] ?? 'none'));
    }

    if (domains.length > 0) {
      result = result.filter((k) => {
        const d = details[k];
        if (!d) return false;
        const kDomains = getDomainsForKanji(d.meanings);
        return domains.some((dom) => kDomains.includes(dom as Domain));
      });
    }

    return result;
  }, [list, search, jlpt, domains, jlptMap, details]);

  const hasFilters = search.trim() || jlpt.length > 0 || domains.length > 0;
  const clearAll = () => { setSearch(''); setJlpt([]); setDomains([]); };

  const toggleJlpt = (level: string) =>
    setJlpt((prev) => prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]);

  const toggleDomain = (domain: string) =>
    setDomains((prev) => prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]);

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
          <button
            onClick={() => navigate('/training', { state: { preselected: list.id } })}
            className="btn-primary flex items-center gap-2 self-start"
          >
            ✏️ S'entraîner sur cette liste
          </button>
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
        <>
          {/* Filter panel */}
          <div className="card p-4 space-y-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Rechercher par kanji ou signification anglaise…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-japan-red"
            />

            {/* JLPT */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Niveau JLPT</p>
              <div className="flex flex-wrap gap-2">
                {JLPT_LEVELS.map((level) => (
                  <button
                    key={level}
                    data-active={jlpt.includes(level)}
                    onClick={() => toggleJlpt(level)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${JLPT_COLORS[level]} text-gray-400 hover:text-white`}
                  >
                    {level}
                  </button>
                ))}
                <button
                  data-active={jlpt.includes('none')}
                  onClick={() => toggleJlpt('none')}
                  className="px-3 py-1 rounded-full text-xs font-bold border transition-all border-gray-600 data-[active=true]:bg-gray-800 data-[active=true]:border-gray-400 data-[active=true]:text-gray-300 text-gray-400 hover:text-white"
                >
                  Sans JLPT
                </button>
              </div>
            </div>

            {/* Domains */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Catégorie</p>
              <div className="flex flex-wrap gap-1.5">
                {DOMAINS.map((domain) => (
                  <button
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className={`px-2.5 py-1 rounded-md text-xs border transition-all ${
                      domains.includes(domain)
                        ? 'bg-japan-red/20 border-japan-red text-red-300'
                        : 'border-[#30363d] text-gray-400 hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {filteredKanjis.length} / {list.kanjis.length} kanji{filteredKanjis.length > 1 ? 's' : ''}
                </span>
                <button onClick={clearAll} className="text-xs text-gray-500 hover:text-white transition-colors underline">
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>

          {/* Kanji grid */}
          {filteredKanjis.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              Aucun kanji ne correspond aux filtres.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-3">
              {filteredKanjis.map((k) => (
                <div key={k} className="relative group">
                  <KanjiCard kanji={k} jlptLevel={jlptMap[k] ?? null} />
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
        </>
      )}
    </div>
  );
}

import { JLPT_LEVELS, DOMAINS } from '../../types';
import { useKanjiStore } from '../../store/kanjiStore';

const JLPT_COLORS: Record<string, string> = {
  N5: 'border-green-600 data-[active=true]:bg-green-900 data-[active=true]:border-green-500 data-[active=true]:text-green-300',
  N4: 'border-blue-600 data-[active=true]:bg-blue-900 data-[active=true]:border-blue-500 data-[active=true]:text-blue-300',
  N3: 'border-yellow-600 data-[active=true]:bg-yellow-900 data-[active=true]:border-yellow-500 data-[active=true]:text-yellow-300',
  N2: 'border-orange-600 data-[active=true]:bg-orange-900 data-[active=true]:border-orange-500 data-[active=true]:text-orange-300',
  N1: 'border-red-600 data-[active=true]:bg-red-900 data-[active=true]:border-red-500 data-[active=true]:text-red-300',
};

export function FilterBar() {
  const { filters, setFilters } = useKanjiStore();

  const toggleJlpt = (level: string) => {
    const next = filters.jlpt.includes(level) ? filters.jlpt.filter((l) => l !== level) : [...filters.jlpt, level];
    setFilters({ jlpt: next });
  };

  const toggleDomain = (domain: string) => {
    const next = filters.domains.includes(domain)
      ? filters.domains.filter((d) => d !== domain)
      : [...filters.domains, domain];
    setFilters({ domains: next });
  };

  const clearAll = () => setFilters({ jlpt: [], domains: [], search: '' });
  const hasFilters = filters.jlpt.length > 0 || filters.domains.length > 0 || filters.search;

  return (
    <div className="card p-4 space-y-4">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Rechercher un kanji..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-japan-red"
        />
      </div>

      {/* JLPT */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Niveau JLPT</p>
        <div className="flex flex-wrap gap-2">
          {JLPT_LEVELS.map((level) => (
            <button
              key={level}
              data-active={filters.jlpt.includes(level)}
              onClick={() => toggleJlpt(level)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${JLPT_COLORS[level]} text-gray-400 hover:text-white`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Domains */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Domaine</p>
        <div className="flex flex-wrap gap-1.5">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => toggleDomain(domain)}
              className={`px-2.5 py-1 rounded-md text-xs border transition-all ${
                filters.domains.includes(domain)
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
        <button onClick={clearAll} className="text-xs text-gray-500 hover:text-white transition-colors underline">
          Effacer tous les filtres
        </button>
      )}
    </div>
  );
}

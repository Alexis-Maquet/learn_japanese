import { Link, useLocation } from 'react-router-dom';
import { useListStore } from '../store/listStore';

const NAV_LINKS = [
  { to: '/', label: 'Kanjis', icon: '漢' },
  { to: '/lists', label: 'Mes listes', icon: '📋' },
  { to: '/training', label: 'Entraînement', icon: '✏️' },
];

export function Navigation() {
  const location = useLocation();
  const lists = useListStore((s) => s.lists);

  return (
    <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-14">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <span className="text-japan-red text-2xl kanji-char">漢字</span>
          <span className="hidden sm:block">Référence</span>
        </Link>

        <nav className="flex items-center gap-1 ml-4">
          {NAV_LINKS.map(({ to, label, icon }) => {
            const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-japan-red text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
                {to === '/lists' && lists.length > 0 && (
                  <span className="bg-[#30363d] text-gray-300 text-xs px-1.5 py-0.5 rounded-full">
                    {lists.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

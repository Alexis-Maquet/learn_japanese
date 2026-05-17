import { Link } from 'react-router-dom';
import { useStatsStore } from '@/store/statsStore';

function pct(correct: number, total: number) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

function formatDuration(ms: number) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m${s % 60 > 0 ? ` ${s % 60}s` : ''}`;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const color = score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
  return (
    <span className={`font-bold tabular-nums ${color} ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
      {score}%
    </span>
  );
}

export function StatsPage() {
  const { kanjiStats, sessions, clearStats } = useStatsStore();

  const totalSessions = sessions.length;
  const uniqueKanjis = Object.keys(kanjiStats).length;
  const globalAvg = totalSessions === 0
    ? null
    : Math.round(sessions.reduce((acc, s) => acc + pct(s.score, s.total), 0) / totalSessions);

  const hardKanjis = Object.entries(kanjiStats)
    .filter(([, s]) => s.seen >= 3)
    .map(([kanji, s]) => ({ kanji, rate: pct(s.correct, s.seen), seen: s.seen, correct: s.correct }))
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 20);

  const masteredKanjis = Object.entries(kanjiStats)
    .filter(([, s]) => s.seen >= 3 && pct(s.correct, s.seen) >= 80)
    .map(([kanji, s]) => ({ kanji, rate: pct(s.correct, s.seen), seen: s.seen }))
    .sort((a, b) => b.rate - a.rate || b.seen - a.seen)
    .slice(0, 20);

  if (totalSessions === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-white">Statistiques</h1>
        <div className="card p-12 text-center space-y-3">
          <p className="text-4xl">📊</p>
          <p className="text-gray-400">Aucune session d'entraînement terminée pour l'instant.</p>
          <Link to="/training" className="btn-primary text-sm inline-block">
            Commencer l'entraînement
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Statistiques</h1>
        <button
          onClick={() => {
            if (confirm('Réinitialiser toutes les statistiques ?')) clearStats();
          }}
          className="text-xs text-gray-600 hover:text-red-400 transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center space-y-1">
          <p className="text-3xl font-bold text-white">{totalSessions}</p>
          <p className="text-xs text-gray-500">Session{totalSessions > 1 ? 's' : ''} terminée{totalSessions > 1 ? 's' : ''}</p>
        </div>
        <div className="card p-5 text-center space-y-1">
          <p className="text-3xl font-bold text-white">{uniqueKanjis}</p>
          <p className="text-xs text-gray-500">Kanjis entraînés</p>
        </div>
        <div className="card p-5 text-center space-y-1">
          {globalAvg !== null && <ScoreBadge score={globalAvg} size="md" />}
          <p className="text-3xl font-bold"></p>
          <p className="text-xs text-gray-500">Moyenne globale</p>
        </div>
      </div>

      {/* Recent sessions */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sessions récentes</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#30363d] text-xs text-gray-500">
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Liste</th>
                <th className="text-right px-4 py-3 font-medium">Score</th>
                <th className="text-right px-4 py-3 font-medium">Durée</th>
              </tr>
            </thead>
            <tbody>
              {sessions.slice(0, 15).map((s, i) => (
                <tr key={s.id} className={`border-b border-[#21262d] last:border-0 ${i % 2 === 0 ? '' : 'bg-[#161b22]/30'}`}>
                  <td className="px-4 py-3 text-gray-500">{formatDate(s.date)}</td>
                  <td className="px-4 py-3 text-gray-300 max-w-[180px] truncate">{s.listName}</td>
                  <td className="px-4 py-3 text-right">
                    <ScoreBadge score={pct(s.score, s.total)} size="sm" />
                    <span className="text-gray-600 text-xs ml-1">({s.score}/{s.total})</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">{formatDuration(s.durationMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Hard kanjis */}
      {hardKanjis.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Kanjis les plus difficiles</h2>
          <p className="text-xs text-gray-600">Kanjis vus au moins 3 fois, classés par taux de réussite croissant.</p>
          <div className="card p-4">
            <div className="flex flex-wrap gap-3">
              {hardKanjis.map(({ kanji, rate, seen, correct }) => (
                <Link
                  key={kanji}
                  to={`/kanji/${encodeURIComponent(kanji)}`}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-[#21262d] transition-colors"
                  title={`${correct}/${seen} — ${rate}%`}
                >
                  <span className="kanji-char text-2xl text-white">{kanji}</span>
                  <ScoreBadge score={rate} size="sm" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mastered kanjis */}
      {masteredKanjis.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Kanjis bien maîtrisés</h2>
          <p className="text-xs text-gray-600">Kanjis vus au moins 3 fois avec ≥ 80% de réussite.</p>
          <div className="card p-4">
            <div className="flex flex-wrap gap-3">
              {masteredKanjis.map(({ kanji, rate, seen }) => (
                <Link
                  key={kanji}
                  to={`/kanji/${encodeURIComponent(kanji)}`}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-[#21262d] transition-colors"
                  title={`${rate}% sur ${seen} passages`}
                >
                  <span className="kanji-char text-2xl text-white">{kanji}</span>
                  <ScoreBadge score={rate} size="sm" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

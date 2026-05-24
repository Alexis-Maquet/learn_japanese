import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { KanjiListPage } from '@/pages/KanjiListPage';
import { KanjiDetailPage } from '@/pages/KanjiDetailPage';
import { UserListsPage } from '@/pages/UserListsPage';
import { ListDetailPage } from '@/pages/ListDetailPage';
import { TrainingPage } from '@/pages/TrainingPage';
import { TrainingSessionPage } from '@/pages/TrainingSessionPage';
import { SentenceSessionPage } from '@/pages/SentenceSessionPage';
import { StatsPage } from '@/pages/StatsPage';
import { ScanPage } from '@/pages/ScanPage';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-[#0d1117] text-gray-100">
        <Navigation />
        <main className="[padding-bottom:env(safe-area-inset-bottom)]">
          <Routes>
            <Route path="/" element={<KanjiListPage />} />
            <Route path="/kanji/:kanji" element={<KanjiDetailPage />} />
            <Route path="/lists" element={<UserListsPage />} />
            <Route path="/lists/:id" element={<ListDetailPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/training/session" element={<TrainingSessionPage />} />
            <Route path="/training/sentence-session" element={<SentenceSessionPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/scan" element={<ScanPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

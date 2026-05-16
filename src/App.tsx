import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { KanjiListPage } from './pages/KanjiListPage';
import { KanjiDetailPage } from './pages/KanjiDetailPage';
import { UserListsPage } from './pages/UserListsPage';
import { ListDetailPage } from './pages/ListDetailPage';
import { TrainingPage } from './pages/TrainingPage';
import { TrainingSetupPage } from './pages/TrainingSetupPage';
import { TrainingSessionPage } from './pages/TrainingSessionPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0d1117] text-gray-100">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<KanjiListPage />} />
            <Route path="/kanji/:kanji" element={<KanjiDetailPage />} />
            <Route path="/lists" element={<UserListsPage />} />
            <Route path="/lists/:id" element={<ListDetailPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/training/:listId" element={<TrainingSetupPage />} />
            <Route path="/training/:listId/session" element={<TrainingSessionPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

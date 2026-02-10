import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PartsPage from './pages/PartsPage';
import MaterialsPage from './pages/MaterialsPage';
import PartDetailPage from './pages/PartDetailPage';
import MaterialDetailPage from './pages/MaterialDetailPage';
import QuizPage from './pages/QuizPage';
import NotesPage from './pages/NotesPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center px-3 text-xl font-bold text-blue-600">
                  汽车材料学习平台
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/parts"
                    className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-gray-300"
                  >
                    零部件
                  </Link>
                  <Link
                    to="/materials"
                    className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-gray-300"
                  >
                    材料库
                  </Link>
                  <Link
                    to="/quiz"
                    className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-gray-300"
                  >
                    练习测验
                  </Link>
                  <Link
                    to="/notes"
                    className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-gray-300"
                  >
                    我的笔记
                  </Link>
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-gray-300"
                  >
                    管理
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parts" element={<PartsPage />} />
            <Route path="/parts/:id" element={<PartDetailPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/materials/:id" element={<MaterialDetailPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

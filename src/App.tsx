import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import ClientLayout from './layouts/ClientLayout';

// Client Pages
import Home from './pages/Home';
import PartsPage from './pages/PartsPage';
import MaterialsPage from './pages/MaterialsPage';
import MaterialPyramidPage from './pages/MaterialPyramidPage';
import MaterialPerformancePage from './pages/MaterialPerformancePage';
import MaterialDataImportPage from './pages/MaterialDataImportPage';
import PartDetailPage from './pages/PartDetailPage';
import LightingPartDetailPage from './pages/LightingPartDetailPage';
import SeatPartDetailPage from './pages/SeatPartDetailPage';
import BodyTrimPartDetailPage from './pages/BodyTrimPartDetailPage';
import SmartElectronicsPartDetailPage from './pages/SmartElectronicsPartDetailPage';
import MaterialDetailPage from './pages/MaterialDetailPage';
import QuizPage from './pages/QuizPage';
import QuizManagementPage from './pages/QuizManagementPage';
import NotesPage from './pages/NotesPage';
import Interior3DPage from './pages/Interior3DPage';
import SharedPartPage from './pages/SharedPartPage';
import { isAdmin } from './utils/adminAuth';

/** 管理页权限守卫：无权限则跳回练习测验页 */
function AdminRoute({ children }: { children: React.ReactNode }) {
  return isAdmin() ? <>{children}</> : <Navigate to="/quiz" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* 客户端路由 */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/parts" element={<PartsPage />} />
          <Route path="/parts/:id" element={<PartDetailPage />} />
          <Route path="/lighting-parts/:id" element={<LightingPartDetailPage />} />
          <Route path="/seat-parts/:id" element={<SeatPartDetailPage />} />
          <Route path="/body-trim-parts/:id" element={<BodyTrimPartDetailPage />} />
          <Route path="/smart-electronics-parts/:id" element={<SmartElectronicsPartDetailPage />} />
          <Route path="/shared" element={<SharedPartPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/materials/pyramid" element={<MaterialPyramidPage />} />
          <Route path="/materials/performance" element={<MaterialPerformancePage />} />
          <Route path="/materials/import" element={<MaterialDataImportPage />} />
          <Route path="/materials/:id" element={<MaterialDetailPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/manage" element={<AdminRoute><QuizManagementPage /></AdminRoute>} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/interior-3d" element={<Interior3DPage />} />
        </Route>

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

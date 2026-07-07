import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import ClientLayout from './layouts/ClientLayout';

// Client Pages
import Home from './pages/Home';
import { isAdmin } from './utils/adminAuth';

const PartsPage = lazy(() => import('./pages/PartsPage'));
const MaterialsPage = lazy(() => import('./pages/MaterialsPage'));
const MaterialPyramidPage = lazy(() => import('./pages/MaterialPyramidPage'));
const MaterialPerformancePage = lazy(() => import('./pages/MaterialPerformancePage'));
const MaterialDataImportPage = lazy(() => import('./pages/MaterialDataImportPage'));
const PartDetailPage = lazy(() => import('./pages/PartDetailPage'));
const LightingPartDetailPage = lazy(() => import('./pages/LightingPartDetailPage'));
const SeatPartDetailPage = lazy(() => import('./pages/SeatPartDetailPage'));
const BodyTrimPartDetailPage = lazy(() => import('./pages/BodyTrimPartDetailPage'));
const SmartElectronicsPartDetailPage = lazy(() => import('./pages/SmartElectronicsPartDetailPage'));
const MaterialDetailPage = lazy(() => import('./pages/MaterialDetailPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const QuizManagementPage = lazy(() => import('./pages/QuizManagementPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const Interior3DPage = lazy(() => import('./pages/Interior3DPage'));
const SharedPartPage = lazy(() => import('./pages/SharedPartPage'));
const EditableDiagramDemo = lazy(() => import('./pages/EditableDiagramDemo'));
const AdvancedDiagramDemo = lazy(() => import('./pages/AdvancedDiagramDemo'));
const RobotPage = lazy(() => import('./pages/RobotPage'));

/** 管理页权限守卫：无权限则跳回练习测验页 */
function AdminRoute({ children }: { children: React.ReactNode }) {
  return isAdmin() ? <>{children}</> : <Navigate to="/quiz" replace />;
}

function RouteFallback() {
  return <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">加载中...</div>;
}

function App() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
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
            <Route path="/editable-diagram" element={<EditableDiagramDemo />} />
            <Route path="/advanced-diagram" element={<AdvancedDiagramDemo />} />
            <Route path="/robot" element={<RobotPage />} />
          </Route>

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

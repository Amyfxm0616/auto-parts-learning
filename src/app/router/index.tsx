import { createBrowserRouter, Navigate } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout';
import HomePage from '../../pages/home/HomePage';
import AppsPage from '../../pages/apps/AppsPage';
import AppDetailPage from '../../pages/apps/AppDetailPage';
import AppLaunchPage from '../../pages/apps/AppLaunchPage';
import AssistantPage from '../../pages/assistant/AssistantPage';
import AssistantSessionPage from '../../pages/assistant/AssistantSessionPage';
import ResultPage from '../../pages/results/ResultPage';
import KnowledgePage from '../../pages/knowledge/KnowledgePage';
import ProjectsPage from '../../pages/projects/ProjectsPage';
import ProjectDetailPage from '../../pages/projects/ProjectDetailPage';
import SystemStatusPage from '../../pages/system-status/SystemStatusPage';
import RouteErrorPage from './RouteErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ClientLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'apps', element: <AppsPage /> },
      { path: 'apps/:appId/meta', element: <AppDetailPage /> },
      { path: 'assistant', element: <AssistantPage /> },
      { path: 'assistant/new', element: <AssistantPage /> },
      { path: 'assistant/:sessionId', element: <AssistantSessionPage /> },
      { path: 'results/:resultId', element: <ResultPage /> },
      { path: 'knowledge', element: <KnowledgePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:projectId', element: <ProjectDetailPage /> },
      { path: 'system-status', element: <SystemStatusPage /> },
      { path: 'recent', element: <Navigate to="/home" replace /> },
      { path: 'favorites', element: <Navigate to="/apps" replace /> },
      { path: 'settings', element: <Navigate to="/home" replace /> },
      { path: 'apps/:appId', element: <AppLaunchPage /> },
    ],
  },
]);

import { Link, Outlet } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Client Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-3 text-xl font-bold text-blue-600 dark:text-blue-400">
                汽车材料学习平台
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/parts"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                >
                  零部件
                </Link>
                <Link
                  to="/materials"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                >
                  材料库
                </Link>
                <Link
                  to="/quiz"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                >
                  练习测验
                </Link>
                <Link
                  to="/notes"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                >
                  我的笔记
                </Link>
                <Link
                  to="/interior-3d"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  🎮 3D内饰
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Client Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Client Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">汽车材料学习平台 © 2026</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">专注于汽车零部件材料教学</p>
        </div>
      </footer>
    </div>
  );
}

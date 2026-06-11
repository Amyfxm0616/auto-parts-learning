import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <nav className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/admin" className="flex items-center px-3 text-xl font-bold text-white">
                🔧 管理端
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/admin/parts"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-white hover:text-gray-200 hover:border-gray-200"
                >
                  零部件管理
                </Link>
                <Link
                  to="/admin/materials"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-white hover:text-gray-200 hover:border-gray-200"
                >
                  材料管理
                </Link>
                <Link
                  to="/admin/diagrams"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-white hover:text-gray-200 hover:border-gray-200"
                >
                  示意图编辑
                </Link>
                <Link
                  to="/admin/users"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-white hover:text-gray-200 hover:border-gray-200"
                >
                  用户管理
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-medium text-yellow-300 hover:text-yellow-100 hover:border-yellow-100"
                >
                  👁️ 客户端视图
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Admin Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          管理端 - 汽车及智能穿戴材料学习平台 © 2026
        </div>
      </footer>
    </div>
  );
}

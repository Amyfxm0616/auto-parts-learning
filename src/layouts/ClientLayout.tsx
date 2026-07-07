import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const NAV_ITEMS = [
  { to: '/parts', label: '汽车零部件' },
  { to: '/robot', label: '🤖 智能机器人' },
  { to: '/materials', label: '材料库' },
  { to: '/quiz', label: '练习测验' },
  { to: '/notes', label: '我的笔记' },
  { to: '/interior-3d', label: '🎮 3D内饰' },
];

export default function ClientLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors ${
      isActive
        ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
        : 'border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 text-sm font-medium border-l-4 transition-colors ${
      isActive
        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-400'
        : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo + Desktop Nav */}
            <div className="flex">
              <Link to="/" className="flex items-center px-3 text-xl font-bold text-blue-600 dark:text-blue-400">
                汽车及智能穿戴材料学习平台
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {NAV_ITEMS.map((item) => (
                  <NavLink key={item.to} to={item.to} className={desktopLinkClass}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right side: theme toggle + hamburger */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {/* Hamburger button - only on mobile */}
              <button
                className="sm:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="菜单"
              >
                {menuOpen ? (
                  /* X icon */
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  /* Hamburger icon */
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={mobileLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">汽车及智能穿戴材料学习平台 © 2026</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">专注于汽车零部件材料教学</p>
        </div>
      </footer>
    </div>
  );
}

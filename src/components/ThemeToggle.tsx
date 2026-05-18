import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

export default function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        title="浅色模式"
      >
        <Sun className="h-4 w-4" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        title="深色模式"
      >
        <Moon className="h-4 w-4" />
      </button>

      <button
        onClick={() => setTheme('auto')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'auto'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        title={`自动跟随系统 (当前: ${effectiveTheme === 'dark' ? '深色' : '浅色'})`}
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}

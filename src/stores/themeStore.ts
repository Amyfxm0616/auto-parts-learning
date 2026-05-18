import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  theme: 'light' | 'dark' | 'auto';
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleTheme: () => void;
}

// 检测系统主题
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// 计算有效主题
const getEffectiveTheme = (theme: 'light' | 'dark' | 'auto'): 'light' | 'dark' => {
  if (theme === 'auto') {
    return getSystemTheme();
  }
  return theme;
};

// 应用主题到 DOM
const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => {
      // 监听系统主题变化
      if (typeof window !== 'undefined') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
          const { theme } = get();
          if (theme === 'auto') {
            const effectiveTheme = getEffectiveTheme(theme);
            set({ effectiveTheme });
            applyTheme(effectiveTheme);
          }
        });
      }

      const initialTheme = 'auto';
      const effectiveTheme = getEffectiveTheme(initialTheme);
      applyTheme(effectiveTheme);

      return {
        theme: initialTheme,
        effectiveTheme,
        setTheme: (theme) => {
          const effectiveTheme = getEffectiveTheme(theme);
          set({ theme, effectiveTheme });
          applyTheme(effectiveTheme);
        },
        toggleTheme: () => {
          const { effectiveTheme } = get();
          const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
          set({ theme: newTheme, effectiveTheme: newTheme });
          applyTheme(newTheme);
        },
      };
    },
    {
      name: 'theme-storage',
    }
  )
);

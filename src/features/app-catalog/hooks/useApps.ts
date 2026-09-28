import { useEffect, useState } from 'react';
import type { AppManifest } from '../../../entities/app/types';
import { appCatalogService } from '../app-catalog.service';

interface UseAppsOptions {
  keyword?: string;
  category?: string;
}

export function useApps(options: UseAppsOptions = {}) {
  const [apps, setApps] = useState<AppManifest[]>([]);
  const [categories, setCategories] = useState<string[]>(['全部']);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadCategories = async () => {
    setCategoriesLoading(true);

    try {
      const data = await appCatalogService.listCategories();
      setCategories(data);
    } catch {
      setCategories(['全部']);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadApps = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await appCatalogService.listApps({
        keyword: options.keyword,
        category: options.category,
      });
      setApps(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '加载应用列表失败'
      );
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    void loadApps();
  }, [options.keyword, options.category]);

  return {
    apps,
    categories,
    loading,
    categoriesLoading,
    errorMessage,
    reload: loadApps,
  };
}

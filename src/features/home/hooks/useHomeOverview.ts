import { useEffect, useState } from 'react';
import type { HomeOverviewData } from '../home.service';
import { homeService } from '../home.service';

export function useHomeOverview() {
  const [overview, setOverview] = useState<HomeOverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadOverview = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await homeService.getHomeOverview();
      setOverview(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '首页数据加载失败'
      );
      setOverview(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOverview();
  }, []);

  return {
    overview,
    loading,
    errorMessage,
    reload: loadOverview,
  };
}

import { useEffect, useState } from 'react';
import type { AppDetailData } from '../app-catalog.service';
import { appCatalogService } from '../app-catalog.service';

export function useAppDetail(appId?: string) {
  const [detail, setDetail] = useState<AppDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDetail = async () => {
    if (!appId) {
      setDetail(null);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const data = await appCatalogService.getAppDetail(appId);
      setDetail(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '应用说明加载失败'
      );
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDetail();
  }, [appId]);

  return {
    detail,
    loading,
    errorMessage,
    reload: loadDetail,
  };
}

import { useEffect, useState } from 'react';
import type { SystemStatusOverviewData } from '../system-status.service';
import { systemStatusService } from '../system-status.service';

export function useSystemStatus() {
  const [overview, setOverview] = useState<SystemStatusOverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadOverview = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await systemStatusService.getOverview();
      setOverview(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '系统状态页加载失败'
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

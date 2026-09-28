import { useEffect, useState } from 'react';
import type { ResultRecord } from '../../../entities/result/types';
import { resultService } from '../result.service';

export function useResult(resultId?: string) {
  const [result, setResult] = useState<ResultRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadResult = async () => {
    if (!resultId) {
      setResult(null);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const data = await resultService.getResultById(resultId);
      setResult(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '结果加载失败'
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadResult();
  }, [resultId]);

  return {
    result,
    loading,
    errorMessage,
    reload: loadResult,
  };
}

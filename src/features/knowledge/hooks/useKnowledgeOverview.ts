import { useEffect, useState } from 'react';
import type { KnowledgeOverviewData } from '../knowledge.service';
import { knowledgeService } from '../knowledge.service';

export function useKnowledgeOverview() {
  const [overview, setOverview] = useState<KnowledgeOverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadOverview = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await knowledgeService.getOverview();
      setOverview(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '知识中心加载失败'
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

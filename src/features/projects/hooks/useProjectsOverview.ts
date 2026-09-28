import { useEffect, useState } from 'react';
import type { ProjectsOverviewData } from '../project.service';
import { projectService } from '../project.service';

export function useProjectsOverview() {
  const [overview, setOverview] = useState<ProjectsOverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadOverview = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await projectService.getOverview();
      setOverview(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '项目管理页加载失败'
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

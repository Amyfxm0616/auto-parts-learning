import { useEffect, useState } from 'react';
import type { ProjectDetailData } from '../project.service';
import { projectService } from '../project.service';

export function useProjectDetail(projectId?: string) {
  const [detail, setDetail] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDetail = async () => {
    if (!projectId) {
      setDetail(null);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const data = await projectService.getProjectDetail(projectId);
      setDetail(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '项目详情加载失败'
      );
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDetail();
  }, [projectId]);

  return {
    detail,
    loading,
    errorMessage,
    reload: loadDetail,
  };
}

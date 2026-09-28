import type { AppManifest } from '../../entities/app/types';
import { http } from '../../integrations/api/http';

export interface KnowledgeOverviewData {
  learningApps: AppManifest[];
  referenceApps: AppManifest[];
  hotTopics: Array<{
    id: string;
    title: string;
    subtitle: string;
    tag: string;
    to: string;
  }>;
  quickLinks: Array<{
    id: string;
    title: string;
    description: string;
    to: string;
  }>;
}

export const knowledgeService = {
  async getOverview(): Promise<KnowledgeOverviewData> {
    // 先走本地聚合接口占位，后续可切真实 /api/knowledge/overview
    const apps = await http.get<AppManifest[]>('/api/apps');

    const learningApps = apps.filter((item) => item.category === '学习培训');
    const referenceApps = apps.filter((item) => item.category === '知识库');

    return {
      learningApps,
      referenceApps,
      hotTopics: [
        {
          id: 'knowledge-1',
          title: 'EPDM 在密封系统中的典型应用',
          subtitle: '适合快速理解材料应用边界',
          tag: '材料知识',
          to: '/knowledge',
        },
        {
          id: 'knowledge-2',
          title: 'TPE 与橡胶材料性能对比',
          subtitle: '适合做替代方案初步判断',
          tag: '性能对比',
          to: '/knowledge',
        },
        {
          id: 'knowledge-3',
          title: 'DVP 审核策略快速入口',
          subtitle: '培训和审核标准可视化查看',
          tag: '培训',
          to: '/knowledge',
        },
      ],
      quickLinks: [
        {
          id: 'k-1',
          title: '橡胶材料数据库',
          description: '查看橡胶材料性能、应用和对比结果',
          to: '/apps/rubber-db',
        },
        {
          id: 'k-2',
          title: 'DVP 培训入口',
          description: '快速进入审核策略学习场景',
          to: '/knowledge',
        },
        {
          id: 'k-3',
          title: '学习平台',
          description: '系统学习非金属材料与相关培训内容',
          to: '/home',
        },
      ],
    };
  },
};

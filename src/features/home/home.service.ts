import type { AppManifest } from '../../entities/app/types';
import { http } from '../../integrations/api/http';

export interface RecentVisitItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  to: string;
}

export interface RecentAnalysisItem {
  id: string;
  title: string;
  subtitle: string;
  level: 'success' | 'warning' | 'danger' | 'info';
  levelLabel: string;
  to: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  subtitle: string;
  level: 'success' | 'warning' | 'danger' | 'info';
  levelLabel: string;
}

export interface HomeStats {
  totalApps: number;
  activeApps: number;
  homeApps: number;
}

export interface HomeOverviewData {
  coreApps: AppManifest[];
  stats: HomeStats;
  recentVisits: RecentVisitItem[];
  recentAnalyses: RecentAnalysisItem[];
  hotKnowledgeItems: HotKnowledgeItem[];
  reminderItems: ReminderItem[];
}

export interface HotKnowledgeItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  to: string;
}

export const homeService = {
  async getHomeOverview(): Promise<HomeOverviewData> {
    return http.get<HomeOverviewData>('/api/home/overview');
  },
};

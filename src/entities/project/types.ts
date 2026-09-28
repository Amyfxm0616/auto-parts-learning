import type { Id } from '../common/types';

export interface ProjectSummary {
  projectId: Id;
  projectName: string;
  status: 'active' | 'paused' | 'completed';
  owner?: string;

  budgetWarning?: boolean;
  todoCount?: number;
  riskCount?: number;
}

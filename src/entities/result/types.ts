import type { Id } from '../common/types';
import type { UnifiedQueryParams } from '../assistant/types';

export type ResultType =
  | 'recommendation'
  | 'table'
  | 'report'
  | 'summary'
  | 'chart'
  | 'mixed';

export interface ResultAction {
  label: string;
  capabilityId?: Id;
  routePath?: string;
  params?: Record<string, string | number | boolean>;
}

export interface ResultRecord {
  resultId: Id;
  capabilityId: Id;
  appId: Id;

  title: string;
  summary: string;
  resultType: ResultType;

  tags?: string[];
  createdAt: string;

  input: UnifiedQueryParams;
  data: unknown;

  nextActions?: ResultAction[];
}

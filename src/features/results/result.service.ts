import type { ResultRecord } from '../../entities/result/types';
import { http } from '../../integrations/api/http';

export interface ResultListQuery {
  capabilityId?: string;
  appId?: string;
  keyword?: string;
  limit?: number;
}

export const resultService = {
  async getResultById(resultId: string): Promise<ResultRecord | null> {
    return http.get<ResultRecord | null>(`/api/results/${resultId}`);
  },

  async listResults(query: ResultListQuery = {}): Promise<ResultRecord[]> {
    return http.get<ResultRecord[]>('/api/results', {
      query: query as Record<string, unknown>,
    });
  },

  async listRecentResults(limit = 5): Promise<ResultRecord[]> {
    return this.listResults({ limit });
  },
};

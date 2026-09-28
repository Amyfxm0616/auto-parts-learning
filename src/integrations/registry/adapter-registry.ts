import { materialRecommendAdapter } from '../app-adapters/material-recommend';
import { weightCostAnalysisAdapter } from '../app-adapters/weight-cost-analysis';
import type { AppAdapter } from '../app-adapters/types';

export const adapterRegistry: Record<string, AppAdapter> = {
  'material-recommend': materialRecommendAdapter,
  'weight-cost-analysis': weightCostAnalysisAdapter,
};

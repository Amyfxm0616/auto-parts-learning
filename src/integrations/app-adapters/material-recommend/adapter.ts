import { buildQueryString } from '../../../features/navigation/route-builder';
import type { AppAdapter, AppLaunchContext } from '../types';

function normalizeMaterialRecommendParams(search: string) {
  const incoming = new URLSearchParams(search);
  const mapped: Record<string, string> = {};

  const partName = incoming.get('part_name');
  const vehicleSystem = incoming.get('vehicle_system');
  const targetGoal = incoming.get('target_goal');
  const analysisDepth = incoming.get('analysis_depth');
  const requirements = incoming.getAll('performance_requirements');

  if (partName) {
    mapped.part_name = partName;
    mapped.partName = partName;
  }

  if (vehicleSystem) {
    mapped.vehicle_system = vehicleSystem;
    mapped.system = vehicleSystem;
    mapped.systemName = vehicleSystem;
  }

  if (targetGoal) {
    mapped.target_goal = targetGoal;
    mapped.mode = targetGoal;
  }

  if (analysisDepth) {
    mapped.analysis_depth = analysisDepth;
  }

  if (requirements.length) {
    mapped.performance_requirements = requirements.join(',');
    mapped.requirements = requirements.join(',');
  }

  return mapped;
}

function buildTargetUrl(context: AppLaunchContext) {
  const { app, search } = context;
  if (!app.externalUrl) return '';

  const params = normalizeMaterialRecommendParams(search);
  return `${app.externalUrl}${buildQueryString(params)}`;
}

export const materialRecommendAdapter: AppAdapter = {
  appId: 'material-recommend',
  buildTargetUrl,
};

import { buildQueryString } from '../../../features/navigation/route-builder';
import type { AppAdapter, AppLaunchContext } from '../types';

function normalizeWeightCostParams(search: string) {
  const incoming = new URLSearchParams(search);
  const mapped: Record<string, string> = {};

  const partName = incoming.get('part_name');
  const vehicleSystem = incoming.get('vehicle_system');
  const materialName = incoming.get('material_name');
  const targetGoal = incoming.get('target_goal');
  const analysisDepth = incoming.get('analysis_depth');
  const costTarget = incoming.get('cost_target');
  const weightTarget = incoming.get('weight_target');
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

  if (materialName) {
    mapped.material_name = materialName;
    mapped.currentMaterial = materialName;
  }

  if (targetGoal) {
    mapped.target_goal = targetGoal;
    mapped.mode = targetGoal;
  }

  if (analysisDepth) {
    mapped.analysis_depth = analysisDepth;
  }

  if (costTarget) {
    mapped.cost_target = costTarget;
    mapped.targetCost = costTarget;
  }

  if (weightTarget) {
    mapped.weight_target = weightTarget;
    mapped.targetWeight = weightTarget;
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

  const params = normalizeWeightCostParams(search);
  return `${app.externalUrl}${buildQueryString(params)}`;
}

export const weightCostAnalysisAdapter: AppAdapter = {
  appId: 'weight-cost-analysis',
  buildTargetUrl,
};

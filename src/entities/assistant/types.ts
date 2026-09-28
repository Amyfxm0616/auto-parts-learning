import type { CapabilityDefinition } from '../capability/types';
import type { UserRole } from '../common/types';

export interface AssistantContext {
  sourceSystem?: string;
  sessionId?: string;
  traceId?: string;
  userRole?: UserRole;

  currentProjectId?: string;
  currentProjectName?: string;
  currentPartName?: string;
  currentVehicleSystem?: string;
}

export interface UnifiedQueryParams {
  part_name?: string;
  part_category?: string;
  vehicle_system?: string;
  sub_system?: string;

  material_name?: string;
  material_class?: string;
  grade_name?: string;
  supplier_name?: string;

  target_goal?: string;
  project_name?: string;
  benchmark_material?: string;

  performance_requirements?: string[];
  cost_target?: number;
  weight_target?: number;
  risk_focus?: string;
  analysis_depth?: 'quick' | 'standard' | 'deep';
}

export interface AssistantRouteRequest {
  message: string;
  context?: AssistantContext;
}

export interface AssistantRouteResponse {
  intent: string;
  confidence: number;

  selectedCapabilities: string[];
  extractedParams: UnifiedQueryParams;

  needsClarification: boolean;
  clarificationQuestion?: string;

  summary?: string;
}

export interface AssistantExecutionPlan {
  route: AssistantRouteResponse;
  capabilities: CapabilityDefinition[];
}

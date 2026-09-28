import type { Id, RiskLevel } from '../common/types';

export type CapabilityInvokeType = 'url_jump' | 'api' | 'hybrid';
export type CapabilityOutputType =
  | 'table'
  | 'recommendation'
  | 'chart'
  | 'report'
  | 'summary'
  | 'mixed';

export type AiSuitability = 'high' | 'medium' | 'low';
export type CostHint = 'low' | 'medium' | 'high';
export type LatencyHint = 'fast' | 'medium' | 'slow';

export interface CapabilityDefinition {
  capabilityId: Id;
  projectId: Id;
  appId: Id;

  name: string;
  category: string;
  description: string;

  intentTags: string[];
  triggerPhrases: string[];

  requiredParams: string[];
  optionalParams: string[];

  invokeType: CapabilityInvokeType;
  invokeTarget: string;

  riskLevel: RiskLevel;
  costHint: CostHint;
  latencyHint: LatencyHint;
  outputType: CapabilityOutputType;

  aiSuitability: AiSuitability;
  supportsSummary: boolean;
  supportsCrossLink: boolean;

  nextCapabilities?: Id[];
  status: 'active' | 'inactive';
}

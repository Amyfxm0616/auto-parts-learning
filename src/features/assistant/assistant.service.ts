import type {
  AssistantContext,
  AssistantExecutionPlan,
  AssistantRouteRequest,
  AssistantRouteResponse,
} from '../../entities/assistant/types';
import { http } from '../../integrations/api/http';
import type { CapabilityDefinition } from '../../entities/capability/types';

export interface AssistantSessionMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface AssistantSessionData {
  sessionId: string;
  title: string;
  status: 'active' | 'archived';
  messages: AssistantSessionMessage[];
  suggestedActions: Array<{
    id: string;
    label: string;
    to: string;
  }>;
}

export const assistantService = {
  async route(
    request: AssistantRouteRequest
  ): Promise<AssistantRouteResponse> {
    const plan = await this.createExecutionPlan(request);
    return plan.route;
  },

  async createExecutionPlan(
    request: AssistantRouteRequest
  ): Promise<AssistantExecutionPlan> {
    return http.post<AssistantExecutionPlan>('/api/assistant/route', {
      body: request,
    });
  },

  getCapabilitiesByIds(ids: string[], source: CapabilityDefinition[]) {
    return source.filter((item) => ids.includes(item.capabilityId));
  },

  buildDefaultContext(partial?: Partial<AssistantContext>): AssistantContext {
    return {
      sourceSystem: 'ai-workbench',
      sessionId: partial?.sessionId,
      traceId: partial?.traceId,
      userRole: partial?.userRole ?? 'engineer',
      currentProjectId: partial?.currentProjectId,
      currentProjectName: partial?.currentProjectName,
      currentPartName: partial?.currentPartName,
      currentVehicleSystem: partial?.currentVehicleSystem,
    };
  },

  async getSessionById(sessionId: string) {
    return http.get<AssistantSessionData | null>(
      `/api/assistant/sessions/${sessionId}`
    );
  },
};

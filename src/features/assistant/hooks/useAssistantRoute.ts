import { useEffect, useRef, useState } from 'react';
import type {
  AssistantContext,
  AssistantExecutionPlan,
  AssistantRouteResponse,
} from '../../../entities/assistant/types';
import type { CapabilityDefinition } from '../../../entities/capability/types';
import { assistantService } from '../assistant.service';

interface UseAssistantRouteOptions {
  initialMessage?: string;
  autoRun?: boolean;
  context?: Partial<AssistantContext>;
}

export function useAssistantRoute(options: UseAssistantRouteOptions = {}) {
  const [message, setMessage] = useState(options.initialMessage ?? '');
  const [routeResult, setRouteResult] = useState<AssistantRouteResponse | null>(
    null
  );
  const [capabilities, setCapabilities] = useState<CapabilityDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const autoRunRef = useRef(false);

  const run = async (nextMessage?: string) => {
    const finalMessage = (nextMessage ?? message).trim();

    if (!finalMessage) return null;

    setLoading(true);
    setErrorMessage('');
    setRouteResult(null);
    setCapabilities([]);

    try {
      const plan: AssistantExecutionPlan =
        await assistantService.createExecutionPlan({
          message: finalMessage,
          context: assistantService.buildDefaultContext(options.context),
        });

      setRouteResult(plan.route);
      setCapabilities(plan.capabilities);

      return plan;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '助手分析失败'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRouteResult(null);
    setCapabilities([]);
    setErrorMessage('');
    setLoading(false);
    autoRunRef.current = false;
  };

  useEffect(() => {
    if (!options.autoRun) return;
    if (!options.initialMessage?.trim()) return;
    if (autoRunRef.current) return;

    autoRunRef.current = true;
    setMessage(options.initialMessage);
    void run(options.initialMessage);
  }, [options.autoRun, options.initialMessage]);

  return {
    message,
    setMessage,

    routeResult,
    capabilities,

    loading,
    errorMessage,

    run,
    reset,
  };
}

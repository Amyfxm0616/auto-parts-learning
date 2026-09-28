import { useEffect, useState } from 'react';
import type { AssistantSessionData } from '../assistant.service';
import { assistantService } from '../assistant.service';

export function useAssistantSession(sessionId?: string) {
  const [session, setSession] = useState<AssistantSessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadSession = async () => {
    if (!sessionId) {
      setSession(null);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const data = await assistantService.getSessionById(sessionId);
      setSession(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '助手会话加载失败'
      );
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSession();
  }, [sessionId]);

  return {
    session,
    loading,
    errorMessage,
    reload: loadSession,
  };
}

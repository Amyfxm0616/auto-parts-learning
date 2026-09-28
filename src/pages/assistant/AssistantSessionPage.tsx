import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAssistantSession } from '../../features/assistant/hooks';
import { LoadingState } from '../../shared/ui/LoadingState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { EmptyState } from '../../shared/ui/EmptyState';
import { ActionPanel } from '../../shared/ui/page-modules';
import './assistant-session.css';

export default function AssistantSessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const { session, loading, errorMessage, reload } =
    useAssistantSession(sessionId);

  if (loading) {
    return (
      <div className="page page-assistant-session">
        <LoadingState
          title="正在加载助手会话"
          description="请稍候，系统正在恢复该次分析会话内容。"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page page-assistant-session">
        <ErrorState
          title="助手会话加载失败"
          description={errorMessage}
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="page page-assistant-session">
        <EmptyState
          title="未找到该会话"
          description="请返回 AI 助手页重新开始，或检查会话链接是否有效。"
          actionLabel="返回 AI 助手"
          onAction={() => navigate('/assistant')}
        />
      </div>
    );
  }

  return (
    <div className="page page-assistant-session">
      <div className="page-header">
        <div>
          <h1>{session.title}</h1>
          <p>会话 ID：{session.sessionId} · 状态：{session.status}</p>
        </div>

        <div className="page-actions">
          <Link to="/assistant/new" className="btn btn-secondary">
            新建会话
          </Link>
          <Link to="/assistant" className="btn btn-primary">
            返回助手
          </Link>
        </div>
      </div>

      <div className="assistant-session-layout">
        <main className="assistant-session-main">
          <section className="assistant-session-timeline card">
            <div className="card-body">
              <h2>会话记录</h2>

              <div className="message-list">
                {session.messages.map((item) => (
                  <div
                    key={item.id}
                    className={`message-item message-${item.role}`}
                  >
                    <div className="message-meta">
                      <strong>{item.role}</strong>
                      <span>{item.createdAt}</span>
                    </div>
                    <div className="message-content">{item.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <aside className="assistant-session-side">
          <ActionPanel
            title="推荐后续动作"
            items={session.suggestedActions.map((item) => ({
              id: item.id,
              label: item.label,
              to: item.to,
              variant: 'secondary',
            }))}
          />
        </aside>
      </div>
    </div>
  );
}

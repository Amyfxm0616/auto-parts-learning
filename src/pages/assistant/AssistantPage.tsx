import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { EmptyState } from '../../shared/ui/EmptyState';
import { LoadingState } from '../../shared/ui/LoadingState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { buildQueryString } from '../../features/navigation/route-builder';
import { useAssistantRoute } from '../../features/assistant/hooks';
import { useQueryState, stringCodec } from '../../shared/hooks';
import { StatTile } from '../../shared/ui/page-modules';
import './assistant.css';

export default function AssistantPage() {
  const navigate = useNavigate();

  const {
    value: messageQuery,
    setValue: setMessageQuery,
    clearValue: clearMessageQuery,
  } = useQueryState('message', stringCodec(''), { replace: true });

  const {
    message,
    setMessage,
    routeResult,
    capabilities,
    loading,
    errorMessage,
    run,
    reset,
  } = useAssistantRoute({
    initialMessage: messageQuery,
    autoRun: true,
  });

  useEffect(() => {
    if (!message && messageQuery) {
      setMessage(messageQuery);
    }
  }, [message, messageQuery, setMessage]);

  const handleSubmit = async () => {
    const finalMessage = message.trim();
    if (!finalMessage) return;

    setMessageQuery(finalMessage);
    await run(finalMessage);
  };

  const handleDemo = async () => {
    const demo = '帮我推荐门板骨架材料，并分析有没有减重降本机会';
    setMessage(demo);
    setMessageQuery(demo);
    await run(demo);
  };

  const handleReset = () => {
    reset();
    setMessage('');
    clearMessageQuery();
  };

  return (
    <div className="page page-assistant">
      <div className="page-header">
        <div>
          <h1>AI 助手</h1>
          <p>用自然语言帮你找到最合适的系统和下一步动作</p>
        </div>

        {(routeResult || message) && (
          <div className="page-actions">
            <button className="btn btn-secondary" onClick={handleReset}>
              清空当前分析
            </button>
          </div>
        )}
      </div>

      <div className="assistant-input-panel card">
        <div className="card-body">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="例如：帮我推荐门板骨架材料，并分析有没有减重降本机会"
            rows={4}
          />
          <div className="assistant-input-actions">
            <button className="btn btn-primary" onClick={() => void handleSubmit()}>
              开始分析
            </button>
          </div>
        </div>
      </div>

      {!loading && !errorMessage && !routeResult && (
        <EmptyState
          title="从一句话开始"
          description="你可以直接描述问题，例如“帮我推荐门板骨架材料”或“帮我看有没有减重降本机会”。"
          actionLabel="试一个示例问题"
          onAction={() => void handleDemo()}
        />
      )}

      {loading && (
        <LoadingState
          title="AI 正在分析中"
          description="正在识别你的意图、匹配能力并整理建议路径。"
        />
      )}

      {!loading && !!errorMessage && (
        <ErrorState
          title="分析暂时失败"
          description={errorMessage}
          actionLabel="重新尝试"
          onAction={() => void handleSubmit()}
        />
      )}

      {!loading && !errorMessage && routeResult && (
        <div className="assistant-body">
          <div className="assistant-main">
            <section className="summary-banner">
              <h2>{routeResult.intent}</h2>
              <p>{routeResult.summary}</p>
            </section>

            <section className="param-panel card">
              <div className="card-body">
                <h3>已识别参数</h3>
                <div className="param-list">
                  <span>零件：{routeResult.extractedParams.part_name || '未识别'}</span>
                  <span>系统：{routeResult.extractedParams.vehicle_system || '未识别'}</span>
                  <span>目标：{routeResult.extractedParams.target_goal || '未识别'}</span>
                  <span>深度：{routeResult.extractedParams.analysis_depth || 'standard'}</span>
                </div>
              </div>
            </section>

            <section className="assistant-meta-strip">
              <StatTile label="匹配能力数" value={capabilities.length} />
              <StatTile
                label="置信度"
                value={`${Math.round(routeResult.confidence * 100)}%`}
              />
            </section>

            <section className="capability-grid">
              {capabilities.map((capability) => (
                <div className="capability-card" key={capability.capabilityId}>
                  <h3>{capability.name}</h3>
                  <p>{capability.description}</p>
                  <div className="app-tags">
                    <span className="info-chip">{capability.category}</span>
                    <span className="info-chip">{capability.riskLevel}</span>
                  </div>
                  <div className="app-actions">
                    <Link
                      className="btn btn-primary"
                      to={`${capability.invokeTarget}${buildQueryString(
                        routeResult.extractedParams as Record<string, unknown>
                      )}`}
                    >
                      进入能力
                    </Link>
                  </div>
                </div>
              ))}
            </section>
          </div>

          <aside className="assistant-side-panel">
            <section>
              <h3>推荐下一步</h3>
              <ul>
                <li>先进入主能力查看详细结果</li>
                <li>必要时补充性能要求和目标约束</li>
                <li>再联动供应商、数据库或项目管理能力</li>
              </ul>
            </section>

            {routeResult.needsClarification && (
              <section>
                <h3>建议补充</h3>
                <p>{routeResult.clarificationQuestion}</p>
              </section>
            )}

            <section>
              <h3>快捷返回</h3>
              <div className="rail-actions">
                <button className="btn btn-secondary" onClick={() => navigate('/home')}>
                  返回首页
                </button>
                <button className="btn btn-secondary" onClick={handleReset}>
                  重置分析
                </button>
              </div>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}

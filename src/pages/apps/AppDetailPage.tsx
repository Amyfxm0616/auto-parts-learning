import { useNavigate, useParams } from 'react-router-dom';
import { useAppDetail } from '../../features/app-catalog/hooks';
import { EmptyState } from '../../shared/ui/EmptyState';
import { LoadingState } from '../../shared/ui/LoadingState';
import { ErrorState } from '../../shared/ui/ErrorState';
import {
  SectionHeading,
  ActionPanel,
} from '../../shared/ui/page-modules';
import './app-detail.css';

export default function AppDetailPage() {
  const { appId } = useParams();
  const navigate = useNavigate();

  const { detail, loading, errorMessage, reload } = useAppDetail(appId);

  if (loading) {
    return (
      <div className="page page-app-detail">
        <LoadingState
          title="正在加载应用说明"
          description="请稍候，系统正在整理当前应用的接入信息与能力说明。"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page page-app-detail">
        <ErrorState
          title="应用说明加载失败"
          description={errorMessage}
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="page page-app-detail">
        <EmptyState
          title="未找到应用说明"
          description="请返回应用中心重新选择系统。"
          actionLabel="返回应用中心"
          onAction={() => navigate('/apps')}
        />
      </div>
    );
  }

  const { app, relatedCapabilities } = detail;

  const handleOpenApp = () => {
    navigate(app.routePath);
  };

  const handleAskAssistant = () => {
    const preset = `帮我使用${app.name}`;
    navigate(`/assistant?message=${encodeURIComponent(preset)}`);
  };

  return (
    <div className="page page-app-detail">
      <div className="page-header">
        <div>
          <h1>{app.name}</h1>
          <p>{app.description}</p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleAskAssistant}>
            让 AI 帮我使用
          </button>
          <button className="btn btn-primary" onClick={handleOpenApp}>
            进入系统
          </button>
        </div>
      </div>

      <section className="app-detail-hero card">
        <div className="card-body">
          <div className="app-detail-hero-main">
            <div className="app-hero-meta">
              <span className={`status-tag status-${app.status}`}>
                {app.status}
              </span>
              <span className="info-chip">{app.category}</span>
              <span className="info-chip">风险：{app.riskLevel}</span>
              <span className="info-chip">优先级：{app.priority}</span>
              <span className="info-chip">接入方式：{app.entryType}</span>
            </div>

            <div className="app-detail-tags">
              {app.tags?.map((tag) => (
                <span className="info-chip" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="app-detail-layout">
        <main className="app-detail-main">
          <section className="detail-block card">
            <div className="card-body">
              <SectionHeading
                compact
                title="系统概览"
                description="当前系统在工作台中的基础接入信息"
              />

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">系统 ID</span>
                  <strong>{app.appId}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">项目 ID</span>
                  <strong>{app.projectId}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">访问路由</span>
                  <strong>{app.routePath}</strong>
                </div>
                <div className="detail-item">
                  <span className="detail-label">外部地址</span>
                  <strong>{app.externalUrl || '未配置'}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="detail-block card">
            <div className="card-body">
              <SectionHeading
                compact
                title="系统定位"
                description="它在当前工作台里承担什么角色"
              />

              <p className="detail-text">
                这个系统当前归类为 <strong>{app.category}</strong>，主要用于：
              </p>
              <ul className="detail-list">
                <li>承接该方向的专业分析 / 查询 / 推荐工作</li>
                <li>作为工作台中的统一入口能力被调用</li>
                <li>与 AI 助手和结果页形成联动闭环</li>
              </ul>
            </div>
          </section>

          <section className="detail-block card">
            <div className="card-body">
              <SectionHeading
                compact
                title="关联系统能力"
                description="当前绑定到该系统的 capability 列表"
              />

              {relatedCapabilities.length === 0 ? (
                <p className="detail-empty">
                  当前还没有绑定 capability，可先作为应用入口挂载。
                </p>
              ) : (
                <div className="capability-list">
                  {relatedCapabilities.map((item) => (
                    <div
                      className="capability-list-item"
                      key={item.capabilityId}
                    >
                      <div className="capability-list-main">
                        <strong>{item.name}</strong>
                        <p>{item.description}</p>
                      </div>
                      <div className="capability-list-side">
                        <span className="info-chip">{item.outputType}</span>
                        <span className="info-chip">{item.aiSuitability}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="app-detail-side">
          <ActionPanel
            title="推荐操作"
            description="你可以直接进入系统，或让 AI 帮你组织使用路径。"
            items={[
              {
                id: 'open-app',
                label: '进入系统',
                onClick: handleOpenApp,
                variant: 'primary',
              },
              {
                id: 'ask-ai',
                label: '用 AI 帮我开始',
                onClick: handleAskAssistant,
                variant: 'secondary',
              },
            ]}
          />

          <section className="rail-card">
            <SectionHeading
              compact
              title="当前接入状态"
              description="系统在工作台中的展示与参数支持情况"
            />

            <ul className="rail-list">
              <li>首页展示：{app.visibleOnHome ? '是' : '否'}</li>
              <li>应用中心展示：{app.visibleInCatalog ? '是' : '否'}</li>
              <li>支持参数：{app.supportsQueryParams ? '是' : '否'}</li>
              <li>
                参数字段：
                {app.supportedParams?.length
                  ? app.supportedParams.join(' / ')
                  : '未配置'}
              </li>
            </ul>
          </section>

          <ActionPanel
            title="返回路径"
            items={[
              {
                id: 'back-apps',
                label: '返回应用中心',
                to: '/apps',
                variant: 'secondary',
              },
              {
                id: 'back-home',
                label: '返回首页',
                to: '/home',
                variant: 'secondary',
              },
            ]}
          />
        </aside>
      </div>
    </div>
  );
}

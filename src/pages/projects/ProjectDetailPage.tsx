import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProjectDetail } from '../../features/projects/hooks';
import { LoadingState } from '../../shared/ui/LoadingState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { EmptyState } from '../../shared/ui/EmptyState';
import { StatTile, ActionPanel } from '../../shared/ui/page-modules';
import './project-detail.css';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { detail, loading, errorMessage, reload } = useProjectDetail(projectId);

  if (loading) {
    return (
      <div className="page page-project-detail">
        <LoadingState
          title="正在加载项目详情"
          description="请稍候，系统正在整理项目状态、结果与下一步动作。"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page page-project-detail">
        <ErrorState
          title="项目详情加载失败"
          description={errorMessage}
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="page page-project-detail">
        <EmptyState
          title="未找到项目详情"
          description="请返回项目管理页重新选择项目。"
          actionLabel="返回项目管理"
          onAction={() => navigate('/projects')}
        />
      </div>
    );
  }

  const { project, budget, todos, milestones, relatedResults, nextActions } = detail;

  return (
    <div className="page page-project-detail">
      <div className="page-header">
        <div>
          <h1>{project.projectName}</h1>
          <p>{project.description}</p>
        </div>

        <div className="page-actions">
          <Link to="/projects" className="btn btn-secondary">
            返回项目管理
          </Link>
          <Link to="/assistant" className="btn btn-primary">
            让 AI 协助推进
          </Link>
        </div>
      </div>

      <section className="project-detail-hero card">
        <div className="card-body">
          <div className="project-detail-meta">
            <span className={`pill pill-${project.status === 'active' ? 'success' : project.status === 'paused' ? 'warning' : 'info'}`}>
              {project.status}
            </span>
            <span className="info-chip">Owner：{project.owner ?? '未指定'}</span>
            <span className="info-chip">待办：{project.todoCount ?? 0}</span>
            <span className="info-chip">风险：{project.riskCount ?? 0}</span>
          </div>

          <div className="app-tags">
            {project.tags?.map((tag) => (
              <span className="info-chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-stat-grid">
        <StatTile label="预算状态" value={budget.status} />
        <StatTile label="预算使用率" value={`${Math.round(budget.usedRatio * 100)}%`} />
        <StatTile label="待办数" value={todos.length} />
        <StatTile label="里程碑数" value={milestones.length} />
      </section>

      <div className="project-detail-layout">
        <main className="project-detail-main">
          <section className="detail-block card">
            <div className="card-body">
              <h2>里程碑</h2>
              <div className="milestone-list">
                {milestones.map((item) => (
                  <div className="milestone-item" key={item.id}>
                    <div className="milestone-main">
                      <strong>{item.title}</strong>
                      {item.note ? <p>{item.note}</p> : null}
                    </div>
                    <span className={`pill pill-${item.status === 'done' ? 'success' : item.status === 'ongoing' ? 'info' : item.status === 'blocked' ? 'danger' : 'warning'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="detail-block card">
            <div className="card-body">
              <h2>待办事项</h2>
              <div className="list-panel">
                {todos.map((item) => (
                  <div className="list-row" key={item.id}>
                    <div className="list-row-main">
                      <strong>{item.title}</strong>
                      <span>Owner：{item.owner ?? '未指定'}</span>
                    </div>
                    <span className={`pill pill-${item.status === 'done' ? 'success' : item.status === 'doing' ? 'info' : 'warning'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="detail-block card">
            <div className="card-body">
              <h2>关联结果</h2>
              {relatedResults.length === 0 ? (
                <p className="muted-text">当前暂无已绑定分析结果。</p>
              ) : (
                <div className="list-panel">
                  {relatedResults.map((item) => (
                    <Link key={item.id} to={item.to} className="list-row">
                      <div className="list-row-main">
                        <strong>{item.title}</strong>
                        <span>{item.subtitle}</span>
                      </div>
                      <span className="text-link">查看结果</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="project-detail-side">
          <section className="rail-card">
            <h3>预算提示</h3>
            <p>{budget.note}</p>
          </section>

          <ActionPanel
            title="关联应用"
            items={
              project.relatedApps?.map((item) => ({
                id: item.id,
                label: item.name,
                to: item.to,
                variant: 'secondary',
              })) ?? []
            }
          />

          <ActionPanel
            title="下一步操作"
            items={nextActions.map((item) => ({
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

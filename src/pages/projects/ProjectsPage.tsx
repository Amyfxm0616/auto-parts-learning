import { useProjectsOverview } from '../../features/projects/hooks';
import { LoadingState } from '../../shared/ui/LoadingState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { EmptyState } from '../../shared/ui/EmptyState';
import {
  SectionHeading,
  StatTile,
  ListRow,
} from '../../shared/ui/page-modules';
import './projects.css';

export default function ProjectsPage() {
  const { overview, loading, errorMessage, reload } = useProjectsOverview();

  if (loading) {
    return (
      <div className="page page-projects">
        <LoadingState
          title="正在加载项目管理"
          description="请稍候，系统正在整理项目、预算与待办概览。"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page page-projects">
        <ErrorState
          title="项目管理加载失败"
          description={errorMessage}
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="page page-projects">
        <EmptyState
          title="暂无项目数据"
          description="当前还没有可展示的项目概览。"
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      </div>
    );
  }

  return (
    <div className="page page-projects">
      <div className="page-header">
        <div>
          <h1>项目管理</h1>
          <p>统一查看项目状态、预算提醒、待办进展与重点关注项。</p>
        </div>
      </div>

      <section className="projects-stat-grid">
        <StatTile label="项目总数" value={overview.stats.totalProjects} />
        <StatTile label="进行中项目" value={overview.stats.activeProjects} />
        <StatTile label="预算提醒" value={overview.stats.budgetWarningCount} />
        <StatTile label="待办总数" value={overview.stats.openTodoCount} />
      </section>

      <section className="projects-two-column">
        <div className="projects-column card">
          <div className="card-body">
            <SectionHeading
              compact
              title="项目列表"
              description="当前工作台中的主要项目"
            />

            <div className="list-panel">
              {overview.projects.map((item) => (
                <ListRow
                  key={item.projectId}
                  to={`/projects/${item.projectId}`}
                  title={item.projectName}
                  subtitle={`Owner：${item.owner ?? '未指定'} · 待办：${item.todoCount ?? 0} · 风险：${item.riskCount ?? 0}`}
                  rightSlot={
                    <span
                      className={`pill pill-${
                        item.status === 'active'
                          ? 'success'
                          : item.status === 'paused'
                          ? 'warning'
                          : 'info'
                      }`}
                    >
                      {item.status}
                    </span>
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="projects-column card">
          <div className="card-body">
            <SectionHeading
              compact
              title="重点关注"
              description="预算、进度和异常状态提醒"
            />

            <div className="list-panel">
              {overview.focusItems.map((item) => (
                <ListRow
                  key={item.id}
                  to={item.to}
                  title={item.title}
                  subtitle={item.subtitle}
                  rightSlot={
                    <span className={`pill pill-${item.level}`}>
                      {item.levelLabel}
                    </span>
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { LoadingState } from '../../shared/ui/LoadingState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { EmptyState } from '../../shared/ui/EmptyState';
import { SectionHeading, StatTile } from '../../shared/ui/page-modules';
import { useSystemStatus } from '../../features/system-status/hooks';
import './system-status.css';

export default function SystemStatusPage() {
  const { overview, loading, errorMessage, reload } = useSystemStatus();

  if (loading) {
    return (
      <div className="page page-system-status">
        <LoadingState
          title="正在加载系统状态"
          description="请稍候，系统正在整理项目接入与能力状态。"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page page-system-status">
        <ErrorState
          title="系统状态加载失败"
          description={errorMessage}
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="page page-system-status">
        <EmptyState
          title="暂无系统状态数据"
          description="当前还没有拿到平台接入与状态信息。"
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      </div>
    );
  }

  return (
    <div className="page page-system-status">
      <div className="page-header">
        <div>
          <h1>系统状态</h1>
          <p>统一查看已接入项目、首页展示、能力绑定与当前可用状态。</p>
        </div>
      </div>

      <section className="system-status-stat-grid">
        <StatTile label="项目总数" value={overview.stats.totalApps} />
        <StatTile label="当前可用" value={overview.stats.activeApps} />
        <StatTile label="首页展示" value={overview.stats.visibleOnHomeApps} />
        <StatTile label="能力总数" value={overview.stats.totalCapabilities} />
      </section>

      <section className="system-status-table card">
        <div className="card-body">
          <SectionHeading
            compact
            title="项目接入清单"
            description="当前前端工作台中可见的应用与能力绑定状态"
          />

          <div className="table-wrap">
            <table className="status-table">
              <thead>
                <tr>
                  <th>系统名称</th>
                  <th>分类</th>
                  <th>状态</th>
                  <th>风险</th>
                  <th>接入方式</th>
                  <th>首页展示</th>
                  <th>能力数</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {overview.rows.map((row) => (
                  <tr key={row.appId}>
                    <td>{row.name}</td>
                    <td>{row.category}</td>
                    <td>
                      <span className={`status-tag status-${row.status}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.riskLevel}</td>
                    <td>{row.entryType}</td>
                    <td>{row.visibleOnHome ? '是' : '否'}</td>
                    <td>{row.capabilityCount}</td>
                    <td>
                      <a href={`/apps/${row.appId}/meta`} className="text-link">
                        查看说明
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

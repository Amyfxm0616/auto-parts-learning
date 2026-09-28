import { Link } from 'react-router-dom';
import { useApps } from '../../features/app-catalog/hooks';
import { EmptyState } from '../../shared/ui/EmptyState';
import { LoadingState } from '../../shared/ui/LoadingState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { useQueryStates, stringCodec } from '../../shared/hooks';
import './apps.css';

export default function AppsPage() {
  const { state, setPartialState, resetState } = useQueryStates(
    {
      keyword: stringCodec(''),
      category: stringCodec('全部'),
    },
    { replace: true }
  );

  const { apps, categories, loading, errorMessage, reload } = useApps({
    keyword: state.keyword,
    category: state.category,
  });

  return (
    <div className="page page-apps">
      <div className="page-header">
        <div>
          <h1>应用中心</h1>
          <p>统一查看非金属 AI 项目与系统入口</p>
        </div>
      </div>

      <div className="apps-toolbar">
        <input
          className="input"
          value={state.keyword}
          onChange={(e) => setPartialState({ keyword: e.target.value })}
          placeholder="搜索系统名称、用途、标签"
        />

        <select
          className="select"
          value={state.category}
          onChange={(e) => setPartialState({ category: e.target.value })}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingState
          title="正在加载应用中心"
          description="正在整理当前可用的系统与能力入口。"
        />
      ) : errorMessage ? (
        <ErrorState
          title="应用中心加载失败"
          description={errorMessage}
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      ) : apps.length === 0 ? (
        <EmptyState
          title="没有找到匹配的系统"
          description="你可以换个关键词，或者切换分类重新试试。"
          actionLabel="清空筛选"
          onAction={() => resetState()}
        />
      ) : (
        <div className="app-grid">
          {apps.map((app) => (
            <div className="app-card card" key={app.appId}>
              <div className="card-body">
                <div className="app-card-header">
                  <div>
                    <h3>{app.name}</h3>
                    <span>{app.category}</span>
                  </div>

                  <span className={`status-tag status-${app.status}`}>
                    {app.status}
                  </span>
                </div>

                <p className="app-desc">{app.description}</p>

                <div className="app-tags">
                  {app.tags?.map((tag) => (
                    <span key={tag} className="info-chip">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="app-meta">
                  <span>风险：{app.riskLevel}</span>
                  <span>优先级：{app.priority}</span>
                  <span>接入：{app.entryType}</span>
                </div>

                <div className="app-actions">
                  <Link to={app.routePath} className="btn btn-primary">
                    进入系统
                  </Link>

                  <Link
                    to={`/apps/${app.appId}/meta`}
                    className="btn btn-secondary"
                  >
                    查看说明
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

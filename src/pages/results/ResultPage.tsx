import { useNavigate, useParams } from 'react-router-dom';
import { useResult } from '../../features/results/hooks';
import { EmptyState } from '../../shared/ui/EmptyState';
import { LoadingState } from '../../shared/ui/LoadingState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { StatTile, ActionPanel } from '../../shared/ui/page-modules';
import './result.css';

export default function ResultPage() {
  const { resultId } = useParams();
  const navigate = useNavigate();

  const { result, loading, errorMessage, reload } = useResult(resultId);

  if (loading) {
    return (
      <div className="page page-result">
        <LoadingState
          title="正在加载结果"
          description="请稍候，系统正在准备当前分析结果。"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page page-result">
        <ErrorState
          title="结果加载失败"
          description={errorMessage}
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="page page-result">
        <EmptyState
          title="未找到结果"
          description="当前结果可能已失效，或者你是从一个未完成的入口跳转过来的。"
          actionLabel="返回首页"
          onAction={() => navigate('/home')}
        />
      </div>
    );
  }

  return (
    <div className="page page-result">
      <div className="page-header">
        <div>
          <h1>{result.title}</h1>
          <p>
            来源能力：{result.capabilityId} · 生成时间：{result.createdAt}
          </p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary">导出报告</button>
          <button className="btn btn-primary">保存结果</button>
        </div>
      </div>

      <section className="summary-banner">
        <h2>分析结论</h2>
        <p>{result.summary}</p>
      </section>

      <section className="stat-grid">
        <StatTile label="结果类型" value={result.resultType} />
        <StatTile label="来源系统" value={result.appId} />
        <StatTile label="标签数" value={result.tags?.length ?? 0} />
      </section>

      <div className="result-layout">
        <main className="result-main">
          <section className="result-block">
            <h3>输入条件</h3>
            <pre>{JSON.stringify(result.input, null, 2)}</pre>
          </section>

          <section className="result-block">
            <h3>结果数据</h3>
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </section>
        </main>

        <aside className="result-side">
          <ActionPanel
            title="下一步建议"
            items={
              result.nextActions?.map((action, index) => ({
                id: `${action.label}-${index}`,
                label: action.label,
                to: action.routePath,
                variant: 'secondary',
              })) ?? []
            }
          />

          <section className="result-block">
            <h3>标签</h3>
            <div className="app-tags">
              {result.tags?.map((tag) => (
                <span className="info-chip" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

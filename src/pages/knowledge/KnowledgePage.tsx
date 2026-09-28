import { Link } from 'react-router-dom';
import { useKnowledgeOverview } from '../../features/knowledge/hooks';
import { LoadingState } from '../../shared/ui/LoadingState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { EmptyState } from '../../shared/ui/EmptyState';
import { SectionHeading, ListRow } from '../../shared/ui/page-modules';
import './knowledge.css';

export default function KnowledgePage() {
  const { overview, loading, errorMessage, reload } = useKnowledgeOverview();

  if (loading) {
    return (
      <div className="page page-knowledge">
        <LoadingState
          title="正在加载知识中心"
          description="请稍候，系统正在整理培训、知识与资料入口。"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page page-knowledge">
        <ErrorState
          title="知识中心加载失败"
          description={errorMessage}
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="page page-knowledge">
        <EmptyState
          title="暂无知识中心数据"
          description="当前还没有可展示的知识与培训内容。"
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      </div>
    );
  }

  return (
    <div className="page page-knowledge">
      <div className="page-header">
        <div>
          <h1>知识培训</h1>
          <p>统一查看培训系统、数据库、指南与高频知识主题。</p>
        </div>
      </div>

      <section className="knowledge-quick-links">
        {overview.quickLinks.map((item) => (
          <Link key={item.id} to={item.to} className="knowledge-link-card card">
            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="knowledge-two-column">
        <div className="knowledge-column card">
          <div className="card-body">
            <SectionHeading
              compact
              title="培训类应用"
              description="面向学习、培训和标准化场景"
            />

            <div className="list-panel">
              {overview.learningApps.map((item) => (
                <ListRow
                  key={item.appId}
                  to={item.routePath}
                  title={item.name}
                  subtitle={item.description}
                  meta={item.category}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="knowledge-column card">
          <div className="card-body">
            <SectionHeading
              compact
              title="知识库类应用"
              description="面向查询、对比和资料参考"
            />

            <div className="list-panel">
              {overview.referenceApps.map((item) => (
                <ListRow
                  key={item.appId}
                  to={item.routePath}
                  title={item.name}
                  subtitle={item.description}
                  meta={item.category}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="knowledge-hot-topics card">
        <div className="card-body">
          <SectionHeading
            compact
            title="热门知识主题"
            description="适合快速进入高频学习与查阅场景"
          />

          <div className="list-panel">
            {overview.hotTopics.map((item) => (
              <ListRow
                key={item.id}
                to={item.to}
                title={item.title}
                subtitle={item.subtitle}
                rightSlot={<span className="info-chip">{item.tag}</span>}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

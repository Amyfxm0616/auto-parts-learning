import { Link, useNavigate } from 'react-router-dom';
import { useHomeOverview } from '../../features/home/hooks';
import { LoadingState } from '../../shared/ui/LoadingState';
import { ErrorState } from '../../shared/ui/ErrorState';
import {
  SectionHeading,
  StatTile,
  ListRow,
} from '../../shared/ui/page-modules';
import './home.css';
import HomeConsultationWidget from './HomeConsultationWidget';

export default function HomePage() {
  const navigate = useNavigate();
  const { overview, loading, errorMessage, reload } = useHomeOverview();

  const handleAssistantQuickStart = (message: string) => {
    navigate(`/assistant?message=${encodeURIComponent(message)}`);
  };

  return (
    <div className="page page-home">
      <div className="page-header">
        <div>
          <h1>非金属 AI 工作台</h1>
          <p>
            从选材、减重、数据库查询到项目跟踪，在一个入口完成你的高频工作。
          </p>
        </div>
      </div>

      <section className="hero-panel card">
        <div className="card-body">
          <div className="hero-panel-content">
            <div className="hero-text">
              <h2>今天要处理什么？</h2>
              <p>
                你可以直接进入系统，也可以先让 AI
                助手帮你识别任务、推荐路径、带参数进入对应能力。
              </p>
            </div>

            <div className="hero-input-group">
              <button
                className="btn btn-primary"
                onClick={() =>
                  handleAssistantQuickStart(
                    '帮我推荐门板骨架材料，并分析有没有减重降本机会'
                  )
                }
              >
                进入 AI 助手
              </button>
            </div>
          </div>

          <div className="quick-action-row">
            <button
              className="quick-action-btn"
              onClick={() => handleAssistantQuickStart('帮我做一次智能选材分析')}
            >
              智能选材
            </button>

            <button
              className="quick-action-btn"
              onClick={() =>
                handleAssistantQuickStart('帮我分析某个零件的减重降本机会')
              }
            >
              减重降本
            </button>

            <button
              className="quick-action-btn"
              onClick={() => handleAssistantQuickStart('帮我查 EPDM 的性能与应用')}
            >
              查橡胶材料
            </button>

            <button
              className="quick-action-btn"
              onClick={() => handleAssistantQuickStart('帮我提取分供方材料信息')}
            >
              提取分供方
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingState
          title="正在准备首页"
          description="正在整理核心能力与平台概览。"
        />
      ) : errorMessage ? (
        <ErrorState
          title="首页数据加载失败"
          description={errorMessage}
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      ) : !overview ? (
        <ErrorState
          title="首页暂无数据"
          description="当前没有拿到首页概览数据。"
          actionLabel="重新加载"
          onAction={() => void reload()}
        />
      ) : (
        <>
          <section className="home-stat-strip">
            <StatTile label="已接入项目" value={overview.stats.totalApps} />
            <StatTile label="当前可用" value={overview.stats.activeApps} />
            <StatTile label="首页核心能力" value={overview.stats.homeApps} />
          </section>

          <section className="page-section">
            <SectionHeading
              title="核心能力"
              description="一期优先接入与联动的 5 个高频能力"
            />

            <div className="home-app-grid">
              {overview.coreApps.map((app) => (
                <article className="app-card card" key={app.appId}>
                  <div className="card-body">
                    <div className="app-card-header">
                      <div className="app-card-title-group">
                        <h3>{app.shortName}</h3>
                        <span className="app-category">{app.category}</span>
                      </div>

                      <span className={`status-tag status-${app.status}`}>
                        {app.status}
                      </span>
                    </div>

                    <p className="app-desc">{app.description}</p>

                    <div className="app-tags">
                      {app.tags?.map((tag) => (
                        <span className="info-chip" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="app-meta">
                      <span>风险：{app.riskLevel}</span>
                      <span>优先级：{app.priority}</span>
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
                </article>
              ))}
            </div>
          </section>

          <section className="home-two-column">
            <div className="home-column-card card">
              <div className="card-body">
                <SectionHeading
                  compact
                  title="最近访问"
                  description="快速回到你最近打开的系统"
                  action={
                    <Link to="/recent" className="text-link">
                      查看更多
                    </Link>
                  }
                />

                <div className="list-panel">
                  {overview.recentVisits.map((item) => (
                    <ListRow
                      key={item.id}
                      to={item.to}
                      title={item.title}
                      subtitle={item.subtitle}
                      meta={item.time}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="home-column-card card">
              <div className="card-body">
                <SectionHeading
                  compact
                  title="最近分析 / 项目"
                  description="最近处理的分析结果和项目事项"
                  action={
                    <Link to="/projects" className="text-link">
                      进入项目管理
                    </Link>
                  }
                />

                <div className="list-panel">
                  {overview.recentAnalyses.map((item) => (
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

          <section className="home-two-column">
            <div className="home-column-card card">
              <div className="card-body">
                <SectionHeading
                  compact
                  title="热门知识"
                  description="知识中心里的高频主题与入口"
                  action={
                    <Link to="/knowledge" className="text-link">
                      进入知识中心
                    </Link>
                  }
                />

                <div className="list-panel">
                  {overview.hotKnowledgeItems.map((item) => (
                    <ListRow
                      key={item.id}
                      to={item.to}
                      title={item.title}
                      subtitle={item.subtitle}
                      meta={item.tag}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="home-column-card card">
              <div className="card-body">
                <SectionHeading
                  compact
                  title="今日提醒 / 前瞻摘要"
                  description="项目提醒、预算风险与行业前沿动态"
                />

                <div className="list-panel">
                  {overview.reminderItems.map((item) => (
                    <ListRow
                      key={item.id}
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
        </>
      )}

      <HomeConsultationWidget />
    </div>
  );
}

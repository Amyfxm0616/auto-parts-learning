import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDetail } from '../../features/app-catalog/hooks';
import { LoadingState } from '../../shared/ui/LoadingState';
import { ErrorState } from '../../shared/ui/ErrorState';
import { EmptyState } from '../../shared/ui/EmptyState';
import { adapterRegistry } from '../../integrations/registry/adapter-registry';
import './app-launch.css';

function buildDefaultTargetUrl(baseUrl?: string, search = '') {
  if (!baseUrl) return '';

  const url = new URL(baseUrl, window.location.origin);
  const incoming = new URLSearchParams(search);

  incoming.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}

export default function AppLaunchPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { detail, loading, errorMessage, reload } = useAppDetail(appId);

  const targetUrl = useMemo(() => {
    if (!detail) return '';

    const adapter = adapterRegistry[detail.app.appId];
    if (adapter) {
      return adapter.buildTargetUrl({
        app: detail.app,
        search: location.search,
      });
    }

    return buildDefaultTargetUrl(detail.app.externalUrl, location.search);
  }, [detail, location.search]);

  useEffect(() => {
    if (!detail) return;

    const { app } = detail;

    if (app.entryType === 'native') {
      if (app.routePath && app.routePath !== location.pathname) {
        navigate(app.routePath, { replace: true });
      }
      return;
    }

    if (app.entryType === 'redirect' && targetUrl) {
      window.location.assign(targetUrl);
    }
  }, [detail, location.pathname, navigate, targetUrl]);

  if (loading) {
    return (
      <div className="page page-app-launch">
        <LoadingState
          title="正在打开系统"
          description="请稍候，工作台正在准备进入目标系统。"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="page page-app-launch">
        <ErrorState
          title="系统打开失败"
          description={errorMessage}
          actionLabel="重试"
          onAction={() => void reload()}
        />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="page page-app-launch">
        <EmptyState
          title="未找到系统入口"
          description="当前应用没有可用的接入信息，请返回应用中心重试。"
          actionLabel="返回应用中心"
          onAction={() => navigate('/apps')}
        />
      </div>
    );
  }

  const { app } = detail;
  const isEmbed = app.entryType === 'embed';

  return (
    <div className="page page-app-launch">
      {isEmbed && targetUrl ? (
        <div className="app-launch-frame-wrap">
          <div className="app-launch-toolbar card">
            <div className="card-body app-launch-toolbar-body">
              <div>
                <h1>{app.name}</h1>
                <p>{app.description}</p>
              </div>
              <div className="app-launch-actions">
                <a className="btn btn-secondary" href={targetUrl} target="_blank" rel="noreferrer">
                  新窗口打开
                </a>
                <Link className="btn btn-secondary" to="/apps">
                  返回应用中心
                </Link>
              </div>
            </div>
          </div>
          <iframe
            className="app-launch-frame"
            src={targetUrl}
            title={app.name}
          />
        </div>
      ) : (
        <div className="app-launch-redirect card">
          <div className="card-body">
            <h1>{app.name}</h1>
            <p>{app.description}</p>
            <p className="app-launch-note">
              正在尝试打开真实系统。如果没有自动跳转，请使用下面的按钮继续。
            </p>
            <div className="app-launch-actions">
              {targetUrl ? (
                <a className="btn btn-primary" href={targetUrl} rel="noreferrer">
                  继续进入系统
                </a>
              ) : null}
              <Link className="btn btn-secondary" to="/apps">
                返回应用中心
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

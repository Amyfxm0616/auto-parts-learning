import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function RouteErrorPage() {
  const error = useRouteError();
  const description = isRouteErrorResponse(error)
    ? '你访问的页面不存在或链接已失效。'
    : '页面加载时发生异常，请返回首页后重试。';

  return (
    <main className="route-error-page">
      <section className="route-error-card">
        <span className="route-error-code">
          {isRouteErrorResponse(error) ? error.status : '加载失败'}
        </span>
        <h1>暂时无法打开这个页面</h1>
        <p>{description}</p>
        <Link className="btn btn-primary" to="/home">
          返回首页
        </Link>
      </section>
    </main>
  );
}

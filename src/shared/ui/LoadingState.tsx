import './states.css';

interface LoadingStateProps {
  title?: string;
  description?: string;
}

export function LoadingState({
  title = '正在加载',
  description = '请稍候，系统正在准备当前内容。',
}: LoadingStateProps) {
  return (
    <div className="state-card state-loading">
      <div className="state-spinner" />
      <h2 className="state-title">{title}</h2>
      <p className="state-description">{description}</p>
    </div>
  );
}

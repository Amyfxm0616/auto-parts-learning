import './states.css';

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title = '出现了一点问题',
  description = '当前内容暂时无法正常显示，请稍后重试。',
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <div className="state-card state-error">
      <div className="state-illustration">!</div>
      <h2 className="state-title">{title}</h2>
      <p className="state-description">{description}</p>

      {actionLabel && onAction ? (
        <div className="state-actions">
          <button className="btn btn-secondary" onClick={onAction}>
            {actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}

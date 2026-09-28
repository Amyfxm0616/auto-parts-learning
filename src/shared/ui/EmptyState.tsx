import './states.css';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="state-card state-empty">
      <div className="state-illustration">◌</div>
      <h2 className="state-title">{title}</h2>
      {description ? <p className="state-description">{description}</p> : null}

      {actionLabel && onAction ? (
        <div className="state-actions">
          <button className="btn btn-primary" onClick={onAction}>
            {actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}

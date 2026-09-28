import { Link } from 'react-router-dom';
import './page-modules.css';

export interface ActionPanelItem {
  id: string;
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

interface ActionPanelProps {
  title: string;
  items: ActionPanelItem[];
  description?: string;
}

export function ActionPanel({
  title,
  items,
  description,
}: ActionPanelProps) {
  return (
    <section className="rail-card action-panel">
      <h3>{title}</h3>
      {description ? <p className="action-panel-desc">{description}</p> : null}

      <div className="rail-actions">
        {items.map((item) => {
          const className =
            item.variant === 'primary' ? 'btn btn-primary' : 'btn btn-secondary';

          if (item.to) {
            return (
              <Link key={item.id} to={item.to} className={className}>
                {item.label}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className={className}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

import type { ReactNode } from 'react';
import './page-modules.css';

interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}

export function SectionHeading({
  title,
  description,
  action,
  compact = false,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${compact ? 'compact' : ''}`}>
      <div>
        <h2 className="section-title">{title}</h2>
        {description ? <p className="section-desc">{description}</p> : null}
      </div>

      {action ? <div className="section-heading-action">{action}</div> : null}
    </div>
  );
}

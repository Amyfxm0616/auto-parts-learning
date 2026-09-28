import type { ReactNode } from 'react';
import './page-modules.css';

type StatTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface StatTileProps {
  label: string;
  value: ReactNode;
  helper?: string;
  tone?: StatTone;
}

export function StatTile({
  label,
  value,
  helper,
  tone = 'default',
}: StatTileProps) {
  return (
    <div className={`stat-tile stat-tile-${tone}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {helper ? <span className="stat-helper">{helper}</span> : null}
    </div>
  );
}

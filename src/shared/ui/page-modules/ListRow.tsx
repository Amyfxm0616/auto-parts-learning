import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './page-modules.css';

interface ListRowProps {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  rightSlot?: ReactNode;
  to?: string;
  onClick?: () => void;
}

function Content({
  title,
  subtitle,
  meta,
  rightSlot,
}: Omit<ListRowProps, 'to' | 'onClick'>) {
  return (
    <>
      <div className="list-row-main">
        <strong>{title}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>

      {(meta || rightSlot) && (
        <div className="list-row-side">
          {meta ? <span className="list-row-meta">{meta}</span> : null}
          {rightSlot}
        </div>
      )}
    </>
  );
}

export function ListRow(props: ListRowProps) {
  const { to, onClick, ...rest } = props;

  if (to) {
    return (
      <Link to={to} className="list-row">
        <Content {...rest} />
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" className="list-row list-row-button" onClick={onClick}>
        <Content {...rest} />
      </button>
    );
  }

  return (
    <div className="list-row">
      <Content {...rest} />
    </div>
  );
}

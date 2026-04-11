import type { ReactNode } from 'react';
import styles from './AdminUi.module.css';

type Props = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  stickyActions?: boolean;
};

export const PageHeader = ({ title, description, actions, stickyActions = false }: Props) => {
  const headerClassName = [
    styles.header,
    stickyActions ? styles.headerSticky : '',
  ]
    .filter(Boolean)
    .join(' ');

  const headerTopClassName = [
    styles.headerTop,
    !title ? styles.headerTopActionsOnly : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClassName}>
      <div className={headerTopClassName}>
        {title ? <h1>{title}</h1> : null}
        {actions}
      </div>
      {description ? <div>{description}</div> : null}
    </header>
  );
};

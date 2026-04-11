import type { ReactNode } from 'react';
import styles from './AdminUi.module.css';

type Props = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
};

export const PageHeader = ({ title, description, actions }: Props) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <h1>{title}</h1>
        {actions}
      </div>
      {description ? <div>{description}</div> : null}
    </header>
  );
};

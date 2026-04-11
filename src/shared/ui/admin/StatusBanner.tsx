import type { PropsWithChildren } from 'react';
import styles from './AdminUi.module.css';

type Props = PropsWithChildren<{
  tone?: 'info' | 'error';
}>;

export const StatusBanner = ({ children, tone = 'info' }: Props) => {
  return (
    <div className={[styles.status, tone === 'error' ? styles.statusError : ''].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
};

import type { PropsWithChildren } from 'react';
import styles from './AdminUi.module.css';

export const FormActions = ({ children }: PropsWithChildren) => {
  return <div className={styles.formActions}>{children}</div>;
};

import type { PropsWithChildren } from 'react';
import styles from './AdminUi.module.css';

type Props = PropsWithChildren<{
  stickyTop?: boolean;
}>;

export const FormActions = ({ children, stickyTop = false }: Props) => {
  const className = `${styles.formActions} ${stickyTop ? styles.formActionsStickyTop : ''}`.trim();
  return <div className={className}>{children}</div>;
};

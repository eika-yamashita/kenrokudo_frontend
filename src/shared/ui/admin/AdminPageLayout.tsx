import type { PropsWithChildren } from 'react';
import styles from './AdminUi.module.css';

type Props = PropsWithChildren<{
  className?: string;
}>;

export const AdminPageLayout = ({ children, className }: Props) => {
  return <section className={[styles.page, className].filter(Boolean).join(' ')}>{children}</section>;
};

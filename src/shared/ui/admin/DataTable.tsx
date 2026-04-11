import type { KeyboardEvent, ReactNode } from 'react';
import styles from './AdminUi.module.css';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  renderCell: (row: T) => ReactNode;
};

type Props<T> = {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  emptyMessage: string;
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  density?: 'default' | 'compact';
};

export function DataTable<T>({ columns, rows, emptyMessage, getRowKey, onRowClick, density = 'default' }: Props<T>) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (!onRowClick) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${density === 'compact' ? styles.tableCompact : ''}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className={onRowClick ? styles.clickableRow : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={onRowClick ? (event) => handleKeyDown(event, row) : undefined}
                role={onRowClick ? 'button' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key}>{column.renderCell(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

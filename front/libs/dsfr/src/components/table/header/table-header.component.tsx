import React from 'react';

import type { PropsWithClassName, SelectableInterface } from '@fc/common';
import { t } from '@fc/i18n';

import type { TableColumnInterface, TableDataSourceInterface } from '../../../interfaces';

interface TableHeaderComponentProps<T> extends PropsWithClassName {
  columns: Array<Pick<TableColumnInterface, 'label'>>;
  tableId: string;
  showActionsColumn?: boolean;
  selectable?: SelectableInterface<T>;
}

function TableHeaderComponentInner<T extends TableDataSourceInterface>({
  className,
  columns,
  selectable,
  showActionsColumn = false,
  tableId,
}: TableHeaderComponentProps<T>) {
  const showSelectColumn = !!selectable;

  return (
    <thead className={className}>
      <tr>
        {showSelectColumn && (
          <th className="fr-cell--fixed" role="columnheader">
            <span className="fr-sr-only">{t('DSFR.table.columnSelect.header')}</span>
          </th>
        )}
        {columns.map((item, idx) => {
          const uniqKey = `${tableId}--th-${idx}`;
          return (
            <th key={uniqKey} scope="col">
              {item.label}
            </th>
          );
        })}
        {showActionsColumn && <th scope="col">{t('DSFR.table.columnActions.label')}</th>}
      </tr>
    </thead>
  );
}

export const TableHeaderComponent = React.memo(
  TableHeaderComponentInner,
) as typeof TableHeaderComponentInner;

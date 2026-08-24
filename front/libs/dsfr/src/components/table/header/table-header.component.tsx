import React from 'react';

import type { PropsWithClassName } from '@fc/common';
import { t } from '@fc/i18n';

import type { TableColumnInterface } from '../../../interfaces';

interface TableHeaderComponentProps extends PropsWithClassName {
  columns: Array<Pick<TableColumnInterface, 'label'>>;
  tableId: string;
  showActionsColumn?: boolean;
}

function TableHeaderComponentInner({
  className,
  columns,
  showActionsColumn = false,
  tableId,
}: TableHeaderComponentProps) {
  return (
    <thead className={className}>
      <tr>
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

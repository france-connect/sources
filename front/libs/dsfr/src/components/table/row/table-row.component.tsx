import classnames from 'classnames';
import { get } from 'lodash';
import React from 'react';

import { type PropsWithClassName, Strings } from '@fc/common';

import type {
  TableCellValue,
  TableColumnActionsInterface,
  TableColumnInterface,
  TableDataSourceInterface,
} from '../../../interfaces';

interface TableRowComponentProps<T> extends PropsWithClassName {
  data: T;
  index: number;
  tableId: string;
  columns: TableColumnInterface<T>[];
  actions?: TableColumnActionsInterface<T>;
}

function TableRowComponentInner<T extends TableDataSourceInterface>({
  actions,
  columns,
  data,
  index,
  tableId,
}: TableRowComponentProps<T>) {
  const rowid = `${tableId}--row-${index}`;
  const hasActions = !!actions;

  return (
    <tr data-row-key={index} id={rowid}>
      {columns.map((item, idx) => {
        const uniqKey = `${rowid}--cell-${idx}`;

        const rawValue = item.getValue ? item.getValue(data) : get(data, item.key);

        const value = item.format ? item.format(rawValue) : rawValue;

        return (
          <td
            key={uniqKey}
            className={classnames({
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'fr-cell--multiline': !!item.multiline,
            })}>
            {(value as TableCellValue) ?? Strings.N_A}
          </td>
        );
      })}
      {hasActions && <td>{actions(data, index)}</td>}
    </tr>
  );
}

export const TableRowComponent = React.memo(
  TableRowComponentInner,
) as typeof TableRowComponentInner;

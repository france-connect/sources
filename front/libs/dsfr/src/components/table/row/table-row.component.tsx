import classnames from 'classnames';
import { get } from 'lodash';
import React from 'react';

import { type PropsWithClassName, Strings } from '@fc/common';

import type {
  TableCellValue,
  TableColumnInterface,
  TableDataSourceInterface,
} from '../../../interfaces';

interface TableRowComponentProps<T> extends PropsWithClassName {
  data: T;
  index: number;
  tableId: string;
  columns: TableColumnInterface<T>[];
}

function TableRowComponentInner<T extends TableDataSourceInterface>({
  columns,
  data,
  index,
  tableId,
}: TableRowComponentProps<T>) {
  const rowid = `${tableId}--row-${index}`;
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
    </tr>
  );
}

export const TableRowComponent = React.memo(
  TableRowComponentInner,
) as typeof TableRowComponentInner;

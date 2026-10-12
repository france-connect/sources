import classnames from 'classnames';
import { get } from 'lodash';
import React from 'react';

import {
  type PropsWithClassName,
  type SelectableInterface,
  Strings,
  useContentHeight,
} from '@fc/common';
import { t } from '@fc/i18n';

import type {
  TableCellValue,
  TableColumnActionsInterface,
  TableColumnInterface,
  TableDataSourceInterface,
} from '../../../interfaces';
import { TableRowSelectComponent } from '../row-select';

interface TableRowComponentProps<T> extends PropsWithClassName {
  data: T;
  index: number;
  tableId: string;
  columns: TableColumnInterface<T>[];
  actions?: TableColumnActionsInterface<T>;
  selectable?: SelectableInterface<T>;
}

function TableRowComponentInner<T extends TableDataSourceInterface>({
  actions,
  className,
  columns,
  data,
  index,
  selectable,
  tableId,
}: TableRowComponentProps<T>) {
  const { contentHeight, contentRef } = useContentHeight<HTMLTableRowElement>({
    offset: 2,
  });

  const nonZeroIndex = index + 1;

  const rowId = `${tableId}--row-${nonZeroIndex}`;

  const hasActions = !!actions;

  const { checkIfItemIsSelected, toggleOneItem } = selectable ?? {};

  const isChecked = !checkIfItemIsSelected ? false : checkIfItemIsSelected(data);

  const ariaSelected = selectable ? isChecked : undefined;

  const rowStyle = {
    // DSFR classname
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '--row-height': `${contentHeight}px`,
  } as React.CSSProperties;

  return (
    <tr
      ref={contentRef}
      aria-selected={ariaSelected}
      className={className}
      data-row-key={nonZeroIndex}
      id={rowId}
      style={rowStyle}>
      {toggleOneItem && (
        <th className="fr-cell--fixed" scope="row">
          <TableRowSelectComponent
            checked={isChecked}
            id={`${rowId}--row-select`}
            label={t('DSFR.table.columnSelect.row', { index: nonZeroIndex })}
            onChange={(checked: boolean) => {
              toggleOneItem(data, checked);
            }}
          />
        </th>
      )}
      {columns.map((item, idx) => {
        const uniqKey = `${rowId}--cell-${idx}`;

        const rawValue = item.getValue ? item.getValue(data) : get(data, item.key);

        const value = item.format ? item.format(rawValue) : rawValue;

        return (
          <td
            key={uniqKey}
            className={classnames(
              {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'fr-cell--multiline': !!item.multiline,
              },
              item.className,
            )}>
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

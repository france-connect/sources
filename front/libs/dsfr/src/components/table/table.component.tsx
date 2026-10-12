import React, { useMemo } from 'react';

import type { SelectableInterface } from '@fc/common';
import { ucfirst } from '@fc/common';

import { Sizes } from '../../enums';
import type {
  TableColumnActionsInterface,
  TableColumnInterface,
  TableDataSourceInterface,
  TableToolbarInterface,
} from '../../interfaces';
import { TableCaptionComponent } from './caption';
import { TableHeaderComponent } from './header';
import { TableRowComponent } from './row';
import { TableWrapperComponent } from './wrapper';

type TableComponentStyles = {
  container?: string;
  row?: string;
};

interface TableComponentProps<T> {
  // @TODO implement alignment, wrap, sort, into the table component
  // @SEE https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/tableau
  caption?: string;
  size?: Sizes;
  id: string;
  sources: T[];
  hideHeader?: boolean;
  bordered?: boolean;
  styles?: TableComponentStyles;
  noScroll?: boolean;
  columns?: TableColumnInterface<T>[];
  multiline?: boolean;
  actions?: TableColumnActionsInterface<T>;
  selectable?: SelectableInterface<T>;
  toolbar?: TableToolbarInterface;
}

function TableComponentInner<T extends TableDataSourceInterface>({
  actions,
  bordered = false,
  caption,
  columns,
  hideHeader = false,
  id,
  multiline = false,
  noScroll = false,
  selectable,
  size = Sizes.MEDIUM,
  sources,
  styles = {},
  toolbar,
}: TableComponentProps<T>) {
  const tableColumns = useMemo(() => {
    if (columns && columns.length > 0) {
      return columns;
    }
    const result = Object.keys(sources[0]).map((key) => {
      const label = ucfirst(key);
      return { key, label };
    });
    return result;
  }, [columns, sources]);

  const hasActions = !!actions;

  return (
    <div className={styles.container}>
      <TableWrapperComponent
        bordered={bordered}
        id={id}
        multiline={multiline}
        noScroll={noScroll}
        selectable={selectable}
        size={size}
        toolbar={toolbar}>
        {caption && <TableCaptionComponent caption={caption} />}
        {!hideHeader && (
          <TableHeaderComponent
            columns={tableColumns}
            selectable={selectable}
            showActionsColumn={hasActions}
            tableId={id}
          />
        )}
        <tbody>
          {sources.map((item, index) => {
            const key = `${id}--row-${index}`;
            return (
              <TableRowComponent<T>
                key={key}
                actions={actions}
                className={styles.row}
                columns={tableColumns}
                data={item}
                index={index}
                selectable={selectable}
                tableId={id}
              />
            );
          })}
        </tbody>
      </TableWrapperComponent>
    </div>
  );
}

export const TableComponent = React.memo(TableComponentInner) as typeof TableComponentInner;

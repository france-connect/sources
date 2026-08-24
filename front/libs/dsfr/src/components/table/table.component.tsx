import classnames from 'classnames';
import React, { useMemo } from 'react';

import { ucfirst } from '@fc/common';

import { Sizes } from '../../enums';
import type {
  TableColumnActionsInterface,
  TableColumnInterface,
  TableDataSourceInterface,
} from '../../interfaces';
import { TableCaptionComponent } from './caption';
import { TableHeaderComponent } from './header';
import { TableRowComponent } from './row';

type TableComponentStyles = {
  table?: string;
  header?: string;
  row?: string;
};

interface TableComponentProps<T extends TableDataSourceInterface> {
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
  size = Sizes.MEDIUM,
  sources,
  styles = {},
}: TableComponentProps<T>) {
  const tableColumns = useMemo(() => {
    if (columns && columns.length > 0) {
      return columns;
    }
    const result = Object.keys(sources[0]).map((key) => {
      const label = ucfirst(key);
      return { key, label } as TableColumnInterface<T>;
    });
    return result;
  }, [columns, sources]);

  const hasActions = !!actions;

  return (
    <div
      className={classnames(`fr-table--${size} fr-table`, styles.table, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-table--bordered': bordered,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-table--multiline': multiline,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-table--no-scroll': noScroll,
      })}
      id={id}>
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id={`${id}--table`}>
              {caption && <TableCaptionComponent caption={caption} />}
              {!hideHeader && (
                <TableHeaderComponent
                  columns={tableColumns}
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
                      tableId={id}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TableComponent = React.memo(TableComponentInner) as typeof TableComponentInner;

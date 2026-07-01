export type TableCellValue = string | number | boolean | null | undefined;

export type TableDataSourceInterface = object;

type TableColumnBase = {
  label: string;
  clickable?: boolean;
  sortable?: boolean;
  styles?: string;
  multiline?: boolean;
  format?: (value: unknown) => TableCellValue;
};

type TableColumnByKey = TableColumnBase & {
  key: string;
  getValue?: never;
};

type TableColumnByGetValue<T = unknown> = TableColumnBase & {
  getValue: (row: T) => TableCellValue;
  key?: never;
};

export type TableColumnInterface<T = unknown> = TableColumnByKey | TableColumnByGetValue<T>;

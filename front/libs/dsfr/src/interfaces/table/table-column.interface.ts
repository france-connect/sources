export interface TableColumnInterface {
  label: string;
  key: string;
  clickable?: boolean;
  sortable?: boolean;
  styles?: string;
  multiline?: boolean;
  format?: (value: unknown) => unknown;
}

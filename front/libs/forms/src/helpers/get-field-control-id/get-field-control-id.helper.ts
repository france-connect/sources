import type { FieldTypes } from '../../enums';

export const getFieldControlId = (type: FieldTypes | string, name: string): string =>
  `form-input-${type}-${name}`;

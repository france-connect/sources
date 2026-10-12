import { Strings } from '@fc/common';

export const formatCellValue = (value: unknown) => {
  const isNumber = typeof value === 'number';
  const isString = typeof value === 'string';

  if (!isNumber && !isString) {
    return Strings.N_A;
  }

  const val = isNumber ? value.toString() : value;
  return val.trim() || Strings.N_A;
};

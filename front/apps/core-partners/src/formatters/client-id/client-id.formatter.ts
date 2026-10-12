import { truncateMiddle } from '@fc/common';
import { formatCellValue } from '@fc/dsfr';

export const formatClientId = (value: unknown) => {
  const val = formatCellValue(value);
  return truncateMiddle(val);
};

import { isNotEmpty } from '@fc/common';

export const isRequired = (message: string) => (fieldValue: string | string[]) => {
  const values = !Array.isArray(fieldValue) ? [fieldValue] : fieldValue;
  const notEmpty = values.every((v) => isNotEmpty(v));
  return !notEmpty ? message : undefined;
};

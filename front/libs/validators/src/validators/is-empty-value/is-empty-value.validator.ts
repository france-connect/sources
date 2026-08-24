import { Strings } from '@fc/common';

export const isEmptyValue = (value: unknown): boolean =>
  value === undefined || value === null || value === Strings.EMPTY_STRING;

import type { ISODate } from '@fc/common';
import { isoToDate } from '@fc/common';

export const formatCreatedAt = (value: unknown) => isoToDate(value as ISODate);

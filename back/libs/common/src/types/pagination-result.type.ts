/* istanbul ignore file */

// Declarative code

import { IPaginationOptions } from './pagination-options.type';

export type IPaginationResult = {
  total: number;
} & IPaginationOptions;

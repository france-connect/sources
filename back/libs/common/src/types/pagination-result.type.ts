import { IPaginationOptions } from './pagination-options.type';

export type IPaginationResult = {
  total: number;
} & IPaginationOptions;

/* istanbul ignore file */

// Declarative code

import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

import { IPaginationOptions } from '@fc/common';

export class GetUserTracesQueryDto implements IPaginationOptions {
  @Min(0)
  @IsInt()
  @Type(() => Number)
  readonly offset: number;

  @Max(100)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  readonly size: number;
}

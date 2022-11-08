/* istanbul ignore file */

// Declarative file
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationOptionDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  readonly offset: number = 0;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  readonly size: number = 10;
}

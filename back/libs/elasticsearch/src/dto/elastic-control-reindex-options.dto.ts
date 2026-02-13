import { Expose } from 'class-transformer';
import { IsEnum, IsString, Matches } from 'class-validator';

import {
  ElasticControlKeyEnum,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '../enums';

const PERIOD_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export class ElasticControlReindexOptionsDto {
  @Expose()
  @IsEnum(ElasticControlProductEnum)
  readonly product: ElasticControlProductEnum;

  @Expose()
  @IsEnum(ElasticControlRangeEnum)
  readonly range: ElasticControlRangeEnum;

  @Expose()
  @IsEnum(ElasticControlPivotEnum)
  readonly pivot: ElasticControlPivotEnum;

  @Expose()
  @IsString()
  @Matches(PERIOD_REGEX, {
    message: 'period must be in the format YYYY-MM',
  })
  readonly period: string;

  @Expose()
  @IsString()
  readonly timezone?: string;

  @Expose()
  @IsEnum(ElasticControlKeyEnum)
  readonly key: ElasticControlKeyEnum;
}

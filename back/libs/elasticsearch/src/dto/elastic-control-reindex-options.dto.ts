import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

import {
  ElasticControlKeyEnum,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '../enums';
import { IsPeriodMatchingRange } from '../validators';

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
  @IsPeriodMatchingRange()
  readonly period: string;

  @Expose()
  @IsEnum(ElasticControlKeyEnum)
  readonly key: ElasticControlKeyEnum;
}

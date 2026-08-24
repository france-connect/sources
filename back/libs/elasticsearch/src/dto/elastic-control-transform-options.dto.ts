import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import {
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '../enums';
import { IsPeriodMatchingRange } from '../validators';

export class ElasticControlTransformOptionsDto {
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
  @IsOptional()
  @IsString()
  @IsPeriodMatchingRange()
  readonly period?: string;
}

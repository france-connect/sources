import { Type } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator';

import { FSA, FSAMeta } from '@fc/common';

import { ActionTypes } from '../enums';
import { RandomPayloadDto } from './random-payload.dto';

export class CsmrHsmRandomMessageDto implements FSA {
  @IsEnum(ActionTypes)
  readonly type: ActionTypes;

  @IsObject()
  @Type(() => RandomPayloadDto)
  @ValidateNested()
  readonly payload: RandomPayloadDto;

  @IsOptional()
  readonly meta?: FSAMeta;
}

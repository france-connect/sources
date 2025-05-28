import { Type } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator';

import { FSA, FSAMeta } from '@fc/common';

import { ActionTypes } from '../enums';
import { SignPayloadDto } from './sign-payload.dto';

export class CsmrHsmClientMessageDto implements FSA {
  @IsEnum(ActionTypes)
  readonly type: ActionTypes;

  @IsObject()
  @Type(() => SignPayloadDto)
  @ValidateNested()
  readonly payload: SignPayloadDto;

  @IsOptional()
  readonly meta?: FSAMeta;
}

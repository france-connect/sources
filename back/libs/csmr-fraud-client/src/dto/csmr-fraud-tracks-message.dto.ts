import { Type } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { FSA, FSAMeta } from '@fc/common';

import { ActionTypes } from '../enums';

export class FraudTracksMessageDtoPayload {
  @IsUUID(4)
  readonly authenticationEventId: string;
}

export class FraudTracksMessageDto implements FSA {
  @IsEnum(ActionTypes)
  readonly type: ActionTypes;

  @IsOptional()
  meta?: FSAMeta;

  @IsObject()
  @Type(() => FraudTracksMessageDtoPayload)
  @ValidateNested()
  readonly payload: FraudTracksMessageDtoPayload;
}

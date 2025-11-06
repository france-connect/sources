import { Type } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator';

import { FSA, FSAMeta } from '@fc/common';
import { PivotIdentityDto } from '@fc/oidc';

import { ActionTypes } from '../enums';
import { FraudCaseDto } from './fraud-case.dto';

export class FraudCaseMessageDtoPayload {
  @IsObject()
  @ValidateNested()
  @Type(() => PivotIdentityDto)
  readonly identity: PivotIdentityDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FraudCaseDto)
  readonly fraudCase: FraudCaseDto;
}

export class FraudCaseMessageDto implements FSA {
  @IsEnum(ActionTypes)
  readonly type: ActionTypes;

  @IsOptional()
  meta?: FSAMeta;

  @IsObject()
  @Type(() => FraudCaseMessageDtoPayload)
  @ValidateNested()
  readonly payload: FraudCaseMessageDtoPayload;
}

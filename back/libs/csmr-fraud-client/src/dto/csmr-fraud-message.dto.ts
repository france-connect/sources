import { Type } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator';

import { FSA, FSAMeta } from '@fc/common';
import { FraudCaseDto } from '@fc/csmr-fraud-client';
import { PivotIdentityDto } from '@fc/oidc';

import { ActionTypes } from '../enums';

export class FraudMessageDtoPayload {
  @IsObject()
  @ValidateNested()
  @Type(() => PivotIdentityDto)
  readonly identity: PivotIdentityDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FraudCaseDto)
  readonly fraudCase: FraudCaseDto;
}

export class FraudMessageDto implements FSA {
  @IsEnum(ActionTypes)
  readonly type: ActionTypes;

  @IsOptional()
  meta?: FSAMeta;

  @IsObject()
  @Type(() => FraudMessageDtoPayload)
  @ValidateNested()
  readonly payload: FraudMessageDtoPayload;
}

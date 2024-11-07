/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { FraudCaseDto } from '@fc/csmr-fraud-client';
import { PivotIdentityDto } from '@fc/oidc';

export class ProcessFraudCasePayloadDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PivotIdentityDto)
  readonly identity: PivotIdentityDto;

  @IsObject()
  @ValidateNested()
  @Type(() => FraudCaseDto)
  readonly fraudCase: FraudCaseDto;
}

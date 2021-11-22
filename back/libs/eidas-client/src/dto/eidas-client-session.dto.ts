/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { EidasPartialRequest, EidasRequest, EidasResponse } from '@fc/eidas';

export class EidasClientSession {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EidasPartialRequest)
  readonly eidasPartialRequest?: EidasPartialRequest;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EidasRequest)
  readonly eidasRequest?: EidasRequest;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EidasResponse)
  readonly eidasResponse?: EidasResponse;
}

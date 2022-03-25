/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsArray,
  IsAscii,
  IsBoolean,
  IsObject,
  ValidateNested,
} from 'class-validator';

import { IPivotIdentity } from '@fc/cryptography-fcp';

import { OidcIdentityDto } from '../dto';

class IdpSettingsDto {
  @IsAscii({ each: true })
  @IsArray()
  readonly idpList: string[];

  @IsBoolean()
  readonly allowFutureIdp: boolean;
}

export class GetIdpSettingsPayloadDto {
  @IsObject()
  @ValidateNested()
  @Type(() => OidcIdentityDto)
  readonly identity: IPivotIdentity;
}

export class SetIdpSettingsPayloadDto {
  @IsObject()
  @ValidateNested()
  @Type(() => OidcIdentityDto)
  readonly identity: IPivotIdentity;

  @IsObject()
  @ValidateNested()
  @Type(() => IdpSettingsDto)
  readonly idpSettings: IdpSettingsDto;
}

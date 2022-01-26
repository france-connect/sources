/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsArray, IsAscii, IsObject, ValidateNested } from 'class-validator';

import { IPivotIdentity } from '@fc/cryptography-fcp';

import { OidcIdentityDto } from '../interfaces';

class IdpSettingsDto {
  @IsAscii({ each: true })
  @IsArray()
  readonly includeList: string[];
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

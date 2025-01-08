import { Type } from 'class-transformer';
import {
  IsArray,
  IsAscii,
  IsBoolean,
  IsObject,
  ValidateNested,
} from 'class-validator';

import { PivotIdentityDto } from '@fc/oidc';

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
  @Type(() => PivotIdentityDto)
  readonly identity: PivotIdentityDto;
}

export class SetIdpSettingsPayloadDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PivotIdentityDto)
  readonly identity: PivotIdentityDto;

  @IsObject()
  @ValidateNested()
  @Type(() => IdpSettingsDto)
  readonly idpSettings: IdpSettingsDto;
}

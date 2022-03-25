/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IdpConfig } from '../interfaces/idp-config.interface';

class IdpConfigSettings implements IdpConfig {
  @IsString()
  readonly uid: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly image: string;

  @IsString()
  readonly title: string;

  @IsBoolean()
  readonly active: boolean;

  @IsBoolean()
  readonly isChecked: boolean;
}

export class IdpConfigUpdateEmailParameters {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly givenName: string;

  @IsString()
  readonly familyName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdpConfigSettings)
  readonly formattedIdpSettingsList: IdpConfig[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdpConfigSettings)
  readonly updatedIdpSettingsList: IdpConfig[];

  @IsBoolean()
  readonly futureIdpChoice: boolean;

  @IsBoolean()
  readonly hasChangedIsExcludeList: boolean;
}

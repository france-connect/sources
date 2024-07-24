/* istanbul ignore file */

// Declarative code
import { Expose } from 'class-transformer';
import {
  IsAscii,
  IsEmail,
  IsEnum,
  IsOptional,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { IsCog } from '@fc/cog';
import { IsSafeString } from '@fc/common';
import { Genders } from '@fc/rnipp';

const COG_FRANCE = '99100';

export class OidcIdentityDto {
  @MinLength(1)
  @IsAscii()
  @IsOptional()
  @Expose()
  readonly sub?: string;

  @IsSafeString()
  @Length(1, 256)
  @Expose()
  readonly given_name: string;

  @IsSafeString()
  @Length(1, 256)
  @Expose()
  readonly family_name: string;

  @IsSafeString()
  @Expose()
  readonly birthdate: string;

  @IsSafeString()
  @IsEnum(Genders)
  @Expose()
  readonly gender: string;

  @ValidateIf(OidcIdentityDto.shouldValidateBirthplace)
  @IsCog()
  @Expose()
  readonly birthplace: string;

  @IsCog()
  @Expose()
  readonly birthcountry: string;

  @IsSafeString()
  @IsOptional()
  @Expose()
  readonly preferred_username?: string;

  @IsEmail()
  @IsOptional()
  @Expose()
  readonly email?: string;

  static shouldValidateBirthplace(instance: OidcIdentityDto) {
    return instance.birthcountry === COG_FRANCE;
  }
}

/* istanbul ignore file */

// Declarative code
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { IsCog } from '@fc/cog';
import { IsSafeString } from '@fc/common';
import { MinIdentityDto } from '@fc/oidc-client';
import { Genders } from '@fc/rnipp';

const COG_FRANCE = '99100';
export class OidcIdentityDto extends MinIdentityDto {
  @IsSafeString()
  @MinLength(1)
  @MaxLength(256)
  @Expose()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly given_name: string;

  @IsSafeString()
  @MinLength(1)
  @MaxLength(256)
  @Expose()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  @Expose()
  readonly email: string;

  static shouldValidateBirthplace(instance: OidcIdentityDto) {
    return instance.birthcountry === COG_FRANCE;
  }
}

/* istanbul ignore file */

// Declarative code
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { COG_FRANCE, IsCog } from '@fc/cog';
import { MinIdentityDto } from '@fc/oidc-client';
import { Genders } from '@fc/rnipp';

export class OidcIdentityDto extends MinIdentityDto {
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @Expose()
  readonly given_name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @Expose()
  readonly family_name: string;

  @IsString()
  @Expose()
  readonly birthdate: string;

  @IsString()
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

  @IsString()
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

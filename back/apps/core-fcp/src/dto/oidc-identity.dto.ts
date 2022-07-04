/* istanbul ignore file */

// Declarative code
import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { IsCog } from '@fc/cog';
import { IsSafeString } from '@fc/common';
import { MinIdentityDto } from '@fc/oidc-client';
import { Genders } from '@fc/rnipp';

const COG_FRANCE = '99100';

class IdentityAddress {
  @IsSafeString()
  @IsOptional()
  @Expose()
  country?: string;

  @IsSafeString()
  @IsOptional()
  @Expose()
  formatted?: string;

  @IsSafeString()
  @IsOptional()
  @Expose()
  locality?: string;

  @ValidateIf(({ postal_code: pc }) => pc)
  @IsCog()
  @Expose()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  postal_code?: string;

  @IsSafeString()
  @IsOptional()
  @Expose()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  street_address?: string;
}

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
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly preferred_username?: string;

  @IsEmail()
  @Expose()
  readonly email: string;

  /**
   * @todo #1022 Supprimer les claim `phone_number` obsolète
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1022
   * @ticket FC-1022
   */
  @IsSafeString()
  @IsOptional()
  @Expose()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly phone_number?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => IdentityAddress)
  @Expose()
  readonly address?: IdentityAddress;

  static shouldValidateBirthplace(instance: OidcIdentityDto) {
    return instance.birthcountry === COG_FRANCE;
  }
}

/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import {
  IsAscii,
  IsEmail,
  IsEnum,
  IsHexadecimal,
  IsObject,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { IsSafeString } from '@fc/common';
import { MinIdentityDto } from '@fc/oidc-client';
import { Genders } from '@fc/rnipp';

const COG_FRANCE = '99100';

class IdentityAddress {
  @IsSafeString()
  @IsOptional()
  country?: string;

  @IsSafeString()
  @IsOptional()
  formatted?: string;

  @IsSafeString()
  @IsOptional()
  locality?: string;

  @ValidateIf(({ postal_code: pc }) => pc)
  @IsHexadecimal()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  postal_code?: string;

  @IsSafeString()
  @IsOptional()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  street_address?: string;
}

export class FcIdentityDto extends MinIdentityDto {
  @IsSafeString()
  @MinLength(1)
  @MaxLength(256)
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly given_name: string;

  @IsSafeString()
  @MinLength(1)
  @MaxLength(256)
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly family_name: string;

  @IsSafeString()
  @MinLength(1)
  readonly birthdate: string;

  @IsSafeString()
  @IsEnum(Genders)
  readonly gender: string;

  @IsHexadecimal()
  @ValidateIf(FcIdentityDto.shouldValidateBirthplace)
  readonly birthplace?: string;

  @IsHexadecimal()
  readonly birthcountry: string;

  @IsSafeString()
  @IsOptional()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly preferred_username?: string;

  @IsEmail()
  readonly email: string;

  @IsAscii()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly phone_number: string;

  @IsObject()
  @ValidateNested()
  @Type(() => IdentityAddress)
  readonly address: IdentityAddress;

  static shouldValidateBirthplace(instance: FcIdentityDto) {
    return instance.birthcountry === COG_FRANCE;
  }
}

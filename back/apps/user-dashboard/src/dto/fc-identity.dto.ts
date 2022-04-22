/* istanbul ignore file */

// Declarative code
import {
  IsEmail,
  IsEnum,
  IsHexadecimal,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { IsSafeString } from '@fc/common';
import { MinIdentityDto } from '@fc/oidc-client';
import { Genders } from '@fc/rnipp';

const COG_FRANCE = '99100';

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

  @IsEmail()
  readonly email: string;

  static shouldValidateBirthplace(instance: FcIdentityDto) {
    return instance.birthcountry === COG_FRANCE;
  }
}

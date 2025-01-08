import {
  IsEmail,
  IsEnum,
  IsHexadecimal,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { COG_FRANCE } from '@fc/cog';
import { MinIdentityDto } from '@fc/oidc-client';
import { Genders } from '@fc/rnipp';

export class FcIdentityDto extends MinIdentityDto {
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  readonly given_name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  readonly family_name: string;

  @IsString()
  @MinLength(1)
  readonly birthdate: string;

  @IsString()
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

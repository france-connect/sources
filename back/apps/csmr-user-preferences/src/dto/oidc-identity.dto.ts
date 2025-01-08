import { Expose } from 'class-transformer';
import {
  IsAscii,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { COG_FRANCE, IsCog } from '@fc/cog';
import { Genders } from '@fc/rnipp';

export class OidcIdentityDto {
  @MinLength(1)
  @IsAscii()
  @IsOptional()
  @Expose()
  readonly sub?: string;

  @IsString()
  @Length(1, 256)
  @Expose()
  readonly given_name: string;

  @IsString()
  @Length(1, 256)
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
  @IsOptional()
  @Expose()
  readonly email?: string;

  static shouldValidateBirthplace(instance: OidcIdentityDto) {
    return instance.birthcountry === COG_FRANCE;
  }
}

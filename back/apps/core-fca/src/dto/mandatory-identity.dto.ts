import { Expose } from 'class-transformer';
import {
  IsAscii,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { MinIdentityDto } from '@fc/oidc-client';

export class MandatoryIdentityDto extends MinIdentityDto {
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @Expose()
  readonly given_name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @Expose()
  readonly usual_name: string;

  @IsEmail()
  @Expose()
  readonly email: string;

  @MinLength(1)
  @IsAscii()
  @Expose()
  readonly uid: string;
}

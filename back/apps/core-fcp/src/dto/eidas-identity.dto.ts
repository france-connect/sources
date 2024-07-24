/* istanbul ignore file */

// Declarative code
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { EidasGenders } from '@fc/eidas-oidc-mapper';
import { MinIdentityDto } from '@fc/oidc-client';

export class EidasIdentityDto extends MinIdentityDto {
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @Expose()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly given_name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @Expose()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly family_name: string;

  @IsString()
  @Expose()
  readonly birthdate: string;

  @IsString()
  @IsEnum(EidasGenders)
  @IsOptional()
  @Expose()
  readonly gender?: string;

  @IsString()
  @IsOptional()
  @Expose()
  readonly birthplace?: string;

  @IsString()
  @IsOptional()
  @Expose()
  readonly preferred_username?: string;
}

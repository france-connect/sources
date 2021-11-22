/* istanbul ignore file */

// Declarative code
import { Expose } from 'class-transformer';
import {
  IsAscii,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsSafeString } from '@fc/common';
import { EidasGenders } from '@fc/eidas-oidc-mapper';
import { MinIdentityDto } from '@fc/oidc-client';

export class EidasIdentityDto extends MinIdentityDto {
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
  @IsEnum(EidasGenders)
  @IsOptional()
  @Expose()
  readonly gender?: string;

  @IsAscii()
  @IsOptional()
  @Expose()
  readonly birthplace?: string;

  @IsSafeString()
  @IsOptional()
  @Expose()
  // oidc naming convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly preferred_username?: string;
}

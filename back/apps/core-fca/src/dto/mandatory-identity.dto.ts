/* istanbul ignore file */

// Declarative code
import { Expose } from 'class-transformer';
import { IsAscii, IsEmail, MaxLength, MinLength } from 'class-validator';

import { IsSafeString } from '@fc/common';
import { MinIdentityDto } from '@fc/oidc-client';

export class MandatoryIdentityDto extends MinIdentityDto {
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
  readonly usual_name: string;

  @IsEmail()
  @Expose()
  readonly email: string;

  @MinLength(1)
  @IsAscii()
  @Expose()
  readonly uid: string;
}

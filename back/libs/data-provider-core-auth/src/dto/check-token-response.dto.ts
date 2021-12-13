/* istanbul ignore file */

// declarative file
import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsIn,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IsSafeString } from '@fc/common';
import { OidcIdentityDto } from '@fc/oidc';

export class CheckTokenResponseDto {
  @ValidateNested()
  @Type(() => OidcIdentityDto)
  readonly identity: OidcIdentityDto;

  @IsArray()
  @IsSafeString({ each: true })
  readonly scope: string[];

  @Allow()
  readonly client: unknown;

  @IsString()
  @IsIn(['eidas1', 'eidas2', 'eidas3'])
  readonly acr: string;
}

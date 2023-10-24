/* istanbul ignore file */

// Declarative file
import { Expose } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { PartialExcept } from '@fc/common';
import { CoreBaseOidcClientSessionDto, CoreRoutes } from '@fc/core';
import { IOidcIdentity } from '@fc/oidc';
import { RnippPivotIdentity } from '@fc/rnipp';

export class GetLoginOidcClientSessionDto extends CoreBaseOidcClientSessionDto {
  // Metadata: We MUST have an accountId
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly accountId: string;

  // Metadata: We MUST restrict the routes we can come from
  @IsString()
  @IsIn([CoreRoutes.INTERACTION_CONSENT])
  @Expose()
  readonly stepRoute: string;

  // Identity Provider: We MUST have idpId
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpId: string;

  // Identity Provider: We MUST have idpName
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpName: string;

  // Identity Provider: We MUST have idpLabel
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpLabel: string;

  // Identity Provider: We MUST have idpAcr
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly idpAcr: string;

  // Identity: We MAY keep an idpIdentity (SSO)
  @IsOptional()
  @IsObject()
  @Expose()
  readonly idpIdentity?: PartialExcept<IOidcIdentity, 'sub'> | IOidcIdentity;

  // Identity: We MAY keep a rnippIdentity (SSO)
  @IsOptional()
  @IsObject()
  @Expose()
  readonly rnippIdentity?: RnippPivotIdentity;

  // Identity: We MUST have a spIdentity
  @IsObject()
  @Expose()
  readonly spIdentity: IOidcIdentity;
}

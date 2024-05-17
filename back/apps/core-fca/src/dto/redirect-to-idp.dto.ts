import { IsAscii, IsEmail, IsOptional, IsString } from 'class-validator';

import { RedirectToIdp as CoreRedirectToIdp } from '@fc/oidc-client';

export class RedirectToIdp extends CoreRedirectToIdp {
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  @IsAscii()
  readonly identityProviderUid?: string;
}

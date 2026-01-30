import { Expose } from 'class-transformer';
import { IsIn, IsString } from 'class-validator';

import { CoreRoutes } from '@fc/core';
import { OidcProviderPrompt } from '@fc/oidc-provider';

import { GetLoginOidcClientSessionDto } from './get-login-session-dto';

export class GetAutoLoginSessionDto extends GetLoginOidcClientSessionDto {
  // Metadata: Override stepRoute validation to accept INTERACTION_VERIFY
  // The auto-login flow comes from the verify step, not the consent page
  @IsString()
  @IsIn([CoreRoutes.INTERACTION_VERIFY])
  @Expose()
  readonly stepRoute: string;

  // SP Prompt: We MUST have spPrompt with strict validation
  @IsString()
  @IsIn([OidcProviderPrompt.LOGIN, OidcProviderPrompt.CONSENT])
  @Expose()
  readonly spPrompt: string;
}

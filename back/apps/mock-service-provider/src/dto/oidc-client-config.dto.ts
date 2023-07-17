/* istanbul ignore file */

// Declarative file
import { IsOptional } from 'class-validator';

import { OidcClientConfig as OidcClientBaseConfig } from '@fc/oidc-client';

export class OidcClientConfig extends OidcClientBaseConfig {
  /**
   * Make postLogoutRedirectUri optional for testing purpose
   */
  @IsOptional()
  readonly postLogoutRedirectUri: string;
}

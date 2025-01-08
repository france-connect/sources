import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

import { IsUrlRequiredTldFromConfig, Split } from '@fc/common';
import { IsValidPrompt } from '@fc/oidc-provider';

/**
 * Control parameters on the authentication request.
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.2.1
 */
export class AuthorizeParamsDto {
  @IsString()
  @MinLength(1)
  readonly client_id: string;

  @IsString({ each: true })
  @IsArray()
  @Split(/[ ]+/, { maxLength: 64 })
  readonly acr_values: string;

  @IsOptional()
  @IsString()
  readonly claims?: string;

  @IsString()
  readonly response_type: string;

  @IsString()
  @MinLength(22)
  readonly nonce: string;

  @IsString()
  readonly state: string;

  @IsUrlRequiredTldFromConfig()
  readonly redirect_uri: string;

  // The openid verification is made into oidc-provider
  @IsString()
  readonly scope: string;

  @IsString({ each: true })
  @Split(/[ ]+/, { maxLength: 64 })
  /**
   * @TODO #199 Retourner chez le FS en cas d'erreur
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/199
   *
   * @TODO #256
   * ETQ Dev, je supprime la valeur 'none' pour le prompt
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/256
   */
  @IsValidPrompt()
  @IsOptional()
  readonly prompt?: string;

  @IsOptional()
  @IsString()
  readonly idp_hint?: string;
}

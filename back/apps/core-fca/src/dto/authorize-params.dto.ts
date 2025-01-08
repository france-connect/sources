import {
  IsArray,
  IsAscii,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import {
  IsIncludedInConfig,
  IsUrlRequiredTldFromConfig,
  Split,
} from '@fc/common';
import { OidcProviderConfig } from '@fc/oidc-provider';

/**
 * Control parameters on the authentication request.
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.2.1
 */
export class AuthorizeParamsDto {
  @IsString()
  readonly client_id: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @Split(/[ ]+/, { maxLength: 64 })
  readonly acr_values?: string;

  @IsOptional()
  @IsString()
  readonly claims?: string;

  @IsString()
  readonly response_type: string;

  @IsOptional()
  @IsString()
  @IsAscii({ message: 'Le nonce doit être composé de caractères ASCII' })
  @Length(1, 512)
  readonly nonce?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Le login_hint doit être une adresse email valide' })
  readonly login_hint?: string;

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
   */
  @IsOptional()
  @IsIncludedInConfig<OidcProviderConfig>('OidcProvider', 'allowedPrompt')
  readonly prompt?: string;

  @IsOptional()
  @IsString()
  readonly idp_hint?: string;
}

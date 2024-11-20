/* istanbul ignore file */

// Declarative code

import { ErrorCode } from '../enums';
import { OidcProviderBaseRenderedException } from './oidc-provider-base-rendered.exception';

export class OidcProviderParseJsonClaimsException extends OidcProviderBaseRenderedException {
  static CODE = ErrorCode.PARSE_JSON_CLAIMS;
  static DOCUMENTATION =
    "Le format attendu pour le claims n'est pas le bon. Si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'OidcProvider.exceptions.oidcProviderParseJsonClaims';
}

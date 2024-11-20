/* istanbul ignore file */

// Declarative code

import { ErrorCode } from '../enums';
import { OidcProviderBaseRenderedException } from './oidc-provider-base-rendered.exception';

export class OidcProviderInitialisationException extends OidcProviderBaseRenderedException {
  static CODE = ErrorCode.INIT_PROVIDER;
  static DOCUMENTATION =
    "Problème lors de l'initialisation de la plateforme lié au wrapper oidc-provider. La plateforme ne fonctionne pas, contacter en urgence le support N3.";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'OidcProvider.exceptions.oidcProviderInitialisation';
}

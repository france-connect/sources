import { ErrorCode } from '../enums';
import { OidcProviderBaseRenderedException } from './oidc-provider-base-rendered.exception';

export class OidcProviderGrantSaveException extends OidcProviderBaseRenderedException {
  static CODE = ErrorCode.GRANT_NOT_SAVED;
  static DOCUMENTATION =
    'Problème de sauvegarde du grant. Contacter le support N3';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'OidcProvider.exceptions.oidcProviderGrantSave';
}

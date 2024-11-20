/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enums';
import { MockServiceProviderBaseException } from './mock-service-provider-base.exception';

export class MockServiceProviderTokenRevocationException extends MockServiceProviderBaseException {
  static CODE = ErrorCode.TOKEN_REVOCATION;
  static DOCUMENTATION =
    "Une erreur s'est produite lors de la révocation d'un token par un FS de démo. Le token a dû expirer avec révocation. Si le problème persiste, contacter le support N3.";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI =
    'MockServiceProvider.exceptions.mockServiceProviderTokenRevocation';
}

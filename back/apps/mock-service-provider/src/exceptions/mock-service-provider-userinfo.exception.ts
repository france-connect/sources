/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enums';
import { MockServiceProviderBaseException } from './mock-service-provider-base.exception';

export class MockServiceProviderUserinfoException extends MockServiceProviderBaseException {
  static CODE = ErrorCode.USERINFO;
  static DOCUMENTATION =
    "Une erreur s'est produite lors de la récupération des données utilisateurs depuis un FS de démo. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'MockServiceProvider.exceptions.mockServiceProviderUserinfo';
}

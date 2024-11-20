import { ErrorCode } from '../enums';
import { OidcProviderBaseException } from './oidc-provider-base.exception';

export class OidcProviderRuntimeException extends OidcProviderBaseException {
  static CODE = ErrorCode.RUNTIME_ERROR;
  static UI = 'OidcProvider.exceptions.RuntimeException';
}

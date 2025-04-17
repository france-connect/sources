/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_A158_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A158';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'jwt.encrypt.key Resource Server configuration must be a secret (symmetric) or a public key';
  static DOCUMENTATION =
    'jwt.encrypt.key Resource Server configuration must be a secret (symmetric) or a public key';
  static ERROR_SOURCE = 'models/formats/jwt.js:80';
  static UI = 'OidcProvider.exceptions.Error.A158';
}

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_1ADD_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '1ADD';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'provider key (kid: ${kid}) is invalid';
  static DOCUMENTATION = 'provider key (kid: ${kid}) is invalid';
  static ERROR_SOURCE = 'models/formats/paseto.js:84';
  static UI = 'OidcProvider.exceptions.Error.1ADD';
}

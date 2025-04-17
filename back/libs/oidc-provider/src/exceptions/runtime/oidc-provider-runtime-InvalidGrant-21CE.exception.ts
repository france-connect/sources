/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_21CE_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '21CE';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'DPoP proof JWT not provided';
  static DOCUMENTATION = 'DPoP proof JWT not provided';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:79';
  static UI = 'OidcProvider.exceptions.InvalidGrant.21CE';
}

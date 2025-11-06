/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_17B39_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '17B39';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'missing DPoP proof JWT';
  static DOCUMENTATION = 'missing DPoP proof JWT';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:132';
  static UI = 'OidcProvider.exceptions.InvalidGrant.17B39';
}

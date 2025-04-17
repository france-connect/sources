/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_6558_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6558';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'missing DPoP proof JWT';
  static DOCUMENTATION = 'missing DPoP proof JWT';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:131';
  static UI = 'OidcProvider.exceptions.InvalidGrant.6558';
}

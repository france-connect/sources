/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_7251D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '7251D';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'DPoP proof JWT not provided';
  static DOCUMENTATION = 'DPoP proof JWT not provided';
  static ERROR_SOURCE = 'actions/grants/authorization_code.js:80';
  static UI = 'OidcProvider.exceptions.InvalidGrant.7251D';
}

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_2FE3_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2FE3';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'DPoP proof JWT not provided';
  static DOCUMENTATION = 'DPoP proof JWT not provided';
  static ERROR_SOURCE = 'actions/grants/ciba.js:62';
  static UI = 'OidcProvider.exceptions.InvalidGrant.2FE3';
}

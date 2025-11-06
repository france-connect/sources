/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_60AFA_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '60AFA';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'accountId mismatch';
  static DOCUMENTATION = 'accountId mismatch';
  static ERROR_SOURCE = 'actions/grants/ciba.js:115';
  static UI = 'OidcProvider.exceptions.InvalidGrant.60AFA';
}

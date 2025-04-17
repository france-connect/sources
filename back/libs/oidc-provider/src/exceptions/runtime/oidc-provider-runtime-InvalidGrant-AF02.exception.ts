/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_AF02_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AF02';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'client mismatch';
  static DOCUMENTATION = 'client mismatch';
  static ERROR_SOURCE = 'actions/grants/device_code.js:49';
  static UI = 'OidcProvider.exceptions.InvalidGrant.AF02';
}

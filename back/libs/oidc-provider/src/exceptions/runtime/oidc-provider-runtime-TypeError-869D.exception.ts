/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_869D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '869D';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    '"mode" must be ${formatters.formatList([...requestObjectStrategies], { type: "disjunction" })}';
  static DOCUMENTATION =
    '"mode" must be ${formatters.formatList([...requestObjectStrategies], { type: "disjunction" })}';
  static ERROR_SOURCE = 'helpers/configuration.js:440';
  static UI = 'OidcProvider.exceptions.TypeError.869D';
}

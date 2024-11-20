/* istanbul ignore file */

/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_D876_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'D876';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'mode must be ${formatters.formatList([...requestObjectStrategies], { type: disjunction })}';
  static DOCUMENTATION =
    'mode must be ${formatters.formatList([...requestObjectStrategies], { type: disjunction })}';
  static ERROR_SOURCE = 'helpers/configuration.js:419';
  static UI = 'OidcProvider.exceptions.TypeError.D876';
}

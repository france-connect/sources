/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_AAC8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'AAC8';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'unsupported encrypted request enc';
  static DOCUMENTATION = 'unsupported encrypted request enc';
  static ERROR_SOURCE = 'actions/authorization/process_request_object.js:55';
  static UI = 'OidcProvider.exceptions.TypeError.AAC8';
}

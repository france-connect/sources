/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_6B607_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '6B607';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL = 'no suitable encryption key found (${encryption.alg})';
  static DOCUMENTATION = 'no suitable encryption key found (${encryption.alg})';
  static ERROR_SOURCE = 'models/id_token.js:200';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.6B607';
}

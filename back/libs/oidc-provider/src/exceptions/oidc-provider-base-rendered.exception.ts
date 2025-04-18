import { OidcProviderBaseException } from './oidc-provider-base.exception';

export abstract class OidcProviderBaseRenderedException extends OidcProviderBaseException {
  public source: 'render' | 'event';
}

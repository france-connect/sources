import { KoaContextWithOIDC, Provider } from 'oidc-provider';

import { Injectable, Type } from '@nestjs/common';

import { throwException } from '@fc/exceptions/helpers';

import { OidcProviderEvents } from '../enums';
import { OidcProviderNoWrapperException } from '../exceptions';
import { OidcProviderBaseRuntimeException } from '../exceptions/oidc-provider-base-runtime.exception';
import { exceptionSourceMap } from '../exceptions/runtime';

@Injectable()
export class OidcProviderErrorService {
  private errorEvents = [
    OidcProviderEvents.AUTHORIZATION_ERROR,
    OidcProviderEvents.BACKCHANNEL_ERROR,
    OidcProviderEvents.JWKS_ERROR,
    OidcProviderEvents.CHECK_SESSION_ORIGIN_ERROR,
    OidcProviderEvents.CHECK_SESSION_ERROR,
    OidcProviderEvents.DISCOVERY_ERROR,
    OidcProviderEvents.END_SESSION_ERROR,
    OidcProviderEvents.GRANT_ERROR,
    OidcProviderEvents.INTROSPECTION_ERROR,
    OidcProviderEvents.PUSHED_AUTHORIZATION_REQUEST_ERROR,
    OidcProviderEvents.REGISTRATION_CREATE_ERROR,
    OidcProviderEvents.REGISTRATION_DELETE_ERROR,
    OidcProviderEvents.REGISTRATION_READ_ERROR,
    OidcProviderEvents.REGISTRATION_UPDATE_ERROR,
    OidcProviderEvents.REVOCATION_ERROR,
    OidcProviderEvents.SERVER_ERROR,
    OidcProviderEvents.USERINFO_ERROR,
  ];

  /**
   * @param {Provider} provider PANVA provider object
   *
   */
  catchErrorEvents(provider: Provider) {
    this.errorEvents.forEach((eventName) => {
      provider.on(eventName, this.listenError.bind(this, eventName));
    });
  }

  async listenError(eventName: string, ctx: KoaContextWithOIDC, error: Error) {
    await this.renderError(ctx, '', error);
  }

  /**
   *
   * @param {KoaContextWithOIDC} ctx Koa's `ctx` object
   * @param {string} out output body, we won't use it here.
   * @param {any} error error trown from oidc-provider
   *
   * @see https://github.com/panva/node-oidc-provider/tree/master/docs#rendererror
   */
  async renderError(ctx: KoaContextWithOIDC, _out: string, error: any) {
    const exceptionClass =
      OidcProviderErrorService.getRenderedExceptionWrapper(error);

    const wrappedError = new exceptionClass(error);

    /**
     * Flag the request as invalid
     * to inform async treatment (event listeners)
     */
    if (ctx?.oidc) {
      ctx.oidc['isError'] = true;
    }

    await throwException(wrappedError);
  }

  static getRenderedExceptionWrapper(
    exception: Error,
  ): Type<OidcProviderBaseRuntimeException> {
    const source = exception.stack
      .split('\n')?.[1]
      .match(/node_modules\/oidc-provider\/lib\/(.*):[0-9]/)?.[1];

    const wrapper =
      exceptionSourceMap[source] || OidcProviderNoWrapperException;

    return wrapper;
  }
}

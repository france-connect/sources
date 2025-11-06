import { KoaContextWithOIDC, Provider } from 'oidc-provider';

import { Injectable, Type } from '@nestjs/common';

import { throwException } from '@fc/exceptions/helpers';

import { OidcProviderEvents } from '../enums';
import { OidcProviderNoWrapperException } from '../exceptions';
import { OidcProviderBaseRuntimeException } from '../exceptions/oidc-provider-base-runtime.exception';
import { exceptionSourceMap } from '../exceptions/runtime';

@Injectable()
export class OidcProviderErrorService {
  /**
   * @param {Provider} provider PANVA provider object
   *
   */
  catchErrorEvents(provider: Provider) {
    /**
     * We can not iterate over the events, because the on() method signature
     * is built with overloads rather than with a type union.
     */
    provider.on(
      OidcProviderEvents.AUTHORIZATION_ERROR,
      this.listenError.bind(this, OidcProviderEvents.AUTHORIZATION_ERROR),
    );
    provider.on(
      OidcProviderEvents.BACKCHANNEL_ERROR,
      this.listenError.bind(this, OidcProviderEvents.BACKCHANNEL_ERROR),
    );
    provider.on(
      OidcProviderEvents.JWKS_ERROR,
      this.listenError.bind(this, OidcProviderEvents.JWKS_ERROR),
    );
    provider.on(
      OidcProviderEvents.DISCOVERY_ERROR,
      this.listenError.bind(this, OidcProviderEvents.DISCOVERY_ERROR),
    );
    provider.on(
      OidcProviderEvents.END_SESSION_ERROR,
      this.listenError.bind(this, OidcProviderEvents.END_SESSION_ERROR),
    );
    provider.on(
      OidcProviderEvents.GRANT_ERROR,
      this.listenError.bind(this, OidcProviderEvents.GRANT_ERROR),
    );
    provider.on(
      OidcProviderEvents.INTROSPECTION_ERROR,
      this.listenError.bind(this, OidcProviderEvents.INTROSPECTION_ERROR),
    );
    provider.on(
      OidcProviderEvents.PUSHED_AUTHORIZATION_REQUEST_ERROR,
      this.listenError.bind(
        this,
        OidcProviderEvents.PUSHED_AUTHORIZATION_REQUEST_ERROR,
      ),
    );
    provider.on(
      OidcProviderEvents.REGISTRATION_CREATE_ERROR,
      this.listenError.bind(this, OidcProviderEvents.REGISTRATION_CREATE_ERROR),
    );
    provider.on(
      OidcProviderEvents.REGISTRATION_DELETE_ERROR,
      this.listenError.bind(this, OidcProviderEvents.REGISTRATION_DELETE_ERROR),
    );
    provider.on(
      OidcProviderEvents.REGISTRATION_READ_ERROR,
      this.listenError.bind(this, OidcProviderEvents.REGISTRATION_READ_ERROR),
    );
    provider.on(
      OidcProviderEvents.REGISTRATION_UPDATE_ERROR,
      this.listenError.bind(this, OidcProviderEvents.REGISTRATION_UPDATE_ERROR),
    );
    provider.on(
      OidcProviderEvents.REVOCATION_ERROR,
      this.listenError.bind(this, OidcProviderEvents.REVOCATION_ERROR),
    );
    provider.on(
      OidcProviderEvents.SERVER_ERROR,
      this.listenError.bind(this, OidcProviderEvents.SERVER_ERROR),
    );
    provider.on(
      OidcProviderEvents.USERINFO_ERROR,
      this.listenError.bind(this, OidcProviderEvents.USERINFO_ERROR),
    );
  }

  async listenError(_eventName: string, ctx: KoaContextWithOIDC, error: Error) {
    const wrappedError = this.wrapError(ctx, error);

    wrappedError.source = 'event';

    await throwException(wrappedError);
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
    const wrappedError = this.wrapError(ctx, error);

    wrappedError.source = 'render';

    await throwException(wrappedError);
  }

  private wrapError(ctx: KoaContextWithOIDC, error: Error) {
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
    return wrappedError;
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

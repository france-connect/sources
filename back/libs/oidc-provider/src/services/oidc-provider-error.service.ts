import { KoaContextWithOIDC, Provider } from 'oidc-provider';

import { ArgumentsHost, Injectable } from '@nestjs/common';

import { FcException, FcExceptionFilter } from '@fc/exceptions';

import { ErrorCode, OidcProviderEvents } from '../enums';
import { OidcProviderRuntimeException } from '../exceptions';
import { OidcCtx } from '../interfaces';

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

  constructor(private readonly exceptionFilter: FcExceptionFilter) {}

  /**
   * @param {Provider} provider PANVA provider object
   *
   */
  catchErrorEvents(provider: Provider) {
    this.errorEvents.forEach((eventName) => {
      provider.on(eventName, this.triggerError.bind(this, eventName));
    });
  }

  /**
   *
   * @param {KoaContextWithOIDC} ctx Koa's `ctx` object
   * @param {string} out output body, we won't use it here.
   * @param {any} error error trown from oidc-provider
   *
   * @see https://github.com/panva/node-oidc-provider/tree/master/docs#rendererror
   */
  renderError(ctx: KoaContextWithOIDC, _out: string, error: any) {
    // Instantiate our exception
    const exception = new OidcProviderRuntimeException(error);
    // Call our hacky "thrower"
    this.throwError(ctx, exception);
  }

  triggerError(eventName: OidcProviderEvents, ctx: OidcCtx, error: Error) {
    let wrappedError: FcException;

    if (error instanceof FcException) {
      wrappedError = error;
    } else {
      wrappedError = new OidcProviderRuntimeException(
        error,
        ErrorCode[eventName.toUpperCase()],
      );
    }

    /**
     * Flag the request as invalid
     * to inform async tratment (event listeners)
     */
    ctx.oidc['isError'] = true;

    if (wrappedError.redirect === true) {
      this.throwError(ctx, wrappedError);
    }
  }

  /**
   * We can't just throw since oidc-provider has its own catch block
   * which would prevent us of reaching our NestJs exceptionFilter
   *
   * Hacky workarround:
   * 1. Exception filter is injected in the service
   * 2. Explicit call to the catch method
   *
   * We have to construct a fake ArgumentsHost host instance.
   * @param ctx Koa's `ctx` object
   * @param exception error to throw
   */
  throwError(ctx, exception) {
    // Build fake ArgumentsHost host instance
    const host = FcExceptionFilter.ArgumentHostAdapter(ctx) as ArgumentsHost;

    // Finally call the exception filter
    this.exceptionFilter.catch(exception, host);
  }
}

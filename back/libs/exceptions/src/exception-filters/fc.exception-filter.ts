import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams, ApiHttpResponseCode } from '@fc/app';
import { ConfigService } from '@fc/config';
import { Loggable, Trackable } from '@fc/exceptions';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { TrackingService } from '@fc/tracking';

import { TrackableEvent } from '../events';
import { FcException } from '../exceptions';
import { ExceptionsService } from '../exceptions.service';
import { FcBaseExceptionFilter } from './fc-base.exception-filter';

@Catch(FcException)
export class FcExceptionFilter
  extends FcBaseExceptionFilter
  implements ExceptionFilter
{
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly tracking: TrackingService,
  ) {
    super(config, logger);
    this.logger.setContext(this.constructor.name);
  }

  catch(exception: FcException, host: ArgumentsHost) {
    this.logger.debug('Exception from FcException');

    const res = host.switchToHttp().getResponse();
    const req = host.switchToHttp().getRequest();
    const code = ExceptionsService.getExceptionCodeFor(exception);
    const id = ExceptionsService.generateErrorId();

    const { message } = exception;

    /**
     * Business "exceptions" are by definition not technical issues
     * Thus they do not need to be logged as errors.
     *
     * They will most likely trigger a business log.
     */
    const isTrackableError = Trackable.isTrackable(exception);

    const isLoggableError = Loggable.isLoggable(exception);

    if (isLoggableError) {
      this.logException(code, id, exception);
    }

    if (isTrackableError) {
      /**
       * @TODO #230 ETQ Dev, je n'envoie pas toute la req
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/230
       */
      this.tracking.track(TrackableEvent, { req, exception });
    }

    /**
     * Do not render error if the `redirect` flag is set to true.
     * This usually means that the error is supposed to trigger a redirect
     * rather than to display some information.
     *
     * This is typically the case for many oidc parameters.
     * In those scenarios, redirection is handled by `oidc-provider`
     */
    if (exception.redirect === true) {
      return;
    }

    this.logger.trace({ exception }, LoggerLevelNames.ERROR);

    const httpErrorCode: number = ApiHttpResponseCode.ERROR_CODE_500;
    const errorMessage: ApiErrorMessage = { code, id, message };
    const exceptionParam: ApiErrorParams = {
      res,
      error: errorMessage,
      httpResponseCode: httpErrorCode,
    };

    return this.errorOutput(exceptionParam);
  }

  /**
   * Fake adapter to inject into manual calls to `FcExceptionFilter.catch()`
   * @see '@fc/oidc-provider/oidc-provider-service' throwError()
   */
  static ArgumentHostAdapter(ctx) {
    return {
      switchToHttp: () => ({
        getResponse: () => ctx.res,
        getRequest: () => ctx.req,
      }),
    };
  }
}

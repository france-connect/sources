import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';
import { ConfigService } from '@fc/config';
import { ExceptionsService, FcException, Loggable } from '@fc/exceptions';
import { LoggerService } from '@fc/logger';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';
import { ViewTemplateService } from '@fc/view-templates';

import { FcaBaseExceptionFilter } from './fca-base.exception-filter';

@Catch(FcException)
export class FcaExceptionFilter
  extends FcaBaseExceptionFilter
  implements ExceptionFilter
{
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly viewTemplate: ViewTemplateService,
    protected readonly tracking: TrackingService,
  ) {
    super(config, logger, viewTemplate);
  }

  async catch(exception: FcException, host: ArgumentsHost) {
    this.logger.debug('Exception from FcException');

    const res = host.switchToHttp().getResponse();
    const req = host.switchToHttp().getRequest();
    const code = ExceptionsService.getExceptionCodeFor(exception);
    const id = ExceptionsService.generateErrorId();

    const { message } = exception;

    const isLoggableError = Loggable.isLoggable(exception);

    if (isLoggableError) {
      this.logException(code, id, exception);
    }

    if (this.tracking) {
      const context: TrackedEventContextInterface = { req, exception };
      await this.tracking.trackExceptionIfNeeded(exception, context);
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

    const errorMessage: ApiErrorMessage = { code, id, message };
    const exceptionParam: ApiErrorParams = {
      exception,
      res,
      error: errorMessage,
      httpResponseCode: exception.httpStatusCode,
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

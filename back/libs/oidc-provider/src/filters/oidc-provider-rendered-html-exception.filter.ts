import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { ApiErrorMessage } from '@fc/app';
import { ExceptionCaughtEvent } from '@fc/exceptions/events';
import { FcWebHtmlExceptionFilter } from '@fc/exceptions/filters';
import { generateErrorId, getClass } from '@fc/exceptions/helpers';

import { OidcProviderBaseRenderedException } from '../exceptions';

@Catch(OidcProviderBaseRenderedException)
@Injectable()
export class OidcProviderRenderedHtmlExceptionFilter
  extends FcWebHtmlExceptionFilter
  implements ExceptionFilter
{
  catch(exception: OidcProviderBaseRenderedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const code = this.getExceptionCodeFor(exception);
    const id = generateErrorId();

    const { source } = exception;
    const caught = exception.originalError?.caught;

    if (!caught) {
      this.logAndPublish(exception, ctx, code, id);
    }

    if (source === 'render') {
      this.output(exception, ctx, code, id);
    }
  }

  /**
   * If the error is already caught, we should not log it again,
   * but this means we are in the render() call, so we should output the error.
   */
  private output(
    exception: OidcProviderBaseRenderedException,
    ctx: HttpArgumentsHost,
    code: string,
    id: string,
  ): void {
    const exceptionConstructor = getClass(exception);
    const res = ctx.getResponse();
    const message = exceptionConstructor.UI;
    const errorMessage: ApiErrorMessage = { code, id, message };
    const exceptionParam = this.getParams(exception, errorMessage, res);

    this.errorOutput(exceptionParam);
  }

  /**
   * Log the exception and publish an event at the first sight.
   *
   * Do not output anything,
   * as oidc-provider could choose to redirect user to the service provider.
   *
   * Flag the error as caught to avoid multiple logs
   * (but do not create originalError if it does not exist).
   */
  private logAndPublish(
    exception: OidcProviderBaseRenderedException,
    ctx: HttpArgumentsHost,
    code: string,
    id: string,
  ): void {
    const req = ctx.getRequest();

    this.logException(code, id, exception);
    this.eventBus.publish(new ExceptionCaughtEvent(exception, { req }));

    if (exception.originalError) {
      exception.originalError.caught = true;
    }
  }
}

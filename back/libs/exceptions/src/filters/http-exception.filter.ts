import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';

import { ExceptionCaughtEvent } from '../events';
import { generateErrorId } from '../helpers';
import { FcWebHtmlExceptionFilter } from './fc-web-html-exception.filter';

@Catch(HttpException)
export class HttpExceptionFilter
  extends FcWebHtmlExceptionFilter
  implements ExceptionFilter
{
  catch(exception, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    const req = host.switchToHttp().getRequest();

    const status = (exception as unknown as HttpException).getStatus();
    const code = this.getExceptionCodeFor(exception);
    const id = generateErrorId();

    const message = `exceptions.http.${status}`;

    this.logException(code, id, exception);
    this.eventBus.publish(new ExceptionCaughtEvent(exception, { req }));

    const errorMessage: ApiErrorMessage = { code, id, message };
    const exceptionParam: ApiErrorParams = {
      exception,
      res,
      error: errorMessage,
      httpResponseCode: status,
    };

    return this.errorOutput(exceptionParam);
  }
}

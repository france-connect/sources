import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';
import { ExceptionsService } from '@fc/exceptions';

import { FcaBaseExceptionFilter } from './fca-base.exception-filter';

@Catch(HttpException)
export class HttpExceptionFilter
  extends FcaBaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.debug('Exception from HttpException');

    const res = host.switchToHttp().getResponse();
    const code = ExceptionsService.getExceptionCodeFor(exception);
    const id = ExceptionsService.generateErrorId();

    const { message } = exception.getResponse() as any;

    this.logException(code, id, exception);

    const errorMessage: ApiErrorMessage = { code, id, message };
    const exceptionParam: ApiErrorParams = {
      exception,
      res,
      error: errorMessage,
      httpResponseCode: exception.getStatus(),
    };

    return this.errorOutput(exceptionParam);
  }
}

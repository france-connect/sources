import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams, ApiHttpResponseCode } from '@fc/app';

import { ExceptionsService } from '../exceptions.service';
import { FcBaseExceptionFilter } from './fc-base.exception-filter';

@Catch(HttpException)
export class HttpExceptionFilter
  extends FcBaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.debug('Exception from HttpException');

    const res = host.switchToHttp().getResponse();
    const code = ExceptionsService.getExceptionCodeFor(exception);
    const id = ExceptionsService.generateErrorId();

    const { message } = exception.getResponse() as any;

    this.logException(code, id, exception);

    res.status(exception.getStatus());

    const httpErrorCode: number = ApiHttpResponseCode.ERROR_CODE_NONE;
    const errorMessage: ApiErrorMessage = { code, id, message };
    const exceptionParam: ApiErrorParams = {
      res,
      error: errorMessage,
      httpResponseCode: httpErrorCode,
    };

    return this.errorOutput(exceptionParam);
  }
}

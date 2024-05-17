import { Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';
import { ExceptionsService } from '@fc/exceptions';

import { FcaBaseExceptionFilter } from './fca-base.exception-filter';

@Catch()
export class UnhandledExceptionFilter
  extends FcaBaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: Error, host: ArgumentsHost) {
    this.logger.debug('Exception from UnhandledException');

    const res: Response = host.switchToHttp().getResponse();
    const code: string = ExceptionsService.getExceptionCodeFor();
    const id: string = ExceptionsService.generateErrorId();

    const { name, message, stack } = exception;
    const stackTrace: string[] = stack.split('\n');

    this.logger.err({
      type: name,
      code,
      id,
      message,
      stackTrace,
    });

    const httpErrorCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage: ApiErrorMessage = { code, id, message };
    const exceptionParam: ApiErrorParams = {
      exception,
      res,
      error: errorMessage,
      httpResponseCode: httpErrorCode,
    };

    this.logger.err(errorMessage);

    return this.errorOutput(exceptionParam);
  }
}

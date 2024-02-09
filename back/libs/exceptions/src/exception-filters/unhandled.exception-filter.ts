import { Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import {
  ApiContentType,
  ApiErrorMessage,
  ApiErrorParams,
  AppConfig,
} from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { ExceptionsService } from '../exceptions.service';

@Catch()
export class UnhandledExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  constructor(
    protected readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

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

    return this.errorOutput(exceptionParam);
  }

  private errorOutput(errorParam: ApiErrorParams): void {
    const { error, httpResponseCode, res } = errorParam;
    const { apiOutputContentType } = this.config.get<AppConfig>('App');

    this.logger.err(error);

    /**
     * @todo #139 allow the exception to set the HTTP response code
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/139
     */
    res.status(httpResponseCode);

    switch (apiOutputContentType) {
      case ApiContentType.HTML:
        this.getApiOutputHtml(errorParam);
        break;

      case ApiContentType.JSON:
        this.getApiOutputJson(errorParam);
        break;
    }
  }

  private getApiOutputHtml(errorParam: ApiErrorParams): void {
    const { res, ...params } = errorParam;
    res.render('error', params);
  }

  private getApiOutputJson(errorParam: ApiErrorParams): void {
    const { res, error } = errorParam;

    res.json(error);
  }
}

import { Response } from 'express';

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import {
  ApiContentType,
  ApiErrorMessage,
  ApiErrorParams,
  ApiHttpResponseCode,
  AppConfig,
} from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerLevelNames, LoggerService } from '@fc/logger';

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
    this.logger.setContext(this.constructor.name);
  }

  catch(exception: Error, host: ArgumentsHost) {
    this.logger.debug('Exception from UnhandledException');

    const res: Response = host.switchToHttp().getResponse();
    const code: string = ExceptionsService.getExceptionCodeFor();
    const id: string = ExceptionsService.generateErrorId();

    const { name, message, stack } = exception;
    const stackTrace: string[] = stack.split('\n');

    this.logger.error({
      type: name,
      code,
      id,
      message,
      stackTrace,
    });

    const httpErrorCode: number = ApiHttpResponseCode.ERROR_CODE_500;
    const errorMessage: ApiErrorMessage = { code, id, message };
    const exceptionParam: ApiErrorParams = {
      res,
      error: errorMessage,
      httpResponseCode: httpErrorCode,
    };

    return this.errorOutput(exceptionParam);
  }

  private errorOutput(errorParam: ApiErrorParams): void {
    const { error, httpResponseCode, res } = errorParam;
    const { apiOutputContentType } = this.config.get<AppConfig>('App');

    this.logger.trace(error, LoggerLevelNames.ERROR);

    /**
     * @todo #139 allow the exception to set the HTTP response code
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/139
     */
    res.status(httpResponseCode);

    switch (apiOutputContentType) {
      case ApiContentType.HTML:
        this.getApiOutputHtml(res, error);
        break;

      case ApiContentType.JSON:
        this.getApiOutputJson(res, error);
        break;
    }
  }

  private getApiOutputHtml(res: Response, error: ApiErrorMessage): void {
    res.render('error', error);
  }

  private getApiOutputJson(res: Response, error: ApiErrorMessage): void {
    res.json(error);
  }
}

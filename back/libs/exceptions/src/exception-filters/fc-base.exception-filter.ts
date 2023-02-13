import { Response } from 'express';

import { Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import {
  ApiContentType,
  ApiErrorMessage,
  ApiErrorParams,
  AppConfig,
} from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';

@Catch()
export abstract class FcBaseExceptionFilter extends BaseExceptionFilter {
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
  ) {
    super();
    this.logger.setContext(this.constructor.name);
  }

  protected getStackTraceArray(exception: any) {
    const { stack = '' } = exception;
    let stackTrace = stack.split('\n');

    if (exception.originalError) {
      const originalStack = exception.originalError.stack || '';
      stackTrace = stackTrace.concat(originalStack.split('\n'));
    }

    // Remove last empty element if any
    if (stackTrace[stackTrace.length - 1] === '') {
      stackTrace.pop();
    }

    return stackTrace;
  }

  protected logException(code: string, id: string, exception: any): void {
    const { message, redirect } = exception;
    const stackTrace = this.getStackTraceArray(exception);
    const exceptionObject = {
      type: exception.constructor.name,
      code,
      id,
      message,
      stackTrace,
      redirect,
    };
    this.logger.warn(exceptionObject);
    this.logger.trace(exceptionObject, LoggerLevelNames.WARN);
  }

  protected errorOutput(errorParam: ApiErrorParams): void {
    const { error, httpResponseCode, res } = errorParam;
    const { apiOutputContentType } = this.config.get<AppConfig>('App');

    this.logger.trace(error, LoggerLevelNames.ERROR);

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

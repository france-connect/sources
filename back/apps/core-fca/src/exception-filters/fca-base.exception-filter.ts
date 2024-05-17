import { Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { ApiContentType, ApiErrorParams, AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

@Catch()
export abstract class FcaBaseExceptionFilter extends BaseExceptionFilter {
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly viewTemplate: ViewTemplateService,
  ) {
    super();
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
      stackTrace,
      redirect,
    };
    this.logger.err(exceptionObject, message);
  }

  protected errorOutput(errorParam: ApiErrorParams): void {
    const { httpResponseCode, res } = errorParam;
    const { apiOutputContentType } = this.config.get<AppConfig>('App');

    /**
     * Interceptors are not run in case of route not handled by our app (404)
     * So we need to manually bind template helpers.
     */
    this.viewTemplate.bindMethodsToResponse(res);

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

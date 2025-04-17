import { Response } from 'express';

import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { EventBus } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { ExceptionsConfig } from '../dto';
import { BaseException } from '../exceptions/base.exception';
import { getClass, getCode, getStackTraceArray } from '../helpers';

@Catch()
export abstract class FcBaseExceptionFilter extends BaseExceptionFilter {
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly eventBus: EventBus,
  ) {
    super();
  }

  protected getParams(
    exception: BaseException,
    message: ApiErrorMessage,
    res: Response,
  ): ApiErrorParams {
    const exceptionParam: ApiErrorParams = {
      exception,
      res,
      error: message,
      httpResponseCode: this.getHttpStatus(exception),
    };

    return exceptionParam;
  }

  /**
   * @todo FC-2184 ⚠️
   */
  // eslint-disable-next-line complexity
  protected getHttpStatus(
    exception: BaseException,
    defaultStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): HttpStatus {
    const exceptionConstructor = getClass(exception);

    return (
      exception.status ||
      exception.statusCode ||
      exceptionConstructor.HTTP_STATUS_CODE ||
      defaultStatus
    );
  }

  protected logException(
    code: string,
    id: string,
    exception: BaseException,
  ): void {
    const exceptionConstructor = getClass(exception);

    const exceptionObject = {
      code,
      id,
      msg: exceptionConstructor.UI,
      originalError: exception.originalError,
      reason: exception.log,
      stackTrace: getStackTraceArray(exception),
      type: exception.constructor.name,
      statusCode: exception.statusCode,
    };

    this.logger.err(exceptionObject);
  }

  protected getExceptionCodeFor<T extends BaseException | Error>(
    exception?: T,
  ): string {
    const { prefix } = this.config.get<ExceptionsConfig>('Exceptions');
    let scope = 0;
    let code: string | number = 0;

    if (exception instanceof BaseException) {
      const exceptionClass = getClass(exception);

      scope = exceptionClass.SCOPE;
      code = exceptionClass.CODE;
    } else if (exception instanceof HttpException) {
      code = exception.getStatus();
    } else if (exception instanceof RpcException) {
      code = 0;
    }

    const errorCode = getCode(scope, code);

    return `${prefix}${errorCode}`;
  }
}

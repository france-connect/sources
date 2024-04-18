import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';

import { FcException, HttpException, RpcException } from './exceptions';

/**
 * Global core Error prefix
 *
 * "Y" was a random choice to be different from legacy core ("E")
 * We actually ran pwgen and got the first letter.
 * But let's build some story telling and say it is intended to say "why?"
 */
const ERROR_PREFIX = 'Y';

@Injectable()
export class ExceptionsService {
  static getExceptionCodeFor<T>(exception?: T): string {
    let scope = 0;
    let code = 0;

    if (exception instanceof FcException) {
      scope = exception.scope;
      code = exception.code;
    } else if (exception instanceof HttpException) {
      code = exception.getStatus();
    } else if (exception instanceof RpcException) {
      code = 0;
    }

    return ExceptionsService.getCode(scope, code);
  }

  // simple wrapper
  // instanbul ignore next line
  static generateErrorId(): string {
    return uuidv4();
  }

  static getCode(scope: number, code: number): string {
    const scopeString = ExceptionsService.addLeadingZeros(scope, 2);
    const codeString = ExceptionsService.addLeadingZeros(code, 4);

    return `${ERROR_PREFIX}${scopeString}${codeString}`;
  }

  private static addLeadingZeros(value: number, length: number): string {
    return `${value}`.padStart(length, '0');
  }
}

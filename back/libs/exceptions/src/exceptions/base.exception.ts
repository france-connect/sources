/* istanbul ignore file */

// Declarative file
import { HttpStatus } from '@nestjs/common';

export class BaseException extends Error {
  static DOCUMENTATION: string;
  static UI: string;
  static SCOPE: number;
  static CODE: number | string;
  static LOG_LEVEL: number;
  static HTTP_STATUS_CODE: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  static ERROR?: string;
  static ERROR_DESCRIPTION?: string;

  public originalError?: Error;
  public log: unknown;
  public statusCode?: number;
  public status?: number;

  constructor(input?: Error | string) {
    let arg: unknown = input;

    if (input instanceof Error) {
      arg = input.message;
    }

    super(arg as string);

    if (input instanceof Error) {
      this.originalError = input;
    }
  }
}

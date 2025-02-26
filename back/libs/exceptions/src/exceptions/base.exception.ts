import { HttpException, HttpStatus } from '@nestjs/common';

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

  constructor(input?: Error | HttpException | string) {
    let arg: unknown = input;

    if (input instanceof Error) {
      arg = input.message;
    }

    super(arg as string);

    this.addOriginalError(input);
    this.addStatus(input);
  }

  private addOriginalError(input: Error | HttpException | string): void {
    if (input instanceof Error) {
      this.originalError = input;
    }
  }

  private addStatus(input: Error | HttpException | string): void {
    if (input instanceof HttpException) {
      this.status = input.getStatus();
    }
  }
}

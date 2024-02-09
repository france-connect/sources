/* istanbul ignore file */

// Declarative code
import { Type } from '@nestjs/common';

import { FcException } from '@fc/exceptions';

export type PathAndException = {
  path: string;
  Exception: Type<FcException>;
};

export type ExceptionClass = {
  [key: string]: {
    new (...args: any[]): any;
  };
};

export type PathAndInstantiatedException = {
  path: string;
  errorInstance: FcException;
  error: { ERROR: string; ERROR_DESCRIPTION: string };
};

export type ValidExceptionParams = {
  hasValidScope: boolean;
  hasValidCode: boolean;
  hasValidHttpStatusCode: boolean;
  hasValidError: boolean;
  hasValidErrorDescription: boolean;
};

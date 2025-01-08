import { Response } from 'express';

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@fc/exceptions/exceptions';

import { ApiErrorMessage } from './api-error-message';

export interface ApiErrorParams {
  exception: BaseException;
  error: ApiErrorMessage;
  httpResponseCode: HttpStatus;
  res: Response;
}

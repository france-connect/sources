/* istanbul ignore file */

import { Response } from 'express';

import { HttpStatus } from '@nestjs/common';

import { ApiErrorMessage } from './api-error-message';

// Declarative code
export interface ApiErrorParams {
  error: ApiErrorMessage;
  httpResponseCode: HttpStatus;
  res: Response;
}
